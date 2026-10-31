import {
  assetSchema,
  centerCrop,
  hash,
  MAX_ASSET_BYTES,
  validateManifest,
  type Project,
  type Asset,
} from './project';
export async function addImage(project: Project, file: File): Promise<Project> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    throw new Error('Obsługiwane obrazy: JPEG, PNG i WebP.');
  if (!file.size || file.size > MAX_ASSET_BYTES)
    throw new Error('Obraz musi mieć od 1 bajta do 50 MB.');
  const bytes = new Uint8Array(await file.arrayBuffer());
  const bitmap = await createImageBitmap(new Blob([bytes], { type: file.type }), {
    imageOrientation: 'from-image',
  });
  try {
    const id = await hash(bytes);
    const asset = assetSchema.parse({
      id,
      mime: file.type,
      width: bitmap.width,
      height: bitmap.height,
      bytes: bytes.length,
    });
    const manifest = validateManifest({
      ...project.manifest,
      assets: { ...project.manifest.assets, [id]: asset },
      cards: [
        ...project.manifest.cards,
        {
          id: crypto.randomUUID(),
          assetId: id,
          text: file.name.replace(/\.[^.]+$/, ''),
          mode: 'cover',
          crop: centerCrop(asset.width, asset.height),
        },
      ],
    });
    return { manifest, data: { ...project.data, [id]: bytes } };
  } finally {
    bitmap.close();
  }
}
export function rasterSize(
  asset: Asset,
  crop: { width: number; height: number },
  mode: 'cover' | 'contain',
  widthMm: number,
  ppi = 300,
): number {
  const available =
    mode === 'cover'
      ? Math.min(crop.width * asset.width, crop.height * asset.height)
      : Math.max(asset.width, asset.height);
  return Math.max(1, Math.min(Math.ceil((widthMm / 25.4) * ppi), Math.floor(available)));
}
export async function rasterize(
  bytes: Uint8Array,
  asset: Asset,
  card: Project['manifest']['cards'][number],
  widthMm: number,
): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(
    new Blob([Uint8Array.from(bytes).buffer], { type: asset.mime }),
    { imageOrientation: 'from-image' },
  );
  try {
    if (bitmap.width !== asset.width || bitmap.height !== asset.height)
      throw new Error('Wymiary zasobu nie zgadzają się z manifestem.');
    const side = rasterSize(asset, card.crop, card.mode, widthMm);
    const canvas = new OffscreenCanvas(side, side);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Brak obsługi obrazu w tej przeglądarce.');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, side, side);
    if (card.mode === 'cover') {
      const c = card.crop;
      ctx.drawImage(
        bitmap,
        c.x * bitmap.width,
        c.y * bitmap.height,
        c.width * bitmap.width,
        c.height * bitmap.height,
        0,
        0,
        side,
        side,
      );
    } else {
      const ratio = side / Math.max(bitmap.width, bitmap.height),
        w = bitmap.width * ratio,
        h = bitmap.height * ratio;
      ctx.drawImage(bitmap, (side - w) / 2, (side - h) / 2, w, h);
    }
    const blob = await canvas.convertToBlob({
      type: asset.mime === 'image/png' ? 'image/png' : 'image/jpeg',
      quality: 0.92,
    });
    return new Uint8Array(await blob.arrayBuffer());
  } finally {
    bitmap.close();
  }
}
