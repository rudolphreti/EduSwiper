import { importLegacy } from './legacy';
self.onmessage = async (event: MessageEvent<{ text: string }>) => {
  try {
    const result = await importLegacy(event.data.text, {
      onProgress: (done, total) => self.postMessage({ type: 'progress', done, total }),
    });
    self.postMessage({ type: 'result', ...result });
  } catch (e) {
    self.postMessage({
      type: 'error',
      message: e instanceof Error ? e.message : 'Nie udało się zaimportować pliku .esw.',
    });
  }
};
