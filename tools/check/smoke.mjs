import { chromium } from '/opt/npm-tools/node_modules/playwright/index.mjs';
const base = process.argv[2] || 'http://localhost:8090';
const paths = (process.argv[3] || '/,/?view=list,/stage/1,/stage/4,/stage/6,/planet/venus,/reference,/boost,/mods,/syndicates,/loot,/endgame,/article/route,/article/syndicates,/article/readiness,/mod/galvanized-diffusion,/mod/scattered-justice?from=build:hek-starchart&slot=3,/item/rhino,/item/neural-sensors,/vendor/steel-meridian,/vendor/cavalero,/syndicate/steel-meridian,/activity/arbitrations,/activity/icebind,/quest/quest:new-war,/build/hek-starchart,/build/rhino-starchart?slot=8,/search?q=гальванизированный,/tasks,/warframes,/weapons,/weapons?cat=melee,/item/ignis,/item/kuva-nukor,/build/saryn-solo,/build/ignis-solo,/nope').split(',');
const width = +(process.argv[4] || 1440);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport: { width, height: 900 } });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', e => errs.push('PAGEERROR ' + page.url() + ' ' + e.message));
page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + page.url() + ' ' + m.text()); });
for (const p of paths) {
  await page.goto(base + p); await page.waitForTimeout(300);
  const h1 = await page.evaluate(() => (document.querySelector('h1') || {}).textContent || '(no h1)');
  const len = await page.evaluate(() => document.getElementById('main').innerText.length);
  console.log(p, '→', h1.slice(0, 70), '| text', len);
}
console.log(errs.length ? errs.join('\n') : 'no errors');
await b.close();
