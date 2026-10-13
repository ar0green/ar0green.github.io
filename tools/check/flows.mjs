import { chromium } from '/opt/npm-tools/node_modules/playwright/index.mjs';
const base = process.argv[2] || 'http://localhost:8090';
const out = '/home/claude/work/shots/flows';
import fs from 'fs'; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', e => errs.push('PAGEERROR ' + page.url() + ' ' + e.message));
page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
const log = (...a) => console.log('•', ...a);
const doc = () => page.evaluate(() => JSON.parse(localStorage.getItem('tn:progress:v1') || 'null'));
const toast = async () => { await page.waitForTimeout(250); return page.evaluate(() => [...document.querySelectorAll('#tn-toasts .tn-toast')].map(t => t.innerText.replace(/\s+/g, ' ')).join(' | ')); };
const shot = n => page.screenshot({ path: `${out}/${n}.png` });
const clearToasts = () => page.evaluate(() => { document.getElementById('tn-toasts').innerHTML = ''; });

// 1. Первый визит
await page.goto(base + '/'); await page.waitForTimeout(400);
log('first visit h1:', await page.textContent('h1'));
await page.click('[data-act="start-first"]'); await page.waitForTimeout(400);
let d = await doc(); log('after start-first stage=', d && d.stage, 'onboarded=', d && d.onboarded, 'url=', page.url());
log('toast:', await toast()); await clearToasts();
// смена этапа на 4 через диалог
await page.goto(base + '/'); await page.waitForTimeout(300);
await page.click('[data-act="change-stage"]'); await page.waitForTimeout(300);
await shot('stage-dialog');
const dlg = await page.evaluate(() => { const o = document.querySelector('#tn-overlays [role="dialog"]'); return o ? o.innerText.slice(0, 600).replace(/\s+/g, ' ') : 'no dialog'; });
log('stage dialog:', dlg.slice(0, 300));
const opt = await page.$('#tn-overlays input[value="4"]') || await page.$('#tn-overlays [data-stage="4"]');
if (opt) { await opt.check ? await opt.click() : null; }
const confirm = await page.$('#tn-overlays .tn-btn--primary');
if (confirm) await confirm.click(); await page.waitForTimeout(400);
d = await doc(); log('stage after dialog =', d.stage, 'facts=', JSON.stringify(d.facts), 'done=', Object.keys(d.done).length);

// 2. Этап → цель → в задачи
await page.goto(base + '/stage/4'); await page.waitForTimeout(400);
log('stage4 h1:', await page.textContent('h1'));
const addGoal = await page.$('main [data-act="add-goal"]');
log('add-goal button:', !!addGoal);
if (addGoal) { await addGoal.click(); log('toast:', await toast()); await clearToasts(); }
d = await doc(); log('tasks:', d.tasks.map(t => t.title + (t.dependsOn && t.dependsOn.length ? ' [зависит ' + t.dependsOn.length + ']' : '')).join(' ; '));

// 3. Сборка → недостающий мод → источник → задачи → назад к слоту
await page.goto(base + '/build/hek-starchart'); await page.waitForTimeout(400);
await page.click('[data-act="slot"][data-slot="3"]'); await page.waitForTimeout(300);
log('url after slot 3:', page.url());
await shot('build-slot3');
const where = await page.$('main a[href*="from=build:hek-starchart"]');
log('where link:', where && await where.getAttribute('href'));
await where.click(); await page.waitForTimeout(500);
log('mod page:', await page.textContent('h1'), '| url', page.url());
const buy = await page.$('main [data-act="add-purchase"]');
log('add-purchase button:', !!buy);
if (buy) { await buy.click(); log('toast:', await toast()); await clearToasts(); }
d = await doc(); log('tasks now:', d.tasks.map(t => t.title).join(' ; '));
await page.click('[data-back="1"]'); await page.waitForTimeout(500);
log('back url:', page.url(), '| focused:', await page.evaluate(() => document.activeElement && (document.activeElement.id || document.activeElement.dataset.key || document.activeElement.tagName)),
  '| slot3 pressed:', await page.getAttribute('[data-slot="3"]', 'aria-pressed'));

// 4. Ресурс → место → условие → задача
await page.goto(base + '/item/neural-sensors'); await page.waitForTimeout(400);
const farm = await page.$('main [data-act="add-farm"]');
log('add-farm:', !!farm); if (farm) { await farm.click(); log('toast:', await toast()); await clearToasts(); }

// 5. Синдикат: указать ранг → дефицит
await page.goto(base + '/vendor/cavalero'); await page.waitForTimeout(400);
log('vendor h1:', await page.textContent('h1'));

// 6. Задачи: выполнение, обновление страницы
await page.goto(base + '/tasks'); await page.waitForTimeout(400);
await shot('tasks-filled');
const rows = await page.$$eval('main .tn-task', els => els.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 140)));
log('task rows:', rows.length); rows.forEach(r => console.log('   -', r));
const chk = await page.$("main .tn-task label.tn-check, main .tn-task .tn-check");
if (chk) { await chk.click(); await page.waitForTimeout(300); log('toast:', await toast()); await clearToasts(); }
await page.reload(); await page.waitForTimeout(400);
d = await doc(); log('after reload done tasks:', d.tasks.filter(t => t.done).length, 'of', d.tasks.length, '| marks done keys:', Object.keys(d.done).length, '| facts', JSON.stringify(d.facts));

// 7. Несколько вкладок
const p2 = await ctx.newPage(); await p2.goto(base + '/tasks'); await p2.waitForTimeout(300);
await page.goto(base + '/stage/5'); await page.waitForTimeout(300);
const ag = await page.$('main [data-act="add-goal"]'); if (ag) { await ag.click(); await page.waitForTimeout(400); }
const n2 = await p2.$$eval('main .tn-task', els => els.length);
d = await doc(); log('multi-tab: storage tasks', d.tasks.length, '| tab2 rendered', n2);

// 8. Ошибка записи
await page.goto(base + '/stage/6?debug=storage-fail'); await page.waitForTimeout(400);
const before = (await doc()).tasks.length;
const ag2 = await page.$('main [data-act="add-goal"]'); if (ag2) { await ag2.click(); log('storage-fail toast:', await toast()); }
await shot('storage-fail');
log('storage-fail: tasks before', before, 'after', (await doc()).tasks.length, '| save status:', await page.evaluate(() => (document.querySelector('.tn-save') || {}).innerText));
await page.goto(base + '/?debug=off'); await page.waitForTimeout(300); await clearToasts();

// 9. Неизвестный формат
await page.evaluate(() => localStorage.setItem('tn:progress:v1', JSON.stringify({ version: 7, stuff: 1 })));
await page.goto(base + '/stage/3'); await page.waitForTimeout(400);
log('unknown banner:', await page.evaluate(() => document.getElementById('tn-banner').innerText.replace(/\s+/g, ' ').slice(0, 200)));
const ag3 = await page.$('main [data-act="add-goal"]'); if (ag3) { await ag3.click(); log('unknown add toast:', await toast()); }
log('stored still v7:', await page.evaluate(() => localStorage.getItem('tn:progress:v1')));
await shot('unknown-format');
// 10. Хранилище отключено
await page.goto(base + '/?debug=storage-off'); await page.waitForTimeout(400);
log('storage-off banner:', await page.evaluate(() => (document.getElementById('tn-banner').innerText + ' || ' + ((document.querySelector('.tn-save') || {}).innerText || '')).replace(/\s+/g, ' ').slice(0, 250)));
await page.goto(base + '/?debug=off'); await page.waitForTimeout(200);
console.log(errs.join('\n') || 'no page errors');
await b.close();
