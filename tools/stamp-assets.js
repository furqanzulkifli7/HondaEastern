#!/usr/bin/env node
/*
 * Stamps every local CSS/JS reference in index.html with a hash of that file's
 * contents, so browsers fetch a changed file and keep using a cached unchanged
 * one - without anyone having to remember to bump a number.
 *
 *   node tools/stamp-assets.js          rewrite index.html
 *   node tools/stamp-assets.js --check  report drift, change nothing, exit 1
 *
 * Why this exists: the version numbers used to be hand-written (?v=1.2, ?v=3).
 * Forgetting to bump one means returning visitors keep the old file and never
 * see the fix, which looks exactly like a failed upload. It bit us when the CSS
 * started referencing .webp backgrounds: a stale cached stylesheet would ask
 * for PNGs that no longer exist on the server.
 *
 * Only same-origin .css/.js are touched. CDN URLs are left alone - they are
 * already versioned in the URL and we cannot hash them anyway.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const CHECK = process.argv.includes('--check');
const HTML = path.join(ROOT, 'index.html');

const hashOf = file =>
  crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 8);

let html = fs.readFileSync(HTML, 'utf8');
const changed = [];
const missing = [];

// src="..." on <script>, href="..." on <link rel=stylesheet>
const RE = /(<(?:script|link)\b[^>]*?(?:src|href)=")([^"]+\.(?:css|js))(\?[^"]*)?(")/g;

html = html.replace(RE, (whole, pre, file, query, post) => {
  if (/^(https?:)?\/\//.test(file)) return whole;          // CDN - leave alone
  const onDisk = path.join(ROOT, file.split('#')[0]);
  if (!fs.existsSync(onDisk)) { missing.push(file); return whole; }

  const want = '?v=' + hashOf(onDisk);
  if (query === want) return whole;
  changed.push(file + '  ' + (query || '(none)') + ' -> ' + want);
  return pre + file + want + post;
});

if (missing.length) {
  console.error('stamp-assets: referenced file(s) not found on disk\n');
  [...new Set(missing)].forEach(m => console.error('  x ' + m));
  process.exit(1);
}

if (CHECK) {
  if (changed.length) {
    console.error('stamp-assets: ' + changed.length + ' asset link(s) not stamped with current content\n');
    changed.forEach(c => console.error('  ! ' + c));
    console.error('\nRun `npm run stamp` before deploying.');
    process.exit(1);
  }
  console.log('stamp-assets: all asset links match file contents');
  process.exit(0);
}

if (!changed.length) {
  console.log('stamp-assets: already current, nothing written');
} else {
  fs.writeFileSync(HTML, html);
  console.log('stamp-assets: updated ' + changed.length + ' link(s)');
  changed.forEach(c => console.log('  - ' + c));
}
