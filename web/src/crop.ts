import { type Asset, type Crop } from './project';
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export function cropZoom(crop: Crop, asset: Pick<Asset, 'width' | 'height'>): number {
  return Math.min(asset.width, asset.height) / (crop.width * asset.width);
}
export function zoomCrop(crop: Crop, asset: Pick<Asset, 'width' | 'height'>, zoom: number): Crop {
  const side = Math.min(asset.width, asset.height) / clamp(zoom, 1, 8);
  const width = side / asset.width,
    height = side / asset.height;
  return {
    x: clamp(crop.x + crop.width / 2 - width / 2, 0, 1 - width),
    y: clamp(crop.y + crop.height / 2 - height / 2, 0, 1 - height),
    width,
    height,
  };
}
/** dx/dy are fractions of the visible square; moving the image right moves the source window left. */
export function panCrop(crop: Crop, dx: number, dy: number): Crop {
  return {
    ...crop,
    x: clamp(crop.x - dx * crop.width, 0, 1 - crop.width),
    y: clamp(crop.y - dy * crop.height, 0, 1 - crop.height),
  };
}
