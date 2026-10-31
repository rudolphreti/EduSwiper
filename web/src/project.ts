import { z } from 'zod';
import { legacyCardMetadataSchema } from './legacy-metadata';
export const MAX_ASSET_BYTES = 50_000_000;
export const MAX_PROJECT_BYTES = 200_000_000;
export const MAX_PIXELS = 40_000_000;
const id = z.string().regex(/^[a-f0-9]{64}$/);
const rect = z
  .object({
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1),
    width: z.number().positive().max(1),
    height: z.number().positive().max(1),
  })
  .strict()
  .refine(
    (r) => r.x + r.width <= 1.000001 && r.y + r.height <= 1.000001,
    'Kadr wychodzi poza obraz.',
  );
export const assetSchema = z
  .object({
    id,
    mime: z.enum(['image/jpeg', 'image/png', 'image/webp', 'font/ttf']),
    width: z.number().int().nonnegative().max(MAX_PIXELS),
    height: z.number().int().nonnegative().max(MAX_PIXELS),
    bytes: z.number().int().positive().max(MAX_ASSET_BYTES),
  })
  .strict()
  .refine(
    (a) =>
      a.mime === 'font/ttf' || (a.width > 0 && a.height > 0 && a.width * a.height <= MAX_PIXELS),
    'Nieprawidłowe wymiary obrazu.',
  );
const cardSchema = z
  .object({
    id: z.string().min(1).max(100),
    assetId: id,
    text: z.string().max(20000),
    mode: z.enum(['cover', 'contain']),
    crop: rect,
    legacy: legacyCardMetadataSchema.optional(),
  })
  .strict();
export const manifestSchema = z
  .object({
    format: z.literal('eduswiper'),
    version: z.literal(1),
    id: z.string().min(1).max(100),
    title: z.string().max(300),
    migration: z
      .object({
        source: z.literal('esw'),
        version: z.string().max(100),
        fontType: z.string().max(200),
        baseFontSize: z.string().max(30),
        template: z.string().max(100),
        cropPolicy: z.literal('whole-image'),
        notes: z.array(z.string().max(500)).max(20).optional(),
        fontReplaced: z.boolean().optional(),
        discardedCropMetadata: z.array(z.number().int().positive().max(1000)).max(1000).optional(),
      })
      .strict()
      .optional(),
    cards: z.array(cardSchema).max(1000),
    assets: z.record(id, assetSchema),
    print: z
      .object({
        layout: z.enum(['eco', 'classic2', 'classic4']),
        fontAssetId: id.nullable(),
        fontSize: z.number().min(10).max(100),
        minimumFontSize: z.number().min(10).max(100),
        ppi: z.literal(300),
        division: z.boolean(),
      })
      .strict(),
  })
  .strict()
  .superRefine((m, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: 'custom', message });
    if (new Set(m.cards.map((c) => c.id)).size !== m.cards.length)
      fail('Powtórzone identyfikatory kart.');
    if (m.print.minimumFontSize > m.print.fontSize)
      fail('Minimalny stopień pisma przekracza bazowy.');
    let total = 0;
    for (const [key, a] of Object.entries(m.assets)) {
      if (key !== a.id) fail('Niezgodny identyfikator zasobu.');
      total += a.bytes;
    }
    if (total > MAX_PROJECT_BYTES) fail('Projekt przekracza 200 MB.');
    for (const c of m.cards) {
      const a = m.assets[c.assetId];
      if (!a || a.mime === 'font/ttf') {
        fail(`Karta ${c.id}: brak obrazu.`);
        continue;
      }
      if (c.mode === 'cover' && Math.abs(c.crop.width * a.width - c.crop.height * a.height) > 0.01)
        fail(`Karta ${c.id}: kadr musi być kwadratowy.`);
    }
    if (m.print.fontAssetId && m.assets[m.print.fontAssetId]?.mime !== 'font/ttf')
      fail('Brak pliku fontu.');
  });
export type Manifest = z.infer<typeof manifestSchema>;
export type Asset = z.infer<typeof assetSchema>;
export type Crop = z.infer<typeof rect>;
export type Project = { manifest: Manifest; data: Record<string, Uint8Array> };
export function validateManifest(input: unknown): Manifest {
  const result = manifestSchema.safeParse(input);
  if (!result.success)
    throw new Error(
      result.error.issues.find((i) => i.code === 'custom')?.message ??
        'Nieprawidłowe dane projektu lub nieobsługiwana wersja pliku.',
    );
  return result.data;
}
export function createProject(): Project {
  return {
    manifest: {
      format: 'eduswiper',
      version: 1,
      id: crypto.randomUUID(),
      title: 'Nowy zestaw',
      cards: [],
      assets: {},
      print: {
        layout: 'classic4',
        fontAssetId: null,
        fontSize: 18,
        minimumFontSize: 10,
        ppi: 300,
        division: true,
      },
    },
    data: {},
  };
}
export function centerCrop(width: number, height: number): Crop {
  const side = Math.min(width, height);
  return {
    x: (width - side) / 2 / width,
    y: (height - side) / 2 / height,
    width: side / width,
    height: side / height,
  };
}
export async function hash(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', Uint8Array.from(bytes).buffer);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}
export async function validateProject(project: Project): Promise<Project> {
  const manifest = validateManifest(project.manifest);
  if (Object.keys(project.data).length !== Object.keys(manifest.assets).length)
    throw new Error('Niezgodna liczba zasobów.');
  for (const [key, a] of Object.entries(manifest.assets)) {
    const bytes = project.data[key];
    if (!(bytes instanceof Uint8Array) || bytes.length !== a.bytes || (await hash(bytes)) !== key)
      throw new Error('Uszkodzony zasób projektu.');
  }
  return { manifest, data: project.data };
}
export function pruneAssets(project: Project): Project {
  const ids = new Set(project.manifest.cards.map((c) => c.assetId));
  if (project.manifest.print.fontAssetId) ids.add(project.manifest.print.fontAssetId);
  return {
    ...project,
    manifest: {
      ...project.manifest,
      assets: Object.fromEntries(
        Object.entries(project.manifest.assets).filter(([id]) => ids.has(id)),
      ),
    },
    data: Object.fromEntries(Object.entries(project.data).filter(([id]) => ids.has(id))),
  };
}
