import { chromium } from '/opt/npm-tools/node_modules/playwright/index.mjs';
// node shoot.mjs base outdir width "name=path,name=path" [fullPage] [setup-json]
const [base, out, w, list, full, setup] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const width = +w; const height = width >= 1100 ? 900 : width >= 640 ? 1024 : 800;
const ctx = await b.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', e => errs.push('PAGEERROR ' + page.url() + ' ' + e.message));
page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
if (setup) { await page.goto(base + '/'); await page.evaluate(s => { localStorage.setItem('tn:progress:v1', s); }, setup); }
for (const pair of list.split(',')) {
  const i = pair.indexOf('='); const name = pair.slice(0, i), p = pair.slice(i + 1);
  await page.goto(base + p); await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/${name}-${width}.png`, fullPage: full === 'full' });
}
console.log(errs.join('\n') || 'ok');
await b.close();
