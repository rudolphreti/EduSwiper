import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { openProject } from '../src/archive';
mkdirSync('test-results', { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ||
    (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
try {
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } }),
    errors: string[] = [];
  page.setDefaultTimeout(15000);
  page.setDefaultNavigationTimeout(15000);
  page.on('pageerror', (e) => errors.push(e.message));
  // tsx may preserve function names through __name inside serialized evaluate callbacks.
  await page.addInitScript('globalThis.__name = (fn) => fn;');
  await page.goto(process.env.APP_URL || 'http://127.0.0.1:5175/');
  console.log("await page.locator('#images')");
  await page
    .locator('#images')
    .setInputFiles(['tests/fixtures/landscape.png', 'tests/fixtures/transparent.png']);
  await page.waitForFunction(() => document.querySelectorAll('.card').length === 2);
  await page.fill('#title', 'Próba polskich znaków');
  await page.locator('.card textarea').nth(0).fill('Zażółć gęślą jaźń');
  await page.locator('.card select').nth(0).selectOption('contain');
  await page.waitForFunction(() =>
    document.querySelector('#draft-status')?.textContent?.includes('zapisana'),
  );
  console.log('const archive=');
  const archive = page.waitForEvent('download');
  await page.click('#save');
  const file = await archive;
  await file.saveAs('test-results/project.eduswiper');
  const project = await openProject(new Uint8Array(readFileSync('test-results/project.eduswiper')));
  assert.equal(project.manifest.title, 'Próba polskich znaków');
  assert.equal(project.manifest.cards.length, 2);
  assert.equal(project.manifest.cards[0].mode, 'contain');
  assert.equal(project.manifest.cards[0].text, 'Zażółć gęślą jaźń');
  console.log("await page.click('#export')");
  await page.click('#export');
  await page.waitForFunction(
    () => !document.querySelector<HTMLButtonElement>('#download')!.disabled,
    {},
    { timeout: 60000 },
  );
  await page.waitForFunction(
    () => document.querySelector('canvas[data-rendered="true"]'),
    {},
    { timeout: 30000 },
  );
  const pdf = page.waitForEvent('download');
  await page.click('#download');
  await (await pdf).saveAs('test-results/browser.pdf');
  console.log("await page.locator('#open').setInputFiles({");
  await page.locator('#open').setInputFiles({
    name: 'bad.eduswiper',
    mimeType: 'application/zip',
    buffer: Buffer.from('invalid'),
  });
  await page.waitForFunction(() =>
    document.querySelector('#status')?.textContent?.includes('uszkodzony'),
  );
  assert.equal(await page.locator('.card').count(), 2);
  console.log('await page.evaluate(()=>');
  await page.click('#export');
  await page.click('#cancel');
  await page.waitForFunction(
    () => document.querySelector('#status')?.textContent === 'Eksport anulowany.',
  );
  console.log("await page.locator('.card button')");
  await page.click('#cards-tab');
  await page.getByRole('button', { name: 'Usuń kartę 1', exact: true }).click();
  assert.equal(await page.locator('.card').count(), 1);
  console.log("page.once('dialog',d=>d.accept());await page.locator('#open')");
  page.once('dialog', (d) => d.accept());
  await page.locator('#open').setInputFiles('test-results/project.eduswiper');
  await page.waitForFunction(() => document.querySelectorAll('.card').length === 2);
  await page.waitForFunction(() =>
    document.querySelector('#draft-status')?.textContent?.includes('zapisana'),
  );
  console.log("page.once('dialog',d=>d.accept());await page.reload()");
  page.once('dialog', (d) => d.accept());
  await page.reload();
  await page.click('#restore');
  await page.waitForFunction(() => document.querySelectorAll('.card').length === 2);
  assert.equal(await page.inputValue('#title'), 'Próba polskich znaków');
  // These checks run inside a real browser because the image pipeline uses worker-compatible browser APIs.
  console.log('const pipeline=');
  const pipeline = await page.evaluate(async () => {
    const projectPath = '/src/project.ts',
      imagesPath = '/src/images.ts',
      exportPath = '/src/export.ts';
    const { createProject } = await import(projectPath),
      { addImage, rasterize } = await import(imagesPath),
      { exportPdf } = await import(exportPath);
    const bytes = await (await fetch('/tests/fixtures/landscape.png')).arrayBuffer();
    let p = await addImage(
      createProject(),
      new File([bytes], 'stripes.png', { type: 'image/png' }),
    );
    const duplicate = await addImage(p, new File([bytes], 'same.png', { type: 'image/png' }));
    if (Object.keys(duplicate.manifest.assets).length !== 1)
      throw new Error('Asset deduplication failed');
    const card = p.manifest.cards[0],
      asset = p.manifest.assets[card.assetId];
    async function pixel(mode: string, x: number, y: number) {
      const image = await rasterize(p.data[card.assetId], asset, { ...card, mode }, 90);
      const bitmap = await createImageBitmap(new Blob([image]));
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height),
        ctx = canvas.getContext('2d')!;
      ctx.drawImage(bitmap, 0, 0);
      const value = Array.from(
        ctx.getImageData(Math.floor(x * bitmap.width), Math.floor(y * bitmap.height), 1, 1).data,
      );
      bitmap.close();
      return value;
    }
    const cover = await pixel('cover', 0.1, 0.1),
      contain = await pixel('contain', 0.1, 0.1);
    if (cover[1] < 100 || cover[0] > 5) throw new Error('Wrong centered crop');
    if (contain[0] !== 255 || contain[1] !== 255 || contain[2] !== 255)
      throw new Error('Contain should have white padding');
    const rotated = await (await fetch('/tests/fixtures/rotated.jpg')).arrayBuffer();
    const rp = await addImage(
      createProject(),
      new File([rotated], 'rotated.jpg', { type: 'image/jpeg' }),
    );
    const ra = Object.values(rp.manifest.assets)[0] as { width: number; height: number };
    if (ra.width !== 60 || ra.height !== 120) throw new Error('EXIF orientation failed');
    const fontPath = '/assets/NotoSans-Regular.ttf';
    const font = new Uint8Array(await (await fetch(fontPath)).arrayBuffer());
    const ac = new AbortController();
    let progress = false,
      cancelled = false;
    try {
      await exportPdf(p, font, {
        signal: ac.signal,
        onProgress: () => {
          progress = true;
          ac.abort();
        },
      });
    } catch (e) {
      cancelled = e instanceof DOMException && e.name === 'AbortError';
    }
    if (!progress || !cancelled) throw new Error('Worker cancellation failed');
    p.manifest.cards[0].text = 'Snapshot';
    const promise = exportPdf(p, font);
    p.manifest.cards[0].text = '🦄';
    const result = await promise;
    if (!result.pages) throw new Error('Snapshot export failed');
    return {
      cover,
      contain,
      exif: [ra.width, ra.height],
      deduplicated: true,
      cancelled,
      snapshot: true,
    };
  });
  assert.deepEqual(errors, []);
  await page.screenshot({ path: 'test-results/browser.png', fullPage: true });
  writeFileSync(
    'test-results/browser-results.json',
    JSON.stringify({ ui: 'passed', pipeline }, null, 2),
  );
  console.log('Browser workflow passed', pipeline);
} finally {
  await browser.close();
}
