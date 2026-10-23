#!/usr/bin/env node
/*
 * Turns a flat white studio photo into a proper cut-out with transparency, so
 * it sits correctly on the coloured cards used by the mobile model list.
 *
 *   node tools/dewhite-image.js <src> <dest.webp> [maxWidth]
 *
 * Two passes:
 *  1. Flood fill from the image edges over near-white pixels. Edge-connected
 *     only, so white panels ON the car are never touched.
 *  2. Below the car (everything under the lowest dark pixel, i.e. the tyre
 *     contact line) the only thing left is the drop shadow. That is grey, not
 *     white, so pass 1 cannot reach it and it would otherwise show as pale
 *     blobs on a coloured card. Give it alpha proportional to how dark it is
 *     and paint it black, which reproduces a real soft shadow on ANY colour.
 */
const sharp = require('sharp');

(async () => {
  const [src, dst, wOut] = process.argv.slice(2);
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const lum = i => (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);

  // --- pass 1: edge flood over near-white -------------------------------
  // Honda's studio backdrop is exactly 255,255,255 while the white car body is
  // 254,254,254 - one level apart. Any tolerance above 0 floods into the roof
  // and bonnet and eats the car, so this must stay an exact-white match.
  const TOL = 0;
  const isWhite = i => data[i] >= 255 - TOL && data[i + 1] >= 255 - TOL && data[i + 2] >= 255 - TOL;
  const bg = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, x + (H - 1) * W);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const p = stack.pop();
    if (bg[p] || !isWhite(p * C)) continue;
    bg[p] = 1;
    const x = p % W, y = (p / W) | 0;
    if (x > 0) stack.push(p - 1);
    if (x < W - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - W);
    if (y < H - 1) stack.push(p + W);
  }
  for (let p = 0; p < W * H; p++) if (bg[p]) data[p * C + 3] = 0;

  // --- pass 2: shadow band under the car --------------------------------
  let lastDark = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C;
      if (data[i + 3] > 0 && lum(i) < 110) { lastDark = y; break; }
    }
  const bandTop = Math.max(0, lastDark - Math.round(H * 0.02));
  let softened = 0;
  for (let y = bandTop; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C;
      if (data[i + 3] === 0) continue;
      const l = lum(i);
      if (l < 170) continue;                       // dark = still the car
      const a = Math.max(0, Math.min(255, Math.round(255 - l)));
      data[i] = data[i + 1] = data[i + 2] = 0;     // black shadow
      data[i + 3] = a;
      softened++;
    }

  let pipe = sharp(data, { raw: { width: W, height: H, channels: C } });
  if (wOut && W > +wOut) pipe = pipe.resize({ width: +wOut });
  await pipe.webp({ quality: 82 }).toFile(dst);
  const m = await sharp(dst).metadata();
  console.log(`${dst}  ${m.width}x${m.height}  alpha=${!!m.hasAlpha}  (shadow band from y=${bandTop}, ${softened} px softened)`);
})();
