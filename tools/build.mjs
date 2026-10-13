#!/usr/bin/env node
// Сборка «Навигатора Тенно» без внешних зависимостей (Node 18+):
//  1) разбирает гайд (guide/Warframe_Endgame_Guide_RU_v3.md) в структурированные статьи;
//  2) собирает содержание из src/content и проверяет все связи (нет висящих ссылок и условий);
//  3) пишет assets/data.js (window.TN_DATA) и assets/app.js (склейка src/js/*.js).
// Запуск: node tools/build.mjs [--guide путь/к/гайду.md]
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const argGuide = process.argv.indexOf('--guide');
const GUIDE_CANDIDATES = [
  argGuide > 0 ? process.argv[argGuide + 1] : null,
  path.join(ROOT, 'src/guide/Warframe_Endgame_Guide_RU_v3.md'),
  path.join(ROOT, '../guide/Warframe_Endgame_Guide_RU_v3.md')
].filter(Boolean);
const guidePath = GUIDE_CANDIDATES.find(p => fs.existsSync(p));
if (!guidePath) { console.error('Не найден гайд. Укажите --guide <путь>'); process.exit(1); }

const imp = f => import(url.pathToFileURL(path.join(ROOT, 'src/content', f)).href);
const { sources, GUIDE, SITE_CHECKED } = await imp('sources.mjs');
const { facts } = await imp('facts.mjs');
const { map, locations, edges } = await imp('locations.mjs');
const { items } = await imp('items.mjs');
const { mods } = await imp('mods.mjs');
const { syndicates, vendors } = await imp('syndicates.mjs');
const { activities, readiness } = await imp('activities.mjs');
const { builds, modStats } = await imp('builds.mjs');
const { stages, goals } = await imp('stages.mjs');
const { groups, articles, spoilerTerms } = await imp('articles.mjs');
const { frames: arsFrames, weapons: arsWeapons, WEAPON_CLASS, FRAME_PLAY } = await imp('arsenal.mjs');
const { soloBuilds } = await imp('builds-solo.mjs');

