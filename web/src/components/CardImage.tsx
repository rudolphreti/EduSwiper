import type { Crop } from '../project';
export function CardImage({
  url,
  crop,
  mode,
  alt = '',
}: {
  url: string | undefined;
  crop: Crop;
  mode: 'cover' | 'contain';
  alt?: string;
}) {
  return (
    <div className={`card-image ${mode}`}>
      <img
        draggable={false}
        src={url}
        alt={alt}
        style={
          mode === 'cover'
            ? {
                width: `${100 / crop.width}%`,
                height: `${100 / crop.height}%`,
                left: `${(-crop.x / crop.width) * 100}%`,
                top: `${(-crop.y / crop.height) * 100}%`,
              }
            : undefined
        }
      />
    </div>
  );
}
