import { useCallback, useEffect, useRef, useState } from 'react';
import fontUrl from '../assets/NotoSans-Regular.ttf?url';
import { createProject, validateManifest, pruneAssets, type Project, type Crop } from './project';
import { addImage } from './images';
import { saveProject, openProject } from './archive';
import { loadDraft, saveDraft } from './storage';
import { importEsw } from './import';
import { exportPdf } from './export';
export type Card = Project['manifest']['cards'][number];
export interface PdfResult {
  bytes: ArrayBuffer;
  pages: number;
  warnings: string[];
  name: string;
  revision: number;
}
const message = (e: unknown) => (e instanceof Error ? e.message : String(e));
function filename(title: string) {
  return (
    title
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
      .trim()
      .slice(0, 100) || 'zestaw'
  );
}
export function downloadBytes(bytes: Uint8Array | ArrayBuffer, name: string, type: string) {
  const buffer = bytes instanceof Uint8Array ? Uint8Array.from(bytes).buffer : bytes;
  const url = URL.createObjectURL(new Blob([buffer], { type })),
    a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export function useEditor() {
  const [project, setProject] = useState(createProject),
    [revision, setRevision] = useState(0),
    [saved, setSaved] = useState(0);
  const current = useRef(project),
    rev = useRef(0),
    savedRef = useRef(0),
    generation = useRef(0);
  const undo = useRef<Project[]>([]),
    redo = useRef<Project[]>([]),
    lastGroup = useRef({ name: '', time: 0 });
  const [historyTick, setHistoryTick] = useState(0);
  const [status, setStatus] = useState('Dodaj zdjęcia i stwórz swój pierwszy zestaw.');
  const [draftStatus, setDraftStatus] = useState('Zmiany pozostają na Twoim urządzeniu.');
  const addingRef = useRef(false);
  const [adding, setAdding] = useState(false),
    [importing, setImporting] = useState(false),
    [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0),
    [pdf, setPdf] = useState<PdfResult>();
  const importController = useRef<AbortController | undefined>(undefined),
    exportController = useRef<AbortController | undefined>(undefined);
  const draftQueue = useRef<Promise<void>>(Promise.resolve()),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      importController.current?.abort();
      exportController.current?.abort();
    };
  }, []);
  const commit = useCallback((next: Project, group = '') => {
    const valid = { ...next, manifest: validateManifest(next.manifest) },
      now = Date.now();
    if (!group || lastGroup.current.name !== group || now - lastGroup.current.time > 1000) {
      undo.current.push(current.current);
      if (undo.current.length > 30) undo.current.shift();
    }
    redo.current = [];
    lastGroup.current = { name: group, time: now };
    current.current = valid;
    rev.current++;
    setProject(valid);
    setRevision(rev.current);
    setHistoryTick((n) => n + 1);
  }, []);
  function replace(next: Project) {
    generation.current++;
    undo.current = [];
    redo.current = [];
    lastGroup.current = { name: '', time: 0 };
    current.current = next;
    rev.current++;
    savedRef.current = rev.current;
    setSaved(rev.current);
    setProject(next);
    setRevision(rev.current);
    setHistoryTick((n) => n + 1);
  }
  useEffect(() => {
    if (!revision) return;
    setDraftStatus('Zapisywanie kopii lokalnej…');
    const timer = setTimeout(() => {
      const snapshot = structuredClone(project),
        version = revision;
      draftQueue.current = draftQueue.current
        .then(() => saveDraft(snapshot))
        .then(() => {
          if (mounted.current && version === rev.current)
            setDraftStatus('Kopia robocza zapisana na tym urządzeniu.');
        })
        .catch(() => {
          if (mounted.current)
            setDraftStatus('Nie udało się zapisać kopii lokalnej. Pobierz projekt do pliku.');
        });
    }, 350);
    return () => clearTimeout(timer);
  }, [project, revision]);
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (rev.current !== savedRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);
  function history(direction: 'undo' | 'redo') {
    const source = direction === 'undo' ? undo : redo,
      target = direction === 'undo' ? redo : undo;
    const next = source.current.pop();
    if (!next) return;
    target.current.push(current.current);
    lastGroup.current = { name: '', time: 0 };
    current.current = next;
    rev.current++;
    setProject(next);
    setRevision(rev.current);
    setHistoryTick((n) => n + 1);
  }
  function updateCard(id: string, patch: Partial<Pick<Card, 'text' | 'mode' | 'crop'>>) {
    const p = current.current;
    commit(
      {
        ...p,
        manifest: {
          ...p.manifest,
          cards: p.manifest.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        },
      },
      Object.keys(patch).length === 1 && patch.text !== undefined ? `text:${id}` : '',
    );
  }
  function updatePrint(patch: Partial<Project['manifest']['print']>) {
    try {
      const p = current.current;
      commit({ ...p, manifest: { ...p.manifest, print: { ...p.manifest.print, ...patch } } });
    } catch (e) {
      setStatus(message(e));
    }
  }
  function moveCard(id: string, offset: number) {
    const p = current.current,
      cards = [...p.manifest.cards],
      from = cards.findIndex((c) => c.id === id),
      to = from + offset;
    if (from < 0 || to < 0 || to >= cards.length) return;
    [cards[from], cards[to]] = [cards[to], cards[from]];
    commit({ ...p, manifest: { ...p.manifest, cards } });
  }
  function removeCard(id: string) {
    const p = current.current;
    commit(
      pruneAssets({
        ...p,
        manifest: { ...p.manifest, cards: p.manifest.cards.filter((c) => c.id !== id) },
      }),
    );
    setStatus('Karta usunięta. Możesz cofnąć tę zmianę.');
  }
  async function addFiles(files: File[]) {
    if (addingRef.current) return;
    addingRef.current = true;
    setAdding(true);
    const epoch = generation.current;
    try {
      for (const [index, file] of files.entries()) {
        const result = await addImage(current.current, file);
        if (!mounted.current) return;
        if (generation.current !== epoch)
          throw new Error('Zestaw został zastąpiony podczas dodawania zdjęć. Spróbuj ponownie.');
        const card = result.manifest.cards.at(-1)!,
          p = current.current;
        commit({
          manifest: {
            ...p.manifest,
            assets: { ...p.manifest.assets, [card.assetId]: result.manifest.assets[card.assetId] },
            cards: [...p.manifest.cards, card],
          },
          data: { ...p.data, [card.assetId]: result.data[card.assetId] },
        });
        setStatus(`Dodawanie zdjęć: ${index + 1}/${files.length}`);
      }
      setStatus(`Zestaw zawiera ${current.current.manifest.cards.length} kart.`);
    } catch (e) {
      setStatus(message(e));
    } finally {
      addingRef.current = false;
      if (mounted.current) setAdding(false);
    }
  }
  async function save() {
    const snapshot = structuredClone(current.current),
      version = rev.current;
    try {
      const bytes = await saveProject(snapshot);
      downloadBytes(bytes, filename(snapshot.manifest.title) + '.eduswiper', 'application/zip');
      savedRef.current = version;
      setSaved(version);
      setStatus('Plik projektu przygotowany do pobrania.');
    } catch (e) {
      setStatus(message(e));
    }
  }
  async function open(file: File) {
    if (importController.current) return;
    const version = rev.current,
      isLegacy = file.name.toLowerCase().endsWith('.esw'),
      active = new AbortController();
    importController.current = active;
    setImporting(true);
    try {
      if (file.size > (isLegacy ? 275_000_000 : 202_000_000))
        throw new Error('Plik projektu jest za duży.');
      setStatus(isLegacy ? 'Odczytywanie starego projektu…' : 'Otwieranie projektu…');
      let next: Project;
      if (isLegacy) {
        const text = await file.text();
        if (active.signal.aborted) throw new DOMException('Import anulowany.', 'AbortError');
        next = (
          await importEsw(text, {
            signal: active.signal,
            onProgress: (done, total) => setStatus(`Import kart: ${done}/${total}`),
          })
        ).project;
      } else next = await openProject(new Uint8Array(await file.arrayBuffer()));
      if (active.signal.aborted) throw new DOMException('Import anulowany.', 'AbortError');
      if (rev.current !== version)
        throw new Error('Projekt zmienił się podczas otwierania pliku. Spróbuj ponownie.');
      if (
        rev.current !== savedRef.current &&
        !window.confirm('Zastąpić bieżący zestaw? Niezapisane zmiany zostaną utracone.')
      )
        return;
      replace(next);
      setPdf(undefined);
      setStatus(
        isLegacy ? 'Import zakończony. Sprawdź raport poniżej tytułu zestawu.' : 'Projekt otwarty.',
      );
    } catch (e) {
      setStatus(
        e instanceof DOMException && e.name === 'AbortError' ? 'Import anulowany.' : message(e),
      );
    } finally {
      importController.current = undefined;
      if (mounted.current) setImporting(false);
    }
  }
  async function restore() {
    const version = rev.current;
    try {
      await draftQueue.current;
      const next = await loadDraft();
      if (!next) throw new Error('Brak kopii roboczej.');
      if (rev.current !== version) throw new Error('Zestaw zmienił się podczas odczytu.');
      if (
        rev.current !== savedRef.current &&
        !window.confirm('Zastąpić bieżący zestaw kopią lokalną?')
      )
        return;
      replace(next);
      setPdf(undefined);
      setStatus('Przywrócono kopię lokalną.');
    } catch (e) {
      setStatus(message(e));
    }
  }
  async function generate() {
    if (exportController.current) return;
    const snapshot = structuredClone(current.current),
      version = rev.current,
      active = new AbortController();
    exportController.current = active;
    setExporting(true);
    setProgress(0);
    setStatus('Przygotowywanie PDF…');
    try {
      const response = await fetch(fontUrl, { signal: active.signal });
      if (!response.ok) throw new Error('Nie udało się załadować fontu.');
      const result = await exportPdf(snapshot, new Uint8Array(await response.arrayBuffer()), {
        signal: active.signal,
        onProgress: (p) => {
          setProgress((p.stage === 'images' ? 0 : 50) + (p.done / p.total) * 50);
          setStatus(
            `${p.stage === 'images' ? 'Przygotowanie obrazów' : 'Skład PDF'}: ${p.done}/${p.total}`,
          );
        },
      });
      if (!mounted.current) return;
      setPdf({ ...result, name: filename(snapshot.manifest.title) + '.pdf', revision: version });
      setStatus(`Gotowe: ${result.pages} stron.`);
    } catch (e) {
      if (mounted.current)
        setStatus(
          e instanceof DOMException && e.name === 'AbortError' ? 'Eksport anulowany.' : message(e),
        );
    } finally {
      exportController.current = undefined;
      if (mounted.current) setExporting(false);
    }
  }
  return {
    project,
    revision,
    dirty: revision !== saved,
    status,
    draftStatus,
    adding,
    importing,
    exporting,
    progress,
    pdf,
    canUndo: historyTick >= 0 && undo.current.length > 0,
    canRedo: historyTick >= 0 && redo.current.length > 0,
    undo: () => history('undo'),
    redo: () => history('redo'),
    updateCard,
    updatePrint,
    moveCard,
    removeCard,
    updateTitle: (title: string) => {
      const p = current.current;
      commit({ ...p, manifest: { ...p.manifest, title } }, 'title');
    },
    applyCrop: (id: string, crop: Crop) => updateCard(id, { mode: 'cover', crop }),
    addFiles,
    save,
    open,
    restore,
    generate,
    cancelExport: () => exportController.current?.abort(),
    cancelImport: () => importController.current?.abort(),
    downloadPdf: () => {
      if (pdf) downloadBytes(pdf.bytes, pdf.name, 'application/pdf');
    },
  };
}