// ─────────────────────────── 0. Арсенал: данные Wiki + тексты сайта ───────────────────────────
// Полярности кодируются: V Мадурай, D Вазарин, - Нарамон, = Зенурик, R Унайру, Y Пенджага, U Умбра, * любая (Aura/Omni).
const errors0 = [];
const refJ = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/ref', f), 'utf8'));
const RF = Object.fromEntries(refJ('frames-wiki.json').frames.map(f => [f.n, f]));
const RW = Object.fromEntries(refJ('weapons-wiki.json').weapons.map(w => [w.n, w]));
const RM = refJ('mods-wiki.json').mods;
const POLC = { Madurai: 'V', Vazarin: 'D', Naramon: '-', Zenurik: '=', Unairu: 'R', Penjaga: 'Y', Umbra: 'U', Aura: '*', Any: '*' };
const POL_RU = { 'Мадурай': 'V', 'Вазарин': 'D', 'Нарамон': '-', 'Зенурик': '=', 'Унайру': 'R', 'Пенджага': 'Y', 'Умбра': 'U' };
const pc = p => (p ? POLC[p] || null : null);
const ARS_CHECKED = '2026-10-13';
const INNATE_INCARNON = new Set(['Phenmor', 'Felarx', 'Laetum', 'Praedos', 'Innodem']);
const regSrc = en => { const k = 'w:' + en; if (!sources[k]) sources[k] = { url: 'https://wiki.warframe.com/w/' + en.replace(/ /g, '_').replace(/'/g, '%27'), lang: 'en', title: 'Warframe Wiki — ' + en, checked: ARS_CHECKED }; return k; };
regSrc('The Circuit'); sources['w:The_Circuit'] = sources['w:The Circuit'];
function mergeArsenal(list, type) {
  list.forEach(a => {
    const r = type === 'warframe' ? RF[a.en] : RW[a.en];
    if (!r) { errors0.push('Арсенал: нет выгрузки Wiki для ' + a.en); return; }
    regSrc(a.en);
    const walkSrc = ws => (ws || []).forEach(w => { if (w.src && w.src.startsWith('w:')) regSrc(w.src.slice(2)); (w.steps || []).forEach(st => { if (st.table && st.table.src) regSrc(st.table.src.slice(2)); }); });
    walkSrc(a.ways);
    let it = items.find(i => i.id === a.id);
    if (!it) {
      it = { id: a.id, type, name: r.ru, en: a.en, wiki: r.ru.replace(/ /g, '_'), wikiEn: a.en.replace(/ /g, '_'), stage: a.stage, summary: a.summary, ways: a.ways || [] };
      if (type === 'weapon') it.slot = a.slot;
      items.push(it);
    } else {
      if (a.replaceWays) it.ways = a.ways;
      if (a.summary && !it.summary) it.summary = a.summary;
      if (a.summary && a.replaceWays && it.id === 'atomos') it.summary = a.summary;
      if (!it.en) it.en = a.en;
      if (!it.wikiEn) it.wikiEn = a.en.replace(/ /g, '_');
    }
    it.arsenal = type === 'warframe' ? 'frame' : 'weapon';
    it.dataSrc = 'w:' + a.en;
    if (type === 'warframe') {
      it.aura = pc(r.aura); it.pol = (r.pol || []).map(pc); it.exilusPol = pc(r.ex);
      it.stats = { hp: r.hp, sh: r.sh, ar: r.ar, en: r.en };
      it.abilities = r.abEn.map((e, i) => ({ en: e, ru: (r.ab || [])[i] || null }));
      it.roles = a.role || (r.play || []).map(p => FRAME_PLAY[p]).filter(Boolean);
      it.augVendors = r.aug || [];
      if (it.mr == null) it.mr = 0;
      it.prime = r.prime ? { aura: pc(r.prime.aura), pol: (r.prime.pol || []).map(pc), exilusPol: pc(r.prime.ex), stats: { hp: r.prime.hp, sh: r.prime.sh, ar: r.prime.ar, en: r.prime.en }, vaulted: r.prime.vaulted === true } : null;
    } else {
      it.cat = r.cat; it.cls = r.cls; it.clsRu = WEAPON_CLASS[r.cls] || r.cls;
      it.mr = r.mr; delete it.mrNote;
      it.pol = (r.pol || []).map(pc); it.stancePol = pc(r.stance);
      it.wstats = { cc: r.cc, cd: r.cd, sc: r.sc, fr: r.fr, mag: r.mag, dmg: r.dmg, trig: r.trig || null };
      it.incarnon = r.incarnon ? (INNATE_INCARNON.has(a.en) ? 'innate' : 'genesis') : null;
      it.prime = r.prime ? { mr: r.prime.mr, pol: (r.prime.pol || []).map(pc), stancePol: pc(r.prime.stance) } : null;
      if (!it.slot) it.slot = r.cat === 'primary' && r.cls === 'Shotgun' ? 'shotgun' : r.cat;
    }
  });
}
mergeArsenal(arsFrames, 'warframe');
mergeArsenal(arsWeapons, 'weapon');
// Карточки модов сверяются с выгрузкой Module:Mods/data
mods.forEach(m => {
  if (m.polarity) m.polc = POL_RU[m.polarity] || null;
  const r = m.en && RM[m.en];
  if (!r) return;
  if (m.card) {
    const exp = { polc: POLC[r[0]], drain0: m.cat === 'aura' ? Math.abs(r[1]) : r[1], maxRank: r[2] };
    if (m.polc !== exp.polc || m.drain0 !== exp.drain0 || m.maxRank !== exp.maxRank) errors0.push('Мод ' + m.id + ': карточка расходится с Wiki (' + [m.polc, m.drain0, m.maxRank].join('/') + ' ≠ ' + [exp.polc, exp.drain0, exp.maxRank].join('/') + ')');
  }
});
// Соло-сборки: добавляем к сборкам и к предметам
soloBuilds.forEach(b => { builds.push(b); const it = items.find(i => i.id === b.target); if (it) { it.builds = it.builds || []; if (!it.builds.includes(b.id)) it.builds.push(b.id); } });

// ─────────────────────────── 1. Разбор гайда ───────────────────────────
const md = fs.readFileSync(guidePath, 'utf8').replace(/\r\n/g, '\n');
const errors = [...errors0], warnings = [];

// Имя → id сущности сайта (для внутренних ссылок вместо Wiki)
const nameIndex = new Map();
const addName = (name, ref) => { if (!name) return; const k = name.toLowerCase(); if (!nameIndex.has(k)) nameIndex.set(k, ref); };
mods.forEach(m => addName(m.name, 'mod:' + m.id));
items.filter(i => !i.hidden).forEach(i => addName(i.name, 'item:' + i.id));
activities.forEach(a => addName(a.name, 'activity:' + a.id));
locations.forEach(l => addName(l.name, 'planet:' + l.id));
syndicates.forEach(s => addName(s.name, 'syndicate:' + s.id));
// Частые формы из гайда
[['Рино', 'item:rhino'], ['Ревенант', 'item:revenant'], ['Хек', 'item:hek'], ['Натарук', 'item:nataruk'], ['Зорис', 'item:xoris'], ['Летум', 'item:laetum'],
 ['Арбитражи', 'activity:arbitrations'], ['Арбитраж', 'activity:arbitrations'], ['Стальной путь', 'activity:steel-path'], ['Ячейки Нетры', 'activity:netracells'],
 ['Глубинная Архимедия', 'activity:deep-archimedea'], ['Временная Архимедия', 'activity:temporal-archimedea'], ['The Icebind', 'activity:icebind'],
 ['Гельминт', 'item:helminth-segment'], ['Венере', 'planet:venus'], ['Неукротимые', 'syndicate:holdfasts'], ['Кавия', 'syndicate:cavia'],
 ['Энтрати', 'syndicate:entrati'], ['Охота На Архонта', 'activity:archon-hunt'], ['Вылазки', 'activity:sorties'], ['Вылазка', 'activity:sorties'],
 ['Инкарнон', 'item:incarnon-adapter'], ['Осколок Архонта', 'item:archon-shard'], ['Эссенция Витус', 'item:vitus'], ['Моды разлома', 'mod:riven'],
 ['Лич Кувы', 'activity:kuva-lich'], ['Сёстры Парвоса', 'activity:sisters'], ['Техноцит Кода', 'activity:coda'], ['Спуск', 'activity:descendia'], ['Перита', 'activity:perita'],
 ['Каскад Бездны', 'activity:void-cascade'], ['Сфера Извлечения Прибыли', 'activity:profit-taker'], ['Эйдолонский Тералист', 'activity:eidolons'],
 ['Палладино', 'vendor:palladino'], ['Баро Ки\'Тиир', 'vendor:baro'], ['магазин Симэриса', 'vendor:simaris'], ['Синдикаты', 'syndicates'], ['Моды', 'mods'],
 ['Цепь', 'activity:steel-circuit'], ['Цепь и актуальная ротация', 'activity:steel-circuit'], ['Хранилище Орокин', 'activity:orokin-vaults'], ['Ночная Волна', 'activity:nightwave']
].forEach(([n, r]) => nameIndex.set(n.toLowerCase(), r));

function parseInline(s) {
  // Токены: {t:'text',v} {t:'b',c:[...]} {t:'a',href,ext,c:[...]}
  const out = [];
  let i = 0, buf = '';
  const flush = () => { if (buf) { out.push({ t: 'text', v: buf }); buf = ''; } };
  while (i < s.length) {
    if (s.startsWith('**', i)) {
      const j = s.indexOf('**', i + 2);
      if (j > 0) { flush(); out.push({ t: 'b', c: parseInline(s.slice(i + 2, j)) }); i = j + 2; continue; }
    }
    if (s[i] === '[') {
      // [текст](url с возможными скобками)
      let depth = 1, k = i + 1;
      while (k < s.length && depth) { if (s[k] === '[') depth++; else if (s[k] === ']') depth--; k++; }
      if (s[k] === '(') {
        const text = s.slice(i + 1, k - 1);
        let d = 1, m = k + 1, u = '';
        while (m < s.length && d) { const c = s[m]; if (c === '(') d++; else if (c === ')') { d--; if (!d) break; } u += c; m++; }
        if (/^https?:/.test(u)) {
          flush();
          let decoded = u; try { decoded = decodeURI(u); } catch (e) {}
          const ref = nameIndex.get(text.toLowerCase());
          if (ref) out.push({ t: 'a', ref, wiki: decoded, c: parseInline(text) });
          else out.push({ t: 'a', href: decoded, ext: true, c: parseInline(text) });
          i = m + 1; continue;
        }
      }
    }
    buf += s[i]; i++;
  }
  flush();
  return out;
}
const plain = toks => toks.map(t => t.t === 'text' ? t.v : plain(t.c)).join('');

function parseGuide(src) {
  const lines = src.split('\n');
  const sections = [];
  let sec = null, sub = null, para = [];
  const target = () => (sub ? sub.blocks : sec ? sec.blocks : null);
  const pushPara = () => {
    if (!para.length) return;
    const text = para.join(' ').trim(); para = [];
    if (!text || !target()) return;
    const toks = parseInline(text);
    const p = plain(toks);
    if (/^(Источники|Источник|Подробнее|Источники изменений)\s*:/.test(p) || /^Иллюстрация|^Скриншот|^Схема карточки|^Официальный скриншот/.test(p)) target().push({ k: 'meta', c: toks });
    else target().push({ k: 'p', c: toks });
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let m;
    if ((m = line.match(/^## (\d+) (.+)$/))) { pushPara(); sec = { n: +m[1], title: m[2].trim(), blocks: [], subs: [] }; sub = null; sections.push(sec); continue; }
    if (/^## /.test(line) || /^# /.test(line)) { pushPara(); sec = null; sub = null; continue; }
    if ((m = line.match(/^### (.+)$/)) && sec) { pushPara(); sub = { title: m[1].trim(), blocks: [] }; sec.subs.push(sub); continue; }
    if (!sec) continue;
    if ((m = line.match(/^!\[([^\]]*)\]\((https?:[^)]+)\)/))) { pushPara(); target().push({ k: 'img', alt: m[1], href: m[2] }); continue; }
    if (/^\|/.test(line)) {
      pushPara();
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
      i--;
      const cells = r => r.replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => c.trim());
      const head = cells(rows[0]).map(parseInline);
      const body = rows.slice(2).map(r => cells(r).map(parseInline));
      const numCols = head.map((_, ci) => body.length > 0 && body.every(r => /^[\d\s\u00a0,.%–\-+×/~≈]+$/.test(plain(r[ci] || [])) ));
      target().push({ k: 'table', head, body, num: numCols });
      continue;
    }
    if ((m = line.match(/^(\d+)\. (.+)$/))) {
      pushPara();
      const itemsL = [];
      while (i < lines.length && (m = lines[i].match(/^(\d+)\. (.+)$/))) { itemsL.push(parseInline(m[2])); i++; }
      i--; target().push({ k: 'ol', items: itemsL }); continue;
    }
    if ((m = line.match(/^[-*] (.+)$/))) {
      pushPara();
      const itemsL = [];
      while (i < lines.length && (m = lines[i].match(/^[-*] (.+)$/))) { itemsL.push(parseInline(m[1])); i++; }
      i--; target().push({ k: 'ul', items: itemsL }); continue;
    }
    if (!line.trim()) { pushPara(); continue; }
    para.push(line.trim());
  }
  pushPara();
  return sections;
}
const guideSections = parseGuide(md);
if (guideSections.length !== 22) errors.push('В гайде найдено разделов: ' + guideSections.length + ' (ожидалось 22)');

// Выделение сообщений: «Важное изменение» → info; первый «Совет/Приоритеты/Ближайшая цель/Простой старт» → gold (не больше одного на статью)
function promoteCallouts(blocks, state) {
  return blocks.map(b => {
    if (b.k !== 'p' || !b.c.length || b.c[0].t !== 'b') return b;
    const lead = plain(b.c[0].c).replace(/[:.]$/, '');
    if (/^(Важное изменение|Актуальная оговорка|Актуальные пороги)/.test(lead)) return { k: 'callout', tone: 'info', title: lead, c: b.c.slice(1) };
    if (!state.gold && /^(Совет|Приоритеты|Ближайшая цель|Простой старт|Практичный порядок)/.test(lead)) { state.gold = true; return { k: 'callout', tone: 'gold', title: lead, c: b.c.slice(1) }; }
    return b;
  });
}

const articleOut = articles.map(a => {
  const g = guideSections.find(s => s.n === a.n);
  if (!g) { errors.push('Нет раздела гайда ' + a.n); return a; }
  const st = { gold: false };
  const subs = g.subs.map((s, i) => ({ id: 's' + (i + 1), title: s.title, spoiler: (a.spoilerSub || {})[s.title] || null, blocks: promoteCallouts(s.blocks, st) }));
  Object.keys(a.spoilerSub || {}).forEach(t => { if (!g.subs.find(s => s.title === t)) errors.push('Статья ' + a.n + ': нет подраздела «' + t + '»'); });
  if (g.title !== a.title) warnings.push('Заголовок статьи ' + a.n + ' отличается от гайда: «' + g.title + '»');
  return Object.assign({}, a, { id: 's' + String(a.n).padStart(2, '0'), guideTitle: g.title, intro: promoteCallouts(g.blocks, st), subs });
});

// Словарь — из раздела 22
const glossary = [];
const s22 = guideSections.find(s => s.n === 22);
if (s22) { const t = s22.blocks.find(b => b.k === 'table'); if (t) t.body.forEach(r => glossary.push({ term: plain(r[0]), def: plain(r[1]) })); }

// ─────────────────────────── 2. Проверка связей ───────────────────────────
const ids = {
  fact: new Set(facts.map(f => f.id)), mod: new Set(mods.map(m => m.id)), item: new Set(items.map(i => i.id)),
  vendor: new Set(vendors.map(v => v.id)), syndicate: new Set(syndicates.map(s => s.id)), activity: new Set(activities.map(a => a.id)),
  build: new Set(builds.map(b => b.id)), planet: new Set(locations.map(l => l.id)), goal: new Set(goals.map(g => g.id)),
  stage: new Set(stages.map(s => String(s.n))), article: new Set(articleOut.map(a => a.id))
};
const routes = new Set(['route', 'stages', 'mods', 'syndicates', 'loot', 'endgame', 'tasks', 'builds', 'checklists', 'reference', 'search']);
function checkRef(ref, where) {
  if (!ref) return;
  if (routes.has(ref)) return;
  const [k, v] = ref.split(':');
  const map2 = { mod: 'mod', item: 'item', vendor: 'vendor', syndicate: 'syndicate', activity: 'activity', build: 'build', planet: 'planet', goal: 'goal', stage: 'stage', article: 'article' };
  if (!map2[k] || !ids[map2[k]].has(v)) errors.push(where + ': неизвестная ссылка ' + ref);
}
function checkCond(c, where) {
  if (c.any) { c.any.forEach(x => checkCond(x, where)); return; }
  if (!c.f) { if (!c.label) errors.push(where + ': условие без f и label'); return; }
  if (c.f.startsWith('rank:')) { if (!ids.syndicate.has(c.f.slice(5))) errors.push(where + ': неизвестный синдикат в ' + c.f); return; }
  if (c.f.startsWith('owned:')) { const v = c.f.slice(6); if (!ids.mod.has(v) && !ids.item.has(v)) errors.push(where + ': неизвестный предмет в ' + c.f); return; }
  if (!ids.fact.has(c.f)) errors.push(where + ': неизвестная отметка прогресса ' + c.f);
}
const checkSrc = (s, where) => { if (s && s !== 'guide' && !/^g:\d+$/.test(s) && !sources[s]) errors.push(where + ': неизвестный источник ' + s); };
const checkWays = (ways, where) => (ways || []).forEach(w => { checkSrc(w.src, where); (w.steps || []).forEach(st => { (st.req || []).forEach(c => checkCond(c, where)); checkRef(st.link, where); checkSrc(st.src, where); (st.items || []).forEach(i => { if (!ids.item.has(i)) errors.push(where + ': нет ресурса ' + i); }); if (st.loc && !ids.planet.has(st.loc)) errors.push(where + ': нет места ' + st.loc); (st.vendors || []).forEach(v => { if (!ids.vendor.has(v)) errors.push(where + ': нет продавца ' + v); }); }); });

facts.forEach(f => { (f.req || []).forEach(c => checkCond(c, 'Отметка ' + f.id)); checkSrc(f.src, 'Отметка ' + f.id); });
items.forEach(i => { checkWays(i.ways, 'Предмет ' + i.id); (i.builds || []).forEach(b => checkRef('build:' + b, 'Предмет ' + i.id)); (i.where || []).forEach(w => { if (w.loc && !ids.planet.has(w.loc)) errors.push('Предмет ' + i.id + ': нет места ' + w.loc); }); checkSrc(i.src, 'Предмет ' + i.id); });
mods.forEach(m => { checkWays(m.ways, 'Мод ' + m.id); if (m.card && (m.drain0 == null || m.maxRank == null)) errors.push('Мод ' + m.id + ': card без вместимости или ранга'); });
locations.forEach(l => { (l.resources || []).forEach(r => { if (!ids.item.has(r)) errors.push('Место ' + l.id + ': нет ресурса ' + r); }); (l.access || []).forEach(c => checkCond(c, 'Место ' + l.id)); });
edges.forEach(e => { if (!ids.planet.has(e.from) || !ids.planet.has(e.to)) errors.push('Связь карты ' + e.from + '→' + e.to); });
syndicates.forEach(s => { [...(s.allied || []), ...(s.opposed || []), ...(s.enemy || [])].forEach(x => { if (!ids.syndicate.has(x)) errors.push('Синдикат ' + s.id + ': нет ' + x); }); if (s.vendor && !ids.vendor.has(s.vendor)) errors.push('Синдикат ' + s.id + ': нет продавца ' + s.vendor); if (s.loc && !ids.planet.has(s.loc)) errors.push('Синдикат ' + s.id + ': нет места ' + s.loc); });
vendors.forEach(v => { if (v.syndicate && !ids.syndicate.has(v.syndicate)) errors.push('Продавец ' + v.id + ': нет синдиката ' + v.syndicate); (v.access || []).forEach(c => checkCond(c, 'Продавец ' + v.id));
  v.offers.forEach((o, i) => { if (o.item && !ids.mod.has(o.item) && !ids.item.has(o.item)) errors.push('Продавец ' + v.id + ': нет предмета ' + o.item); if (!o.item && !o.label) errors.push('Продавец ' + v.id + ': предложение ' + i + ' без названия'); checkSrc(o.src, 'Продавец ' + v.id); (o.extraReq || []).forEach(c => checkCond(c, 'Продавец ' + v.id)); }); });
activities.forEach(a => { (a.access || []).forEach(c => checkCond(c, 'Активность ' + a.id)); if (a.loc && !ids.planet.has(a.loc)) errors.push('Активность ' + a.id + ': нет места ' + a.loc); if (a.vendor && !ids.vendor.has(a.vendor)) errors.push('Активность ' + a.id + ': нет продавца'); if (a.ready && !readiness[a.ready]) errors.push('Активность ' + a.id + ': нет списка готовности'); (a.mods || []).forEach(m => { if (!ids.mod.has(m)) errors.push('Активность ' + a.id + ': нет мода ' + m); }); checkSrc(a.src, 'Активность ' + a.id); });
builds.forEach(b => { if (!ids.item.has(b.target)) errors.push('Сборка ' + b.id + ': нет предмета ' + b.target);
  const all = [b.aura && b.aura.mod, ...b.slots.flatMap(s => [s.mod, ...(s.alt || []), s.later])].filter(Boolean);
  all.forEach(m => { if (!ids.mod.has(m)) errors.push('Сборка ' + b.id + ': нет мода ' + m); });
  if (b.slots.length !== 8) errors.push('Сборка ' + b.id + ': слотов ' + b.slots.length + ' (нужно 8)');
  if (b.slots.filter(s => s.key).length !== 1) errors.push('Сборка ' + b.id + ': должен быть ровно один ключевой мод'); });
stages.forEach(s => { s.goals.forEach(g => { if (!ids.goal.has(g)) errors.push('Этап ' + s.n + ': нет цели ' + g); }); s.planets.forEach(p => { if (!ids.planet.has(p)) errors.push('Этап ' + s.n + ': нет места ' + p); });
  if (!ids.planet.has(s.focus)) errors.push('Этап ' + s.n + ': нет фокуса ' + s.focus);
  (s.loot || []).forEach(i => { if (!ids.item.has(i)) errors.push('Этап ' + s.n + ': нет добычи ' + i); }); (s.vendors || []).forEach(v => { if (!ids.vendor.has(v)) errors.push('Этап ' + s.n + ': нет продавца ' + v); }); (s.builds || []).forEach(b => { if (!ids.build.has(b)) errors.push('Этап ' + s.n + ': нет сборки ' + b); });
  if (!s.goals.some(g => (goals.find(x => x.id === g) || {}).kind === 'main')) errors.push('Этап ' + s.n + ': нет основной цели'); });
goals.forEach(g => { (g.req || []).forEach(c => checkCond(c, 'Цель ' + g.id)); (g.links || []).forEach(l => checkRef(l, 'Цель ' + g.id)); (g.steps || []).forEach(st => checkRef(st.link, 'Цель ' + g.id));
  if (g.next) checkRef(g.next.includes(':') ? g.next : 'goal:' + g.next, 'Цель ' + g.id);
  (g.marks || []).forEach(m => checkCond({ f: m }, 'Цель ' + g.id + ' (отметки)'));
  if (g.item && !ids.item.has(g.item)) errors.push('Цель ' + g.id + ': нет предмета ' + g.item);
  if (!g.result) errors.push('Цель ' + g.id + ': нет результата'); if (!g.why) errors.push('Цель ' + g.id + ': нет пользы');
  if (!stages.find(s => s.goals.includes(g.id))) errors.push('Цель ' + g.id + ' не входит ни в один этап'); });
// Основные цели ведут дальше: у каждой основной цели есть следующий переход (кроме последней)
stages.forEach(s => { const mains = s.goals.map(id => goals.find(g => g.id === id)).filter(g => g && g.kind === 'main'); const last = mains[mains.length - 1];
  if (s.n < stages.length && last && !last.next) errors.push('Этап ' + s.n + ': последняя основная цель ' + last.id + ' не ведёт к следующему этапу'); });
// Нелогичные предпосылки: условие не может требовать отметку более позднего этапа, чем сама отметка
facts.forEach(f => (f.req || []).forEach(c => { const d = c.f && facts.find(x => x.id === c.f); if (d && f.stage && d.stage && d.stage > f.stage) errors.push('Отметка ' + f.id + ' (этап ' + f.stage + ') требует ' + d.id + ' (этап ' + d.stage + ')'); }));
// Циклы условий
const deps = new Map(facts.map(f => [f.id, (f.req || []).filter(c => c.f && ids.fact.has(c.f)).map(c => c.f)]));
const seen = new Set(), stack = new Set();
const dfs = (id, trail) => { if (stack.has(id)) { errors.push('Цикл условий: ' + [...trail, id].join(' → ')); return; } if (seen.has(id)) return; seen.add(id); stack.add(id); (deps.get(id) || []).forEach(d => dfs(d, [...trail, id])); stack.delete(id); };
deps.forEach((_, id) => dfs(id, []));
articleOut.forEach(a => (a.tools || []).forEach(t => checkRef(t, 'Статья ' + a.n)));
// Внутренние ссылки в тексте статей
const walk = (toks, where) => toks.forEach(t => { if (t.t === 'a' && t.ref) checkRef(t.ref, where); if (t.c) walk(t.c, where); });
articleOut.forEach(a => { const all = [...a.intro, ...a.subs.flatMap(s => s.blocks)]; all.forEach(b => { if (b.c) walk(b.c, 'Статья ' + a.n); (b.items || []).forEach(i => walk(i, 'Статья ' + a.n)); (b.body || []).forEach(r => r.forEach(c => walk(c, 'Статья ' + a.n))); (b.head || []).forEach(c => walk(c, 'Статья ' + a.n)); }); });
// Покрытие 22 разделов
const covered = new Set(articleOut.map(a => a.n));
for (let n = 1; n <= 22; n++) if (!covered.has(n)) errors.push('Раздел ' + n + ' гайда не покрыт статьёй');
// Каждая сущность достижима (на неё ссылаются)
const linked = new Set();
const mark = r => r && linked.add(r);
goals.forEach(g => { (g.links || []).forEach(mark); (g.steps || []).forEach(s => mark(s.link)); if (g.item) mark('item:' + g.item); });
stages.forEach(s => { s.loot.forEach(i => mark('item:' + i)); s.vendors.forEach(v => mark('vendor:' + v)); s.builds.forEach(b => mark('build:' + b)); });
builds.forEach(b => { mark('item:' + b.target); b.slots.forEach(s => { mark('mod:' + s.mod); (s.alt || []).forEach(x => mark('mod:' + x)); if (s.later) mark('mod:' + s.later); }); if (b.aura) mark('mod:' + b.aura.mod); });
vendors.forEach(v => v.offers.forEach(o => { if (o.item) mark((ids.mod.has(o.item) ? 'mod:' : 'item:') + o.item); }));
articleOut.forEach(a => a.tools.forEach(mark));
const orphans = [...mods.map(m => 'mod:' + m.id), ...items.filter(i => !i.hidden && i.type !== 'resource' && i.type !== 'currency').map(i => 'item:' + i.id), ...activities.map(a => 'activity:' + a.id), ...vendors.map(v => 'vendor:' + v.id)].filter(r => !linked.has(r));
if (orphans.length) warnings.push('Сущности без входящих ссылок (доступны через каталоги и поиск): ' + orphans.join(', '));

// ─────────────────────────── 3. Вывод ───────────────────────────
if (warnings.length) { console.log('Предупреждения:'); warnings.forEach(w => console.log('  · ' + w)); }
if (errors.length) { console.error('Ошибки проверки содержания (' + errors.length + '):'); errors.forEach(e => console.error('  ✗ ' + e)); process.exit(1); }

const data = {
  built: new Date().toISOString(), siteChecked: SITE_CHECKED, guide: GUIDE, sources, facts, map, locations, edges, items, mods, syndicates, vendors,
  activities, readiness, builds, modStats, stages, goals, groups, articles: articleOut, spoilerTerms, glossary
};
fs.mkdirSync(path.join(ROOT, 'assets'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'assets/data.js'), '/* Сгенерировано tools/build.mjs — не редактируйте вручную */\nwindow.TN_DATA = ' + JSON.stringify(data) + ';\n');

const jsDir = path.join(ROOT, 'src/js');
const parts = fs.readdirSync(jsDir).filter(f => /^\d\d-.*\.js$/.test(f)).sort();
const js = '/* Навигатор Тенно — сгенерировано tools/build.mjs из src/js/*.js */\n(function () {\n' +
  parts.map(f => '/* ── ' + f + ' ── */\n' + fs.readFileSync(path.join(jsDir, f), 'utf8')).join('\n') + '\n})();\n';
fs.writeFileSync(path.join(ROOT, 'assets/app.js'), js);
console.log('Готово: ' + articleOut.length + ' статей, ' + stages.length + ' этапов, ' + goals.length + ' целей, ' + mods.length + ' модов, ' + items.length + ' предметов, ' +
  vendors.length + ' продавцов, ' + activities.length + ' активностей, ' + builds.length + ' сборок; JS-частей: ' + parts.length);
