#!/usr/bin/env node
/*
 * Writes every price on the site from prices.json - the single source of truth.
 *
 *   node tools/sync-prices.js          rewrite index.html + assets/js/agency.js
 *   node tools/sync-prices.js --check  report drift, change nothing, exit 1 if any
 *
 * Each price appears in five places (desktop tile, mobile row, modal spec tab,
 * modal price list, loan calculator). Before this existed they were edited by
 * hand and drifted apart - the HR-V price list ended up showing Civic prices.
 * Edit prices.json, run this, and they cannot disagree.
 *
 * Adding or removing a VARIANT still needs a manual edit to index.html (the tab
 * buttons and tab panels) and to carData/populateTabs in agency.js. This script
 * only owns the numbers and the labels attached to them, and it will fail loudly
 * if prices.json and the markup disagree about which variants exist.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHECK = process.argv.includes('--check');

const rm = n => 'RM ' + n.toLocaleString('en-US') + '.00';
const prices = JSON.parse(fs.readFileSync(path.join(ROOT, 'prices.json'), 'utf8'));

const problems = [];
const changes = [];

function replaceOne(text, re, make, what) {
  const matches = [...text.matchAll(re)];
  if (matches.length === 0) { problems.push(`not found in markup: ${what}`); return text; }
  if (matches.length > 1) { problems.push(`ambiguous (${matches.length} matches): ${what}`); return text; }
  const m = matches[0];
  const next = make(m);
  if (next !== m[0]) changes.push(what);
  return text.slice(0, m.index) + next + text.slice(m.index + m[0].length);
}

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---------------------------------------------------------------- index.html
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

for (const model of prices.models) {
  const base = Math.min(...model.variants.map(v => v.price));
  const modal = model.modal;

  // 1. desktop tile - two markup styles depending on tile size
  if (model.tileStyle === 'subheading') {
    html = replaceOne(html,
      new RegExp(`(href="#${modal}"[\\s\\S]{0,900}?Product-caption-subheading"><span>From )RM [\\d,]+\\.\\d\\d(</span>)`, 'g'),
      m => m[1] + rm(base) + m[2], `${model.name} desktop tile`);
  } else {
    html = replaceOne(html,
      new RegExp(`(href="#${modal}"[\\s\\S]{0,900}?<span class="price">From )RM [\\d,]+\\.\\d\\d(</span>)`, 'g'),
      m => m[1] + rm(base) + m[2], `${model.name} desktop tile`);
  }

  // 2. mobile row
  html = replaceOne(html,
    new RegExp(`(href="#${modal}"[\\s\\S]{0,600}?model-detail-mobile">From<br>)RM [\\d,]+\\.\\d\\d(</div>)`, 'g'),
    m => m[1] + rm(base) + m[2], `${model.name} mobile row`);

  for (const v of model.variants) {
    // 3. spec tab button label
    html = replaceOne(html,
      new RegExp(`(openTab\\(event, '${esc(v.tab)}'\\)">)[^<]*(</button>)`, 'g'),
      m => m[1] + v.label + m[2], `${model.name} tab label ${v.tab}`);

    // 4. price inside that tab panel
    html = replaceOne(html,
      new RegExp(`(id="${esc(v.tab)}" class="tabcontent[^"]*">[\\s\\S]{0,400}?price-value">)RM [\\d,]+\\.\\d\\d(</div>)`, 'g'),
      m => m[1] + rm(v.price) + m[2], `${model.name} tab price ${v.tab}`);

    // 5. entry in the "Retail Price Without Insurance" list
    html = replaceOne(html,
      new RegExp(`(car-name">${esc(v.carName)}</strong>[\\s\\S]{0,200}?<span class="price">)RM [\\d,]+\\.\\d\\d(</span>)`, 'g'),
      m => m[1] + rm(v.price) + m[2], `${model.name} price list ${v.carName}`);
  }
}

// 6. JSON-LD structured data - the price Google reads for rich results
{
  const DEALER = 'https://www.hondaeasternkelantan.com/#dealer';
  const items = prices.models.map((m, i) => {
    const base = Math.min(...m.variants.map(v => v.price));
    return `        { "@type": "ListItem", "position": ${i + 1}, "item": { "@type": "Car",` +
           ` "name": "${m.name}", "brand": { "@type": "Brand", "name": "Honda" },` +
           ` "offers": { "@type": "Offer", "price": "${base}", "priceCurrency": "MYR",` +
           ` "availability": "https://schema.org/InStock",` +
           ` "seller": { "@id": "${DEALER}" } } } }`;
  });
  const ldRe = /("itemListElement": \[\r?\n)[\s\S]*?(\r?\n      \])/;
  if (!ldRe.test(html)) {
    problems.push('JSON-LD itemListElement block not found in index.html');
  } else {
    const htmlEol = html.includes('\r\n') ? '\r\n' : '\n';
    const next = html.replace(ldRe, (_, a, b) => a + items.join(',' + htmlEol) + b);
    if (next !== html) changes.push('JSON-LD structured data (index.html)');
    html = next;
  }
}

// ------------------------------------------------------------- agency.js calc
let js = fs.readFileSync(path.join(ROOT, 'assets/js/agency.js'), 'utf8');

// agency.js uses CRLF; generated lines must match or the file ends up mixed.
const EOL = js.includes('\r\n') ? '\r\n' : '\n';

const calcBody = prices.models.map(model => {
  const opts = model.variants
    .map(v => `        {"label": "${v.calcLabel}", "value": "${v.price}"}`)
    .join(',' + EOL);
  return [`    {`, `      "label": "${model.name}",`, `      "options": [`, opts,
          `      ]`, `    }`].join(EOL);
}).join(',' + EOL);

const calcRe = /(const data = \{\r?\n  "options": \[\r?\n)[\s\S]*?(\r?\n  \]\r?\n\};)/;
if (!calcRe.test(js)) {
  problems.push('loan calculator `const data` block not found in agency.js');
} else {
  const next = js.replace(calcRe, (_, a, b) => a + calcBody + b);
  if (next !== js) changes.push('loan calculator (agency.js)');
  js = next;
}

// ------------------------------------------------------------------ finish up
if (problems.length) {
  console.error('sync-prices: markup does not match prices.json\n');
  problems.forEach(p => console.error('  x ' + p));
  console.error('\nFix prices.json or the markup so the variants line up.');
  process.exit(1);
}

if (CHECK) {
  if (changes.length) {
    console.error(`sync-prices: ${changes.length} place(s) out of sync with prices.json\n`);
    changes.forEach(c => console.error('  ! ' + c));
    console.error('\nRun `npm run prices` to fix.');
    process.exit(1);
  }
  console.log('sync-prices: all prices match prices.json');
  process.exit(0);
}

fs.writeFileSync(path.join(ROOT, 'index.html'), html);
fs.writeFileSync(path.join(ROOT, 'assets/js/agency.js'), js);
console.log(changes.length
  ? `sync-prices: updated ${changes.length} place(s)\n` + changes.map(c => '  - ' + c).join('\n')
  : 'sync-prices: already in sync, nothing written');
