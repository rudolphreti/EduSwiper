import { lazy, Suspense, useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Download,
  FolderOpen,
  HardDrive,
  ImagePlus,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  PanelsTopLeft,
  Plus,
  Printer,
  Redo2,
  Save,
  SlidersHorizontal,
  Sparkles,
  Undo2,
  X,
} from 'lucide-react';
import { useEditor } from './useEditor';
import { CardTile } from './components/CardTile';
import { CropDialog } from './components/CropDialog';
import { PreviewBoundary } from './components/PreviewBoundary';
const PdfPreview = lazy(() => import('./components/PdfPreview'));
export default function App() {
  const editor = useEditor(),
    { project } = editor,
    cards = project.manifest.cards,
    print = project.manifest.print;
  const [cropId, setCropId] = useState<string>(),
    [dragOver, setDragOver] = useState(false),
    [fontValue, setFontValue] = useState(String(print.fontSize));
  const [tab, setTab] = useState<'cards' | 'preview'>('cards');
  const imageInput = useRef<HTMLInputElement>(null),
    previewAnchor = useRef<HTMLDivElement>(null);
  const activeCard = cards.find((c) => c.id === cropId);
  useEffect(() => setFontValue(String(print.fontSize)), [print.fontSize]);
  const freshPdf = editor.pdf && editor.pdf.revision === editor.revision;
  useEffect(() => setTab(editor.pdf ? 'preview' : 'cards'), [editor.pdf]);
  useEffect(() => {
    function keyboard(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.closest('input,textarea,select,[contenteditable="true"],dialog')) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) editor.redo();
        else editor.undo();
      }
    }
    window.addEventListener('keydown', keyboard);
    return () => window.removeEventListener('keydown', keyboard);
  });
  async function files(event: ChangeEvent<HTMLInputElement>) {
    const list = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (list.length) await editor.addFiles(list);
  }
  function requestPreview() {
    setTab('preview');
    previewAnchor.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const pages = print.layout === 'classic2' ? cards.length : Math.ceil(cards.length / 2);
  const migration = project.manifest.migration;
  return (
    <div
      className="app-shell"
      onPaste={(event) => {
        if ((event.target as HTMLElement).closest('input,textarea,[contenteditable="true"],dialog'))
          return;
        const list = Array.from(event.clipboardData.files).filter((f) =>
          f.type.startsWith('image/'),
        );
        if (list.length) {
          event.preventDefault();
          void editor.addFiles(list);
        }
      }}
    >
      <header className="site-header">
        <a
          className="brand"
          href="./"
          aria-label="EduSwiper — strona główna"
          onClick={(e) => {
            e.preventDefault();
            setTab('cards');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className="brand-mark">
            <BookOpen size={23} />
          </span>
          Edu<span>Swiper</span>
          <span className="brand-dot" />
        </a>
        <div className="header-caption">Małe karty. Wielkie odkrycia.</div>
        <div className="private-badge">
          <LockKeyhole size={14} />
          <span>Twoje pliki zostają u Ciebie</span>
        </div>
      </header>
      <main>
        <section className="intro">
          <div>
            <p className="eyebrow">
              <span /> PRACOWNIA KART EDUKACYJNYCH
            </p>
            <h1>
              Przygotuj coś
              <br />
              <span>wartego odkrycia.</span>
            </h1>
            <p>
              Twoje zdjęcia, dobre słowa i gotowe do druku karty.
              <br className="desktop-break" /> Twórz materiały, które pomagają poznawać świat.
            </p>
          </div>
          <div className="intro-note">
            <span className="note-icon">
              <Sparkles size={21} />
            </span>
            <div>
              <strong>Od pomysłu do wydruku</strong>
              <p>
                Dodaj obrazy, dopasuj kadry
                <br />i pobierz swój zestaw w PDF.
              </p>
            </div>
            <ArrowUpRight size={19} />
          </div>
        </section>
        <div className="project-bar">
          <div className="project-title">
            <label htmlFor="title">TWÓJ ZESTAW</label>
            <input
              id="title"
              maxLength={300}
              value={project.manifest.title}
              onChange={(e) => editor.updateTitle(e.target.value)}
              aria-label="Tytuł zestawu"
            />
            <span id="draft-status" role="status">
              <span className="save-dot" />
              {editor.draftStatus}
            </span>
          </div>
          <div className="project-actions">
            <label className="button secondary" htmlFor="open">
              <FolderOpen size={17} /> Otwórz projekt
              <input
                className="sr-only"
                id="open"
                type="file"
                accept=".eduswiper,.esw"
                disabled={editor.importing}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (file) void editor.open(file);
                }}
              />
            </label>
            <button id="save" onClick={() => void editor.save()}>
              <Save size={17} />
              <span>Zapisz projekt</span>
            </button>
            <button
              id="restore"
              className="icon-button"
              aria-label="Przywróć kopię lokalną"
              title="Przywróć kopię lokalną"
              onClick={() => void editor.restore()}
            >
              <HardDrive size={18} />
            </button>
          </div>
        </div>
        {migration && (
          <details id="import-report" className="migration-report" open>
            <summary>
              <Check size={16} /> Zaimportowano projekt .esw <ChevronDown size={16} />
            </summary>
            <p>{cards.length} kart. Przejrzyj dopasowanie obrazów i podpisów przed drukiem.</p>
            <ul>
              {(
                migration.notes ?? [
                  'Projekt pochodzi ze starszej wersji. Sprawdź kadry przed drukiem.',
                ]
              ).map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            {!!migration.discardedCropMetadata?.length && (
              <p>
                Nieprawidłowe pomocnicze dane kart źródłowych:{' '}
                {migration.discardedCropMetadata.join(', ')}.
              </p>
            )}
          </details>
        )}
        <div className="workspace">
          <section className="editor-panel" aria-label="Edytor kart">
            <div className="editor-tabs">
              <div
                role="tablist"
                aria-label="Widok zestawu"
                onKeyDown={(event) => {
                  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                  event.preventDefault();
                  const next =
                    event.key === 'Home'
                      ? 'cards'
                      : event.key === 'End'
                        ? 'preview'
                        : tab === 'cards'
                          ? 'preview'
                          : 'cards';
                  setTab(next);
                  document.getElementById(`${next}-tab`)?.focus();
                }}
              >
                <button
                  id="cards-tab"
                  role="tab"
                  tabIndex={tab === 'cards' ? 0 : -1}
                  aria-selected={tab === 'cards'}
                  aria-controls="cards-panel"
                  onClick={() => setTab('cards')}
                >
                  <PanelsTopLeft size={17} /> Karty zestawu{' '}
                  <span className="count">{cards.length}</span>
                </button>
                <button
                  id="preview-tab"
                  role="tab"
                  tabIndex={tab === 'preview' ? 0 : -1}
                  aria-selected={tab === 'preview'}
                  aria-controls="preview-panel"
                  onClick={requestPreview}
                >
                  <Printer size={17} /> Podgląd wydruku
                </button>
              </div>
              <div className="history-actions">
                <button
                  className="icon-button"
                  aria-label="Cofnij zmianę"
                  title="Cofnij zmianę"
                  disabled={!editor.canUndo}
                  onClick={editor.undo}
                >
                  <Undo2 size={18} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Ponów zmianę"
                  title="Ponów zmianę"
                  disabled={!editor.canRedo}
                  onClick={editor.redo}
                >
                  <Redo2 size={18} />
                </button>
              </div>
            </div>
            <div
              id="cards-panel"
              role="tabpanel"
              aria-labelledby="cards-tab"
              hidden={tab !== 'cards'}
            >
              <div className="section-heading">
                <div>
                  <h2>Obrazy, które uczą</h2>
                  <p>Uzupełnij podpisy i wybierz najlepszy kadr.</p>
                </div>
                <label className="button small" htmlFor="images">
                  <Plus size={17} /> Dodaj zdjęcia
                </label>
              </div>
              <input
                ref={imageInput}
                className="sr-only"
                id="images"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                disabled={editor.adding}
                onChange={files}
              />
              <div
                className={`drop-zone ${dragOver ? 'drag-over' : ''} ${cards.length ? 'compact' : ''}`}
                onDragOver={(event) => {
                  if (event.dataTransfer.types.includes('Files')) {
                    event.preventDefault();
                    setDragOver(true);
                  }
                }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node))
                    setDragOver(false);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragOver(false);
                  if (event.dataTransfer.files.length)
                    void editor.addFiles(Array.from(event.dataTransfer.files));
                }}
              >
                {!cards.length ? (
                  <>
                    <span className="upload-symbol">
                      <ImagePlus size={32} />
                    </span>
                    <h3>Tu zaczyna się Twój zestaw</h3>
                    <p>Przeciągnij zdjęcia lub wybierz je z urządzenia.</p>
                    <button
                      className="primary"
                      disabled={editor.adding}
                      onClick={() => imageInput.current?.click()}
                    >
                      <Plus size={17} />
                      Wybierz zdjęcia
                    </button>
                    <small>JPG, PNG, WebP · do 50 MB na zdjęcie</small>
                  </>
                ) : (
                  <p>
                    <ImagePlus size={18} /> Przeciągnij kolejne zdjęcia tutaj lub wklej je ze
                    schowka.
                  </p>
                )}
              </div>
              <div id="cards" className="cards">
                {cards.map((card, index) => (
                  <CardTile
                    key={card.id}
                    card={card}
                    index={index}
                    total={cards.length}
                    project={project}
                    onText={(text) => editor.updateCard(card.id, { text })}
                    onMode={(mode) => editor.updateCard(card.id, { mode })}
                    onCrop={() => setCropId(card.id)}
                    onRemove={() => editor.removeCard(card.id)}
                    onMove={(offset) => editor.moveCard(card.id, offset)}
                  />
                ))}
              </div>
              {!!cards.length && (
                <div className="editor-tip">
                  <Leaf size={15} />
                  <span>Wskazówka: pojedyncza karta daje wiele okazji do nauki.</span>
                </div>
              )}
            </div>
            <div
              ref={previewAnchor}
              id="preview-panel"
              role="tabpanel"
              aria-labelledby="preview-tab"
              hidden={tab !== 'preview'}
            >
              {editor.pdf ? (
                <PreviewBoundary key={editor.pdf.revision}>
                  <Suspense
                    fallback={
                      <div className="preview-empty">
                        <LoaderCircle className="spin" />
                        Ładowanie podglądu…
                      </div>
                    }
                  >
                    <PdfPreview bytes={editor.pdf.bytes} stale={!freshPdf} />
                  </Suspense>
                </PreviewBoundary>
              ) : (
                <div className="preview-empty">
                  <span className="empty-paper">
                    <Printer size={32} />
                  </span>
                  <h2>Zobacz, jak będzie wyglądał wydruk</h2>
                  <p>Podgląd pokaże strony gotowego pliku PDF.</p>
                  <button
                    className="primary"
                    disabled={!cards.length || editor.exporting}
                    onClick={() => void editor.generate()}
                  >
                    {editor.exporting ? (
                      <LoaderCircle size={17} className="spin" />
                    ) : (
                      <Printer size={17} />
                    )}{' '}
                    Generuj podgląd
                  </button>
                </div>
              )}
            </div>
          </section>
          <aside className="print-sidebar" aria-label="Ustawienia wydruku">
            <div className="sidebar-heading">
              <SlidersHorizontal size={18} />
              <h2>Przygotuj wydruk</h2>
            </div>
            <label className="field-label" htmlFor="layout">
              UKŁAD KART
            </label>
            <select
              id="layout"
              value={print.layout}
              onChange={(e) =>
                editor.updatePrint({ layout: e.target.value as typeof print.layout })
              }
            >
              <option value="classic4">CLASSIC · 4 na A4</option>
              <option value="classic2">CLASSIC · 2 na A4</option>
              <option value="eco">ECO · 4 na A4</option>
            </select>
            <div
              className={`layout-diagram ${print.layout === 'classic2' ? 'landscape' : ''}`}
              aria-hidden="true"
            >
              {Array.from({ length: print.layout === 'classic2' ? 2 : 4 }, (_, i) => (
                <div key={i}>
                  <span />
                  <i className={print.layout !== 'eco' && i % 2 ? 'blank' : ''} />
                </div>
              ))}
            </div>
            <p className="layout-caption">
              {print.layout === 'eco'
                ? 'Dwie pary kart z podpisami'
                : print.layout === 'classic2'
                  ? 'Jedna para kart i osobna etykieta'
                  : 'Dwie pary kart i osobne etykiety'}
            </p>
            <div className="sidebar-rule" />
            <label className="field-label" htmlFor="font-size">
              ROZMIAR PODPISÓW
            </label>
            <div className="number-field">
              <input
                id="font-size"
                type="number"
                min={print.minimumFontSize}
                max={100}
                step={0.1}
                value={fontValue}
                onChange={(e) => setFontValue(e.target.value)}
                onBlur={() => {
                  const n = Number(fontValue);
                  if (n >= print.minimumFontSize && n <= 100) editor.updatePrint({ fontSize: n });
                  else setFontValue(String(print.fontSize));
                }}
              />
              <span>pt</span>
            </div>
            <p className="field-help">
              Długie podpisy zmniejszamy automatycznie, do minimum {print.minimumFontSize} pt.
            </p>
            <p className="font-caption">
              {print.fontAssetId ? 'Własna czcionka z projektu' : 'Noto Sans · polskie znaki'}
            </p>
            <label className="checkbox-label">
              <input
                id="division"
                type="checkbox"
                checked={print.division}
                onChange={(e) => editor.updatePrint({ division: e.target.checked })}
              />
              <span>
                Linia pod obrazem
                <br />
                karty kontrolnej
              </span>
            </label>
            <div className="print-summary">
              <span>
                Format papieru
                <strong>A4 {print.layout === 'classic2' ? 'poziomo' : 'pionowo'}</strong>
              </span>
              <span>
                Gotowy zestaw
                <strong>
                  {pages} {pages === 1 ? 'strona' : 'stron'}
                </strong>
              </span>
            </div>
            <button
              id="export"
              className="primary export-button"
              disabled={!cards.length || editor.exporting || editor.adding || editor.importing}
              onClick={() => void editor.generate()}
            >
              {editor.exporting ? (
                <LoaderCircle size={18} className="spin" />
              ) : (
                <Printer size={18} />
              )}{' '}
              {editor.exporting ? 'Przygotowywanie…' : 'Generuj PDF'}
              {!editor.exporting && <ArrowUpRight size={17} />}
            </button>
            <button
              id="cancel"
              className="cancel-button"
              disabled={!editor.exporting}
              hidden={!editor.exporting}
              onClick={editor.cancelExport}
            >
              <X size={15} /> Anuluj eksport
            </button>
            <button
              id="download"
              className="download-button"
              disabled={!editor.pdf || editor.exporting}
              onClick={editor.downloadPdf}
            >
              <Download size={17} />
              Pobierz PDF{editor.pdf && !freshPdf && <span className="old-badge">poprzedni</span>}
            </button>
            {editor.exporting && (
              <progress
                id="progress"
                value={editor.progress}
                max={100}
                aria-label="Postęp eksportu"
              />
            )}
            <p className="print-footnote">
              <LockKeyhole size={13} /> Bez wysyłania zdjęć na serwer
            </p>
          </aside>
        </div>
        <div className="status-bar">
          <p id="status" role="status" aria-live="polite">
            {editor.status}
          </p>
          <button
            id="cancel-import"
            disabled={!editor.importing}
            hidden={!editor.importing}
            onClick={editor.cancelImport}
          >
            Anuluj import
          </button>
        </div>
        <ul id="warnings" className="export-warnings">
          {editor.pdf?.warnings.map((warning, index) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
        <footer className="site-footer">
          <span>
            <BookOpen size={15} /> Stworzone z myślą o małych odkrywcach.
          </span>
          <span>EduSwiper · Twoja pracownia edukacyjna</span>
        </footer>
      </main>
      {activeCard && (
        <CropDialog
          key={activeCard.id}
          card={activeCard}
          project={project}
          onClose={() => setCropId(undefined)}
          onApply={(crop) => {
            editor.applyCrop(activeCard.id, crop);
            setCropId(undefined);
          }}
        />
      )}
    </div>
  );
}
