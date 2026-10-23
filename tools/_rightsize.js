// Downscale images that are far larger than they are ever displayed.
const sharp = require('sharp');
const fs = require('fs');
const disp = require('C:/Users/RYZEN5~1/AppData/Local/Temp/claude/c--Sources-Github-HondaEastern/35b443a8-849f-4a7b-987a-b83c6e6d8e79/scratchpad/display.json');

// Kept at full size on purpose:
//  header.png / favicon.png - PNG for og:image and the favicon (social crawlers)
const SKIP = ['assets/img/logo/header.png', 'assets/img/logo/favicon.png'];

(async () => {
  let before = 0, after = 0, n = 0;
  for (const [src, shown] of Object.entries(disp)) {
    if (SKIP.includes(src)) continue;
    if (!fs.existsSync(src) || !/\.webp$/i.test(src)) continue;
    const m = await sharp(src).metadata();
    const sz = fs.statSync(src).size;

    // PROMOSI shots also open full-screen in the lightbox, where only the
    // first slide could be measured - give them a generous floor.
    const isPromo = src.indexOf('assets/img/PROMOSI/') === 0;
    let target = isPromo ? 1200 : Math.max(Math.ceil(shown * 2), 500);
    if (m.width <= target * 1.15) continue;

    before += sz;
    const buf = await sharp(src).resize({ width: target }).webp({ quality: 82 }).toBuffer();
    if (buf.length < sz) { fs.writeFileSync(src, buf); after += buf.length; n++; }
    else after += sz;
  }
  console.log(`resized ${n} images: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB ` +
              `(saved ${((before - after) / 1024).toFixed(0)} KB)`);
})();
