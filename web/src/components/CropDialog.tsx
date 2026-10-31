import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Minus, Plus, RotateCcw, X, Move } from 'lucide-react';
import { centerCrop, type Project, type Crop } from '../project';
import { cropZoom, panCrop, zoomCrop } from '../crop';
import { useAssetUrl } from '../useAssetUrl';
import { CardImage } from './CardImage';
type Card = Project['manifest']['cards'][number];
export function CropDialog({
  card,
  project,
  onApply,
  onClose,
}: {
  card: Card;
  project: Project;
  onApply: (crop: Crop) => void;
  onClose: () => void;
}) {
  const asset = project.manifest.assets[card.assetId],
    url = useAssetUrl(project.data[card.assetId], asset.mime);
  const [crop, setCrop] = useState<Crop>(
    card.mode === 'cover' ? card.crop : centerCrop(asset.width, asset.height),
  );
  const dialog = useRef<HTMLDialogElement>(null);
  const drag = useRef<{ x: number; y: number; crop: Crop; pointer: number } | undefined>(undefined);
  useEffect(() => {
    const el = dialog.current!;
    el.showModal();
    return () => el.close();
  }, []);
  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, crop, pointer: event.pointerId };
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || start.pointer !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setCrop(
      panCrop(
        start.crop,
        (event.clientX - start.x) / bounds.width,
        (event.clientY - start.y) / bounds.height,
      ),
    );
  }
  return (
    <dialog
      ref={dialog}
      className="crop-dialog"
      aria-labelledby="crop-heading"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="dialog-heading">
        <div>
          <p className="eyebrow">KADR DO WYDRUKU</p>
          <h2 id="crop-heading">Ustaw obraz po swojemu</h2>
        </div>
        <button className="icon-button" aria-label="Zamknij kadrowanie" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <p className="muted">
        Przesuń zdjęcie i dopasuj powiększenie. Oryginalny obraz pozostanie bez zmian.
      </p>
      <div
        className="crop-stage"
        tabIndex={0}
        role="group"
        aria-label="Obszar kadrowania"
        aria-describedby="crop-help"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={() => {
          drag.current = undefined;
        }}
        onPointerCancel={() => {
          drag.current = undefined;
        }}
        onKeyDown={(event) => {
          const delta = event.shiftKey ? 0.1 : 0.01;
          const directions: Record<string, [number, number]> = {
            ArrowLeft: [-delta, 0],
            ArrowRight: [delta, 0],
            ArrowUp: [0, -delta],
            ArrowDown: [0, delta],
          };
          const d = directions[event.key];
          if (d) {
            event.preventDefault();
            setCrop((c) => panCrop(c, d[0], d[1]));
          }
        }}
      >
        <CardImage url={url} crop={crop} mode="cover" alt="Kadr zdjęcia" />
        <div className="crop-grid" aria-hidden="true" />
      </div>
      <p id="crop-help" className="crop-help">
        <Move size={14} /> Przeciągnij obraz lub użyj strzałek. Shift zwiększa krok przesunięcia.
      </p>
      <div className="zoom-control">
        <button
          className="icon-button"
          aria-label="Oddal kadr"
          onClick={() => setCrop((c) => zoomCrop(c, asset, cropZoom(c, asset) - 0.2))}
        >
          <Minus size={18} />
        </button>
        <label>
          Powiększenie
          <input
            id="crop-zoom"
            type="range"
            min="1"
            max="8"
            step="0.01"
            value={cropZoom(crop, asset)}
            onChange={(e) => setCrop((c) => zoomCrop(c, asset, Number(e.target.value)))}
          />
        </label>
        <button
          className="icon-button"
          aria-label="Przybliż kadr"
          onClick={() => setCrop((c) => zoomCrop(c, asset, cropZoom(c, asset) + 0.2))}
        >
          <Plus size={18} />
        </button>
        <output>{cropZoom(crop, asset).toFixed(1)}×</output>
      </div>
      <div className="dialog-actions">
        <button
          className="text-button"
          onClick={() => setCrop(centerCrop(asset.width, asset.height))}
        >
          <RotateCcw size={16} />
          Wyśrodkuj
        </button>
        <div>
          <button onClick={onClose}>Anuluj</button>
          <button className="primary" onClick={() => onApply(crop)}>
            Zastosuj kadr
          </button>
        </div>
      </div>
    </dialog>
  );
}
