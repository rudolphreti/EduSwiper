import { generatePdf, layouts, type Card } from './pdf';
import { validateProject, type Project } from './project';
import { rasterize } from './images';
self.onmessage = async (event: MessageEvent<{ project: Project; font: Uint8Array }>) => {
  try {
    const project = await validateProject(event.data.project),
      m = project.manifest;
    if (!m.cards.length) throw new Error('Zestaw jest pusty.');
    const font = m.print.fontAssetId ? project.data[m.print.fontAssetId] : event.data.font;
    const cards: Card[] = [];
    for (const [i, card] of m.cards.entries()) {
      cards.push({
        id: card.id,
        text: card.text,
        image: await rasterize(
          project.data[card.assetId],
          m.assets[card.assetId],
          card,
          layouts[m.print.layout].width,
        ),
      });
      self.postMessage({ type: 'progress', stage: 'images', done: i + 1, total: m.cards.length });
    }
    const result = generatePdf(cards, m.print.layout, font, m.print.division, {
      title: m.title,
      fontSize: m.print.fontSize,
      minimumFontSize: m.print.minimumFontSize,
      onCard: (done, total) => self.postMessage({ type: 'progress', stage: 'pdf', done, total }),
    });
    self.postMessage({ type: 'result', ...result }, { transfer: [result.bytes] });
  } catch (error) {
    self.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Nie udało się wygenerować PDF.',
    });
  }
};
