// Итоговые снимки основных экранов в docs/screenshots (нужен запущенный node tools/serve.mjs 8090)
import { chromium } from '/opt/npm-tools/node_modules/playwright/index.mjs';
const base = process.argv[2] || 'http://localhost:8090';
const out = new URL('../../docs/screenshots/', import.meta.url).pathname;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const sizes = { wide: [1440, 900], tablet: [1024, 768], phone: [390, 844] };
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const shot = async (name, path, opts = {}) => {
  await page.goto(base + path); await page.waitForTimeout(opts.wait || 500);
  if (opts.act) await opts.act(); 
  await page.evaluate(() => { const t = document.getElementById('tn-toasts'); if (t && !window.__keepToast) t.innerHTML = ''; });
  await page.screenshot({ path: out + name + '.png', fullPage: !!opts.full });
};
// 1. первый визит
await shot('01-pervyj-vizit-1440', '/');
// подготовка прогресса через интерфейс
await page.click('[data-act="change-stage"]'); await page.waitForTimeout(300);
await page.click('#tn-overlays input[value="4"]'); await page.click('#tn-overlays .tn-btn--primary'); await page.waitForTimeout(300);
await page.goto(base + '/stage/4'); await page.waitForTimeout(300); await page.click('main [data-act="add-goal"]');
await page.goto(base + '/mod/scattered-justice?from=build:hek-starchart&slot=3&tab=where'); await page.waitForTimeout(300); await page.click('main [data-act="add-purchase"]');
await page.goto(base + '/item/neural-sensors'); await page.waitForTimeout(300); await page.click('main [data-act="add-farm"]');
await page.waitForTimeout(3200);
await shot('02-karta-etap4-1440', '/');
await shot('03-karta-vybrana-planeta-1440', '/?view=map&selected=jupiter');
await shot('04-marshrut-spiskom-1440', '/?view=list');
await shot('05-etap-4-1440', '/stage/4', { full: true });
await shot('06-planeta-1440', '/planet/jupiter', { full: true });
await shot('07-sborka-slot-1440', '/build/hek-starchart?slot=3', { full: true });
await shot('08-mod-gde-poluchit-1440', '/mod/scattered-justice?from=build:hek-starchart&slot=3&tab=where', { full: true });
await shot('09-predmet-rino-1440', '/item/rhino?tab=where', { full: true });
await shot('10-sindikaty-1440', '/syndicates', { full: true });
await shot('11-pozdnyaya-igra-1440', '/endgame', { full: true });
await shot('12-statya-1440', '/article/route');
await shot('13-poisk-sajt-1440', '/search?q=' + encodeURIComponent('нейронные датчики'));
await shot('14-poisk-wiki-oshibka-1440', '/search?q=' + encodeURIComponent('нейронные датчики') + '&source=wiki', { wait: 1500 });
await shot('15-zadachi-1440', '/tasks', { full: true });
await shot('16-skrytoe-mesto-1440', '/planet/hollvania');
await shot('17-404-1440', '/nope');
// Арсенал: каталоги, предмет, соло-сборка с полярностями и формами
await shot('40-varfrejmy-1440', '/warframes', { full: true });
await shot('41-oruzhie-1440', '/weapons?cat=primary', { full: true });
await shot('42-predmet-saryn-1440', '/item/saryn', { full: true });
await shot('43-solo-sborka-saryn-1440', '/build/saryn-solo', { full: true });
await shot('44-solo-sborka-kuva-nukor-1440', '/build/kuva-nukor-solo', { full: true });
await shot('45-solo-sborka-vstroennye-1440', '/build/saryn-solo', { full: true, act: async () => { await page.click('main [data-act="forma-mode"][data-val="innate"]'); await page.waitForTimeout(300); } });
for (const [k, [w, h]] of Object.entries({ tablet: sizes.tablet, phone: sizes.phone })) {
  await page.setViewportSize({ width: w, height: h });
  await shot(`20-karta-${k}-${w}`, '/');
  await shot(`21-karta-planeta-${k}-${w}`, '/?view=map&selected=jupiter');
  await shot(`22-etap-${k}-${w}`, '/stage/4');
  await shot(`23-mod-${k}-${w}`, '/mod/scattered-justice?from=build:hek-starchart&slot=3&tab=where');
  await shot(`24-zadachi-${k}-${w}`, '/tasks');
  await shot(`25-poisk-${k}-${w}`, '/search?q=' + encodeURIComponent('гальван'));
}
await page.setViewportSize({ width: 360, height: 780 });
await shot('26-marshrut-360', '/?view=list');
await shot('27-sborka-360', '/build/rhino-starchart');
await page.setViewportSize({ width: 390, height: 844 });
await shot('46-varfrejmy-phone-390', '/warframes');
await shot('47-solo-sborka-phone-390', '/build/saryn-solo', { full: true });
await page.setViewportSize({ width: 1024, height: 768 });
await shot('48-oruzhie-tablet-1024', '/weapons?cat=melee');
// ошибки сохранения
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base + '/stage/5?debug=storage-fail'); await page.waitForTimeout(400); await page.click('main [data-act="add-goal"]'); await page.waitForTimeout(300);
await page.screenshot({ path: out + '30-oshibka-zapisi-1440.png' });
await page.goto(base + '/?debug=off'); await page.waitForTimeout(200);
const keep = await page.evaluate(() => localStorage.getItem('tn:progress:v1'));
await page.evaluate(() => localStorage.setItem('tn:progress:v1', '{"version":9}'));
await shot('31-neizvestnyj-format-1440', '/tasks');
await page.evaluate(k => localStorage.setItem('tn:progress:v1', k), keep);
console.log('ok');
await b.close();
