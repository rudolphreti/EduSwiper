import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { generatePdf, type Card, type Layout } from '../src/pdf';
const font = new Uint8Array(readFileSync('assets/NotoSans-Regular.ttf'));
const image = new Uint8Array(readFileSync('tests/fixtures/landscape.png'));
// Generator takes prepared square images; use dedicated square fixture.
const square = new Uint8Array(readFileSync('tests/fixtures/square.png'));
const cards: Card[] = Array.from({ length: 5 }, (_, i) => ({
  id: 'card-' + i,
  text:
    i === 0
      ? 'Zażółć gęślą jaźń'
      : i === 1
        ? 'Dwa wiersze\npodpisu'
        : i === 2
          ? 'Bardzo długi podpis edukacyjny sprawdzający automatyczne dopasowanie tekstu'
          : i === 3
            ? 'Najdłuższysłowopróbnybezspacjisprawdzającypodział'
            : '',
  image: square,
}));
mkdirSync('test-results', { recursive: true });
for (const layout of ['eco', 'classic2', 'classic4'] as Layout[]) {
  test(`${layout}: empty set and invalid dimensions are rejected`, () => {
    assert.throws(() => generatePdf([], layout, font), /pusty/);
    assert.throws(() => generatePdf([{ ...cards[0], image }], layout, font), /kwadratowy/);
  });
  for (const n of [1, 2, 3, 5])
    test(`${layout}: ${n} cards`, () => {
      const result = generatePdf(cards.slice(0, n), layout, font, true, { title: 'Próba PDF' });
      assert.equal(result.pages, Math.ceil(n / (layout === 'classic2' ? 1 : 2)));
      writeFileSync(`test-results/${layout}-${n}.pdf`, new Uint8Array(result.bytes));
    });
  test(`${layout}: font errors and overflow do not produce silent clipping`, () => {
    assert.throws(() => generatePdf([{ ...cards[0], text: '🦄' }], layout, font), /nie zawiera/);
    assert.throws(
      () => generatePdf([{ ...cards[0], text: 'x '.repeat(10000) }], layout, font),
      /10 pt/,
    );
    assert.throws(() => generatePdf(cards, layout, font, true, { fontSize: 8 }), /ustawienia/);
  });
}
test('low resolution emits warning and card IDs are unique', () => {
  const r = generatePdf(cards.slice(0, 1), 'classic2', font);
  assert.equal(r.warnings.length, 1);
  assert.throws(() => generatePdf([cards[0], cards[0]], 'eco', font), /unikalne/);
});
