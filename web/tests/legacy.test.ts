import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { decodeDataUri, parseLegacy, LEGACY_VERSION } from '../src/legacy';
import { legacyCardMetadataSchema } from '../src/legacy-metadata';
const image = readFileSync('tests/fixtures/square.png');
const source = () => ({
  version: LEGACY_VERSION,
  title: 'Zażółć gęślą jaźń',
  fontType: 'Calibri',
  baseFontSize: '36',
  template: '4onA4classic',
  cards: [{ imgDataUri: 'data:image/png;base64,' + image.toString('base64'), word: 'Podpis' }],
});
test('legacy source preserves text and accepts known template/version', () => {
  const p = parseLegacy(JSON.stringify(source()));
  assert.equal(p.title, source().title);
  assert.equal(p.cards[0].word, 'Podpis');
});
test('legacy parser rejects malformed JSON, unknown version and invalid card', () => {
  assert.throws(() => parseLegacy('{'), /JSON/);
  assert.throws(() => parseLegacy(JSON.stringify({ ...source(), version: 'future' })), /wersja/);
  assert.throws(
    () => parseLegacy(JSON.stringify({ ...source(), cards: [{ word: 'missing image' }] })),
    /Nieprawidłowy/,
  );
});
test('embedded image bytes remain exact; remote URLs and unsupported types are rejected', () => {
  assert.deepEqual(
    decodeDataUri(source().cards[0].imgDataUri, 'image').bytes,
    new Uint8Array(image),
  );
  for (const uri of [
    'https://example.com/a.png',
    'data:image/svg+xml;base64,PHN2Zz4=',
    'data:image/png;base64,!!!!',
    'data:image/png;base64,YQ===',
  ])
    assert.throws(() => decodeDataUri(uri, 'image'));
});
test('legacy canvas metadata preserves finite geometry but rejects invalid values', () => {
  const meta = {
    templatesData: {
      ECO4onA4: {
        left: -10,
        top: 20,
        width: 250,
        height: 180,
        naturalWidth: 1000,
        naturalHeight: 720,
      },
    },
    fontSize: 36,
  };
  assert.deepEqual(legacyCardMetadataSchema.parse(meta), meta);
  assert.equal(
    legacyCardMetadataSchema.safeParse({ canvasData: { left: 0, top: 0, width: -1, height: 50 } })
      .success,
    false,
  );
});
test('custom font accepts actual TrueType header and rejects webfont formats', () => {
  const bytes = readFileSync('assets/NotoSans-Regular.ttf');
  assert.deepEqual(
    decodeDataUri('data:font/ttf;base64,' + bytes.toString('base64'), 'font').bytes,
    new Uint8Array(bytes),
  );
  assert.throws(() => decodeDataUri('data:font/ttf;base64,d09GMg==', 'font'), /TrueType/);
});
