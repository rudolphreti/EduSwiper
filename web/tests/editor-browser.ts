import { chromium } from 'playwright';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { openProject } from '../src/archive';
mkdirSync('test-results', { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ||
    (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  page.setDefaultTimeout(20000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(process.env.APP_URL || 'http://127.0.0.1:5175/');
  await page
    .locator('#images')
    .setInputFiles([
      'tests/fixtures/landscape.png',
      'tests/fixtures/square.png',
      'tests/fixtures/transparent.png',
    ]);
  await page.waitForFunction(() => document.querySelectorAll('.card').length === 3);
  await page.fill('#title', 'Ręczny kadr i podgląd');
  await page.locator('.card textarea').nth(0).fill('Ręczny kadr');
  await page.getByRole('button', { name: 'Kadruj kartę 1', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  await page.locator('#crop-zoom').evaluate((el) => {
    const input = el as HTMLInputElement;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, '2');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  assert.match(await dialog.locator('output').innerText(), /2.0/);
  const stage = page.getByRole('group', { name: 'Obszar kadrowania' }),
    box = (await stage.boundingBox())!;
  for (let i = 0; i < 3; i++) {
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.5, { steps: 8 });
    await page.mouse.up();
  }
  await page.getByRole('button', { name: 'Zastosuj kadr' }).click();
  assert.equal(await page.locator('dialog').count(), 0);
  // Check that the saved model contains a manually selected region, not a DOM-sized crop.
  async function saved(name: string) {
    const next = page.waitForEvent('download');
    await page.click('#save');
    await (await next).saveAs('test-results/' + name);
    return openProject(new Uint8Array(readFileSync('test-results/' + name)));
  }
  const project = await saved('cropped.eduswiper'),
    card = project.manifest.cards[0];
  assert.equal(card.mode, 'cover');
  assert.ok(card.crop.x < 0.001);
  assert.equal(card.crop.width, 0.25);
  assert.equal(card.crop.height, 0.5);
  await page.getByRole('button', { name: 'Cofnij zmianę', exact: true }).click();
  const undone = await saved('undo.eduswiper');
  assert.equal(undone.manifest.cards[0].crop.width, 0.5);
  await page.getByRole('button', { name: 'Ponów zmianę', exact: true }).click();
  const redone = await saved('redo.eduswiper');
  assert.deepEqual(redone.manifest.cards[0].crop, card.crop);
  await page.getByRole('button', { name: 'Kadruj kartę 1', exact: true }).click();
  await page.getByRole('group', { name: 'Obszar kadrowania' }).focus();
  await page.keyboard.press('ArrowLeft');
  await page.getByRole('button', { name: 'Anuluj', exact: true }).click();
  const cancelled = await saved('cancelled-crop.eduswiper');
  assert.deepEqual(cancelled.manifest.cards[0].crop, card.crop);
  await page.getByRole('button', { name: 'Przesuń kartę 1 dalej', exact: true }).click();
  const reordered = await saved('reordered.eduswiper');
  assert.equal(reordered.manifest.cards[1].id, card.id);
  await page.click('#export');
  await page.waitForFunction(
    () => document.querySelector('canvas[data-rendered="true"]'),
    {},
    { timeout: 30000 },
  );
  assert.equal(await page.locator('[data-testid=page-count]').innerText(), '1 / 2');
  await page.getByRole('button', { name: 'Następna strona', exact: true }).click();
  await page.waitForFunction(
    () =>
      document.querySelector('canvas[data-rendered="true"]')?.getAttribute('aria-label') ===
      'Strona 2 wygenerowanego PDF',
  );
  await page.getByRole('button', { name: 'Powiększ podgląd', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('canvas[data-rendered="true"]'));
  assert.match(await page.locator('.preview-toolbar output').innerText(), /125/);
  const download = page.waitForEvent('download');
  await page.click('#download');
  await (await download).saveAs('test-results/editor.pdf');
  await page.screenshot({ path: 'test-results/editor-preview.png', fullPage: true });
  await page.click('#cards-tab');
  await page.locator('.card textarea').nth(0).fill('Podpis po eksporcie');
  await page.click('#preview-tab');
  assert.match(await page.locator('.stale-notice').innerText(), /ponownie/);
  await page.click('#cards-tab');
  await page.locator('#cards-tab').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#preview-tab').getAttribute('aria-selected'), 'true');
  await page.keyboard.press('ArrowLeft');
  assert.equal(await page.locator('#cards-tab').getAttribute('aria-selected'), 'true');
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    true,
  );
  await page.getByRole('button', { name: 'Kadruj kartę 1', exact: true }).click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'detached' });
  await page.screenshot({ path: 'test-results/editor-mobile.png', fullPage: true });
  assert.deepEqual(errors, []);
  writeFileSync(
    'test-results/editor-results.json',
    JSON.stringify(
      {
        crop: true,
        undoRedo: true,
        cancelCrop: true,
        reorder: true,
        pdfPages: 2,
        pdfJsRender: true,
        zoom: true,
        staleWarning: true,
        mobileOverflow: false,
      },
      null,
      2,
    ),
  );
  console.log('Editor browser checks passed');
} finally {
  await browser.close();
}
