import { useEffect, useRef, useState } from 'react';
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
  type RenderTask,
} from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { ChevronLeft, ChevronRight, Minus, Plus, FileText } from 'lucide-react';
GlobalWorkerOptions.workerSrc = workerUrl;
export default function PdfPreview({ bytes, stale }: { bytes: ArrayBuffer; stale: boolean }) {
  const [pdf, setPdf] = useState<PDFDocumentProxy>();
  const [page, setPage] = useState(1),
    [zoom, setZoom] = useState(1),
    [width, setWidth] = useState(600);
  const [error, setError] = useState(''),
    [rendered, setRendered] = useState(false),
    [text, setText] = useState('');
  const host = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = host.current!;
    const observer = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let active = true;
    setPdf(undefined);
    setPage(1);
    setError('');
    setRendered(false);
    // PDF.js transfers this independent copy to its worker; retain export bytes for downloading.
    const task = getDocument({ data: Uint8Array.from(new Uint8Array(bytes)), useWasm: false });
    task.promise
      .then((document) => {
        if (active) setPdf(document);
      })
      .catch(() => {
        if (active) setError('Nie udało się otworzyć podglądu. Plik PDF nadal możesz pobrać.');
      });
    return () => {
      active = false;
      void task.destroy();
    };
  }, [bytes]);
  useEffect(() => {
    if (!pdf || !canvas.current || width < 1) return;
    let active = true;
    let task: RenderTask | undefined;
    setRendered(false);
    setError('');
    const element = canvas.current;
    void (async () => {
      try {
        const pdfPage = await pdf.getPage(page);
        if (!active) return;
        const base = pdfPage.getViewport({ scale: 1 });
        const viewport = pdfPage.getViewport({
          scale: Math.max(0.1, (Math.min(width, 1000) - 40) / base.width) * zoom,
        });
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const buffer = document.createElement('canvas');
        buffer.width = Math.ceil(viewport.width * ratio);
        buffer.height = Math.ceil(viewport.height * ratio);
        task = pdfPage.render({
          canvas: buffer,
          viewport,
          transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
        });
        await task.promise;
        if (!active) return;
        element.width = buffer.width;
        element.height = buffer.height;
        element.style.width = `${viewport.width}px`;
        element.style.height = `${viewport.height}px`;
        element.getContext('2d')!.drawImage(buffer, 0, 0);
        buffer.width = 0;
        buffer.height = 0;
        const content = await pdfPage.getTextContent();
        if (!active) return;
        setText(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
        setRendered(true);
      } catch (e) {
        if (active && !(e instanceof Error && e.name === 'RenderingCancelledException'))
          setError('Nie udało się wyświetlić strony. Spróbuj ponownie wygenerować dokument.');
      }
    })();
    return () => {
      active = false;
      task?.cancel();
    };
  }, [pdf, page, zoom, width]);
  return (
    <section className="pdf-preview" aria-labelledby="preview-title">
      <div className="preview-heading">
        <div>
          <p className="eyebrow">GOTOWY DO DRUKU</p>
          <h2 id="preview-title">Podgląd dokumentu</h2>
        </div>
        <span className="paper-badge">
          <FileText size={14} /> Format A4
        </span>
      </div>
      {stale && (
        <p className="stale-notice" role="status">
          Zestaw został zmieniony. Wygeneruj PDF ponownie, aby zobaczyć aktualną wersję.
        </p>
      )}
      <div className="preview-toolbar">
        <div>
          <button
            className="icon-button"
            aria-label="Poprzednia strona"
            disabled={!pdf || page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={18} />
          </button>
          <span aria-live="polite" data-testid="page-count">
            {pdf ? `${page} / ${pdf.numPages}` : 'Ładowanie…'}
          </span>
          <button
            className="icon-button"
            aria-label="Następna strona"
            disabled={!pdf || page === pdf.numPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div>
          <button
            className="icon-button"
            aria-label="Pomniejsz podgląd"
            disabled={zoom <= 0.5}
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
          >
            <Minus size={16} />
          </button>
          <output title="100% oznacza dopasowanie do szerokości podglądu">
            {Math.round(zoom * 100)}%
          </output>
          <button
            className="icon-button"
            aria-label="Powiększ podgląd"
            disabled={zoom >= 2}
            onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div className="pdf-canvas-host" ref={host} aria-busy={!rendered && !error}>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <canvas
          ref={canvas}
          hidden={!!error}
          role="img"
          aria-label={`Strona ${page} wygenerowanego PDF`}
          data-rendered={rendered}
        />
        {!rendered && !error && (
          <p className="render-status" role="status">
            Przygotowywanie podglądu…
          </p>
        )}
      </div>
      {text && (
        <details className="pdf-text">
          <summary>Tekst strony {page}</summary>
          <p>{text}</p>
        </details>
      )}
      <p className="preview-footnote">Drukuj w skali 100%, bez opcji „dopasuj do strony”.</p>
    </section>
  );
}
