import { Crop, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Project } from '../project';
import type { Card } from '../useEditor';
import { useAssetUrl } from '../useAssetUrl';
import { CardImage } from './CardImage';
export function CardTile({
  card,
  index,
  total,
  project,
  onText,
  onMode,
  onCrop,
  onRemove,
  onMove,
}: {
  card: Card;
  index: number;
  total: number;
  project: Project;
  onText: (text: string) => void;
  onMode: (mode: Card['mode']) => void;
  onCrop: () => void;
  onRemove: () => void;
  onMove: (offset: number) => void;
}) {
  const asset = project.manifest.assets[card.assetId],
    url = useAssetUrl(project.data[card.assetId], asset.mime);
  return (
    <article className="card" aria-label={`Karta ${index + 1}`} data-card-id={card.id}>
      <div className="card-photo">
        <CardImage
          url={url}
          crop={card.crop}
          mode={card.mode}
          alt={card.text || `Obraz karty ${index + 1}`}
        />
        <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
        <button className="crop-button" onClick={onCrop} aria-label={`Kadruj kartę ${index + 1}`}>
          <Crop size={15} /> Kadruj
        </button>
      </div>
      <div className="card-body">
        <label htmlFor={`text-${card.id}`}>PODPIS KARTY</label>
        <textarea
          id={`text-${card.id}`}
          value={card.text}
          maxLength={20000}
          onChange={(event) => onText(event.target.value)}
          placeholder="Wpisz podpis…"
          rows={2}
        />
        <label className="sr-only" htmlFor={`mode-${card.id}`}>
          Dopasowanie obrazu karty {index + 1}
        </label>
        <select
          id={`mode-${card.id}`}
          value={card.mode}
          onChange={(e) => onMode(e.target.value as Card['mode'])}
        >
          <option value="cover">Kadr kwadratowy</option>
          <option value="contain">Cały obraz</option>
        </select>
        <div className="card-footer">
          <span>
            {asset.width} × {asset.height} px
          </span>
          <div>
            <button
              className="icon-button"
              disabled={index === 0}
              aria-label={`Przesuń kartę ${index + 1} wstecz`}
              onClick={() => onMove(-1)}
            >
              <ArrowLeft size={15} />
            </button>
            <button
              className="icon-button"
              disabled={index === total - 1}
              aria-label={`Przesuń kartę ${index + 1} dalej`}
              onClick={() => onMove(1)}
            >
              <ArrowRight size={15} />
            </button>
            <button
              className="icon-button danger"
              aria-label={`Usuń kartę ${index + 1}`}
              onClick={onRemove}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
