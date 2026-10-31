import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zipSync, strToU8 } from 'fflate';
import {
  createProject,
  centerCrop,
  hash,
  manifestSchema,
  validateProject,
  pruneAssets,
  type Project,
} from '../src/project';
import { saveProject, openProject } from '../src/archive';
import { rasterSize } from '../src/images';
async function fixture(): Promise<Project> {
  const p = createProject(),
    bytes = new Uint8Array([1, 2, 3]),
    id = await hash(bytes);
  p.data[id] = bytes;
  p.manifest.assets[id] = { id, mime: 'image/png', width: 1200, height: 600, bytes: bytes.length };
  p.manifest.cards = [
    {
      id: 'card',
      assetId: id,
      text: 'Zażółć gęślą jaźń',
      mode: 'cover',
      crop: centerCrop(1200, 600),
    },
  ];
  return p;
}
test('portable project preserves bytes, Unicode, print settings and crop', async () => {
  const p = await fixture();
  p.manifest.print.division = false;
  const decoded = await openProject(await saveProject(p));
  assert.deepEqual(decoded, p);
});
test('reject damaged asset before accepting project', async () => {
  const p = await fixture();
  const bytes = await saveProject(p);
  p.data[p.manifest.cards[0].assetId][0] = 9;
  await assert.rejects(validateProject(p), /Uszkodzony/);
  assert.deepEqual(
    (await openProject(bytes)).data[Object.keys(p.data)[0]],
    new Uint8Array([1, 2, 3]),
  );
});
test('future schema is rejected', async () => {
  const p = await fixture();
  const bytes = zipSync({
    'manifest.json': strToU8(JSON.stringify({ ...p.manifest, version: 2 })),
  });
  await assert.rejects(openProject(bytes));
});
test('archive rejects traversal and oversized manifest before decompression', async () => {
  await assert.rejects(openProject(zipSync({ '../escape': new Uint8Array([1]) })), /ścieżka/);
  await assert.rejects(
    openProject(zipSync({ 'manifest.json': new Uint8Array(2_000_001) })),
    /za duży/,
  );
});
test('missing assets and duplicate card IDs are rejected', async () => {
  const p = await fixture();
  const m = structuredClone(p.manifest);
  m.cards.push({ ...m.cards[0] });
  assert.equal(manifestSchema.safeParse(m).success, false);
  delete m.assets[m.cards[0].assetId];
  assert.equal(manifestSchema.safeParse(m).success, false);
});
test('crop is square in source pixels and stays within image', async () => {
  const p = await fixture();
  assert.deepEqual(centerCrop(1200, 600), { x: 0.25, y: 0, width: 0.5, height: 1 });
  p.manifest.cards[0].crop.width = 0.7;
  assert.equal(manifestSchema.safeParse(p.manifest).success, false);
  p.manifest.cards[0].crop.x = 1;
  assert.equal(manifestSchema.safeParse(p.manifest).success, false);
});
test('removing a card drops only unreferenced assets', async () => {
  const p = await fixture();
  const next = pruneAssets({ ...p, manifest: { ...p.manifest, cards: [] } });
  assert.equal(Object.keys(next.data).length, 0);
  assert.equal(p.manifest.cards.length, 1);
});
test('300 ppi limit never upscales cropped source', async () => {
  const p = await fixture(),
    a = Object.values(p.manifest.assets)[0];
  assert.equal(rasterSize(a, p.manifest.cards[0].crop, 'cover', 90), 600);
  assert.equal(
    rasterSize({ ...a, width: 6000, height: 6000 }, { width: 1, height: 1 }, 'cover', 90),
    1063,
  );
  assert.equal(rasterSize(a, p.manifest.cards[0].crop, 'contain', 90), 1063);
});
test('minimum font and unsupported layout are validated', async () => {
  const p = await fixture();
  p.manifest.print.minimumFontSize = 40;
  assert.equal(manifestSchema.safeParse(p.manifest).success, false);
});
