import { chromium } from 'playwright';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
mkdirSync('test-results', { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ||
    (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  await page.addInitScript('globalThis.__name=(fn)=>fn;');
  await page.goto(process.env.APP_URL || 'http://127.0.0.1:5175/');
  const fixture = {
    version: 'Prototype_k3d_v3_2templates',
    title: 'Import próbny',
    fontType: 'Calibri',
    baseFontSize: '36',
    template: '4onA4classic',
    cards: [
      {
        imgDataUri:
          'data:image/png;base64,' +
          readFileSync('tests/fixtures/landscape.png').toString('base64'),
        word: 'Zażółć gęślą jaźń',
        templatesData: {
          CLASSIC2onA4: {
            left: -5,
            top: 10,
            width: 371,
            height: 185.5,
            naturalWidth: 1200,
            naturalHeight: 600,
          },
        },
      },
    ],
  };
  await page.locator('#open').setInputFiles({
    name: 'sample.esw',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(fixture)),
  });
  await page.waitForFunction(() =>
    document.querySelector('#status')?.textContent?.startsWith('Import zakończony'),
  );
  assert.equal(await page.locator('.card').count(), 1);
  assert.equal(await page.inputValue('#title'), 'Import próbny');
  assert.match(await page.locator('#import-report').innerText(), /Noto Sans/);
  const download = page.waitForEvent('download');
  await page.click('#save');
  await (await download).saveAs('test-results/imported.eduswiper');
  await page.locator('#open').setInputFiles('test-results/imported.eduswiper');
  await page.waitForFunction(
    () => document.querySelector('#status')?.textContent === 'Projekt otwarty.',
  );
  assert.match(await page.locator('#import-report').innerText(), /Noto Sans/);
  await page.locator('#open').setInputFiles({
    name: 'invalid.esw',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        ...fixture,
        cards: [
          fixture.cards[0],
          { ...fixture.cards[0], imgDataUri: 'data:image/png;base64,YmFk' },
        ],
      }),
    ),
  });
  await page.waitForFunction(() =>
    document.querySelector('#status')?.textContent?.startsWith('Karta 2:'),
  );
  assert.equal(await page.locator('.card').count(), 1);
  await page.evaluate(() => {
    document.querySelector<HTMLButtonElement>('#cancel-import')!.click();
  });
  const synthetic = await page.evaluate(async (input) => {
    const p = '/src/import.ts',
      a = '/src/archive.ts';
    const { importEsw } = await import(p),
      { saveProject, openProject } = await import(a);
    const r = await importEsw(JSON.stringify(input));
    const roundtrip = await openProject(await saveProject(r.project));
    if (roundtrip.manifest.migration.notes.length < 2) throw new Error('Migration report lost');
    if (roundtrip.manifest.cards[0].legacy.templatesData.CLASSIC2onA4.left !== -5)
      throw new Error('Metadata lost');
    const bad = await importEsw(
      JSON.stringify({
        ...input,
        cards: [{ ...input.cards[0], templatesData: { CLASSIC2onA4: { width: -1 } } }],
      }),
    );
    if (bad.report.discardedCropMetadata[0] !== 1) throw new Error('Missing metadata warning');
    const ac = new AbortController();
    let aborted = false;
    try {
      await importEsw(
        JSON.stringify({ ...input, cards: Array.from({ length: 10 }, () => input.cards[0]) }),
        { signal: ac.signal, onProgress: () => ac.abort() },
      );
    } catch (e) {
      aborted = e instanceof DOMException && e.name === 'AbortError';
    }
    if (!aborted) throw new Error('Import cancellation failed');
    return { roundtrip: true, metadata: true, cancelled: aborted, corruptMetadataReported: true };
  }, fixture);
  // The real corpus is optional in generic CI; the synthetic checks above always run.
  const corpus = path.resolve('../ready-to-use-sets'),
    results = [];
  const files = existsSync(corpus)
    ? readdirSync(corpus)
        .filter((f) => f.endsWith('.esw'))
        .sort()
    : [];
  await page.route('**/legacy-corpus/*', (route) =>
    route.fulfill({
      path: path.join(
        corpus,
        decodeURIComponent(new URL(route.request().url()).pathname.split('/').at(-1)!),
      ),
      contentType: 'application/json',
    }),
  );
  for (const name of files) {
    const expected = JSON.parse(readFileSync(path.join(corpus, name), 'utf8'));
    const result = await page.evaluate(async (name) => {
      const p = '/src/import.ts';
      const { importEsw } = await import(p);
      const text = await (await fetch('/legacy-corpus/' + encodeURIComponent(name))).text();
      const source = JSON.parse(text);
      const start = performance.now(),
        r = await importEsw(text),
        m = r.project.manifest;
      if (
        m.title !== source.title ||
        m.cards.length !== source.cards.length ||
        m.cards.some(
          (c: { text: string; mode: string }, i: number) =>
            c.text !== source.cards[i].word || c.mode !== 'contain',
        )
      )
        throw new Error('Corpus mismatch: ' + name);
      // Independently compare decoded original bytes against imported content for every card.
      for (let i = 0; i < m.cards.length; i++) {
        const uri = source.cards[i].imgDataUri;
        const original = atob(uri.slice(uri.indexOf(',') + 1)),
          actual = r.project.data[m.cards[i].assetId];
        if (
          original.length !== actual.length ||
          actual.some((b: number, index: number) => b !== original.charCodeAt(index))
        )
          throw new Error('Source bytes changed');
      }
      return {
        cards: m.cards.length,
        assets: r.report.assets,
        bytes: Object.values(r.project.data).reduce((n: number, b: any) => n + b.length, 0),
        metadataWarnings: r.report.discardedCropMetadata.length,
        milliseconds: Math.round(performance.now() - start),
        fontReplaced: r.report.fontReplaced,
      };
    }, name);
    assert.equal(result.cards, expected.cards.length);
    results.push({ file: name, ...result });
    console.log(name, result.cards, 'cards', result.milliseconds, 'ms');
  }
  // Verify that an embedded valid custom font survives migration and can generate PDF.
  const custom = {
    ...fixture,
    fontType: 'Moja czcionka',
    customFont:
      'data:font/ttf;base64,' + readFileSync('assets/NotoSans-Regular.ttf').toString('base64'),
  };
  await page.evaluate(async (input) => {
    const p = '/src/import.ts',
      e = '/src/export.ts';
    const { importEsw } = await import(p),
      { exportPdf } = await import(e);
    const r = await importEsw(JSON.stringify(input));
    if (r.report.fontReplaced || !r.project.manifest.print.fontAssetId)
      throw new Error('Font lost');
    const pdf = await exportPdf(r.project, new Uint8Array());
    if (pdf.pages !== 1) throw new Error('Custom font PDF failed');
  }, custom);
  writeFileSync(
    'test-results/legacy-results.json',
    JSON.stringify(
      {
        synthetic,
        customFontPdf: true,
        files: results,
        totalCards: results.reduce((n, r) => n + r.cards, 0),
      },
      null,
      2,
    ),
  );
  console.log(
    'Legacy import verified:',
    results.length,
    'projects,',
    results.reduce((n, r) => n + r.cards, 0),
    'cards',
  );
} finally {
  await browser.close();
}
