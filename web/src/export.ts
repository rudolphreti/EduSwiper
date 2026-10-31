import type { Project } from './project';
import type { Result } from './pdf';
export type Progress = { stage: 'images' | 'pdf'; done: number; total: number };
export function exportPdf(
  project: Project,
  font: Uint8Array,
  options: { signal?: AbortSignal; onProgress?: (p: Progress) => void } = {},
): Promise<Result> {
  if (options.signal?.aborted)
    return Promise.reject(new DOMException('Eksport anulowany.', 'AbortError'));
  const snapshot = structuredClone(project);
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./pdf.worker.ts', import.meta.url), { type: 'module' });
    const cleanup = () => {
      worker.terminate();
      options.signal?.removeEventListener('abort', cancel);
    };
    const cancel = () => {
      cleanup();
      reject(new DOMException('Eksport anulowany.', 'AbortError'));
    };
    options.signal?.addEventListener('abort', cancel, { once: true });
    worker.onerror = (e) => {
      cleanup();
      reject(new Error(e.message));
    };
    worker.onmessageerror = () => {
      cleanup();
      reject(new Error('Nie udało się odczytać wyniku eksportu.'));
    };
    worker.onmessage = (e) => {
      if (e.data.type === 'progress') {
        options.onProgress?.(e.data);
        return;
      }
      cleanup();
      if (e.data.type === 'error') reject(new Error(e.data.message));
      else resolve({ bytes: e.data.bytes, pages: e.data.pages, warnings: e.data.warnings });
    };
    try {
      worker.postMessage({ project: snapshot, font: Uint8Array.from(font) });
    } catch (e) {
      cleanup();
      reject(e);
    }
  });
}
