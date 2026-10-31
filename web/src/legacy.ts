import { z } from 'zod';
import {
  assetSchema,
  centerCrop,
  createProject,
  hash,
  MAX_ASSET_BYTES,
  MAX_PROJECT_BYTES,
  validateProject,
  type Project,
} from './project';
export const LEGACY_VERSION = 'Prototype_k3d_v3_2templates';
export const MAX_LEGACY_BYTES = 275_000_000;
import { legacyCardMetadataSchema } from './legacy-metadata';
const sourceSchema = z.object({
  version: z.literal(LEGACY_VERSION),
  title: z.string().max(300),
  fontType: z.string().max(200),
  baseFontSize: z.union([z.string().max(30), z.number().finite()]),
  template: z.enum(['4onA4ECO', '2onA4', '4onA4classic']),
  customFont: z.string().max(70_000_000).optional(),
  cards: z
    .array(
      z.object({
        imgDataUri: z.string().max(70_000_000),
        word: z.string().max(20000),
        canvasData: z.unknown().optional(),
        templatesData: z.unknown().optional(),
        fontSize: z.unknown().optional(),
      }),
    )
    .max(1000),
});
export interface ImportReport {
  version: string;
  cards: number;
  assets: number;
  cropPolicy: 'whole-image';
  sourceFont: string;
  fontReplaced: boolean;
  notes: string[];
  discardedCropMetadata: number[];
}
export interface LegacyResult {
  project: Project;
  report: ImportReport;
}
export function parseLegacy(text: string) {
  let input: unknown;
  try {
    input = JSON.parse(text);
  } catch {
    throw new Error('Nieprawidłowy JSON w pliku .esw.');
  }
  const parsed = sourceSchema.safeParse(input);
  if (!parsed.success)
    throw new Error(
      'Nieprawidłowy plik .esw lub nieobsługiwana wersja. Obsługiwany jest Prototype_k3d_v3_2templates.',
    );
  return parsed.data;
}
export function decodeDataUri(
  uri: string,
  kind: 'image' | 'font',
): { bytes: Uint8Array; mime: string } {
  const comma = uri.indexOf(',');
  if (comma < 0) throw new Error('Brak osadzonego zasobu.');
  const header = uri.slice(0, comma),
    encoded = uri.slice(comma + 1);
  const mime = /^data:([^;,]+);base64$/i.exec(header)?.[1]?.toLowerCase();
  const allowed =
    kind === 'image'
      ? ['image/jpeg', 'image/png', 'image/webp']
      : [
          'font/ttf',
          'font/truetype',
          'application/x-font-ttf',
          'application/font-sfnt',
          'application/octet-stream',
        ];
  if (!mime || !allowed.includes(mime))
    throw new Error(
      kind === 'image'
        ? 'Obsługiwane obrazy w .esw: JPEG, PNG i WebP.'
        : 'Nieobsługiwany format własnej czcionki w .esw.',
    );
  if (
    encoded.length > Math.ceil(MAX_ASSET_BYTES / 3) * 4 ||
    !encoded.length ||
    encoded.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)
  )
    throw new Error('Nieprawidłowy lub zbyt duży zasób base64.');
  let raw: string;
  try {
    raw = atob(encoded);
  } catch {
    throw new Error('Nieprawidłowy zasób base64.');
  }
  if (!raw.length || raw.length > MAX_ASSET_BYTES)
    throw new Error('Zasób przekracza dozwolony rozmiar.');
  const bytes = Uint8Array.from(raw, (ch) => ch.charCodeAt(0));
  if (kind === 'font' && !(bytes[0] === 0 && bytes[1] === 1 && bytes[2] === 0 && bytes[3] === 0))
    throw new Error('Importer obsługuje własne czcionki TrueType TTF.');
  return { bytes, mime };
}
export async function importLegacy(
  text: string,
  options: { signal?: AbortSignal; onProgress?: (done: number, total: number) => void } = {},
): Promise<LegacyResult> {
  if (new TextEncoder().encode(text).byteLength > MAX_LEGACY_BYTES)
    throw new Error('Plik .esw przekracza 275 MB.');
  const cancelled = () => {
    if (options.signal?.aborted) throw new DOMException('Import anulowany.', 'AbortError');
  };
  cancelled();
  const source = parseLegacy(text),
    project = createProject();
  project.manifest.title = source.title;
  const layout = ({ '4onA4ECO': 'eco', '2onA4': 'classic2', '4onA4classic': 'classic4' } as const)[
    source.template
  ];
  const size = Number(source.baseFontSize);
  if (!Number.isFinite(size) || size <= 0)
    throw new Error('Nieprawidłowy rozmiar pisma w pliku .esw.');
  project.manifest.print.layout = layout;
  project.manifest.print.fontSize = Math.min(
    100,
    Math.max(10, size * 0.75 * (layout === 'classic4' ? 0.7 : 1)),
  );
  const report: ImportReport = {
    version: source.version,
    cards: source.cards.length,
    assets: 0,
    cropPolicy: 'whole-image',
    sourceFont: source.fontType,
    fontReplaced: true,
    notes: [],
    discardedCropMetadata: [],
  };
  let total = 0;
  for (const [index, card] of source.cards.entries()) {
    cancelled();
    try {
      const { bytes, mime } = decodeDataUri(card.imgDataUri, 'image'),
        id = await hash(bytes);
      if (!project.data[id]) {
        total += bytes.length;
        if (total > MAX_PROJECT_BYTES) throw new Error('Projekt przekracza 200 MB zasobów.');
        const bitmap = await createImageBitmap(
          new Blob([bytes.buffer as ArrayBuffer], { type: mime }),
          { imageOrientation: 'from-image' },
        );
        try {
          project.manifest.assets[id] = assetSchema.parse({
            id,
            mime,
            width: bitmap.width,
            height: bitmap.height,
            bytes: bytes.length,
          });
          project.data[id] = bytes;
        } finally {
          bitmap.close();
        }
      }
      const a = project.manifest.assets[id];
      const metadata = legacyCardMetadataSchema.safeParse({
        canvasData: card.canvasData,
        templatesData: card.templatesData,
        fontSize: card.fontSize,
      });
      if (!metadata.success) report.discardedCropMetadata.push(index + 1);
      project.manifest.cards.push({
        id: crypto.randomUUID(),
        assetId: id,
        text: card.word,
        mode: 'contain',
        crop: centerCrop(a.width, a.height),
        ...(metadata.success ? { legacy: metadata.data } : {}),
      });
      options.onProgress?.(index + 1, source.cards.length);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error;
      throw new Error(
        `Karta ${index + 1}: ${error instanceof Error ? error.message : 'nie udało się odczytać obrazu.'}`,
      );
    }
  }
  cancelled();
  if (source.fontType === 'Moja czcionka') {
    if (!source.customFont) throw new Error('W projekcie brakuje pliku własnej czcionki.');
    const { bytes } = decodeDataUri(source.customFont, 'font');
    const { create } = await import('fontkit');
    const { Buffer } = await import('buffer');
    try {
      const face = create(Buffer.from(bytes));
      if (!('ascent' in face)) throw new Error();
    } catch {
      throw new Error('Nieprawidłowy plik własnej czcionki TrueType TTF.');
    }
    const id = await hash(bytes);
    project.data[id] = bytes;
    project.manifest.assets[id] = assetSchema.parse({
      id,
      mime: 'font/ttf',
      width: 0,
      height: 0,
      bytes: bytes.length,
    });
    project.manifest.print.fontAssetId = id;
    report.fontReplaced = false;
  }
  report.assets = Object.values(project.manifest.assets).filter(
    (a) => a.mime !== 'font/ttf',
  ).length;
  report.notes.push(
    'Stary plik nie zapisuje pełnej geometrii obszaru kadrowania. Pokazano całe obrazy, aby nie odcinać ich zawartości. Zachowane dane kadrowania są dostępne do dalszej migracji.',
  );
  if (report.discardedCropMetadata.length)
    report.notes.push(
      'Nieprawidłowe pomocnicze dane kadrowania nie zostały przeniesione; obrazy i podpisy zachowano.',
    );
  if (report.fontReplaced)
    report.notes.push(
      `Czcionkę „${source.fontType}” zastąpiono Noto Sans. Stary plik nie zawiera jej danych.`,
    );
  report.notes.push(
    'Rozmiar pisma przeliczono z pikseli na punkty. Nowa geometria kart może zmienić zawijanie podpisów.',
  );
  project.manifest.migration = {
    source: 'esw',
    version: source.version,
    fontType: source.fontType,
    baseFontSize: String(source.baseFontSize),
    template: source.template,
    cropPolicy: 'whole-image',
    notes: report.notes,
    fontReplaced: report.fontReplaced,
    discardedCropMetadata: report.discardedCropMetadata,
  };
  cancelled();
  return { project: await validateProject(project), report };
}
