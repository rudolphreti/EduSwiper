import { test } from 'node:test';
import assert from 'node:assert/strict';
import { centerCrop } from '../src/project';
import { cropZoom, panCrop, zoomCrop } from '../src/crop';
test('manual zoom preserves focal center and square source geometry', () => {
  const a = { width: 1200, height: 600 },
    crop = zoomCrop(centerCrop(1200, 600), a, 2);
  assert.deepEqual(crop, { x: 0.375, y: 0.25, width: 0.25, height: 0.5 });
  assert.equal(cropZoom(crop, a), 2);
  assert.equal(crop.width * a.width, crop.height * a.height);
});
test('pan clamps against source borders and does not change crop size', () => {
  const crop = zoomCrop(centerCrop(1200, 600), { width: 1200, height: 600 }, 2);
  assert.deepEqual(panCrop(crop, 100, 100), { ...crop, x: 0, y: 0 });
  assert.deepEqual(panCrop(crop, -100, -100), { ...crop, x: 0.75, y: 0.5 });
});
test('zoom out from an edge keeps a valid square and resets to full short side', () => {
  const asset = { width: 600, height: 1200 },
    zoomed = zoomCrop(centerCrop(600, 1200), asset, 8),
    edge = panCrop(zoomed, -100, 100),
    out = zoomCrop(edge, asset, 1);
  assert.equal(out.width, 1);
  assert.equal(out.height, 0.5);
  assert.equal(out.x, 0);
  assert.ok(out.y >= 0 && out.y <= 0.5);
});
