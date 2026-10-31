import { jsPDF } from 'jspdf';
import { create } from 'fontkit';
import { Buffer } from 'buffer';

export type Layout = 'eco' | 'classic2' | 'classic4';
export interface Card {
  id: string;
  text: string;
  image: string | Uint8Array;
}
export interface Result {
  bytes: ArrayBuffer;
  pages: number;
  warnings: string[];
}
export const layouts = {
  eco: { width: 90, image: 90, label: 40, separate: 0, perPage: 2, font: 18 },
  classic2: { width: 130, image: 130, label: 20, separate: 20, perPage: 1, font: 24 },
  classic4: { width: 90, image: 90, label: 18, separate: 18, perPage: 2, font: 18 },
} as const;
const ptToMm = 25.4 / 72;

/** Pure document generation: no DOM, CSS, viewport or network access. Images are pre-cropped square PNG/JPEG. */
export function generatePdf(
  cards: readonly Card[],
  layout: Layout,
  font: Uint8Array,
  division = true,
  options: {
    title?: string;
    fontSize?: number;
    minimumFontSize?: number;
    onCard?: (done: number, total: number) => void;
  } = {},
): Result {
  if (!cards.length) throw new Error('Zestaw jest pusty.');
  const parsedFont = create(Buffer.from(font));
  if (!('ascent' in parsedFont)) throw new Error('Kolekcje fontów nie są obsługiwane.');
  const face = parsedFont;
  if (new Set(cards.map((c) => c.id)).size !== cards.length)
    throw new Error('Identyfikatory kart muszą być unikalne.');
  for (const [index, card] of cards.entries()) {
    if (!card.id || !card.image) throw new Error('Niepełne dane karty.');
    for (const ch of card.text.normalize('NFC')) {
      if (!/\s/u.test(ch) && !face.hasGlyphForCodePoint(ch.codePointAt(0)!))
        throw new Error(`Karta ${index + 1}: font nie zawiera znaku ${ch}.`);
    }
  }
  const cfg = layouts[layout];
  if (!cfg) throw new Error('Nieznany układ PDF.');
  const baseSize = options.fontSize ?? cfg.font,
    minimum = options.minimumFontSize ?? 10;
  if (
    !Number.isFinite(baseSize) ||
    !Number.isFinite(minimum) ||
    minimum < 10 ||
    baseSize < minimum ||
    baseSize > 100
  )
    throw new Error('Nieprawidłowe ustawienia tekstu.');
  const pdf = new jsPDF({
    orientation: layout === 'classic2' ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
    floatPrecision: 6,
  });
  let binary = '';
  for (const b of font) binary += String.fromCharCode(b);
  pdf.addFileToVFS('NotoSans.ttf', btoa(binary));
  pdf.addFont('NotoSans.ttf', 'NotoSans', 'normal');
  pdf.setFont('NotoSans');
  pdf.setLineWidth(0.25);
  pdf.setProperties({ title: options.title ?? 'EduSwiper', creator: 'EduSwiper' });
  const warnings: string[] = [];
  const pages = Math.ceil(cards.length / cfg.perPage);
  const pageW = pdf.internal.pageSize.getWidth(),
    pageH = pdf.internal.pageSize.getHeight();
  const totalW = cfg.width * 2 + 5;
  const groupH = cfg.image + cfg.label + cfg.separate;
  const totalH = groupH * cfg.perPage + 5 * (cfg.perPage - 1);
  const startX = (pageW - totalW) / 2,
    startY = (pageH - totalH) / 2;
  if (startX < 10 || startY < 10) throw new Error('Układ przekracza bezpieczny obszar strony.');

  function fit(text: string) {
    for (let step = 0; step <= Math.ceil((baseSize - minimum) / 0.25); step++) {
      const size = Math.max(minimum, baseSize - step * 0.25);
      pdf.setFontSize(size);
      const lines = text
        .split('\n')
        .flatMap((line) => (line ? (pdf.splitTextToSize(line, cfg.width - 6) as string[]) : ['']));
      // Use actual font ascent/descent and PDF baseline advance; do not infer text height from CSS.
      const glyphHeight = ((face.ascent - face.descent) / face.unitsPerEm) * size * ptToMm;
      const advance = Math.max(1.2, (face.ascent - face.descent) / face.unitsPerEm) * size * ptToMm;
      const height = glyphHeight + (lines.length - 1) * advance;
      const maxHeight = (cfg.separate || cfg.label) - 6;
      if (height <= maxHeight && lines.every((l) => pdf.getTextWidth(l) <= cfg.width - 6 + 0.001))
        return { lines, size, height, advance };
    }
    throw new Error(`Podpis nie mieści się przy minimalnym rozmiarze ${minimum} pt.`);
  }
  function label(x: number, y: number, height: number, fitted: ReturnType<typeof fit>) {
    pdf.setFontSize(fitted.size);
    const ascent = (face.ascent / face.unitsPerEm) * fitted.size * ptToMm;
    const top = y + (height - fitted.height) / 2;
    fitted.lines.forEach((line, i) =>
      pdf.text(line, x + cfg.width / 2, top + ascent + i * fitted.advance, { align: 'center' }),
    );
  }
  cards.forEach((card, i) => {
    if (i && i % cfg.perPage === 0) pdf.addPage();
    const x = startX,
      y = startY + (i % cfg.perPage) * (groupH + 5);
    let fitted: ReturnType<typeof fit>;
    try {
      fitted = fit(card.text.normalize('NFC'));
    } catch (e) {
      throw new Error(`Karta ${i + 1}: ${(e as Error).message}`);
    }
    const props = pdf.getImageProperties(card.image);
    if (props.width !== props.height)
      throw new Error(`Karta ${i + 1}: obraz eksportowy musi mieć kwadratowy kadr.`);
    if (props.width / (cfg.width / 25.4) < 150)
      warnings.push(`Karta ${i + 1}: rozdzielczość poniżej 150 ppi.`);
    for (let col = 0; col < 2; col++) {
      const cx = x + col * (cfg.width + 5);
      pdf.addImage(card.image, props.fileType, cx, y, cfg.width, cfg.image, card.id, 'FAST');
      // Borders are inset by half their stroke width, keeping physical dimensions exact.
      pdf.rect(cx + 0.125, y + 0.125, cfg.width - 0.25, cfg.image + cfg.label - 0.25);
      if (col === 0 ? division : layout === 'eco')
        pdf.line(cx, y + cfg.image, cx + cfg.width, y + cfg.image);
      if (col === 0 || layout === 'eco') label(cx, y + cfg.image, cfg.label, fitted);
    }
    if (cfg.separate) {
      pdf.rect(x + 0.125, y + cfg.image + cfg.label + 0.125, cfg.width - 0.25, cfg.separate - 0.25);
      label(x, y + cfg.image + cfg.label, cfg.separate, fitted);
    }
    options.onCard?.(i + 1, cards.length);
  });
  return { bytes: pdf.output('arraybuffer'), pages, warnings };
}
