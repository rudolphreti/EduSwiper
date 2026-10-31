import type { LegacyResult } from './legacy';
export function importEsw(
  text: string,
  options: { signal?: AbortSignal; onProgress?: (done: number, total: number) => void } = {},
): Promise<LegacyResult> {
  if (options.signal?.aborted)
    return Promise.reject(new DOMException('Import anulowany.', 'AbortError'));
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./legacy.worker.ts', import.meta.url), { type: 'module' });
    const cleanup = () => {
      worker.terminate();
      options.signal?.removeEventListener('abort', cancel);
    };
    const cancel = () => {
      cleanup();
      reject(new DOMException('Import anulowany.', 'AbortError'));
    };
    options.signal?.addEventListener('abort', cancel, { once: true });
    worker.onerror = (e) => {
      cleanup();
      reject(new Error(e.message));
    };
    worker.onmessageerror = () => {
      cleanup();
      reject(new Error('Nie udało się odczytać wyniku importu.'));
    };
    worker.onmessage = (e) => {
      if (e.data.type === 'progress') {
        options.onProgress?.(e.data.done, e.data.total);
        return;
      }
      cleanup();
      if (e.data.type === 'error') reject(new Error(e.data.message));
      else resolve({ project: e.data.project, report: e.data.report });
    };
    try {
      worker.postMessage({ text });
    } catch (e) {
      cleanup();
      reject(e);
    }
  });
}
