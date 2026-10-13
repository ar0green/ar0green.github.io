/* Навигатор Тенно — сгенерировано tools/build.mjs из src/js/*.js */
(function () {
/* ── 00-core.js ── */
/* 00-core.js — общие помощники. Иконки и правила форм числа перенесены из design-system/components/bundle.js без изменений. */
'use strict';
const TN = {};
window.TNApp = TN;
const Actions = {};   // обработчики data-act (заполняются модулями)
const Screens = {};   // экраны (заполняются модулями)
const ICON_PATHS = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    map: '<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>',
    route: '<circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8 17h5a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h5"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    tasks: '<rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="m8 9 1.5 1.5L12 8M8 15l1.5 1.5L12 14M14.5 9.5H17M14.5 15.5H17"/>',
    book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    unlock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 7.5-1.9"/>',
    star: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>', close: '<path d="m6 6 12 12M18 6 6 18"/>',
    'chevron-right': '<path d="m9.5 6 6 6-6 6"/>', 'chevron-left': '<path d="m14.5 6-6 6 6 6"/>', 'chevron-down': '<path d="m6 9.5 6 6 6-6"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>', 'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1"/>',
    warning: '<path d="M12 4 21 19.5H3z"/><path d="M12 10v4.5M12 17.2v.1"/>',
    error: '<path d="M8.3 3.5h7.4l5.3 5.3v7.4l-5.3 5.3H8.3L3 16.2V8.8z"/><path d="M12 8v5M12 16v.1"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    'eye-off': '<path d="M4 4l16 16M10 5.7A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.8 3.6M6.5 7.3A16 16 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4-.9M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    filter: '<path d="M4 5h16l-6.2 7.5V19l-3.6-1.8v-4.7z"/>',
    sort: '<path d="M8 4v16M4.5 7.5 8 4l3.5 3.5M16 20V4M12.5 16.5 16 20l3.5-3.5"/>',
    planet: '<circle cx="12" cy="12" r="5.5"/><path d="M5.2 15.5C2.6 17.6 1.7 19.4 2.6 20.1c1.3 1.1 6-1.3 10.5-5.4s7.2-8.6 6-9.7c-.8-.7-2.7.1-5 1.8"/>',
    quest: '<path d="M6 21V4M6 4h11l-2.5 4L17 12H6"/>',
    mod: '<path d="M7 3h10l3 3v12l-3 3H7l-3-3V6z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    resource: '<path d="m12 3 6.5 6L12 21 5.5 9z"/><path d="M5.5 9h13M12 3v18"/>',
    syndicate: '<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z"/><path d="M12 8v8M8.5 12h7"/>',
    vendor: '<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    build: '<path d="M12 2.8 19.8 7.3v9.4L12 21.2 4.2 16.7V7.3z"/><path d="M12 12 19.8 7.3M12 12v9.2M12 12 4.2 7.3"/>',
    endgame: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/><path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4"/>',
    boost: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
    loot: '<path d="M4 9h16v11H4zM2.5 5.5h19V9h-19zM12 5.5V20M12 5.5C10.5 3 7.5 2.6 7.5 4.3S10 5.5 12 5.5zm0 0c1.5-2.5 4.5-2.9 4.5-1.2S14 5.5 12 5.5z"/>',
    save: '<rect x="3.5" y="4" width="17" height="13" rx="1.5"/><path d="M8 21h8M12 17v4M8 10.5l2.5 2.5L16 8"/>',
    'save-error': '<rect x="3.5" y="4" width="17" height="13" rx="1.5"/><path d="M8 21h8M12 17v4M12 7.5v4.5M12 14.3v.1"/>',
    sync: '<path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3M18 3v4h-4M6 21v-4h4"/>',
    offline: '<path d="M4 4l16 16M8.5 8.6A5 5 0 0 0 7 18h10M11 6.2A6 6 0 0 1 18 11a3.5 3.5 0 0 1 2.4 5.4"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 6.6M20 4v7h-7"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    'zoom-in': '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2M11 8.5v5M8.5 11h5"/>',
    'zoom-out': '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2M8.5 11h5"/>',
    target: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="1.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    layers: '<path d="m12 4 9 5-9 5-9-5z"/><path d="m3 14 9 5 9-5"/>',
    'image-off': '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="m3.5 16 5-5 4 4M14 13l2-2 4.5 4.5M3 3l18 18"/>',
    settings: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5"/>',
    more: '<circle cx="5.5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18.5" cy="12" r="1.2"/>',
    currency: '<circle cx="12" cy="12" r="8.5"/><path d="M12 6.5 15.5 12 12 17.5 8.5 12z"/>',
    rank: '<path d="m4 15 8-5 8 5M4 10l8-5 8 5M4 20l8-5 8 5"/>',
    mission: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="5"/><path d="m10 12 1.5 1.5L14.5 10.5"/>',
    reward: '<circle cx="12" cy="9" r="5.5"/><path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7"/>',
    keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="1.5"/><path d="M6 10h.1M9.5 10h.1M13 10h.1M16.5 10h.1M7 14h10"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 16.8v.1"/>',
    polarity: '<path d="M12 4v16M6 8l6-4 6 4M6 16l6 4 6-4"/>',
    orokin: '<path d="M12 2.5 15 8l-3 3-3-3zM12 21.5 9 16l3-3 3 3zM2.5 12 8 9l3 3-3 3zM21.5 12 16 15l-3-3 3-3z"/>'
  };

function sprite() {
  if (document.getElementById('tn-sprite')) return;
  let s = '<svg id="tn-sprite" xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">';
  for (const k in ICON_PATHS) s += '<symbol id="tn-i-' + k + '" viewBox="0 0 24 24">' + ICON_PATHS[k] + '</symbol>';
  document.body.insertAdjacentHTML('afterbegin', s + '</svg>');
}
/** Иконка DS: <svg class="tn-icon"><use href="#tn-i-name"/></svg> */
function icon(name, cls, label) {
  if (!ICON_PATHS[name]) throw new Error('Нет иконки ' + name);
  return '<svg class="tn-icon' + (cls ? ' ' + cls : '') + '"' + (label ? ' role="img" aria-label="' + esc(label) + '"' : ' aria-hidden="true"') + '><use href="#tn-i-' + name + '"/></svg>';
}
/** TN.plural(n, ['задача','задачи','задач']) — как в bundle.js */
function plural(n, f) {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return f[2];
  if (b > 1 && b < 5) return f[1];
  if (b === 1) return f[0];
  return f[2];
}
const pl = (n, f) => n + ' ' + plural(n, f);
/** Число с неразрывным пробелом в тысячах и запятой в дробях: 25 000, 12,5 */
function fmt(n) {
  if (n == null || n === '') return '—';
  const s = String(n).split('.');
  return s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (s[1] ? ',' + s[1] : '');
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const attr = esc;
/** Дата ДД.ММ.ГГГГ из ISO или Date */
function fdate(d) {
  if (!d) return '—';
  const x = typeof d === 'string' ? new Date(d.length === 10 ? d + 'T12:00:00' : d) : d;
  if (isNaN(x)) return '—';
  return String(x.getDate()).padStart(2, '0') + '.' + String(x.getMonth() + 1).padStart(2, '0') + '.' + x.getFullYear();
}
function ftime(d) {
  const x = new Date(d); if (isNaN(x)) return '';
  const today = new Date(); const y = new Date(); y.setDate(today.getDate() - 1);
  const hm = String(x.getHours()).padStart(2, '0') + ':' + String(x.getMinutes()).padStart(2, '0');
  if (x.toDateString() === today.toDateString()) return 'сегодня, ' + hm;
  if (x.toDateString() === y.toDateString()) return 'вчера, ' + hm;
  return fdate(x) + ', ' + hm;
}
function todayISO() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function uid(p) { return (p || 'id') + '_' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3); }
function debounce(fn, ms) { let t; return function (...a) { clearTimeout(t); t = setTimeout(() => fn.apply(this, a), ms); }; }
const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
/** Склейка классов */
const cx = (...a) => a.filter(Boolean).join(' ');
/** Список — пустая строка, если нет элементов */
const each = (arr, fn) => (arr || []).map(fn).join('');
/** Кавычки-ёлочки */
const q = s => '«' + s + '»';
const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Объявление для экранного диктора */
function announce(text) {
  const el = document.getElementById('tn-live'); if (!el) return;
  el.textContent = ''; setTimeout(() => { el.textContent = text; }, 30);
}
Object.assign(TN, { icon, plural, pl, fmt, esc, fdate, ftime, uid, announce });

/* ── 01-data.js ── */
/* 01-data.js — доступ к содержанию (window.TN_DATA), ссылки между сущностями и защита от спойлеров.
   Защита (HANDOFF → «Защита от спойлеров»): сущность скрыта, если защита включена, spoiler === true и stage > порога.
   Порог: настройка игрока → выбранный этап → 5 (середина игры), если этап не выбран.
   Скрытые тексты не попадают в DOM: подстановка выполняется до вставки разметки. */
const D = window.TN_DATA;
const by = (arr, key) => new Map(arr.map(x => [x[key || 'id'], x]));
const IDX = {
  fact: by(D.facts), mod: by(D.mods), item: by(D.items), vendor: by(D.vendors), syndicate: by(D.syndicates), activity: by(D.activities),
  build: by(D.builds), planet: by(D.locations), goal: by(D.goals), stage: new Map(D.stages.map(s => [String(s.n), s])),
  article: by(D.articles), articleSlug: by(D.articles, 'slug')
};
const RARITY = { common: ['Обычный', 1], uncommon: ['Необычный', 2], rare: ['Редкий', 3], legendary: ['Легендарный', 4] };
const FAMILY = { normal: 'Обычный мод', corrupted: 'Повреждённый', galvanized: 'Гальванизированный', archon: 'Архонтовый', primed: 'Прайм', augment: 'Мод-улучшение', nightmare: 'Мод Кошмара', sixty: '60/60', companion: 'Мод Связи', umbra: 'Умбра', riven: 'Мод разлома' };
const MODCAT = { warframe: 'Варфрейм', aura: 'Аура', shotgun: 'Дробовик', rifle: 'Винтовка и лук', bow: 'Лук', pistol: 'Пистолет', melee: 'Ближний бой', companion: 'Компаньон', any: 'Оружие' };
const ITEMTYPE = { warframe: 'Варфрейм', weapon: 'Оружие', resource: 'Ресурс', currency: 'Валюта', arcane: 'Мистификатор', misc: 'Предмет' };
const SLOTNAME = { primary: 'Основное оружие', secondary: 'Вторичное оружие', melee: 'Ближний бой', shotgun: 'Дробовик' };

/* ── Защита от спойлеров ─────────────────────────────── */
const Spoil = {
  revealed: new Set(),            // раскрытые блоки — до ухода со страницы
  on() { return Store.doc.settings.spoilers !== 'off'; },
  threshold() {
    const s = Store.doc.settings;
    if (s.spoilerStage) return s.spoilerStage;
    return Store.doc.stage || 5;
  },
  hiddenStage(stage, spoiler) { return !!spoiler && this.on() && stage > this.threshold(); },
  isHidden(obj) { return !!obj && this.hiddenStage(obj.stage || (obj.stages ? Math.min(...obj.stages) : 0), obj.spoiler); },
  reset() { this.revealed.clear(); }
};
let TERM_RE = null;
function termRegex() {
  if (TERM_RE) return TERM_RE;
  TERM_RE = D.spoilerTerms.map(t => ({ stage: t.stage, kind: t.kind, re: new RegExp('(?<![\\p{L}\\d])(?:' + t.re + ')(?![\\p{L}])', 'gu') }));
  return TERM_RE;
}
/** Экранирует текст и заменяет скрытые сюжетные слова меткой «Скрыто · этап N». scope — ключ раскрытого блока. */
function mask(text, scope) {
  const raw = String(text == null ? '' : text);
  if (!Spoil.on() || (scope && Spoil.revealed.has(scope))) return esc(raw);
  const T = Spoil.threshold();
  const hits = [];
  termRegex().forEach(t => {
    if (t.stage <= T) return;
    t.re.lastIndex = 0; let m;
    while ((m = t.re.exec(raw))) hits.push({ a: m.index, b: m.index + m[0].length, stage: t.stage, kind: t.kind });
  });
  if (!hits.length) return esc(raw);
  hits.sort((x, y) => x.a - y.a);
  let out = '', pos = 0;
  hits.forEach(h => {
    if (h.a < pos) return;
    out += esc(raw.slice(pos, h.a)) + spoilerInline(h.stage);
    pos = h.b;
  });
  return out + esc(raw.slice(pos));
}
/** Есть ли в тексте скрытые слова (для кнопки «Показать скрытое в разделе») */
function hasMasked(text) {
  if (!Spoil.on()) return false;
  const T = Spoil.threshold();
  return termRegex().some(t => { if (t.stage <= T) return false; t.re.lastIndex = 0; return t.re.test(String(text)); });
}
/** Простой текст без скрытых слов — для title вкладки, aria-label и подсказок */
function maskPlain(text) {
  if (!Spoil.on()) return String(text);
  const T = Spoil.threshold();
  let s = String(text);
  termRegex().forEach(t => { if (t.stage > T) { t.re.lastIndex = 0; s = s.replace(t.re, '[скрыто]'); } });
  return s;
}
function spoilerInline(stage) {
  return '<span class="tn-spoiler tn-spoiler--inline">' + icon('eye-off', 'tn-icon--sm') + 'Скрыто · этап ' + stage + '</span>';
}

/* ── Сущности и ссылки ───────────────────────────────── */
/** ref: 'mod:id' | 'item:id' | 'vendor:id' | ... | 'route' и т. п. → { kind, id, obj, name, path, stage, hidden } */
function entity(ref) {
  if (!ref) return null;
  const simple = { route: ['/?view=list', 'Маршрут списком'], stages: ['/?view=list', 'Маршрут развития'], mods: ['/mods', 'Моды'], syndicates: ['/syndicates', 'Синдикаты'], loot: ['/loot', 'Добыча'],
    endgame: ['/endgame', 'Поздняя игра'], tasks: ['/tasks', 'Мои задачи'], builds: ['/boost#builds', 'Сборки'], checklists: ['/endgame#readiness', 'Проверка готовности'], reference: ['/reference', 'Справочник'], search: ['/search', 'Поиск'] };
  if (simple[ref]) return { kind: 'route', id: ref, name: simple[ref][1], path: simple[ref][0], stage: 0, hidden: false };
  const i = ref.indexOf(':'); const kind = ref.slice(0, i), id = ref.slice(i + 1);
  let obj, name, path, stage = 0, spoiler = false;
  switch (kind) {
    case 'mod': obj = IDX.mod.get(id); path = '/mod/' + id; break;
    case 'item': obj = IDX.item.get(id); path = '/item/' + id; break;
    case 'vendor': obj = IDX.vendor.get(id); path = '/vendor/' + id; break;
    case 'syndicate': obj = IDX.syndicate.get(id); path = '/syndicate/' + id; break;
    case 'activity': obj = IDX.activity.get(id); path = '/activity/' + id; break;
    case 'build': obj = IDX.build.get(id); path = '/build/' + id; if (obj) name = obj.title; break;
    case 'planet': obj = IDX.planet.get(id); path = '/planet/' + id; if (obj) stage = Math.min(...obj.stages); break;
    case 'goal': obj = IDX.goal.get(id); if (obj) { path = '/stage/' + obj.stage + '#goal-' + id; name = obj.title; stage = obj.stage; spoiler = (IDX.stage.get(String(obj.stage)) || {}).spoiler; } break;
    case 'stage': obj = IDX.stage.get(id); if (obj) { path = '/stage/' + id; name = 'Этап ' + id + ': ' + obj.title; stage = obj.n; spoiler = obj.spoiler; } break;
    case 'article': obj = IDX.article.get(id); if (obj) { path = '/article/' + obj.slug; name = obj.title; stage = obj.stage || 0; } break;
    case 'quest': case 'fact': obj = IDX.fact.get(id); path = '/quest/' + encodeURIComponent(id); break;
    default: return null;
  }
  if (!obj) return null;
  if (!name) name = obj.name || obj.title;
  if (!stage) stage = obj.stage || 0;
  if (kind !== 'goal' && kind !== 'stage') spoiler = !!obj.spoiler;
  const hidden = Spoil.hiddenStage(stage, spoiler);
  return { kind, id, obj, name, path, stage, spoiler, hidden };
}
/** Название сущности для показа: скрытое — «Скрытая … · этап N» */
function entName(e, scope) {
  if (!e) return '';
  if (e.hidden && !(scope && Spoil.revealed.has(scope))) {
    const what = { planet: 'Скрытое место', quest: 'Скрытый сюжетный квест', fact: 'Скрытый сюжетный квест', vendor: 'Скрытый продавец', syndicate: 'Скрытая группа', stage: 'Скрытый этап', goal: 'Скрытая цель', item: 'Скрытый предмет', activity: 'Скрытый режим' }[e.kind] || 'Скрыто';
    return esc(what) + ' · этап ' + e.stage;
  }
  return mask(e.name, scope);
}
function entPlain(e) {
  if (!e) return '';
  if (e.hidden) return ({ planet: 'Скрытое место', quest: 'Скрытый сюжетный квест', vendor: 'Скрытый продавец', stage: 'Скрытый этап' }[e.kind] || 'Скрыто') + ' · этап ' + e.stage;
  return maskPlain(e.name);
}
const factName = f => {
  const e = { kind: 'quest', name: f.name, stage: f.stage || 0, hidden: Spoil.hiddenStage(f.stage || 0, f.spoiler) };
  return e.hidden ? 'Скрытый сюжетный квест · этап ' + f.stage : (f.kind === 'quest' ? 'Квест ' + q(f.name) : f.name);
};
const stageTitle = s => (Spoil.hiddenStage(s.n, s.spoiler) ? 'Скрытый этап' : s.title);
const wikiRu = page => 'https://ru.wiki.warframe.com/w/' + encodeURI(page);
const wikiEn = page => 'https://wiki.warframe.com/w/' + encodeURI(page).replace(/'/g, '%27');
function srcInfo(key) {
  if (!key || key === 'guide' || /^g:/.test(key)) return { guide: true, title: D.guide.title, checked: D.guide.checked, section: key && key.startsWith('g:') ? key.slice(2) : null };
  const s = D.sources[key]; return s ? Object.assign({ key }, s) : null;
}
Object.assign(TN, { D, IDX, Spoil, mask, entity });

/* ── 02-store.js ── */
/* 02-store.js — хранение прогресса только в этом браузере (HANDOFF → «Сохранение прогресса»).
   Ключ tn:progress:v1, один JSON-документ. Запись: setItem → повторное чтение → сравнение.
   Ошибка записи — откат изменения и состояние error; успех показывается только после подтверждения.
   Неизвестная версия документа — не перезаписываем, предлагаем сброс. Несколько вкладок — событие storage. */
const STORE_KEY = 'tn:progress:v1';
const DOC_VERSION = 1;

function emptyDoc() {
  return {
    version: DOC_VERSION,
    updatedAt: null,
    stage: null,          // выбранный этап маршрута (число) или null — «не указан»
    goalId: null,         // выбранная цель (необязательно)
    done: {},             // отметки выполнения: { 'goal:<id>': ISO, 'step:<goal>:<step>': ISO, 'check:<list>:<i>': ISO }
    facts: {},            // ручные отметки прогресса: { 'quest:new-war': true|false, 'mr': 12, 'owned:mod:vitality': true }
    standing: {},         // { '<syndicate>': { rank: 2, value: 42000 } } — только то, что указал игрок
    tasks: [],            // личные задачи
    lastPlace: null,      // { href, title, at } — для «Продолжить с того места»
    settings: { spoilers: 'on', spoilerStage: null, staticMap: false, showEnglish: true, view: null, density: 'normal' },
    onboarded: false
  };
}

const Store = {
  doc: emptyDoc(),
  status: 'saved',        // saved | error | unavailable | unknown-format
  lastError: null,
  listeners: new Set(),
  available: true,
  raw: null,              // исходная строка при неизвестном формате (для экспорта)

  storage() {
    const dbg = new URLSearchParams(location.search).get('debug') || sessionStorage.getItem('tn:debug') || '';
    if (dbg.includes('storage-off')) throw Object.assign(new Error('SecurityError'), { name: 'SecurityError' });
    return window.localStorage;
  },

  init() {
    try {
      const ls = this.storage();
      const probe = '__tn_probe__';
      ls.setItem(probe, '1'); ls.removeItem(probe);
      this.available = true;
    } catch (e) {
      this.available = false; this.status = 'unavailable'; this.lastError = e;
      this.doc = emptyDoc();
      return;
    }
    const r = this.read();
    if (r.state === 'ok') { this.doc = r.doc; this.status = 'saved'; }
    else if (r.state === 'empty') { this.doc = emptyDoc(); this.status = 'saved'; }
    else { this.doc = emptyDoc(); this.status = 'unknown-format'; this.raw = r.raw; }
    window.addEventListener('storage', e => {
      if (e.key !== STORE_KEY && e.key !== null) return;
      const rr = this.read();
      if (rr.state === 'ok') { this.doc = rr.doc; if (this.status !== 'unavailable') this.status = 'saved'; }
      else if (rr.state === 'empty') { this.doc = emptyDoc(); this.status = 'saved'; this.raw = null; }
      else { this.status = 'unknown-format'; this.raw = rr.raw; }
      this.emit({ external: true });
    });
  },

  /** Читает документ из хранилища. state: ok | empty | unknown */
  read() {
    let raw;
    try { raw = this.storage().getItem(STORE_KEY); } catch (e) { return { state: 'empty' }; }
    if (raw == null) return { state: 'empty' };
    let d;
    try { d = JSON.parse(raw); } catch (e) { return { state: 'unknown', raw }; }
    if (!d || typeof d !== 'object' || d.version !== DOC_VERSION) return { state: 'unknown', raw };
    return { state: 'ok', doc: normalize(d) };
  },

  /** Изменение документа. mutator(doc) меняет копию. Возвращает true (записано), 'memory' (только до закрытия вкладки) или false (ошибка). */
  update(mutator) {
    if (this.status === 'unknown-format') { this.emit({ blocked: true }); return false; }
    // берём свежую версию из хранилища, чтобы не затереть изменения из другой вкладки
    let base = this.doc;
    if (this.available) { const r = this.read(); if (r.state === 'ok') base = r.doc; }
    const next = clone(base);
    mutator(next);
    next.updatedAt = new Date().toISOString();
    if (!this.available) { this.doc = next; this.status = 'unavailable'; this.emit({}); return 'memory'; }
    const str = JSON.stringify(next);
    try {
      const dbg = new URLSearchParams(location.search).get('debug') || sessionStorage.getItem('tn:debug') || '';
      if (dbg.includes('storage-fail')) throw Object.assign(new Error('QuotaExceededError'), { name: 'QuotaExceededError' });
      const ls = this.storage();
      ls.setItem(STORE_KEY, str);
      if (ls.getItem(STORE_KEY) !== str) throw new Error('Проверка записи не совпала');
    } catch (e) {
      this.lastError = e; this.status = 'error';
      // откат: остаёмся на последнем подтверждённом документе
      this.doc = base;
      this.emit({ error: e });
      return false;
    }
    this.doc = next; this.status = 'saved'; this.lastError = null;
    this.emit({});
    return true;
  },

  /** Полный сброс: удаляется ключ целиком */
  reset() {
    try { if (this.available) this.storage().removeItem(STORE_KEY); }
    catch (e) { this.lastError = e; this.status = 'error'; this.emit({ error: e }); return false; }
    this.doc = emptyDoc(); this.raw = null;
    this.status = this.available ? 'saved' : 'unavailable';
    this.emit({});
    return true;
  },

  /** Импорт документа из файла (после проверки формата) */
  replace(doc) {
    const d = normalize(doc);
    return this.update(x => { Object.keys(x).forEach(k => delete x[k]); Object.assign(x, d); });
  },

  exportText() { return this.status === 'unknown-format' && this.raw ? this.raw : JSON.stringify(this.doc, null, 2); },

  on(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  emit(ev) { this.listeners.forEach(fn => { try { fn(ev); } catch (e) { console.error(e); } }); }
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }
function normalize(d) {
  const e = emptyDoc();
  const out = Object.assign(e, d);
  out.settings = Object.assign(emptyDoc().settings, d.settings || {});
  out.done = d.done && typeof d.done === 'object' ? d.done : {};
  out.facts = d.facts && typeof d.facts === 'object' ? d.facts : {};
  out.standing = d.standing && typeof d.standing === 'object' ? d.standing : {};
  out.tasks = Array.isArray(d.tasks) ? d.tasks.filter(t => t && t.id && t.title) : [];
  return out;
}
TN.Store = Store;

/* ── 03-progress.js ── */
/* 03-progress.js — отметки прогресса, проверка условий, цели этапов и личные задачи.
   Правила задания: отсутствие отметки = «не указано», а не «нет»; выбор этапа ничего не отмечает автоматически;
   выполнение задачи не меняет игровые сведения — для этого игрок нажимает отдельное действие. */

const Facts = {
  /** true | false | undefined */
  get(id) {
    const d = Store.doc;
    if (id.startsWith('rank:')) { const s = d.standing[id.slice(5)]; return s && s.rank != null ? s.rank : undefined; }
    const v = d.facts[id];
    return v === undefined || v === null ? undefined : v;
  },
  def(id) { return IDX.fact.get(id); },
  label(c) {
    if (c.label) return c.label;
    const f = c.f || '';
    if (f === 'mr') return 'Ранг мастерства ' + c.min;
    if (f.startsWith('rank:')) { const s = IDX.syndicate.get(f.slice(5)); return (s ? s.name : f) + ': ранг ' + c.min; }
    if (f.startsWith('owned:')) { const e = entity((IDX.mod.has(f.slice(6)) ? 'mod:' : 'item:') + f.slice(6)); return 'Есть ' + (e ? e.name : f.slice(6)); }
    const def = IDX.fact.get(f); return def ? factName(def) : f;
  },
  /** Ключ условия для ручной отметки: факт или «note:…» для условий без отдельной отметки */
  key(c) { return c.f || ('note:' + slug(c.label || '')); }
};
function slug(s) { return String(s).toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60); }

/** Проверка условия → { state: yes|no|unknown, label, current, hint } */
function evalCond(c) {
  if (c.any) {
    const parts = c.any.map(evalCond);
    const state = parts.some(p => p.state === 'yes') ? 'yes' : parts.every(p => p.state === 'no') ? 'no' : 'unknown';
    return { state, label: c.label || parts.map(p => p.label).join(' или '), note: c.note, parts, key: null, cond: c };
  }
  const key = Facts.key(c);
  const label = Facts.label(c);
  let state = 'unknown', current = null;
  if (c.f === 'mr' || (c.f && c.f.startsWith('rank:'))) {
    const v = Facts.get(c.f);
    if (v !== undefined) { state = v >= c.min ? 'yes' : 'no'; current = c.f === 'mr' ? 'у вас ' + v : 'сейчас: ранг ' + v; }
  } else {
    const v = Store.doc.facts[key];
    if (v === true) state = 'yes'; else if (v === false) state = 'no';
    else if (c.f && c.f.startsWith('junction:')) {
      // переход, ведущий к планете, которую игрок отметил открытой, пройден: без него на планету не попасть
      const to = junctionTarget(c.f);
      if (to && Store.doc.facts['open:' + to] === true) { state = 'yes'; current = 'следует из отметки «' + entPlain(entity('planet:' + to)) + ' — открыта»'; }
    }
  }
  const def = c.f ? IDX.fact.get(c.f) : null;
  return { state, label, current, note: c.note || (def && def.note), key, cond: c, def };
}

/* ── Цели и этапы ─────────────────────────────────────── */
const isDone = key => !!Store.doc.done[key];
function goalInfo(g) {
  const steps = g.steps || [];
  const stepsDone = steps.filter(s => isDone('step:' + g.id + ':' + s.id)).length;
  const done = isDone('goal:' + g.id);
  const conds = (g.req || []).map(evalCond);
  const unmet = conds.filter(c => c.state === 'no').length;
  const unknown = conds.filter(c => c.state === 'unknown').length;
  return { done, steps, stepsDone, conds, unmet, unknown, inTasks: !!findTask('goal:' + g.id) };
}
function stageGoals(n) { const s = IDX.stage.get(String(n)); return s ? s.goals.map(id => IDX.goal.get(id)).filter(Boolean) : []; }
function stageInfo(n) {
  const gs = stageGoals(n);
  const main = gs.filter(g => g.kind === 'main');
  const doneMain = main.filter(g => isDone('goal:' + g.id)).length;
  const nearest = main.find(g => !isDone('goal:' + g.id)) || gs.find(g => !isDone('goal:' + g.id)) || null;
  return { goals: gs, main, doneMain, total: main.length, nearest };
}
/** Состояние этапа маршрута относительно выбранного: done | current | available | locked */
function stageProgress(n) {
  const cur = Store.doc.stage;
  if (!cur) return n === 1 ? 'available' : 'locked';
  if (n < cur) return 'done';
  if (n === cur) return 'current';
  if (n === cur + 1) return 'available';
  return 'locked';
}
const PROGRESS_WORD = { locked: 'Закрыто', available: 'Доступно', current: 'Текущий этап', done: 'Пройдено' };
const PROGRESS_ICON = { locked: 'lock', available: 'unlock', current: 'target', done: 'check' };
/** Подписи состояния для планет: «пройдено» для места звучит странно — планета «открыта» */
const PLANET_WORD = { locked: 'Закрыта', available: 'Впереди по маршруту', current: 'Текущий этап', done: 'Открыта' };
/** Переход → планета, которую он открывает (по условиям доступа мест) */
let JUNCTION_TO = null;
function junctionTarget(f) {
  if (!JUNCTION_TO) { JUNCTION_TO = {}; D.locations.forEach(l => (l.access || []).forEach(c => { if (c.f && c.f.startsWith('junction:') && c.gate !== false) JUNCTION_TO[c.f] = l.id; })); }
  return JUNCTION_TO[f] || null;
}
/** Открыта ли планета в игре: yes | no | unknown.
    Явная отметка игрока важнее; иначе — по условиям, без которых на планету не попасть (переходы и квесты). */
function planetOpen(loc) {
  const v = Store.doc.facts['open:' + loc.id];
  if (v === true) return { state: 'yes', how: 'mark' };
  if (v === false) return { state: 'no', how: 'mark' };
  const gates = (loc.access || []).filter(c => c.gate !== false).map(evalCond);
  if (!gates.length) return { state: 'unknown', how: 'none' };
  if (gates.every(e => e.state === 'yes')) return { state: 'yes', how: 'conds' };
  if (gates.some(e => e.state === 'no')) return { state: 'no', how: 'conds' };
  return { state: 'unknown', how: 'conds' };
}
/** Состояние планеты на карте: current — фокус выбранного этапа; done — открыта (по отметкам или условиям);
    locked — точно закрыта; иначе — по выбранному этапу (без отметок предполагаем, что ранние этапы пройдены) */
function planetProgress(loc) {
  const cur = Store.doc.stage;
  const st = loc.stages;
  const curStage = cur ? IDX.stage.get(String(cur)) : null;
  if (curStage && curStage.focus === loc.id) return 'current';
  const op = planetOpen(loc).state;
  if (op === 'yes') return 'done';
  if (op === 'no') return st.includes(cur) || st.includes((cur || 0) + 1) ? 'available' : 'locked';
  if (!cur) return st[0] === 1 ? 'available' : 'locked';
  if (st.every(x => x < cur) || st[0] < cur) return 'done';
  if (st.includes(cur) || st.includes(cur + 1)) return 'available';
  return 'locked';
}
/** Этап, ради которого показываем планету: текущий, иначе ближайший будущий, иначе первый */
function planetStage(loc) {
  const cur = Store.doc.stage;
  if (cur && loc.stages.includes(cur)) return cur;
  const fut = cur ? loc.stages.find(x => x > cur) : null;
  return fut || loc.stages[0];
}

/* ── Личные задачи ───────────────────────────────────── */
function findTask(ref) { return Store.doc.tasks.find(t => t.ref === ref && !t.removed); }
/** Описание задачи для цели этапа */
function taskSpecGoal(g) {
  const s = IDX.stage.get(String(g.stage));
  return { ref: 'goal:' + g.id, title: g.title, href: '/stage/' + g.stage + '#goal-' + g.id, group: 'stage:' + g.stage, groupTitle: 'Этап ' + g.stage + ' · ' + (s ? s.short : ''), kind: 'goal', stage: g.stage, ctx: g.why };
}
/** Описание задачи для невыполненного условия */
function taskSpecCond(ev, groupRef, groupTitle, stage) {
  const c = ev.cond;
  let href = null, ctx = ev.note || '';
  const f = c.f || '';
  if (f.startsWith('quest:')) href = '/quest/' + f;
  else if (f.startsWith('rank:')) href = '/syndicate/' + f.slice(5);
  else if (f.startsWith('junction:') || f.startsWith('flag:')) href = '/quest/' + f;
  else if (f === 'mr') href = '/article/mastery';
  const verb = f.startsWith('quest:') ? 'Пройти: ' : f.startsWith('rank:') ? 'Поднять ' : f === 'mr' ? 'Достичь: ' : '';
  let title = ev.label;
  if (f.startsWith('quest:')) { const d = IDX.fact.get(f); title = verb + (d ? q(d.name) : f); }
  else if (f.startsWith('rank:')) { const s = IDX.syndicate.get(f.slice(5)); title = 'Поднять ранг ' + q(s ? s.name : f) + ' до ' + c.min; }
  else if (f === 'mr') title = 'Достичь ранга мастерства ' + c.min;
  return { ref: 'cond:' + Facts.key(c) + (c.min != null ? ':' + c.min : ''), title, href, group: groupRef, groupTitle, kind: 'cond', fact: c.f || null, factKey: Facts.key(c), min: c.min, ctx, stage };
}
/**
 * Добавляет задачи. specs — массив описаний; deps — индексы зависимостей: [{ task: i, on: [j, …] }].
 * Общие предпосылки не дублируются: если задача с тем же ref уже есть, используется она.
 * Возвращает { ok, created: [titles], reused: [titles] }.
 */
function addTasks(specs, deps) {
  const created = [], reused = [];
  const res = Store.update(doc => {
    const ids = specs.map(sp => {
      const ex = doc.tasks.find(t => t.ref === sp.ref && !t.removed);
      if (ex) { reused.push(ex.title); return ex.id; }
      const t = Object.assign({ id: uid('t'), done: false, createdAt: new Date().toISOString(), dependsOn: [] }, sp);
      doc.tasks.push(t); created.push(t.title); return t.id;
    });
    (deps || []).forEach(d => {
      const t = doc.tasks.find(x => x.id === ids[d.task]);
      if (!t) return;
      d.on.forEach(j => { const dep = ids[j]; if (dep && dep !== t.id && !t.dependsOn.includes(dep)) t.dependsOn.push(dep); });
    });
  });
  return { ok: res, created, reused };
}
function taskBlockers(t) {
  return (t.dependsOn || []).map(id => Store.doc.tasks.find(x => x.id === id)).filter(x => x && !x.done && !x.removed);
}
function activeTasks() { return Store.doc.tasks.filter(t => !t.removed); }
function openTaskCount() { return activeTasks().filter(t => !t.done).length; }

/** Подсказка для отметки прогресса после выполнения цели или задачи (не применяется автоматически) */
function pendingMarks(keys) {
  return (keys || []).filter(k => {
    if (k.startsWith('owned:')) return Store.doc.facts[k] !== true;
    const v = Store.doc.facts[k];
    return v !== true;
  });
}
function markLabel(k) {
  if (k.startsWith('owned:')) { const id = k.slice(6); const e = entity((IDX.mod.has(id) ? 'mod:' : 'item:') + id); return 'есть ' + (e ? entPlain(e) : id); }
  const d = IDX.fact.get(k); if (!d) return k;
  if (Spoil.hiddenStage(d.stage || 0, d.spoiler)) return 'скрытый квест · этап ' + d.stage;
  return d.kind === 'quest' ? 'квест ' + q(d.name) + ' пройден' : d.name;
}
Object.assign(TN, { evalCond, goalInfo, stageInfo, addTasks });

/* ── 04-router.js ── */
/* 04-router.js — адреса и история (HANDOFF → «Навигация и адреса»).
   На сервере — обычные пути (/stage/3). При открытии файла index.html — адреса вида index.html#!/stage/3.
   Перед уходом со страницы в history.state сохраняются прокрутка, фокус и состояние экрана (выбранный объект,
   слот, фильтры); при «назад» они восстанавливаются. */
const HASH_MODE = location.protocol === 'file:' || document.documentElement.dataset.router === 'hash';
const BASE = (() => {
  if (HASH_MODE) return '';
  const b = document.querySelector('base'); if (!b) return '';
  return new URL(b.href).pathname.replace(/\/$/, '');
})();

/** Внутренний путь → href для ссылки */
function link(path) {
  if (!path) return '#';
  if (HASH_MODE) return '#!' + path;
  return BASE + path;
}
/** Текущий внутренний путь: { path, query: URLSearchParams, frag } */
function current() {
  let full;
  if (HASH_MODE) full = location.hash.startsWith('#!') ? location.hash.slice(2) : '/';
  else full = location.pathname.slice(BASE.length) + location.search + location.hash;
  if (!full) full = '/';
  const hashI = full.indexOf('#');
  const frag = hashI >= 0 ? decodeURIComponent(full.slice(hashI + 1)) : '';
  const noFrag = hashI >= 0 ? full.slice(0, hashI) : full;
  const qi = noFrag.indexOf('?');
  return { path: (qi >= 0 ? noFrag.slice(0, qi) : noFrag) || '/', query: new URLSearchParams(qi >= 0 ? noFrag.slice(qi) : ''), frag, full };
}

const Router = {
  routes: [],
  screen: null,
  params: null,
  onRender: null,
  add(pattern, screen) {
    const keys = [];
    const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '/?$');
    this.routes.push({ re, keys, screen });
  },
  match(path) {
    for (const r of this.routes) {
      const m = path.match(r.re);
      if (m) { const p = {}; r.keys.forEach((k, i) => { p[k] = decodeURIComponent(m[i + 1]); }); return { screen: r.screen, params: p }; }
    }
    return null;
  },
  /** Сохраняет состояние текущего экрана в запись истории */
  save() {
    if (!this.screen) return;
    const ae = document.activeElement;
    const fk = ae && ae.closest && ae.closest('[data-key]');
    const st = Object.assign({}, history.state || {}, {
      tn: 1, scrollY: window.scrollY, focusKey: fk ? fk.dataset.key : null,
      ui: this.screen.saveUI ? this.screen.saveUI() : null,
      path: current().full
    });
    try { history.replaceState(st, ''); } catch (e) { /* file:// в некоторых браузерах */ }
  },
  go(path, opts) {
    opts = opts || {};
    this.save();
    const prev = current().full;
    const url = HASH_MODE ? '#!' + path : BASE + path;
    try {
      if (opts.replace) history.replaceState({ tn: 1, prev: (history.state || {}).prev || null }, '', url);
      else history.pushState({ tn: 1, prev }, '', url);
    } catch (e) { location.hash = '!' + path; return; }
    this.render({ nav: true, keepFocus: opts.keepFocus });
  },
  /** Назад к пути: если предыдущая запись истории — этот путь, используем history.back() и восстанавливаем состояние */
  backTo(path) {
    const st = history.state || {};
    if (st.prev && samePath(st.prev, path)) { history.back(); return; }
    this.go(path);
  },
  render(opts) {
    opts = opts || {};
    const cur = current();
    const m = this.match(cur.path) || { screen: Screens.notFound, params: {} };
    if (this.screen && this.screen.unmount) this.screen.unmount();
    if (opts.nav) Spoil.reset();
    this.screen = m.screen; this.params = m.params;
    const restore = opts.restore || null;
    if (this.onRender) this.onRender(m.screen, m.params, cur, { restore, nav: !!opts.nav, rerender: !!opts.rerender, keepFocus: opts.keepFocus });
  }
};
function samePath(a, b) { const na = a.split('#')[0], nb = b.split('#')[0]; return na === nb || na.split('?')[0] === nb.split('?')[0] && nb.indexOf('?') < 0; }

window.addEventListener('popstate', e => { Spoil.reset(); Router.render({ restore: e.state || {} }); });
if (HASH_MODE) window.addEventListener('hashchange', () => { if (!history.state || !history.state.tn) Router.render({ nav: true }); });

/** Перехват внутренних ссылок — обычные <a href>, поэтому «открыть в новой вкладке» тоже работает */
document.addEventListener('click', e => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest && e.target.closest('a[href]');
  if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
  const href = a.getAttribute('href');
  let path = null;
  if (HASH_MODE && href.startsWith('#!')) path = href.slice(2);
  else if (!HASH_MODE && href.startsWith('/')) path = href.slice(BASE.length) || '/';
  if (path == null) return;
  e.preventDefault();
  if (a.dataset.back) { Router.backTo(path); return; }
  Router.go(path);
});
Object.assign(TN, { Router, link });

/* ── 05-ui.js ── */
/* 05-ui.js — компоненты дизайн-системы. Разметка и классы перенесены из design-system/components/<Имя>/preview.html. */
const UI = {};

/* ── Шапка (AppHeader) и нижняя панель ─────────────────── */
UI.header = function (active) {
  const n = openTaskCount();
  // label: строка или [полная, краткая] — краткая показывается на средних ширинах (см. app.css, «Шапка на средних ширинах»)
  const lbl = l => Array.isArray(l) ? '<span class="tn-nav__full">' + l[0] + '</span><span class="tn-nav__short">' + l[1] + '</span>' : l;
  const item = (id, path, ic, label, extra, cls) => '<a class="tn-nav__item' + (cls ? ' ' + cls : '') + '" href="' + link(path) + '"' + (active === id || (id === 'arsenal' && (active === 'frames' || active === 'weapons')) ? ' aria-current="page"' : '') + '>' + icon(ic, 'tn-icon--sm') + lbl(label) + (extra || '') + '</a>';
  return '<a class="tn-sr-only tn-skip" href="#main" data-act="skip">Перейти к содержанию</a>' +
    '<header class="tn-header">' +
    '<a class="tn-brand" href="' + link('/') + '">' + icon('orokin', 'tn-icon--lg') + '<span class="tn-brand__text">Навигатор Тенно</span></a>' +
    '<nav class="tn-nav" aria-label="Основные разделы">' +
    item('map', '/', 'map', ['Карта и маршрут', 'Маршрут']) +
    item('frames', '/warframes', 'boost', 'Варфреймы', '', 'tn-nav__item--wide') +
    item('weapons', '/weapons', 'target', 'Оружие', '', 'tn-nav__item--wide') +
    item('arsenal', active === 'weapons' ? '/weapons' : '/warframes', 'boost', 'Арсенал', '', 'tn-nav__item--narrow') +
    '<button class="tn-nav__item" id="ref-menu-btn" aria-expanded="false" aria-controls="ref-menu" aria-haspopup="true" data-act="ref-menu"' + (active === 'ref' ? ' aria-current="page"' : '') + '>' + icon('book', 'tn-icon--sm') + 'Справочник' + icon('chevron-down', 'tn-icon--sm') + '</button>' +
    item('endgame', '/endgame', 'endgame', 'Поздняя игра') +
    item('tasks', '/tasks', 'tasks', ['Мои задачи', 'Задачи'], n ? ' <span class="tn-count" aria-label="' + pl(n, ['активная задача', 'активные задачи', 'активных задач']) + '">' + n + '</span>' : '') +
    '</nav>' +
    '<div class="tn-header__end"><button class="tn-header__search" data-act="open-search" aria-label="Поиск по сайту и Warframe Wiki" aria-keyshortcuts="/">' + icon('search', 'tn-icon--sm') + '<span class="tn-hide-medium">Поиск по сайту и Wiki</span><kbd class="tn-kbd">/</kbd></button>' +
    '<button class="tn-btn tn-btn--ghost tn-btn--icon" data-act="open-settings" aria-label="Настройки: защита от спойлеров, движение">' + icon('settings') + '</button></div>' +
    '</header>';
};
UI.refMenu = function () {
  return '<div class="tn-menu" id="ref-menu" role="menu" aria-labelledby="ref-menu-btn" hidden>' +
    D.groups.map(g => '<a class="tn-menu__item" href="' + link(g.path) + '" role="menuitem">' + icon(g.icon) + '<span>' + g.title + '<small>' + esc({ boost: 'Урон, выживаемость, энергия, ранг мастерства', mods: 'Категории, получение, улучшение', syndicates: 'Репутация, ранги, магазины', loot: 'Предметы, ресурсы, источники' }[g.id]) + '</small></span></a>').join('') +
    '</div>';
};
UI.tabbar = function (active) {
  const n = openTaskCount();
  const it = (id, path, ic, label) => '<a class="tn-tabbar__item" href="' + link(path) + '"' + (active === id ? ' aria-current="page"' : '') + '>' + icon(ic) + label + (id === 'tasks' && n ? '<span class="tn-sr-only"> (' + pl(n, ['активная', 'активные', 'активных']) + ')</span>' : '') + '</a>';
  return '<nav class="tn-tabbar" aria-label="Основные разделы">' + it('map', '/', 'route', 'Маршрут') + it(active === 'weapons' ? 'weapons' : 'frames', active === 'weapons' ? '/weapons' : '/warframes', 'boost', 'Арсенал') + it('ref', '/reference', 'book', 'Справочник') + it('endgame', '/endgame', 'endgame', 'Поздняя игра') + it('tasks', '/tasks', 'tasks', 'Задачи') + '</nav>';
};

/* ── Заголовки и навигация по странице ─────────────────── */
UI.crumbs = function (items) {
  return '<nav class="tn-breadcrumbs" aria-label="Путь"><ol>' + items.map((it, i) => i === items.length - 1 ? '<li><span aria-current="page">' + it.html + '</span></li>' : '<li><a href="' + link(it.path) + '">' + it.html + '</a></li>').join('') + '</ol></nav>';
};
/** PageTitle: { overline, title (html), lead (html), actions, meta, media } */
UI.pageTitle = function (o) {
  if (o.media) {
    return '<header class="tn-pagetitle tn-pagetitle--media">' + o.media +
      (o.overline ? '<p class="tn-text-overline tn-pt-col">' + o.overline + '</p>' : '') +
      '<h1 class="tn-pt-col" tabindex="-1" id="page-h1">' + o.title + '</h1>' +
      (o.markers ? '<div class="tn-markers tn-pt-col">' + o.markers + '</div>' : '') +
      (o.lead ? '<p class="tn-pagetitle__lead tn-pt-col">' + o.lead + '</p>' : '') +
      (o.meta ? '<div class="tn-cluster tn-pt-col">' + o.meta + '</div>' : '') +
      (o.actions ? '<div class="tn-pagetitle__actions tn-pt-actions">' + o.actions + '</div>' : '') + '</header>';
  }
  return '<header class="tn-pagetitle">' + (o.overline ? '<p class="tn-pagetitle__overline tn-text-overline">' + o.overline + '</p>' : '') +
    '<h1 tabindex="-1" id="page-h1">' + o.title + '</h1>' + (o.lead ? '<p class="tn-pagetitle__lead">' + o.lead + '</p>' : '') +
    (o.actions ? '<div class="tn-pagetitle__actions">' + o.actions + '</div>' : '') + (o.meta ? '<div class="tn-pagetitle__meta tn-cluster">' + o.meta + '</div>' : '') + '</header>';
};
UI.orb = function (orbName, size, ring) {
  return '<div class="tn-planet__body tn-orbbox" style="--_size:' + size + 'px;width:' + size + 'px;height:' + size + 'px">' + (orbName ? '<span class="tn-orb tn-orb--' + orbName + '"></span>' : '<span class="tn-orb tn-orb--hidden"></span>') + (ring ? '<span class="tn-planet__ring tn-ring--' + ring + '"></span>' : '') + '</div>';
};
/** Оглавление; items: [{id, title}] */
UI.toc = function (items) {
  return '<nav class="tn-toc tn-toc--wide" aria-label="Оглавление"><p class="tn-toc__title tn-text-overline">На этой странице</p><ol>' + items.map(i => '<li><a href="#' + i.id + '" data-toc="' + i.id + '">' + i.title + '</a></li>').join('') + '</ol></nav>' +
    '<nav class="tn-toc tn-toc--compact" aria-label="Оглавление"><details><summary><span>На странице: <span data-toc-current>' + (items[0] ? items[0].title : '') + '</span></span>' + icon('chevron-down') + '</summary><ol>' + items.map(i => '<li><a href="#' + i.id + '" data-toc="' + i.id + '">' + i.title + '</a></li>').join('') + '</ol></details></nav>';
};

/* ── Сообщения ─────────────────────────────────────────── */
const CALLOUT_ICON = { info: 'info', gold: 'star', success: 'check-circle', warning: 'warning', danger: 'save-error' };
UI.callout = function (tone, title, body, actions, opts) {
  opts = opts || {};
  return '<div class="tn-callout" data-tone="' + tone + '"' + (opts.role ? ' role="' + opts.role + '"' : '') + (opts.id ? ' id="' + opts.id + '"' : '') + '>' + icon(opts.icon || CALLOUT_ICON[tone]) + '<div><p class="tn-callout__title">' + title + '</p>' + (body ? '<p>' + body + '</p>' : '') +
    (actions ? '<div class="tn-callout__actions">' + actions + '</div>' : '') + '</div></div>';
};

/* ── Метки (Markers) ───────────────────────────────────── */
UI.rarity = function (r) {
  const x = RARITY[r]; if (!x) return '';
  return '<span class="tn-rarity" data-rarity="' + r + '"><span class="tn-rarity__pips">' + '<i></i>'.repeat(x[1]) + '</span>' + x[0] + '</span>';
};
UI.reco = text => '<span class="tn-reco">' + icon('star') + (text || 'Рекомендуем') + '</span>';
UI.ready = function (state, text) {
  const ic = { ready: 'check-circle', rank: 'arrow-up', locked: 'lock', unknown: 'help' }[state];
  return '<span class="tn-ready" data-state="' + state + '">' + icon(ic) + text + '</span>';
};
UI.status = (progress, text) => '<span class="tn-status" data-progress="' + progress + '">' + icon(progress === 'done' ? 'check-circle' : PROGRESS_ICON[progress]) + (text || PROGRESS_WORD[progress]) + '</span>';
UI.lang = l => '<span class="tn-lang" data-lang="' + l + '">' + l.toUpperCase() + '</span>';
UI.tag = (text, ic) => '<span class="tn-tag">' + (ic ? icon(ic) : '') + text + '</span>';
UI.save = function (where) {
  const st = Store.status;
  const map = {
    saved: ['saved', 'save', Store.doc.updatedAt ? 'Сохранено в этом браузере' : 'Сохраняется в этом браузере'],
    error: ['error', 'save-error', 'Не удалось сохранить'],
    unavailable: ['unavailable', 'warning', 'Сохранение недоступно: изменения действуют до закрытия вкладки'],
    'unknown-format': ['error', 'save-error', 'Сохранение остановлено: данные в неизвестном формате']
  }[st];
  return '<button class="tn-save tn-save--btn" data-state="' + map[0] + '" data-act="save-info"' + (st === 'error' ? ' role="alert"' : ' role="status"') + ' aria-label="' + map[2] + '. Подробнее о хранении">' + icon(map[1]) + map[2] + (where === 'map' && st === 'saved' && Store.doc.updatedAt ? '' : '') + '</button>';
};

/* ── Ссылки ────────────────────────────────────────────── */
UI.ext = function (href, text, opts) {
  opts = opts || {};
  return '<a class="tn-link' + (opts.quiet ? ' tn-link--quiet' : '') + '" href="' + attr(href) + '" target="_blank" rel="noopener"' + (opts.lang ? ' hreflang="' + opts.lang + '"' : '') + '>' + text +
    '<svg class="tn-link__ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><use href="#tn-i-external"/></svg><span class="tn-sr-only"> (откроется в новой вкладке)</span></a>';
};
UI.a = (path, html, cls, extra) => '<a class="' + (cls || 'tn-link') + '" href="' + link(path) + '"' + (extra || '') + '>' + html + '</a>';
/** Ссылка на сущность по ref с учётом спойлеров */
UI.ref = function (ref, opts) {
  opts = opts || {};
  const e = entity(ref); if (!e) return '';
  const nm = opts.text ? opts.text : entName(e);
  return '<a class="' + (opts.cls || 'tn-link') + '" href="' + link(e.path + (opts.query || '')) + '">' + nm + '</a>';
};
UI.wikiLink = function (o, text) {
  if (!o) return '';
  if (o.wiki) return UI.ext(wikiRu(o.wiki), text || 'Статья на Warframe Wiki', { lang: 'ru' }) + ' ' + UI.lang('ru');
  if (o.wikiEn) return UI.ext(wikiEn(o.wikiEn), text || 'Статья на Warframe Wiki', { lang: 'en' }) + ' ' + UI.lang('en');
  return '';
};

/* ── Источник и дата проверки (SourceMeta) ─────────────── */
UI.sourceMeta = function (srcKey, extra) {
  const s = srcInfo(srcKey);
  if (!s) return '';
  if (s.guide) {
    return '<p class="tn-sourcemeta">' + icon('book') + 'Источник: ' + UI.a('/article/' + (s.section ? (IDX.article.get('s' + String(s.section).padStart(2, '0')) || {}).slug || 'how-to-use' : 'how-to-use'), 'гайд v3' + (s.section ? ', раздел ' + s.section : '')) +
      ' · сведения автора гайда на ' + fdate(s.checked) + '; сайтом не перепроверено' + (extra ? ' · ' + extra : '') + '</p>';
  }
  const stale = (Date.now() - new Date(s.checked + 'T12:00:00')) / 864e5 > 90;
  return '<p class="tn-sourcemeta">' + icon('book') + 'Источник: ' + UI.ext(s.url, esc(s.title.replace(/^Warframe Wiki(?: \(рус\.\))? — /, 'Warframe Wiki, «') + (s.title.includes(' — ') ? '»' : ''))) + ' ' + UI.lang(s.lang || 'en') +
    ' · Проверено ' + fdate(s.checked) + (stale ? ' <span class="tn-sourcemeta__stale">' + icon('warning', 'tn-icon--sm') + 'Проверено более 90 дней назад</span>' : '') + (extra ? ' · ' + extra : '') + '</p>';
};

/* ── Условия доступа (Dependencies + AccessConditions) ── */
const DEP_ICON = { yes: 'check-circle', no: 'lock', unknown: 'help' };
const DEP_WORD = { yes: 'выполнено', no: 'не выполнено', unknown: 'не указано' };
/** Строка условия; ev — результат evalCond; editable — показать «указать» */
UI.depItem = function (ev, opts) {
  opts = opts || {};
  let small = [];
  if (ev.current) small.push(esc(ev.current));
  if (ev.note) small.push(mask(ev.note));
  if (ev.state === 'unknown' && ev.key && opts.editable !== false) small.push('Вы не указали — <button class="tn-linkbtn" data-act="set-fact" data-key="' + attr(ev.key) + '" data-min="' + (ev.cond.min != null ? ev.cond.min : '') + '">указать</button>');
  else if (ev.key && opts.editable !== false && ev.state !== 'unknown') small.push('<button class="tn-linkbtn" data-act="set-fact" data-key="' + attr(ev.key) + '" data-min="' + (ev.cond.min != null ? ev.cond.min : '') + '">изменить</button>');
  if (opts.link) small.push(opts.link);
  const lbl = ev.def && ev.cond.f && ev.cond.f.startsWith('quest:') && !Spoil.hiddenStage(ev.def.stage || 0, ev.def.spoiler)
    ? 'Квест ' + UI.a('/quest/' + ev.cond.f, '«' + esc(ev.def.name) + '»') : mask(ev.label);
  return '<li data-met="' + ev.state + '">' + icon(DEP_ICON[ev.state]) + '<span>' + lbl + (small.length ? '<small>' + small.join(' · ') + '</small>' : '') + '</span><span class="tn-deps__state">' + DEP_WORD[ev.state] + '</span></li>';
};
UI.deps = function (evs, opts) {
  opts = opts || {};
  return '<ul class="tn-deps' + (opts.branch ? ' tn-deps--branch' : '') + '">' + evs.map(e => UI.depItem(e, opts)).join('') + '</ul>';
};
/** Итог по условиям для Ready */
UI.condSummary = function (evs) {
  if (!evs.length) return UI.ready('ready', 'Игровых условий нет');
  const no = evs.filter(e => e.state === 'no').length, unk = evs.filter(e => e.state === 'unknown').length;
  if (!no && !unk) return UI.ready('ready', 'Доступно вам');
  if (no) return UI.ready('rank', no + ' из ' + evs.length + ' не выполнено');
  return UI.ready('unknown', 'Прогресс не указан: ' + unk + ' из ' + evs.length);
};
/** AccessConditions: { id, title, conds, add: { groupRef, groupTitle, stage, extraSpec } } */
UI.access = function (o) {
  const evs = (o.conds || []).map(evalCond);
  const missing = evs.filter(e => e.state !== 'yes');
  const unknownOnly = missing.length && missing.every(e => e.state === 'unknown');
  return '<section class="tn-card" aria-labelledby="' + o.id + '-t" id="' + o.id + '">' +
    '<div class="tn-section-title"><h3 class="' + (o.titleCls || 'tn-text-overline') + '" id="' + o.id + '-t">' + (o.title || 'Условия доступа') + '</h3>' + UI.condSummary(evs) + '</div>' +
    (evs.length ? UI.deps(evs) : '<p class="tn-muted">Отдельных игровых условий нет.</p>') +
    (o.note ? '<p class="tn-faint tn-small">' + o.note + '</p>' : '') +
    (missing.length && o.add ? '<div class="tn-card__foot"><button class="tn-btn tn-btn--sm" data-act="add-missing" data-group="' + attr(o.add.groupRef) + '" data-key="' + o.id + '-add">' + icon('plus') + 'Добавить недостающее в задачи</button>' +
      (unknownOnly ? '<span class="tn-faint tn-small">Условия не указаны — отметьте выполненное, чтобы не создавать лишних задач.</span>' : '') + '</div>' : '') +
    '</section>';
};

/* ── Прогресс этапа (StageProgress) ────────────────────── */
UI.steps = function (done, total, current) {
  let h = '';
  for (let i = 0; i < total; i++) h += '<i' + (i < done ? ' class="done"' : (i === done && current !== false ? ' class="current"' : '')) + '></i>';
  return '<div class="tn-stageprog__steps" role="img" aria-label="Выполнено ' + done + ' из ' + total + ' шагов">' + h + '</div>';
};
UI.stageProg = function (o) {
  return '<div class="tn-stageprog">' + (o.head ? '<div class="tn-stageprog__head">' + o.head + '</div>' : '') + UI.steps(o.done, o.total) +
    (o.note ? '<span class="tn-faint tn-small">' + o.note + '</span>' : '') + '</div>';
};

/* ── Кнопки задач ──────────────────────────────────────── */
UI.taskBtn = function (ref, act, label, opts) {
  opts = opts || {};
  const inTasks = !!findTask(ref);
  if (inTasks) return '<button class="tn-btn' + (opts.sm ? ' tn-btn--sm' : '') + (opts.block ? ' tn-btn--block' : '') + '" aria-pressed="true" data-act="task-remove-ask" data-ref="' + attr(ref) + '" data-key="tb-' + attr(ref) + '">' + icon('check') + 'В задачах</button>';
  return '<button class="tn-btn ' + (opts.primary === false ? '' : 'tn-btn--primary') + (opts.sm ? ' tn-btn--sm' : '') + (opts.block ? ' tn-btn--block' : '') + '" data-act="' + act + '" data-ref="' + attr(ref) + '" data-key="tb-' + attr(ref) + '"' + (opts.data || '') + '>' + icon('plus') + (label || 'Добавить в задачи') + '</button>';
};
UI.doneMark = function (key, opts) {
  opts = opts || {};
  const on = isDone(key);
  const dis = Store.status === 'unknown-format';
  return '<button class="tn-donemark" aria-pressed="' + on + '" data-act="toggle-done" data-done="' + attr(key) + '" data-key="dm-' + attr(key) + '"' + (dis ? ' aria-disabled="true"' : '') + '><span class="tn-donemark__box">' + icon('check') + '</span><span class="tn-donemark__text">' + (dis ? 'Сохранение недоступно' : on ? 'Выполнено' : (opts.label || 'Отметить выполненным')) + '</span></button>';
};

/* ── Цель (GoalCard) ───────────────────────────────────── */
UI.goalCard = function (g, opts) {
  opts = opts || {};
  const gi = goalInfo(g);
  const st = IDX.stage.get(String(g.stage));
  const scope = 'goal:' + g.id;
  const over = opts.overline || ((g.kind === 'main' ? 'Цель' : 'Дополнительно') + ' · этап ' + g.stage);
  const total = gi.steps.length;
  const markers = [];
  if (gi.done) markers.push(UI.status('done'));
  else if (gi.conds.length) {
    if (gi.unmet) markers.push(UI.ready('locked', 'Есть невыполненные условия'));
    else if (gi.unknown) markers.push(UI.ready('unknown', 'Условия не указаны'));
    else markers.push(UI.ready('ready', 'Доступно вам'));
  }
  if (g.kind === 'side') markers.push('<span class="tn-tag">' + icon('route') + 'Дополнительно</span>');
  const reqId = 'req-' + g.id;
  return '<article class="tn-card' + (opts.current ? ' is-current' : '') + ' tn-goal" id="goal-' + g.id + '" data-key="goal-' + g.id + '">' +
    '<div class="tn-stack tn-stack--sm" style="gap:2px"><p class="tn-text-overline">' + over + '</p><h3 class="tn-card__title tn-card__title--display">' + mask(g.title, scope) + '</h3></div>' +
    '<p class="tn-goal__why">Зачем: ' + mask(g.why.replace(/^./, c => c.toLowerCase()), scope) + '</p>' +
    (total ? '<div class="tn-stageprog">' + UI.steps(gi.stepsDone, total, !gi.done) + '<span class="tn-faint tn-small">' + gi.stepsDone + ' из ' + total + ' ' + plural(total, ['шага', 'шагов', 'шагов']) + '</span></div>' : '') +
    (markers.length ? '<div class="tn-markers">' + markers.join('') + '</div>' : '') +
    (opts.compact ? '' :
      '<div class="tn-goal__details" id="' + reqId + '"' + (opts.open ? '' : ' hidden') + '>' + UI.goalDetails(g, gi, scope) + '</div>') +
    '<div class="tn-card__foot">' + UI.taskBtn('goal:' + g.id, 'add-goal', null, { primary: !gi.done }) +
    (opts.compact ? '' : '<button class="tn-btn tn-btn--ghost" aria-expanded="' + (!!opts.open) + '" aria-controls="' + reqId + '" data-act="toggle-details" data-key="exp-' + g.id + '">' + (gi.conds.length ? 'Требования и шаги' : 'Шаги') + icon('chevron-down', 'tn-icon--sm') + '</button>') +
    (opts.doneMark !== false ? UI.doneMark('goal:' + g.id) : '') + '</div></article>';
};
UI.goalDetails = function (g, gi, scope) {
  let h = '';
  if (gi.conds.length) h += '<div class="tn-stack tn-stack--sm"><p class="tn-text-overline">Условия игры</p>' + UI.deps(gi.conds) +
    (gi.conds.some(c => c.state !== 'yes') ? '<button class="tn-btn tn-btn--sm" data-act="add-missing-goal" data-ref="' + attr(g.id) + '">' + icon('plus') + 'Добавить недостающее в задачи</button>' : '') + '</div>';
  if (g.reco && g.reco.length) h += '<div class="tn-stack tn-stack--sm"><p class="tn-text-overline">Рекомендуемая подготовка</p><ul class="tn-deps tn-deps--branch">' +
    g.reco.map(r => '<li data-met="unknown">' + icon('star') + '<span>' + mask(r.label, scope) + (r.note ? '<small>' + mask(r.note, scope) + '</small>' : '') + '</span><span class="tn-deps__state">совет</span></li>').join('') + '</ul></div>';
  if (gi.steps.length) h += '<fieldset class="tn-filter"><legend class="tn-text-overline">Шаги</legend>' + gi.steps.map(s => {
    const k = 'step:' + g.id + ':' + s.id;
    return '<label class="tn-check" data-key="' + attr(k) + '"><input type="checkbox" data-act="toggle-step" data-done="' + attr(k) + '"' + (isDone(k) ? ' checked' : '') + '><span>' + mask(s.text, scope) + (s.link ? ' · ' + UI.ref(s.link, { text: 'открыть' }) : '') + '</span></label>';
  }).join('') + '</fieldset>';
  h += '<p class="tn-goal__result"><b>Результат:</b> ' + mask(g.result, scope) + (g.resultSpoiler ? ' ' + (Spoil.hiddenStage(g.resultSpoiler.stage, true) && !Spoil.revealed.has(scope) ? spoilerInline(g.resultSpoiler.stage) : esc(g.resultSpoiler.text)) : '') + '</p>';
  if (g.next) {
    const e = g.next.startsWith('stage:') ? entity(g.next) : entity('goal:' + g.next);
    if (e) h += '<p class="tn-goal__next">' + icon('arrow-right', 'tn-icon--sm') + 'Дальше: ' + UI.a(e.path, entName(e)) + '</p>';
  }
  if (g.links && g.links.length) h += '<p class="tn-cluster tn-small">' + icon('book', 'tn-icon--sm') + g.links.map(l => UI.ref(l)).filter(Boolean).join(' · ') + '</p>';
  return h;
};

/* ── Карточки предметов ────────────────────────────────── */
const TYPE_ICON = { warframe: 'build', weapon: 'build', resource: 'resource', currency: 'currency', arcane: 'reward', misc: 'reward', mod: 'mod' };
UI.itemCard = function (it, opts) {
  opts = opts || {};
  const e = entity('item:' + it.id);
  const type = ITEMTYPE[it.type] || 'Предмет';
  const place = opts.place || (it.where && it.where.length ? it.where.map(w => w.loc ? (IDX.planet.get(w.loc) || {}).name : '').filter(Boolean).slice(0, 3).join(', ') : (it.slot ? SLOTNAME[it.slot] : ''));
  const marks = [UI.rarity(it.rarity), it.reco ? UI.reco() : '', opts.ready || ''].filter(Boolean).slice(0, 3).join('');
  return '<article class="tn-card tn-card--interactive tn-item"><div class="tn-thumb">' + icon(TYPE_ICON[it.type] || 'reward', 'tn-icon--lg') + '</div><div class="tn-item__main"><h3 class="tn-item__name"><a class="tn-card__link" href="' + link(e.path) + '">' + entName(e) + '</a></h3>' +
    '<p class="tn-item__type">' + type + (place ? ' · ' + maskPlainHtml(place) : '') + '</p>' + (marks ? '<div class="tn-markers">' + marks + '</div>' : '') + '</div></article>';
};
function maskPlainHtml(s) { return mask(s); }
UI.modCard = function (m) {
  const e = entity('mod:' + m.id);
  const fam = { galvanized: ' tn-mod--galvanized', archon: ' tn-mod--archon', riven: ' tn-mod--riven' }[m.family] || '';
  const drain = m.card ? m.drain0 + '–' + (m.drain0 + m.maxRank) : '—';
  return '<article class="tn-card tn-card--interactive tn-mod' + fam + '"><div class="tn-mod__top"><span class="tn-mod__polarity" aria-label="Полярность: ' + esc(m.polarity || 'нет данных') + '">' + icon('polarity', 'tn-icon--sm') + '</span><span class="tn-mod__kind">' + FAMILY[m.family] + '</span><span class="tn-mod__drain" aria-label="Вместимость ' + drain + '">' + icon('boost', 'tn-icon--sm') + drain + '</span></div>' +
    '<h3 class="tn-mod__name"><a class="tn-card__link" href="' + link(e.path) + '">' + entName(e) + '</a></h3><p class="tn-mod__effect">' + (m.effect ? mask(m.effect) + (m.card ? ' на максимальном ранге' : '') : 'Нет данных об эффекте') + '</p>' +
    (m.card ? UI.modRanks(ownedRank(m.id), m.maxRank) : '') +
    '<div class="tn-markers">' + [UI.rarity(m.rarity), ownedMarker(m.id)].filter(Boolean).join('') + '</div></article>';
};
UI.modRanks = function (rank, max) {
  if (rank == null) return '';
  let h = ''; for (let i = 0; i < max; i++) h += '<i' + (i < rank ? ' class="on"' : '') + '></i>';
  return '<div class="tn-mod__ranks" aria-label="Ранг ' + rank + ' из ' + max + '">' + h + '</div>';
};
function ownedRank(id) { const r = Store.doc.facts['rank:mod:' + id]; return typeof r === 'number' ? r : null; }
function ownedState(id) { const v = Store.doc.facts['owned:' + id]; return v === true ? 'yes' : v === false ? 'no' : 'unknown'; }
function ownedMarker(id) {
  const s = ownedState(id);
  if (s === 'yes') return UI.ready('ready', 'Есть у вас');
  if (s === 'no') return UI.ready('locked', 'Нет у вас');
  return '';
}

/* ── Цепочка получения (SourceRow + путь) ───────────────── */
const STEP_WORD = { source: 'Источник', access: 'Доступ', currency: 'Валюта или ресурсы', resources: 'Ресурсы', obtain: 'Получение', craft: 'Изготовление', install: 'Установка и применение' };
const WAY_ICON = { drop: 'mission', vendor: 'vendor', craft: 'build', quest: 'quest', reward: 'reward', trade: 'currency' };
UI.sourceRow = function (w, opts) {
  opts = opts || {};
  const where = w.steps.filter(s => s.k === 'access' || s.k === 'source').map(s => mask(s.text)).slice(0, 2).join(' · ');
  const chance = w.kind === 'vendor' ? 'Покупка<small>Шанс не применим</small>' : w.kind === 'quest' ? 'Награда<small>Шанс не применим</small>' : w.kind === 'craft' ? 'Изготовление<small>' + (w.steps.some(s => s.table) ? 'Шансы частей — ниже' : 'Шанс не применим') + '</small>' : 'Нет данных<small>Шанс не указан — см. Wiki</small>';
  return '<div class="tn-source" role="listitem"' + (opts.selected ? ' aria-current="true"' : '') + ' data-key="way-' + w.id + '" id="way-' + w.id + '"><span class="tn-card__icon">' + icon(WAY_ICON[w.kind] || 'reward') + '</span><div><p class="tn-source__name"><button class="tn-link tn-link--quiet tn-linkbtn" data-act="select-way" data-way="' + w.id + '">' + mask(w.title) + '</button>' + (w.recommended ? ' ' + UI.reco('Основной путь') : '') + '</p><p class="tn-source__where">' + where + '</p></div>' +
    '<p class="tn-source__chance' + (w.kind === 'drop' ? ' tn-faint' : '') + '">' + chance + '</p>' + (opts.selected ? '<span class="tn-tag">Выбрано</span>' : '<button class="tn-btn tn-btn--ghost tn-btn--icon" aria-label="Выбрать способ: ' + attr(maskPlain(w.title)) + '" data-act="select-way" data-way="' + w.id + '">' + icon('chevron-right') + '</button>') + '</div>';
};
/** Подробная цепочка способа — RouteList как путь (ScreenItem → «Ваш путь») */
UI.chain = function (w, opts) {
  opts = opts || {};
  return '<ol class="tn-route tn-chain" aria-label="Цепочка получения: ' + attr(maskPlain(w.title)) + '">' + w.steps.map((s, i) => {
    const evs = (s.req || []).map(evalCond);
    const st = evs.length ? (evs.every(e => e.state === 'yes') ? 'done' : evs.some(e => e.state === 'no') ? 'locked' : 'available') : 'available';
    const extra = [];
    if (evs.length) extra.push(UI.deps(evs));
    if (s.items) extra.push('<p class="tn-cluster tn-small">' + s.items.map(id => UI.ref('item:' + id, { cls: 'tn-link tn-link--quiet' })).join(' · ') + '</p>');
    if (s.table) extra.push(UI.table({ caption: s.table.caption, head: ['Чертёж', 'Шанс'], num: [false, true], rows: s.table.rows.map(r => [esc(r[0]), fmt(r[1]) + ' %']) }) + UI.sourceMeta(s.table.src));
    if (s.link) { const e = entity(s.link); if (e) extra.push('<p>' + UI.a(e.path + (opts.fromQuery || ''), 'Открыть: ' + entName(e)) + '</p>'); }
    if (s.loc) { const e = entity('planet:' + s.loc); if (e) extra.push('<p class="tn-small">' + icon('planet', 'tn-icon--sm') + ' ' + UI.a(e.path, entName(e), 'tn-link tn-link--quiet') + '</p>'); }
    if (s.wikiCheck && opts.obj) extra.push('<p class="tn-small">' + UI.wikiLink(opts.obj, 'Проверить источник в Wiki') + '</p>');
    return '<li class="tn-route__stage" data-progress="' + st + '"><span class="tn-node tn-node--static" data-progress="' + st + '"><span class="tn-node__dot">' + (st === 'done' ? icon('check') : st === 'locked' ? icon('lock') : (i + 1)) + '</span></span><div class="tn-stack tn-stack--sm" style="gap:4px"><p class="tn-text-overline">' + STEP_WORD[s.k] + '</p><p>' + mask(s.text) + '</p>' + extra.join('') + '</div></li>';
  }).join('') + '</ol>';
};

/* ── Таблица (DataTable) ──────────────────────────────── */
/** { caption, head: [html], rows: [[html]], num: [bool], sortable, stack, selected: index, id } */
UI.table = function (o) {
  const sortable = o.sortable && o.rows.length > 3;
  const sort = o.sort || {};
  const th = o.head.map((h, i) => {
    const cls = cx(i === 0 && 'tn-table__first', o.num && o.num[i] && 'is-num');
    if (!sortable) return '<th scope="col"' + (cls ? ' class="' + cls + '"' : '') + '>' + h + '</th>';
    const dir = sort.col === i ? (sort.dir === 'desc' ? 'descending' : 'ascending') : 'none';
    return '<th scope="col"' + (cls ? ' class="' + cls + '"' : '') + ' aria-sort="' + dir + '"><button data-act="sort-table" data-table="' + o.id + '" data-col="' + i + '">' + h + icon('sort', 'tn-icon--sm') + '</button></th>';
  }).join('');
  let rows = o.rows.map((r, i) => ({ r, i }));
  if (sortable && sort.col != null) {
    const key = x => { const t = String(x.r[sort.col]).replace(/<[^>]+>/g, '').trim(); const n = parseFloat(t.replace(/[\s ]/g, '').replace(',', '.')); return isNaN(n) ? t.toLowerCase() : n; };
    rows.sort((a, b) => { const x = key(a), y = key(b); const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ru'); return sort.dir === 'desc' ? -c : c; });
  }
  const body = rows.map(({ r, i }) => '<tr' + (o.selected === i ? ' aria-selected="true"' : '') + '>' + r.map((c, j) => {
    const nd = c === '' || c == null;
    return '<td' + (o.stack ? ' data-label="' + attr(String(o.head[j]).replace(/<[^>]+>/g, '')) + '"' : '') + (cx(o.num && o.num[j] && 'is-num', nd && 'is-nodata') ? ' class="' + cx(o.num && o.num[j] && 'is-num', nd && 'is-nodata') + '"' : '') + '>' + (nd ? 'нет данных' : c) + '</td>';
  }).join('') + '</tr>').join('');
  return '<div class="tn-tablewrap"' + (o.id ? ' id="tw-' + o.id + '"' : '') + '><table class="tn-table' + (o.stack ? ' tn-table--stack' : '') + (o.compact ? ' tn-table--compact' : '') + '">' + (o.caption ? '<caption>' + o.caption + '</caption>' : '') + '<thead><tr>' + th + '</tr></thead><tbody>' + body + '</tbody></table></div>';
};

/* ── Спойлер ──────────────────────────────────────────── */
UI.spoiler = function (scope, hint, title) {
  return '<div class="tn-spoiler" data-state="hidden" data-key="sp-' + attr(scope) + '">' + icon('eye-off') + '<div><p class="tn-spoiler__title">' + (title || 'Скрыто защитой от спойлеров') + '</p><p class="tn-spoiler__hint">' + hint + '</p></div><button class="tn-btn tn-btn--sm" data-act="reveal" data-scope="' + attr(scope) + '">' + icon('eye', 'tn-icon--sm') + 'Показать</button></div>';
};
UI.spoilerShown = function (scope, what) {
  return '<div class="tn-spoiler" data-state="revealed">' + icon('eye') + '<div><p class="tn-spoiler__title">Показано: ' + what + '</p><p class="tn-spoiler__hint">Вы раскрыли этот блок. Остальные поздние сведения скрыты.</p></div><button class="tn-btn tn-btn--ghost tn-btn--sm" data-act="hide-again" data-scope="' + attr(scope) + '">Скрыть снова</button></div>';
};

/* ── Пустые состояния, ошибки, загрузка ────────────────── */
UI.empty = (ic, title, text, actions) => '<div class="tn-empty"><span class="tn-empty__icon">' + icon(ic, 'tn-icon--lg') + '</span><p class="tn-empty__title">' + title + '</p>' + (text ? '<p>' + text + '</p>' : '') + (actions ? '<div class="tn-empty__actions">' + actions + '</div>' : '') + '</div>';
UI.error = (ic, title, text, actions) => '<div class="tn-error" role="alert"><span class="tn-error__icon">' + icon(ic, 'tn-icon--lg') + '</span><p class="tn-error__title">' + title + '</p>' + (text ? '<p>' + text + '</p>' : '') + (actions ? '<div class="tn-empty__actions">' + actions + '</div>' : '') + '</div>';
UI.loading = text => '<div class="tn-loading" role="status"><span class="tn-spinner" aria-hidden="true"></span>' + text + '</div>';
UI.switch = (act, on, label, small, extra) => '<button class="tn-switch" role="switch" aria-checked="' + !!on + '" data-act="' + act + '"' + (extra || '') + '><span class="tn-switch__track"></span><span>' + label + (small ? '<small>' + small + '</small>' : '') + '</span></button>';
UI.segmented = (label, opts, act) => '<div class="tn-segmented" role="group" aria-label="' + label + '">' + opts.map(o => '<button aria-pressed="' + !!o.on + '" data-act="' + act + '" data-val="' + o.val + '" data-key="seg-' + act + '-' + o.val + '">' + (o.icon ? icon(o.icon, 'tn-icon--sm') : '') + o.label + '</button>').join('') + '</div>';
UI.props = pairs => '<dl class="tn-props">' + pairs.map(p => '<dt>' + p[0] + '</dt><dd' + (p[2] ? ' class="' + p[2] + '"' : '') + '>' + p[1] + '</dd>').join('') + '</dl>';

/* ── Шкала репутации (StandingMeter) ───────────────────── */
UI.standing = function (synd, opts) {
  opts = opts || {};
  const s = Store.doc.standing[synd.id] || {};
  const ranks = synd.ranks;
  const target = opts.target;
  if (s.rank == null) {
    const lo = ranks ? Math.max(ranks.lo, 0) : 0, hi = ranks ? ranks.hi : 5;
    return '<div class="tn-standing" role="group" aria-label="Ранг ' + esc(maskPlain(synd.name)) + ' не указан"><div class="tn-standing__head"><span class="tn-standing__rank">Ранг не указан</span><button class="tn-linkbtn tn-link" data-act="set-standing" data-synd="' + synd.id + '">Указать</button></div>' +
      '<div class="tn-standing__bar" aria-hidden="true">' + '<i></i>'.repeat(hi - lo + 1) + '</div>' + (opts.note ? '<p class="tn-standing__note">' + opts.note + '</p>' : '') + '</div>';
  }
  const lo = ranks && !ranks.rankOnly ? (s.rank < 0 ? ranks.lo : 0) : 0, hi = ranks ? ranks.hi : 5;
  const n = hi - lo + 1;
  const maxV = ranks && ranks.max ? ranks.max[s.rank] : null;
  const val = s.value;
  let bar = '';
  for (let r = lo; r <= hi; r++) {
    const cls = [];
    if (r < s.rank) cls.push(r < 0 ? 'neg on' : 'on');
    if (r === s.rank) { if (r < 0) cls.push('neg on'); else if (maxV && val != null) cls.push('part'); else cls.push('on'); }
    if (target != null && r === target) cls.push('target');
    const p = r === s.rank && maxV && val != null && r >= 0 ? ' style="--_p:' + Math.max(0, Math.min(100, Math.round(val / maxV * 100))) + '%"' : '';
    bar += '<i' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + p + '></i>';
  }
  let scale = ''; for (let r = lo; r <= hi; r++) scale += '<span>' + (r < 0 ? '−' + (-r) : r) + '</span>';
  const head = (opts.title ? opts.title + ': ' : '') + (s.rank < 0 ? 'ранг −' + (-s.rank) + ' · отрицательная репутация' : 'ранг ' + s.rank) + (target != null && target > s.rank ? ' → нужен ' + target : '');
  const valTxt = val != null ? fmt(val) + (maxV ? ' / ' + fmt(maxV) : '') : 'репутация не указана';
  return '<div class="tn-standing" role="group" aria-label="' + attr(synd.name + ': ' + head + ', ' + valTxt.replace(/ /g, ' ')) + '"><div class="tn-standing__head"><span class="tn-standing__rank"' + (s.rank < 0 ? ' style="color:var(--tn-color-status-danger)"' : '') + '>' + head + '</span><span class="tn-standing__value">' + valTxt + '</span></div>' +
    '<div class="tn-standing__bar" style="--_ranks:' + n + '" aria-hidden="true">' + bar + '</div><div class="tn-standing__scale" style="--_ranks:' + n + '" aria-hidden="true">' + scale + '</div>' +
    (opts.note ? '<p class="tn-standing__note">' + opts.note + '</p>' : '') + '</div>';
};

/* ── Покупка (PurchaseRow) ─────────────────────────────── */
UI.purchase = function (o, v, opts) {
  opts = opts || {};
  const synd = v.syndicate ? IDX.syndicate.get(v.syndicate) : null;
  const target = o.item ? entity((IDX.mod.has(o.item) ? 'mod:' : 'item:') + o.item) : null;
  const name = o.label && !target ? mask(o.label) : (target ? entName(target) : mask(o.label));
  const st = synd ? (Store.doc.standing[synd.id] || {}) : {};
  const rankOk = o.rank == null || (st.rank != null ? st.rank >= o.rank : null);
  const extra = (o.extraReq || []).map(evalCond);
  const extraOk = extra.every(e => e.state === 'yes') ? true : extra.some(e => e.state === 'no') ? false : null;
  const cost = o.cost != null ? o.cost : null;
  const have = synd && st.value != null ? st.value : null;
  const enough = cost != null && have != null ? have >= cost : null;
  let ready;
  if (rankOk === false) ready = UI.ready('rank', 'У вас ранг ' + st.rank + ', нужен ' + o.rank);
  else if (extraOk === false) ready = UI.ready('locked', 'Не выполнено доп. условие');
  else if (rankOk === null && o.rank != null) ready = UI.ready('unknown', 'Ранг не указан');
  else if (enough === false) ready = UI.ready('rank', 'Не хватает ' + fmt(cost - have) + ' ' + (v.currency.startsWith('репутация') ? 'репутации' : ''));
  else if (rankOk && (enough || cost == null || !synd) && extraOk !== false) ready = synd && have == null && cost != null ? UI.ready('unknown', 'Ранг подходит; запас репутации не указан') : UI.ready('ready', 'Доступно вам');
  else ready = UI.ready('unknown', 'Не указано');
  const dataReady = rankOk === false || enough === false ? 'rank' : rankOk && extraOk !== false ? 'ready' : 'unknown';
  const ref = 'buy:' + v.id + ':' + (o.item || slug(o.label));
  const tags = [];
  if (o.rank != null) tags.push(UI.tag('Ранг ' + o.rank, 'rank'));
  if (o.rankNote) tags.push(UI.tag(esc(o.rankNote), 'rank'));
  extra.forEach(e => tags.push(UI.tag(mask(e.label))));
  if (o.limit) tags.push(UI.tag(esc(o.limit)));
  const price = o.costText ? '<p class="tn-purchase__price tn-purchase__price--text">' + esc(o.costText) + '</p>' : cost != null ? '<p class="tn-purchase__price">' + fmt(cost) + ' <small>' + mask(v.currency) + (o.costNote ? ', ' + esc(o.costNote) : '') + '</small></p>' : '<p class="tn-purchase__price">— <small>нет данных</small></p>';
  return '<article class="tn-purchase" data-ready="' + dataReady + '" data-key="p-' + attr(ref) + '" id="p-' + attr(slug(ref)) + '"' + (opts.selected ? ' aria-current="true"' : '') + '>' +
    '<div class="tn-thumb">' + icon(target && target.kind === 'mod' ? 'mod' : 'reward') + '</div>' +
    '<div><h3 class="tn-purchase__name">' + (target ? '<a class="tn-link tn-link--quiet" href="' + link(target.path) + '">' + name + '</a>' : name) + '</h3><p class="tn-purchase__vendor">' + entName(entity('vendor:' + v.id)) + ' · ' + mask(v.where) + '</p></div>' +
    '<div class="tn-purchase__cost"><span class="tn-purchase__label">Стоимость</span>' + price + '</div>' +
    '<div class="tn-purchase__req"><span class="tn-purchase__label">Требуется</span><p class="tn-cluster">' + (tags.join('') || '<span class="tn-faint">не указано</span>') + '</p><p style="margin-top:4px">' + ready + '</p></div>' +
    '<div class="tn-purchase__actions">' + UI.taskBtn(ref, 'add-purchase', 'В задачи', { sm: true, data: ' data-vendor="' + v.id + '" data-offer="' + attr(o.item || o.label) + '"' }) + (target ? '<a class="tn-btn tn-btn--ghost tn-btn--sm" href="' + link(target.path) + '">Подробнее</a>' : '') + '</div>' +
    (o.why ? '<p class="tn-purchase__why">' + icon('star') + '<span><b>Почему полезно:</b> ' + mask(o.why) + '</span></p>' : '') +
    '</article>';
};
TN.UI = UI;

/** Отметка «Планета открыта в игре»: Да / Нет / не указано. Открытая планета засчитывает и ведущий к ней переход. */
UI.openMark = function (loc, hiddenName) {
  const v = Store.doc.facts['open:' + loc.id];
  const op = planetOpen(loc);
  const nm = hiddenName ? 'Скрытое место' : loc.name;
  const gates = (loc.access || []).filter(c => c.gate !== false);
  let hint;
  if (v === true) hint = gates.some(c => c.f && c.f.startsWith('junction:')) ? 'Переход к этой планете засчитан автоматически.' : 'Отмечено вами.';
  else if (v === false) hint = 'Отмечено вами: ещё не открыта.';
  else if (op.state === 'yes') hint = 'Следует из отмеченных условий доступа.';
  else if (op.state === 'no') hint = 'Условие доступа отмечено как невыполненное.';
  else hint = gates.length ? 'Не указано — отметьте, если уже бывали здесь.' : 'Открывается переходами Навигации; отметьте, если уже бывали здесь.';
  return '<div class="tn-openmark"><div class="tn-cluster" style="justify-content:space-between"><span class="tn-text-body-strong">Открыта в игре</span>' +
    '<div class="tn-segmented tn-segmented--sm" role="group" aria-label="' + attr(nm) + ': открыта в игре">' +
    [['yes', 'Да', v === true], ['no', 'Нет', v === false], ['unset', '—', v == null]].map(o => '<button aria-pressed="' + o[2] + '" data-act="fact-set" data-fact="open:' + loc.id + '" data-v="' + o[0] + '" data-key="open-' + loc.id + '-' + o[0] + '" aria-label="' + ({ yes: 'открыта', no: 'не открыта', unset: 'не указано' }[o[0]]) + '">' + o[1] + '</button>').join('') +
    '</div></div><p class="tn-faint tn-small" style="margin-top:4px">' + hint + '</p></div>';
};

/* ── 06-overlays.js ── */
/* 06-overlays.js — Dialog, Drawer, Toast, меню «Справочник».
   Диалоги и панели: ловушка фокуса, Esc, возврат фокуса на вызвавший элемент, фон не прокручивается (HANDOFF → «Взаимодействие»). */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const Overlay = {
  stack: [],
  root() { return document.getElementById('tn-overlays'); },
  /** Открыть диалог: { title, body (html), foot (html), role, id, onMount(el), onClose(), initialFocus } */
  dialog(o) {
    const id = o.id || uid('dlg');
    const el = document.createElement('div');
    el.className = 'tn-scrim';
    el.innerHTML = '<div class="tn-dialog" role="' + (o.role || 'dialog') + '" aria-modal="true" aria-labelledby="' + id + '-t"' + (o.body ? ' aria-describedby="' + id + '-d"' : '') + ' id="' + id + '">' +
      '<div class="tn-dialog__head"><h2 class="tn-dialog__title" id="' + id + '-t" tabindex="-1">' + o.title + '</h2><button class="tn-btn tn-btn--ghost tn-btn--icon" data-ov="close" aria-label="' + (o.closeLabel || 'Закрыть') + '">' + icon('close') + '</button></div>' +
      '<div class="tn-dialog__body" id="' + id + '-d">' + (o.body || '') + '</div>' + (o.foot ? '<div class="tn-dialog__foot">' + o.foot + '</div>' : '') + '</div>';
    return this.open(el, o, el.querySelector('.tn-dialog'));
  },
  /** Боковая панель или нижний лист: { title, overline, body, foot, sheet, onClose } */
  drawer(o) {
    const id = o.id || uid('dr');
    const el = document.createElement('div');
    el.className = 'tn-overlay-drawer';
    el.innerHTML = '<div class="tn-scrim tn-scrim--drawer" data-ov="close"></div><aside class="tn-drawer' + (o.sheet ? ' tn-drawer--sheet' : '') + '" role="dialog" aria-modal="true" aria-labelledby="' + id + '-t" id="' + id + '">' +
      (o.sheet ? '<div class="tn-drawer__grip" aria-hidden="true"></div>' : '') +
      '<div class="tn-objpanel__head tn-drawer__head"><div>' + (o.overline ? '<p class="tn-text-overline">' + o.overline + '</p>' : '') + '<h2 class="tn-objpanel__title" id="' + id + '-t" tabindex="-1">' + o.title + '</h2></div><button class="tn-btn tn-btn--ghost tn-btn--icon" data-ov="close" aria-label="Закрыть">' + icon('close') + '</button></div>' +
      '<div class="tn-objpanel__body">' + o.body + '</div>' + (o.foot ? '<div class="tn-objpanel__foot">' + o.foot + '</div>' : '') + '</aside>';
    return this.open(el, o, el.querySelector('.tn-drawer'));
  },
  open(el, o, box) {
    const opener = document.activeElement;
    this.root().appendChild(el);
    document.body.classList.add('tn-noscroll');
    const entry = { el, box, opener, o };
    this.stack.push(entry);
    el.addEventListener('click', e => {
      const c = e.target.closest('[data-ov="close"]');
      if (c && el.contains(c)) { e.preventDefault(); this.close(entry); }
    });
    // свайп вниз — дополнительный способ закрыть нижний лист
    if (o.sheet) {
      let y0 = null;
      box.addEventListener('touchstart', e => { y0 = e.touches[0].clientY; }, { passive: true });
      box.addEventListener('touchend', e => { if (y0 != null && e.changedTouches[0].clientY - y0 > 80 && box.querySelector('.tn-objpanel__body').scrollTop === 0) this.close(entry); y0 = null; });
    }
    if (o.onMount) o.onMount(box);
    const first = o.initialFocus ? box.querySelector(o.initialFocus) : box.querySelector('h2[tabindex]');
    (first || box).focus();
    return entry;
  },
  close(entry, opts) {
    entry = entry || this.stack[this.stack.length - 1];
    if (!entry) return;
    this.stack = this.stack.filter(x => x !== entry);
    entry.el.remove();
    if (!this.stack.length) document.body.classList.remove('tn-noscroll');
    if (entry.o.onClose) entry.o.onClose(opts || {});
    if (!(opts && opts.noFocus) && entry.opener && document.contains(entry.opener)) entry.opener.focus();
    else if (!(opts && opts.noFocus) && entry.o.returnKey) { const t = document.querySelector('[data-key="' + entry.o.returnKey + '"]'); if (t) t.focus(); }
  },
  closeAll() { while (this.stack.length) this.close(null, { noFocus: true }); },
  top() { return this.stack[this.stack.length - 1]; }
};
document.addEventListener('keydown', e => {
  const top = Overlay.top();
  if (!top) return;
  if (e.key === 'Escape') { e.preventDefault(); top.o.onEscape ? top.o.onEscape() : Overlay.close(top); return; }
  if (e.key === 'Tab') {
    const f = $$(FOCUSABLE, top.box).filter(x => x.offsetParent !== null || x === document.activeElement);
    if (!f.length) { e.preventDefault(); return; }
    const a = f[0], b = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === a || !top.box.contains(document.activeElement))) { e.preventDefault(); b.focus(); }
    else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
  }
});

/* ── Тосты: успех/инфо — 6 с, с «Вернуть» — 8 с, ошибка — до закрытия; пауза при наведении и фокусе ── */
const Toast = {
  show(o) {
    const host = document.getElementById('tn-toasts');
    while (host.children.length >= 3) host.firstElementChild.remove();
    const el = document.createElement('div');
    el.className = 'tn-toast';
    el.dataset.tone = o.tone || 'success';
    el.setAttribute('role', o.tone === 'danger' ? 'alert' : 'status');
    const ic = { success: 'check-circle', info: 'info', warning: 'warning', danger: 'save-error' }[el.dataset.tone];
    el.innerHTML = icon(ic) + '<div><p class="tn-text-body-strong">' + o.title + '</p>' + (o.text ? '<p>' + o.text + '</p>' : '') +
      (o.actions && o.actions.length ? '<div class="tn-toast__actions">' + o.actions.map((a, i) => a.href ? '<a class="tn-btn tn-btn--sm" href="' + link(a.href) + '" data-ti="' + i + '">' + a.label + '</a>' : '<button class="tn-btn tn-btn--sm" data-ti="' + i + '">' + (a.icon ? icon(a.icon, 'tn-icon--sm') : '') + a.label + '</button>').join('') + '</div>' : '') +
      '</div><button class="tn-btn tn-btn--ghost tn-btn--icon tn-btn--sm" aria-label="Закрыть уведомление" data-tclose>' + icon('close', 'tn-icon--sm') + '</button>';
    host.appendChild(el);
    const ms = o.tone === 'danger' ? 0 : (o.ms || ((o.actions || []).some(a => a.undo) ? 8000 : 6000));
    let left = ms, t0 = Date.now(), timer = null;
    const close = () => { clearTimeout(timer); el.remove(); };
    const start = () => { if (!ms) return; t0 = Date.now(); timer = setTimeout(close, left); };
    const pause = () => { if (!ms) return; clearTimeout(timer); left -= Date.now() - t0; };
    el.addEventListener('mouseenter', pause); el.addEventListener('mouseleave', start);
    el.addEventListener('focusin', pause); el.addEventListener('focusout', e => { if (!el.contains(e.relatedTarget)) start(); });
    el.addEventListener('click', e => {
      if (e.target.closest('[data-tclose]')) { close(); return; }
      const b = e.target.closest('[data-ti]');
      if (b) { const a = o.actions[+b.dataset.ti]; if (a.fn) { e.preventDefault(); a.fn(); } close(); }
    });
    start();
    return { close };
  },
  saveError(retry, what) {
    if (Store.status === 'unknown-format') {
      this.show({ tone: 'danger', title: 'Не сохранено', text: 'Сохранённый прогресс в неизвестном формате, поэтому запись отключена — мы его не перезаписываем. ' + (what || '') + ' Скачайте копию или начните заново (кнопки вверху страницы).' });
      return;
    }
    const err = Store.lastError;
    const reason = err && err.name === 'QuotaExceededError' ? 'Хранилище браузера переполнено.' : err && err.name === 'SecurityError' ? 'Хранилище запрещено настройками браузера.' : 'Браузер не подтвердил запись.';
    this.show({ tone: 'danger', title: 'Не удалось сохранить', text: reason + ' ' + (what || 'Изменение не применено.'), actions: retry ? [{ label: 'Повторить', icon: 'refresh', fn: retry }] : [] });
  }
};

/* ── Меню «Справочник»: кнопка с aria-expanded, стрелки, Esc с возвратом фокуса ── */
const RefMenu = {
  btn() { return document.getElementById('ref-menu-btn'); },
  el() { return document.getElementById('ref-menu'); },
  open(focusFirst) {
    const b = this.btn(), m = this.el(); if (!b || !m) return;
    const r = b.getBoundingClientRect();
    m.style.left = Math.max(8, r.left) + 'px'; m.style.top = (r.bottom + 4) + 'px';
    m.hidden = false; b.setAttribute('aria-expanded', 'true');
    if (focusFirst) { const f = m.querySelector('[role="menuitem"]'); if (f) f.focus(); }
  },
  close(returnFocus) {
    const b = this.btn(), m = this.el(); if (!m || m.hidden) return;
    m.hidden = true; if (b) b.setAttribute('aria-expanded', 'false');
    if (returnFocus && b) b.focus();
  },
  toggle(kb) { const m = this.el(); if (m && m.hidden) this.open(kb); else this.close(true); }
};
document.addEventListener('keydown', e => {
  const m = RefMenu.el();
  if (!m || m.hidden) {
    if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && document.activeElement === RefMenu.btn() && e.key === 'ArrowDown') { e.preventDefault(); RefMenu.open(true); }
    return;
  }
  const items = $$('[role="menuitem"]', m);
  const i = items.indexOf(document.activeElement);
  if (e.key === 'Escape') { e.preventDefault(); RefMenu.close(true); }
  else if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
  else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
  else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
  else if (e.key === 'Tab') RefMenu.close(false);
});
document.addEventListener('click', e => {
  const m = RefMenu.el(); if (!m || m.hidden) return;
  if (!m.contains(e.target) && !e.target.closest('#ref-menu-btn')) RefMenu.close(false);
  if (e.target.closest('[role="menuitem"]')) RefMenu.close(false);
});
Object.assign(TN, { Overlay, Toast });

/* ── 07-map.js ── */
/* 07-map.js — звёздная карта. Отрисовка перенесена из TN.renderMap (bundle.js): SVG связей + HTML-кнопки планет.
   Добавлено: масштаб 50–200% (шаг 25%), перетаскивание, перелёт камеры к выбранной планете,
   клавиатура (Tab — в порядке маршрута, стрелки — к связанной планете, Enter — выбор, Esc — снять выбор, + − 0). */
const PROG = { locked: 'закрыта', available: 'впереди по маршруту', current: 'текущий этап', done: 'открыта' };
const BADGE = { locked: 'lock', available: 'unlock', current: 'target', done: 'check' };
/** Видимый диаметр планет (px при масштабе 1) — как в игровой Навигации: газовые гиганты крупнее, луны мельче */
const PLANET_PX = { xl: 72, lg: 48, md: 38, sm: 30, xs: 20 };
/** Декоративные орбиты навигационной сетки (полуоси по X в координатах карты) */
const NAV_ORBITS = [110, 190, 275, 365, 455, 545, 640];

const MapView = {
  zoom: 1, tx: 0, ty: 0, base: null, el: null, selected: null, onSelect: null, avail: null, drag: null,
  model() {
    const cur = Store.doc.stage;
    const T = Spoil.threshold();
    const planets = D.locations.map(l => {
      const progress = planetProgress(l);
      const hidden = Spoil.hiddenStage(Math.min(...l.stages), l.spoiler);
      const st = l.stages;
      let meta = st.length > 1 ? 'Этапы ' + st.slice(0, -1).join(', ') + ' и ' + st[st.length - 1] : 'Этап ' + st[0];
      if (progress === 'current') meta = 'Этап ' + cur + ' · Вы здесь';
      return { id: l.id, name: l.name, orb: l.orb, x: l.x, y: l.y, size: l.size, progress, hidden, meta, stage: planetStage(l) };
    });
    const edges = D.edges.map(e => {
      let type;
      const k = e.kind === 'main' ? 'required' : e.kind === 'branch' ? 'optional' : 'return';
      if (!cur) type = e.stage <= 2 ? k : 'inactive';
      else if (e.stage < cur) type = e.kind === 'return' ? 'return' : 'done';
      else if (e.stage === cur || e.stage === cur + 1) type = k;
      else type = 'inactive';
      return Object.assign({}, e, { type, current: false });
    });
    // Текущий путь: связь, ведущая в фокус текущего этапа
    if (cur) {
      const s = IDX.stage.get(String(cur));
      const into = edges.find(e => e.to === s.focus && e.stage === cur) || edges.find(e => e.to === s.focus && e.stage <= cur);
      if (into) { into.current = true; if (into.type === 'done' || into.type === 'inactive') into.type = 'required'; }
    }
    return { width: D.map.width, height: D.map.height, sun: D.map.sun, tilt: D.map.tilt, planets, edges };
  },
  render(el, opts) {
    this.el = el; this.onSelect = opts.onSelect; this.selected = opts.selected || null;
    const m = this.model();
    const W = m.width, H = m.height, sx = m.sun[0], sy = m.sun[1], pos = {}, size = {};
    m.planets.forEach(p => { pos[p.id] = [p.x, p.y]; size[p.id] = PLANET_PX[p.size] || PLANET_PX.sm; });
    // Навигационная сетка в духе игровой карты: наклонённые эллиптические орбиты вокруг солнца и лучи от центра
    const tilt = m.tilt || 0.52;
    let grid = '<g class="tn-navgrid">';
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 8, dx = Math.cos(a) * 1500, dy = Math.sin(a) * 1500 * tilt;
      grid += '<line class="tn-navgrid__spoke" x1="' + (sx - dx).toFixed(1) + '" y1="' + (sy - dy).toFixed(1) + '" x2="' + (sx + dx).toFixed(1) + '" y2="' + (sy + dy).toFixed(1) + '"/>';
    }
    NAV_ORBITS.forEach((r, i) => { grid += '<ellipse class="tn-orbit tn-navgrid__orbit" cx="' + sx + '" cy="' + sy + '" rx="' + r + '" ry="' + (r * tilt).toFixed(1) + '"/>'; });
    grid += '</g>';
    let svg = '<svg class="tn-map__svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true"><defs>' +
      '<marker id="tn-ar-required" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="var(--tn-color-route-required)"/></marker>' +
      '<marker id="tn-ar-optional" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 9 5 0 9" fill="none" stroke="var(--tn-color-route-optional)" stroke-width="1.6"/></marker>' +
      '<marker id="tn-ar-done" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="var(--tn-color-route-done)"/></marker>' +
      '<marker id="tn-ar-return" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1 9 5 0 9" fill="none" stroke="var(--tn-color-text-tertiary)" stroke-width="1.6"/></marker></defs>' + grid;
    m.edges.forEach(e => {
      const a = pos[e.from], b = pos[e.to], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
      const g1 = (size[e.from] / 2 + 10) / d, g2 = (size[e.to] / 2 + 12) / d;
      const x1 = a[0] + dx * g1, y1 = a[1] + dy * g1, x2 = b[0] - dx * g2, y2 = b[1] - dy * g2;
      // дуга всегда выгибается от солнца — линии идут «по орбите», а не в случайную сторону
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, nx = -dy / d, ny = dx / d;
      const side = (nx * (mx - sx) + ny * (my - sy)) >= 0 ? 1 : -1;
      const k = Math.min(0.14, 60 / d) * d * side, cx = mx + nx * k, cy = my + ny * k;
      const linked = this.selected && (e.from === this.selected || e.to === this.selected);
      const dim = this.selected && !linked && !e.current ? ' is-dimmed' : '';
      // стрелки — только у шагов, которые предстоит сделать; пройденное и фоновое — без стрелок
      const mk = e.type === 'required' || e.type === 'optional' ? ' marker-end="url(#tn-ar-' + e.type + ')"' : '';
      svg += '<path class="tn-edge tn-edge--' + e.type + (e.current ? ' is-current-path' : '') + (linked ? ' is-linked' : '') + dim + '" data-from="' + e.from + '" data-to="' + e.to + '" d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '"' + mk + '/>';
    });
    svg += '</svg>';
    let btns = '';
    m.planets.forEach(p => {
      const name = p.hidden ? 'Скрытая планета' : p.name;
      btns += '<button class="tn-planet tn-planet--nav" data-size="' + (p.size || 'sm') + '" data-planet="' + p.id + '" style="left:' + (p.x / W * 100).toFixed(2) + '%;top:' + (p.y / H * 100).toFixed(2) + '%" data-progress="' + p.progress + '"' + (p.hidden ? ' data-spoiler="hidden"' : '') +
        ' aria-pressed="' + (this.selected === p.id) + '" aria-label="' + name + ', этап ' + p.stage + ', ' + PROG[p.progress] + '">' +
        '<span class="tn-planet__name">' + name + '</span>' +
        '<span class="tn-planet__body"><span class="tn-orb tn-orb--' + p.orb + '"></span><span class="tn-planet__ring"></span><span class="tn-planet__badge">' + icon(p.hidden && p.progress === 'locked' ? 'eye-off' : BADGE[p.progress]) + '</span></span>' +
        '<span class="tn-planet__meta">' + p.meta + '</span></button>';
    });
    el.innerHTML = '<div class="tn-map__stars"></div><div class="tn-map__nebula" aria-hidden="true"></div><div class="tn-map__layer" data-tn-selectgroup style="aspect-ratio:' + W + '/' + H + '">' +
      '<div class="tn-map__sun" aria-hidden="true" style="left:' + (sx / W * 100).toFixed(2) + '%;top:' + (sy / H * 100).toFixed(2) + '%"></div>' + svg + btns + '</div>';
    this.layer = el.querySelector('.tn-map__layer');
    this.layout(opts);
    this.bind();
  },
  /** Размещение слоя в доступной области (слева от панели, под блоком контекста) */
  layout(opts) {
    opts = opts || this.lastOpts || {};
    this.lastOpts = opts;
    const r = this.el.getBoundingClientRect();
    const full = { x: 24, y: 24, w: r.width - 48, h: r.height - 48 };
    const got = opts.avail ? opts.avail(r) : { fit: full, view: full };
    const av = got.fit;
    this.avail = got.view;
    const ratio = D.map.width / D.map.height;
    let w = Math.min(av.w, av.h * ratio);
    if (opts.minWidth) w = Math.max(w, opts.minWidth);
    const h = w / ratio;
    this.base = { x: av.x + (av.w - w) / 2, y: av.y + Math.max(0, (av.h - h) / 2), w, h };
    Object.assign(this.layer.style, { left: this.base.x + 'px', top: this.base.y + 'px', width: w + 'px' });
    // размеры планет и подписей следуют за масштабом карты, но в разумных пределах
    this.layer.style.setProperty('--k', Math.max(0.72, Math.min(1.15, w / D.map.width)).toFixed(3));
    this.apply(true);
  },
  apply(instant) {
    if (!this.layer) return;
    this.layer.style.transition = instant ? 'none' : '';
    this.layer.style.transform = 'translate(' + this.tx + 'px,' + this.ty + 'px) scale(' + this.zoom + ')';
    const z = document.querySelector('[data-zoom-label]'); if (z) z.textContent = Math.round(this.zoom * 100) + '%';
  },
  setZoom(z, center) {
    z = Math.max(0.5, Math.min(2, Math.round(z * 4) / 4));
    const c = center || { x: this.avail.x + this.avail.w / 2, y: this.avail.y + this.avail.h / 2 };
    // точка под центром остаётся на месте
    const lx = (c.x - this.base.x - this.tx) / this.zoom, ly = (c.y - this.base.y - this.ty) / this.zoom;
    this.zoom = z;
    this.tx = c.x - this.base.x - lx * z; this.ty = c.y - this.base.y - ly * z;
    this.apply(false);
    announce('Масштаб ' + Math.round(z * 100) + '%');
  },
  /** Центрировать планету в доступной области */
  centerOn(id, instant, onlyIfHidden) {
    const p = IDX.planet.get(id); if (!p || !this.base) return;
    const px = p.x / D.map.width * this.base.w, py = p.y / D.map.height * this.base.h;
    if (onlyIfHidden) {
      // планета уже видна целиком (с подписью) — карту не двигаем, чтобы не терять ориентир
      const sx = this.base.x + this.tx + px * this.zoom, sy = this.base.y + this.ty + py * this.zoom, a = this.avail;
      if (sx - 70 >= a.x && sx + 70 <= a.x + a.w && sy - 50 >= a.y && sy + 70 <= a.y + a.h) return;
      // сдвигаем ровно настолько, чтобы планета с подписью вышла из-под панелей, — без «перелёта» всей карты
      const mx = 110, my = 90;
      let ddx = 0, ddy = 0;
      if (sx - mx < a.x) ddx = a.x - (sx - mx); else if (sx + mx > a.x + a.w) ddx = (a.x + a.w) - (sx + mx);
      if (sy - my < a.y) ddy = a.y - (sy - my); else if (sy + my > a.y + a.h) ddy = (a.y + a.h) - (sy + my);
      if (Math.abs(ddx) < a.w / 2 && Math.abs(ddy) < a.h / 2) { this.tx += ddx; this.ty += ddy; this.apply(instant || reduceMotion() || Store.doc.settings.staticMap); return; }
    }
    const cx = this.avail.x + this.avail.w / 2, cy = this.avail.y + this.avail.h / 2;
    this.tx = cx - this.base.x - px * this.zoom; this.ty = cy - this.base.y - py * this.zoom;
    this.apply(instant || reduceMotion() || Store.doc.settings.staticMap);
  },
  reset() { this.zoom = 1; this.tx = 0; this.ty = 0; this.apply(false); },
  select(id, opts) {
    this.selected = id;
    $$('.tn-planet', this.el).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.planet === id)));
    $$('.tn-edge', this.el).forEach(p => { const l = !!id && (p.dataset.from === id || p.dataset.to === id); p.classList.toggle('is-linked', l); p.classList.toggle('is-dimmed', !!id && !l && !p.classList.contains('is-current-path')); });
    if (id && !(opts && opts.noCamera)) this.centerOn(id, false, true);
  },
  bind() {
    const el = this.el;
    // Перетаскивание — дополнительный способ, не единственный
    el.onpointerdown = e => {
      if (e.target.closest('.tn-planet') || e.button !== 0) return;
      this.drag = { x: e.clientX, y: e.clientY, tx: this.tx, ty: this.ty, moved: false };
      el.setPointerCapture(e.pointerId);
    };
    el.onpointermove = e => {
      if (!this.drag) return;
      const dx = e.clientX - this.drag.x, dy = e.clientY - this.drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) this.drag.moved = true;
      this.tx = this.drag.tx + dx; this.ty = this.drag.ty + dy; this.apply(true);
    };
    el.onpointerup = () => { this.drag = null; };
    el.onwheel = e => {
      if (!e.ctrlKey && Math.abs(e.deltaY) < 4) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      this.setZoom(this.zoom + (e.deltaY < 0 ? 0.25 : -0.25), { x: e.clientX - r.left, y: e.clientY - r.top });
    };
    el.onkeydown = e => {
      const b = e.target.closest('.tn-planet');
      if (!b) return;
      const dirs = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (dirs[e.key]) {
        e.preventDefault();
        const from = IDX.planet.get(b.dataset.planet);
        const linked = D.edges.filter(x => x.from === from.id || x.to === from.id).map(x => x.from === from.id ? x.to : x.from);
        const [dx, dy] = dirs[e.key];
        let best = null, bestScore = Infinity;
        linked.forEach(id => {
          const p = IDX.planet.get(id); const vx = p.x - from.x, vy = p.y - from.y;
          const along = vx * dx + vy * dy; if (along <= 0) return;
          const across = Math.abs(vx * dy - vy * dx);
          const score = along + across * 2;
          if (score < bestScore) { bestScore = score; best = id; }
        });
        if (best) { const t = el.querySelector('[data-planet="' + best + '"]'); if (t) t.focus(); }
      }
    };
    el.onclick = e => {
      const b = e.target.closest('.tn-planet');
      if (!b) return;
      if (this.onSelect) this.onSelect(b.dataset.planet, b);
    };
  }
};
TN.MapView = MapView;

/* ── 08-polarity.js ── */
/* 08-polarity.js — полярности и формы (Warframe Wiki, «Polarity», 13.10.2026):
   мод в слоте совпадающей полярности стоит вдвое меньше (с округлением вверх), в слоте другой полярности — на 25% больше
   (с округлением вверх). Аура/стойка: совпадение удваивает прибавку вместимости, несовпадение — 80% с округлением вниз.
   Полярность «любая» (Aura/Omni) совпадает со всеми, кроме Умбры. Слот без полярности — стоимость как на карточке.
   Мод можно поставить в любой слот, поэтому встроенные полярности раскладываются так, чтобы стоимость была минимальной. */
const POLS = {
  V: { ru: 'Мадурай', g: 'V' }, D: { ru: 'Вазарин', g: 'D' }, '-': { ru: 'Нарамон', g: '—' }, '=': { ru: 'Зенурик', g: '=' },
  R: { ru: 'Унайру', g: 'R' }, Y: { ru: 'Пенджага', g: 'Y' }, U: { ru: 'Умбра', g: 'Ω' }, '*': { ru: 'любая (кроме Умбры)', g: '✱' }
};
const polRel = (slot, mod) => !slot || !mod ? 'none' : slot === '*' ? (mod === 'U' ? 'mismatch' : 'match') : slot === mod ? 'match' : 'mismatch';
const polDrain = (d, rel) => rel === 'match' ? Math.ceil(d / 2) : rel === 'mismatch' ? Math.ceil(d * 1.25) : d;
const polBonus = (b, rel) => rel === 'match' ? b * 2 : rel === 'mismatch' ? Math.floor(b * 0.8) : b;

/**
 * Раскладка сборки.
 * mods: массив из 8 элементов { drain, pol } | null (пустой слот);
 * innate: встроенные полярности обычных слотов; ex: { drain, pol } | null; exInnate; aura: { bonus, pol } | null; auraInnate; base: 30 | 60.
 * Возвращает { innate: L, minForma: L, fullForma: L }, где L = { pols[8], exPol, auraPol, used, cap, forma: [{ slot, from, to }] }.
 */
function polLayout(o) {
  const n = o.mods.length;
  const cost = (pols, exPol, auraPol) => {
    let used = 0;
    o.mods.forEach((m, i) => { if (m) used += polDrain(m.drain, polRel(pols[i], m.pol)); });
    if (o.ex) used += polDrain(o.ex.drain, polRel(exPol, o.ex.pol));
    const cap = o.base + (o.aura ? polBonus(o.aura.bonus, polRel(auraPol, o.aura.pol)) : 0);
    return { used, cap };
  };
  // 1. Встроенные полярности — перебор размещений (их не больше 4)
  const innate = (o.innate || []).filter(Boolean);
  let best = null;
  const place = (k, pols, usedSlots) => {
    if (k === innate.length) {
      const c = cost(pols, o.exInnate || null, o.auraInnate || null);
      if (!best || c.used < best.used) best = { pols: pols.slice(), used: c.used, cap: c.cap };
      return;
    }
    for (let i = 0; i < n; i++) { if (usedSlots[i]) continue; usedSlots[i] = true; pols[i] = innate[k]; place(k + 1, pols, usedSlots); pols[i] = null; usedSlots[i] = false; }
  };
  place(0, new Array(n).fill(null), new Array(n).fill(false));
  const L0 = { pols: best.pols, exPol: o.exInnate || null, auraPol: o.auraInnate || null, used: best.used, cap: best.cap, forma: [] };
  // 2. Формы: жадно берём слот с наибольшим выигрышем
  const step = L => {
    let pick = null;
    o.mods.forEach((m, i) => {
      if (!m || polRel(L.pols[i], m.pol) === 'match') return;
      const gain = polDrain(m.drain, polRel(L.pols[i], m.pol)) - Math.ceil(m.drain / 2);
      if (gain > 0 && (!pick || gain > pick.gain)) pick = { slot: i, gain, to: m.pol, from: L.pols[i] };
    });
    if (o.ex && polRel(L.exPol, o.ex.pol) !== 'match') { const gain = polDrain(o.ex.drain, polRel(L.exPol, o.ex.pol)) - Math.ceil(o.ex.drain / 2); if (gain > 0 && (!pick || gain > pick.gain)) pick = { slot: 'ex', gain, to: o.ex.pol, from: L.exPol }; }
    if (o.aura && polRel(L.auraPol, o.aura.pol) !== 'match') { const gain = o.aura.bonus * 2 - polBonus(o.aura.bonus, polRel(L.auraPol, o.aura.pol)); if (gain > 0 && (!pick || gain > pick.gain)) pick = { slot: 'aura', gain, to: o.aura.pol, from: L.auraPol }; }
    if (!pick) return null;
    const N = { pols: L.pols.slice(), exPol: L.exPol, auraPol: L.auraPol, forma: L.forma.concat([{ slot: pick.slot, from: pick.from, to: pick.to }]) };
    if (pick.slot === 'ex') N.exPol = pick.to; else if (pick.slot === 'aura') N.auraPol = pick.to; else N.pols[pick.slot] = pick.to;
    Object.assign(N, cost(N.pols, N.exPol, N.auraPol));
    return N;
  };
  let minF = L0;
  while (minF.used > minF.cap) { const N = step(minF); if (!N) break; minF = N; }
  let full = minF;
  for (;;) { const N = step(full); if (!N) break; full = N; }
  return { innate: L0, minForma: minF, fullForma: full };
}

/** Значок полярности: глиф + скрытое название для экранных дикторов */
UI.pol = (code, opts) => {
  if (!code) return '<span class="tn-pol tn-pol--none" title="Без полярности"><span class="tn-sr-only">без полярности</span></span>';
  const p = POLS[code] || { ru: code, g: code };
  return '<span class="tn-pol' + (opts && opts.state ? ' tn-pol--' + opts.state : '') + '" data-pol="' + attr(code) + '" title="' + attr(p.ru) + '" aria-hidden="' + (opts && opts.decor ? 'true' : 'false') + '"><span aria-hidden="true">' + p.g + '</span><span class="tn-sr-only">' + p.ru + '</span></span>';
};
UI.polList = (list, empty) => (list && list.filter(Boolean).length) ? '<span class="tn-pollist">' + list.filter(Boolean).map(c => UI.pol(c)).join('') + '</span>' : '<span class="tn-faint">' + (empty || 'нет') + '</span>';
TN.polLayout = polLayout;

/* ── 10-screen-home.js ── */
/* 10-screen-home.js — главный экран: звёздная карта (ScreenMap) и маршрут списком (RouteList, ScreenMobile).
   Карта ≠ маршрут: карта показывает, где содержание; маршрут — что и в каком порядке делать. */
const isPhone = () => window.innerWidth < 640;
const isWide = () => window.innerWidth >= 1100;

function stageLabel(n) { const s = IDX.stage.get(String(n)); return s ? 'Этап ' + n + ': ' + esc(stageTitle(s)) : ''; }
function spoilerTag() {
  if (!Spoil.on()) return UI.tag('Защита от спойлеров выключена', 'eye');
  return '<button class="tn-tag tn-tag--btn" data-act="open-settings">' + icon('eye-off') + 'Спойлеры скрыты после этапа ' + Spoil.threshold() + '</button>';
}

Screens.home = {
  nav: 'map',
  title() { return 'Карта и маршрут'; },
  view(query) {
    const v = query.get('view');
    if (v === 'map' || v === 'list') return v;
    if (Store.doc.settings.view) return Store.doc.settings.view;
    return isPhone() ? 'list' : 'map';
  },
  render(params, query) {
    this.query = query;
    const view = this.view(query);
    this.mode = view;
    document.getElementById('app').classList.toggle('is-map', view === 'map');
    if (view === 'list') return this.renderList(query);
    return this.renderMap(query);
  },

  /* ── Карта ─────────────────────────────────────────── */
  renderMap(query) {
    const sel = query.get('selected');
    this.selected = sel && IDX.planet.has(sel) ? sel : null;
    const statik = Store.doc.settings.staticMap || reduceMotion() || isPhone();
    const legend = '<div class="tn-legend tn-legend--floating tn-home__legend" id="map-legend" role="list" aria-label="Легенда">' +
      '<div class="tn-legend__item" role="listitem"><svg width="34" height="10" aria-hidden="true"><path class="tn-edge tn-edge--required" d="M2 5H32"/></svg>Обязательный шаг</div>' +
      '<div class="tn-legend__item" role="listitem"><svg width="34" height="10" aria-hidden="true"><path class="tn-edge tn-edge--optional" d="M2 5H32"/></svg>Дополнительная ветка</div>' +
      '<div class="tn-legend__item" role="listitem"><svg width="34" height="10" aria-hidden="true"><path class="tn-edge tn-edge--done" d="M2 5H32"/></svg>Пройдено</div>' +
      '<div class="tn-legend__item" role="listitem"><svg width="34" height="10" aria-hidden="true"><path class="tn-edge tn-edge--return" d="M2 5H32"/></svg>Возвращение</div>' +
      '<div class="tn-legend__item" role="listitem">' + UI.status('current', 'Текущий') + '</div>' +
      '<div class="tn-legend__item" role="listitem"><span class="tn-status" data-progress="locked">' + icon('lock') + 'Закрыто</span></div></div>';
    return '<div class="tn-home tn-home--map">' +
      '<div class="tn-home__ctx">' +
      '<a class="tn-sr-only tn-skip" href="' + link('/?view=list') + '">Перейти к маршруту списком</a>' +
      this.contextPanel('map') + '</div>' +
      '<div class="tn-map tn-map--nav' + (statik ? ' tn-static-map' : '') + '" id="map" aria-label="Звёздная карта"></div>' +
      '<div class="tn-home__tools">' + UI.segmented('Представление', [{ val: 'map', label: 'Карта', icon: 'map', on: true }, { val: 'list', label: isPhone() ? 'Списком' : 'Маршрут списком', icon: 'list' }], 'view') +
      '<button class="tn-btn' + (isPhone() ? ' tn-btn--sm' : '') + '" aria-expanded="false" aria-controls="map-legend" data-act="toggle-legend" data-key="legend-btn">Легенда</button></div>' +
      legend +
      '<div class="tn-mapctl tn-home__zoom" role="group" aria-label="Масштаб карты"><button class="tn-btn tn-btn--icon" data-act="zoom-in" aria-label="Приблизить" aria-keyshortcuts="+">' + icon('zoom-in') + '</button><div class="tn-mapctl__zoom" data-zoom-label aria-live="polite">100%</div><button class="tn-btn tn-btn--icon" data-act="zoom-out" aria-label="Отдалить" aria-keyshortcuts="-">' + icon('zoom-out') + '</button><button class="tn-btn tn-btn--icon" data-act="zoom-current" aria-label="К текущему этапу" aria-keyshortcuts="0">' + icon('target') + '</button></div>' +
      (this.selected && !isPhone() ? this.objectPanel(this.selected) : '') +
      '</div>';
  },
  /** Блок контекста: где я, что дальше, представление, спойлеры, сохранение */
  contextPanel(view) {
    const cur = Store.doc.stage;
    if (!cur && !Store.doc.onboarded) return this.firstVisit(view);
    const s = cur ? IDX.stage.get(String(cur)) : null;
    const si = cur ? stageInfo(cur) : null;
    return '<div class="tn-panel tn-home__panel">' +
      '<div><p class="tn-text-overline">' + (view === 'map' ? 'Звёздная карта' : 'Маршрут развития') + '</p><h1 class="tn-text-h2" tabindex="-1" id="page-h1">' + (cur ? 'Вы на этапе ' + cur + ': ' + esc(s.short.toLowerCase()) : 'Этап не выбран') + '</h1>' +
      (cur && si.nearest ? '<p class="tn-muted tn-small">Ближайшая цель: ' + UI.a('/stage/' + cur + '#goal-' + si.nearest.id, mask(si.nearest.title)) + '</p>' : !cur ? '<p class="tn-muted tn-small">Карта показана с начала маршрута. Выберите этап, чтобы увидеть ближайшие цели.</p>' : '') + '</div>' +
      '<div class="tn-cluster" style="gap:12px">' + (view === 'map' && isWide() ? UI.segmented('Представление', [{ val: 'map', label: 'Карта', icon: 'map', on: true }, { val: 'list', label: 'Маршрут списком', icon: 'list' }], 'view') : '') +
      '<button class="tn-btn" data-act="change-stage" data-key="change-stage">' + (cur ? 'Изменить этап' : 'Выбрать этап') + '</button>' + spoilerTag() + '</div>' +
      UI.save() + '</div>';
  },
  /** Первый визит: простое действие — начать с первых миссий или указать достигнутый прогресс */
  firstVisit(view) {
    return '<div class="tn-panel tn-home__panel tn-first">' +
      '<div><p class="tn-text-overline">Навигатор Тенно</p><h1 class="tn-text-h2" tabindex="-1" id="page-h1">Где вы сейчас в игре?</h1>' +
      '<p class="tn-muted">Выберите этап — покажем ближайшие цели. Прогресс сохранится только в этом браузере. Справочник доступен и без настройки.</p></div>' +
      '<div class="tn-cluster" style="gap:12px"><button class="tn-btn tn-btn--primary" data-act="start-first" data-key="start-first">' + icon('route') + 'Начать с первых миссий</button>' +
      '<button class="tn-btn" data-act="change-stage" data-key="change-stage">Указать пройденный этап</button></div>' +
      '<div class="tn-cluster tn-small"><button class="tn-linkbtn tn-link" data-act="stage-quiz">Не знаю этап — помогите определить</button><span class="tn-faint" aria-hidden="true">·</span>' + UI.a('/reference', 'Справочник') + '<span class="tn-faint" aria-hidden="true">·</span><button class="tn-linkbtn tn-link" data-act="skip-onboarding">Смотреть без настройки</button></div>' +
      (Store.status === 'unavailable' ? UI.callout('warning', 'Сохранение недоступно', 'Браузер запрещает хранилище (например, приватный режим). Выбор этапа и задачи будут действовать до закрытия вкладки.') : '') +
      '</div>';
  },
  /** Панель объекта (ObjectPanel) для выбранной планеты */
  objectPanel(id, asSheet) {
    const loc = IDX.planet.get(id);
    const e = entity('planet:' + id);
    const n = planetStage(loc);
    const st = IDX.stage.get(String(n));
    const prog = planetProgress(loc);
    const si = stageInfo(n);
    const scope = 'planet:' + id;
    const hidden = e.hidden && !Spoil.revealed.has(scope);
    const name = hidden ? 'Скрытая планета' : esc(loc.name);
    const g = si.nearest;
    let body = '';
    if (hidden) body += UI.spoiler(scope, 'Место поздней игры, этап ' + n + '. Этап и условия доступа видны; название и описание скрыты.');
    // Ближайшая цель
    if (g) {
      const gi = goalInfo(g);
      body += '<section><h3 class="tn-section-title tn-text-overline">' + (stageProgress(n) === 'done' ? 'Не отмечена · этап ' + n : 'Ближайшая цель · этап ' + n) + '</h3>' +
        (stageProgress(n) === 'done' ? '<p class="tn-faint tn-small" style="margin:-4px 0 8px">Этап раньше выбранного, но эта цель не отмечена. Выбор этапа ничего не отмечает за вас.</p>' : '') + '<div class="tn-card' + (prog === 'current' ? ' is-current' : '') + '"><p class="tn-card__title">' + (Spoil.hiddenStage(n, st.spoiler) && !Spoil.revealed.has(scope) ? 'Скрытая цель этапа ' + n : mask(g.title, scope)) + '</p>' +
        (Spoil.hiddenStage(n, st.spoiler) && !Spoil.revealed.has(scope) ? '' : '<p class="tn-goal__why">' + mask(g.why, scope) + '</p>') +
        (gi.steps.length ? '<div class="tn-stageprog">' + UI.steps(gi.stepsDone, gi.steps.length, !gi.done) + '<span class="tn-faint tn-small">' + gi.stepsDone + ' из ' + gi.steps.length + ' ' + plural(gi.steps.length, ['шага', 'шагов', 'шагов']) + '</span></div>' : '') +
        UI.taskBtn('goal:' + g.id, 'add-goal', null, { block: true }) + '</div></section>';
    }
    // Условия доступа
    const evs = (loc.access || []).map(evalCond);
    body += '<section>' + UI.openMark(loc, hidden) + '</section>';
    body += '<section><h3 class="tn-section-title tn-text-overline">Условия доступа</h3>' + (evs.length ? UI.deps(evs) : '<p class="tn-muted tn-small">Открывается переходами Навигации по ходу основной карты — отдельного условия нет.</p>') + '</section>';
    // Полезная добыча
    const loot = (loc.resources || []).map(r => IDX.item.get(r)).filter(Boolean);
    if (loot.length && !hidden) body += '<section><h3 class="tn-section-title tn-text-overline">Полезная добыча ' + (loot.length > 3 ? UI.a('/planet/' + id + '#loot', 'Все ' + loot.length, 'tn-link tn-section-link') : '') + '</h3><div class="tn-stack tn-stack--sm">' +
      loot.slice(0, 3).map(it => '<div class="tn-cluster">' + icon('resource', 'tn-icon--sm') + UI.a('/item/' + it.id, esc(it.name), 'tn-link tn-link--quiet') + UI.rarity(it.rarity) + '</div>').join('') + '</div></section>';
    // Дальше по маршруту
    const next = IDX.stage.get(String(n + 1));
    if (next) body += '<section><h3 class="tn-section-title tn-text-overline">Дальше по маршруту</h3><p class="tn-muted tn-small">' + stageLabel(n + 1) + '</p></section>';
    body += '<p class="tn-faint tn-small">Этапы — порядок вложения сил по гайду, а не игровая блокировка: квесты и системы открываются частично параллельно.</p>';
    const head = '<div class="tn-objpanel__head">' + UI.orb(hidden ? null : loc.orb, 48) + '<div><p class="tn-text-overline">Этап ' + n + ' · ' + esc(Spoil.hiddenStage(n, st.spoiler) ? 'поздняя игра' : st.short) + '</p><h2 class="tn-objpanel__title" id="op-t" tabindex="-1">' + name + '</h2>' +
      '<div class="tn-cluster" style="margin-top:4px">' + UI.status(prog, PLANET_WORD[prog]) + (prog === 'current' || prog === 'available' ? '<span class="tn-faint">· ' + si.doneMain + ' из ' + si.total + ' ' + plural(si.total, ['цели', 'целей', 'целей']) + '</span>' : '') + '</div></div>' +
      '<button class="tn-btn tn-btn--ghost tn-btn--icon" data-act="close-panel" aria-label="Закрыть панель">' + icon('close') + '</button></div>';
    const foot = '<div class="tn-objpanel__foot"><a class="tn-btn" href="' + link('/planet/' + id) + '">Открыть страницу ' + (hidden ? 'места' : esc(loc.name)) + icon('arrow-right', 'tn-icon--sm') + '</a></div>';
    if (asSheet) return { head, body: '<div class="tn-cluster" style="margin-bottom:12px">' + UI.status(prog, PLANET_WORD[prog]) + '<span class="tn-faint tn-small">Этап ' + n + ' · ' + esc(Spoil.hiddenStage(n, st.spoiler) ? 'поздняя игра' : st.short) + '</span></div>' + body, foot, name };
    return '<aside class="tn-objpanel tn-home__objpanel" aria-labelledby="op-t" id="objpanel">' + head + '<div class="tn-objpanel__body">' + body + '</div>' + foot + '</aside>';
  },
  mount(main, ctx) {
    if (this.mode === 'list') { this.mountList(main, ctx); return; }
    const mapEl = main.querySelector('#map');
    const self = this;
    const restore = ctx.restore && ctx.restore.ui && ctx.restore.ui.map;
    MapView.render(mapEl, {
      selected: this.selected,
      gap: isPhone() ? 30 : 40,
      minWidth: isPhone() ? 1100 : null,
      avail: r => self.availRect(r),
      onSelect: (id, btn) => self.selectPlanet(id, btn)
    });
    if (restore) { MapView.zoom = restore.zoom; MapView.tx = restore.tx; MapView.ty = restore.ty; MapView.apply(true); }
    else if (this.selected) MapView.centerOn(this.selected, true, true);
    else if (Store.doc.stage) { const s = IDX.stage.get(String(Store.doc.stage)); if (window.innerWidth < 1100) MapView.centerOn(s.focus, true, true); }
    else if (isPhone()) MapView.centerOn('earth', true);
    if (this.selected && isPhone()) this.openSheet(this.selected, true);
    this.onResize = debounce(() => { if (document.contains(mapEl)) MapView.layout(); }, 120);
    window.addEventListener('resize', this.onResize);
    if (!isWide()) { const lg = main.querySelector('#map-legend'); if (lg) lg.hidden = true; }
  },
  unmount() { if (this.onResize) window.removeEventListener('resize', this.onResize); if (this.sheet) { Overlay.close(this.sheet, { noFocus: true }); this.sheet = null; } document.getElementById('app').classList.remove('is-map'); },
  /** Доступная область карты: слева от панели и ниже блока контекста */
  availRect(r) {
    const main = document.getElementById('main');
    const panel = main.querySelector('#objpanel');
    const ctx = main.querySelector('.tn-home__ctx');
    const tools = main.querySelector('.tn-home__tools');
    const legend = main.querySelector('#map-legend');
    let top = 24, bottom = r.height - 24, right = 24;
    if (isWide()) {
      const c = ctx ? ctx.getBoundingClientRect() : null; if (c) top = c.bottom - r.top + 12;
      if (legend && !legend.hidden) bottom = legend.getBoundingClientRect().top - r.top - 8;
      if (panel) right = 400 + 48;
    } else if (!isPhone()) { const t = tools.getBoundingClientRect(); top = t.bottom - r.top + 8; bottom = r.height - 16; if (panel) right = 380 + 16; }
    else { const t = tools.getBoundingClientRect(); top = t.bottom - r.top + 4; bottom = r.height - 16; }
    // fit — область, в которую вписывается вся карта (без учёта панели объекта, чтобы карта не прыгала при выборе);
    // view — видимая часть, к центру которой подводится выбранная планета.
    const padTop = isPhone() ? 20 : 30, padBottom = isPhone() ? 36 : 44;
    // Карта занимает всю область; места расставлены так, что угол блока контекста (слева сверху) и легенды (слева снизу) свободны
    const ftop = isPhone() ? top : 24, fbot = r.height - (isPhone() ? 16 : 24);
    const fit = { x: 24, y: ftop + padTop, w: Math.max(200, r.width - 48), h: Math.max(160, fbot - ftop - padTop - padBottom) };
    const view = { x: 24, y: top, w: Math.max(200, r.width - 24 - right), h: Math.max(160, bottom - top) };
    return { fit, view };
  },
  selectPlanet(id, btn) {
    this.selected = id;
    const url = '/?view=map&selected=' + id;
    try { history.replaceState(Object.assign({}, history.state, { tn: 1 }), '', link(url)); } catch (e) {}
    MapView.select(id);
    const e = entity('planet:' + id);
    if (isPhone()) { this.openSheet(id); return; }
    const main = document.getElementById('main');
    const old = main.querySelector('#objpanel');
    const html = this.objectPanel(id);
    if (old) old.outerHTML = html; else main.querySelector('.tn-home').insertAdjacentHTML('beforeend', html);
    MapView.layout(); MapView.centerOn(id, false, true);
    announce((e.hidden ? 'Скрытая планета' : e.name) + ', панель объекта открыта');
  },
  openSheet(id, initial) {
    const p = this.objectPanel(id, true);
    if (this.sheet) Overlay.close(this.sheet, { noFocus: true });
    this.sheet = Overlay.drawer({
      sheet: true, overline: '', title: p.name, body: p.body, foot: p.foot.replace(/^<div class="tn-objpanel__foot">|<\/div>$/g, ''),
      returnKey: null,
      onClose: () => { this.sheet = null; this.closePanel(true); }
    });
    // для нижнего листа фокус возвращается на планету
    this.sheet.opener = document.querySelector('.tn-planet[data-planet="' + id + '"]');
  },
  closePanel(fromSheet) {
    const id = this.selected; this.selected = null;
    try { history.replaceState(Object.assign({}, history.state), '', link('/?view=map')); } catch (e) {}
    MapView.select(null, { noCamera: true });
    const p = document.getElementById('objpanel'); if (p) p.remove();
    if (!fromSheet) { MapView.layout(); const b = document.querySelector('.tn-planet[data-planet="' + id + '"]'); if (b) b.focus(); }
  },
  saveUI() { return { map: { zoom: MapView.zoom, tx: MapView.tx, ty: MapView.ty }, openStages: this.openStages ? [...this.openStages] : null }; },

  /* ── Маршрут списком (RouteList) ───────────────────── */
  renderList(query) {
    const cur = Store.doc.stage;
    if (!cur && !Store.doc.onboarded) return '<div class="tn-container tn-home--list">' + this.firstVisitList() + '</div>';
    return '<div class="tn-container tn-home--list"><div class="tn-routepage">' +
      '<div class="tn-stack tn-routepage__head"><div><p class="tn-text-overline">Маршрут развития</p><h1 class="tn-text-h1 tn-h1-adapt" tabindex="-1" id="page-h1">' + (cur ? 'Вы на этапе ' + cur : 'Этап не выбран') + '</h1></div>' +
      '<div class="tn-cluster" style="gap:12px">' + UI.segmented('Представление', [{ val: 'map', label: 'Карта', icon: 'map' }, { val: 'list', label: isPhone() ? 'Списком' : 'Маршрут списком', icon: 'list', on: true }], 'view') +
      '<button class="tn-btn" data-act="change-stage" data-key="change-stage">' + (cur ? 'Изменить этап' : 'Выбрать этап') + '</button></div>' +
      '<div class="tn-cluster">' + UI.save() + spoilerTag() + '</div>' +
      UI.callout('info', 'Карта и маршрут — разные вещи', 'Карта показывает, где находится содержание. Маршрут — что и в каком порядке полезно делать. Этапы — рекомендация гайда, а не игровые блокировки.') +
      '</div>' + this.routeList() + '</div></div>';
  },
  firstVisitList() {
    return '<div class="tn-stack tn-first-list">' + UI.empty('route', 'Где вы сейчас в игре?', 'Выберите этап — покажем ближайшие цели. Прогресс сохранится только в этом браузере.') +
      '<button class="tn-btn tn-btn--primary tn-btn--lg" data-act="start-first" data-key="start-first">Начать с первых миссий</button>' +
      '<button class="tn-btn" data-act="change-stage" data-key="change-stage">Указать пройденный этап</button>' +
      '<button class="tn-btn" data-act="stage-quiz">Не знаю — помогите определить</button>' +
      '<button class="tn-btn tn-btn--ghost" data-act="skip-onboarding">Посмотреть без настройки</button>' +
      (Store.status === 'unavailable' ? UI.callout('warning', 'Сохранение недоступно', 'Браузер запрещает хранилище. Выбор этапа и задачи будут действовать до закрытия вкладки.') : '') + '</div>';
  },
  routeList() {
    const cur = Store.doc.stage;
    const open = this.openStages || new Set();
    const items = [];
    const done = D.stages.filter(s => cur && s.n < cur);
    if (done.length > 1 && !open.has('done')) {
      items.push('<li class="tn-route__stage" data-progress="done"><span class="tn-node tn-node--static" data-progress="done"><span class="tn-node__dot">' + icon('check') + '</span></span><div><p class="tn-text-overline">Этапы 1–' + (cur - 1) + ' · Выполнено</p><p class="tn-card__title">' + esc(D.stages[0].short) + ' — ' + esc(stageTitle(D.stages[cur - 2])) + '</p>' +
        '<button class="tn-btn tn-btn--ghost tn-btn--sm" data-act="route-expand" data-val="done" data-key="route-done">Показать ' + pl(done.length, ['этап', 'этапа', 'этапов']) + '</button></div></li>');
    }
    D.stages.forEach(s => {
      const prog = stageProgress(s.n);
      if (prog === 'done' && done.length > 1 && !open.has('done')) return;
      const hidden = Spoil.hiddenStage(s.n, s.spoiler) && !Spoil.revealed.has('stage:' + s.n);
      const title = hidden ? icon('eye-off', 'tn-icon--sm') + ' Скрытый этап' : esc(s.title);
      const planets = hidden ? '' : s.planets.map(p => { const e = entity('planet:' + p); return entName(e); }).join(', ');
      const node = '<span class="tn-node tn-node--static" data-progress="' + prog + '"><span class="tn-node__dot">' + (prog === 'done' ? icon('check') : prog === 'locked' ? icon('lock') : s.n) + '</span></span>';
      if (prog === 'current') {
        const si = stageInfo(s.n);
        const branch = s.goals.map(id => IDX.goal.get(id)).find(g => g.kind === 'side' && !isDone('goal:' + g.id));
        items.push('<li class="tn-route__stage" data-progress="current" id="route-stage-' + s.n + '">' + node + '<div class="tn-card is-current"><p class="tn-text-overline" style="color:var(--tn-color-text-accent)">Этап ' + s.n + ' · Вы здесь</p><p class="tn-card__title">' + title + '</p>' +
          '<div class="tn-stageprog">' + UI.steps(si.doneMain, si.total) + '<span class="tn-faint tn-small">' + si.doneMain + ' из ' + si.total + (si.nearest ? ' · Следующий шаг: ' + mask(si.nearest.title) : '') + '</span></div>' +
          '<a class="tn-btn tn-btn--primary tn-btn--block" href="' + link('/stage/' + s.n) + '">Открыть этап</a>' +
          (branch ? '<p class="tn-route__branch"><b>Ветка:</b> ' + mask(branch.title) + ' — можно начать сейчас</p>' : '') + '</div></li>');
        return;
      }
      const word = PROGRESS_WORD[prog];
      const reqOpen = open.has('req-' + s.n);
      let reqHtml = '';
      if (prog === 'locked' || !cur) {
        const conds = []; const seen = new Set();
        s.goals.map(id => IDX.goal.get(id)).filter(g => g.kind === 'main').forEach(g => (g.req || []).forEach(c => { const k = JSON.stringify(c); if (!seen.has(k)) { seen.add(k); conds.push(c); } }));
        reqHtml = (conds.length ? '<button class="tn-btn tn-btn--ghost tn-btn--sm" aria-expanded="' + reqOpen + '" aria-controls="route-req-' + s.n + '" data-act="route-expand" data-val="req-' + s.n + '" data-key="route-req-' + s.n + '">Показать требования</button>' +
          '<div id="route-req-' + s.n + '"' + (reqOpen ? '' : ' hidden') + '>' + UI.deps(conds.map(evalCond)) + '</div>' : '');
      }
      items.push('<li class="tn-route__stage" data-progress="' + prog + '" id="route-stage-' + s.n + '">' + node + '<div><p class="tn-text-overline">Этап ' + s.n + ' · ' + word + '</p><p class="tn-card__title">' + UI.a('/stage/' + s.n, title, 'tn-link tn-link--quiet') + '</p>' +
        (planets ? '<p class="tn-faint tn-small">' + planets + '</p>' : '') + reqHtml + '</div></li>');
    });
    return '<ol class="tn-route tn-route--page" aria-label="Маршрут развития">' + items.join('') + '</ol>';
  },
  mountList(main, ctx) {
    const ui = ctx.restore && ctx.restore.ui;
    if (!ctx.restore && Store.doc.stage) {
      const el = main.querySelector('#route-stage-' + Store.doc.stage);
      // прокручиваем, только если текущий этап совсем не виден — заголовок «Вы на этапе N» должен оставаться на экране
      if (el && el.getBoundingClientRect().top > window.innerHeight - 160) el.scrollIntoView({ block: 'center' });
    }
  }
};
Screens.home.openStages = new Set();

/* ── 11-screen-stage.js ── */
/* 11-screen-stage.js — страница этапа и страница планеты (эталон ScreenPlanet: оглавление · статья · правая колонка).
   Порядок разделов фиксирован: Условия доступа → Ближайшие цели → Связанные квесты → Полезная добыча → Синдикаты и продавцы → Подготовка. */

UI.questCard = function (f) {
  const hidden = Spoil.hiddenStage(f.stage || 0, f.spoiler) && !Spoil.revealed.has('quest:' + f.id);
  const v = Store.doc.facts[f.id];
  const prog = v === true ? 'done' : (f.req || []).map(evalCond).some(e => e.state === 'no') ? 'locked' : 'available';
  const word = v === true ? 'Пройден' : v === false ? 'Не пройден' : 'Не указано';
  if (hidden) {
    return '<article class="tn-card"><div class="tn-card__head"><span class="tn-card__icon">' + icon('eye-off') + '</span><div class="tn-stack tn-stack--sm" style="gap:2px"><p class="tn-text-overline">Квест · Этап ' + f.stage + '</p><h3 class="tn-card__title">Скрытый сюжетный квест</h3></div></div>' +
      '<div class="tn-markers"><span class="tn-status" data-progress="' + (v === true ? 'done' : 'locked') + '">' + icon(v === true ? 'check-circle' : 'lock') + word + '</span></div>' +
      (f.req && f.req.length ? UI.deps(f.req.map(evalCond)) : '') +
      UI.spoiler('quest:' + f.id, 'Название и описание скрыты: квест поздней игры. Условия доступа видны.', 'Название и описание скрыты') + '</article>';
  }
  return '<article class="tn-card tn-card--interactive"><div class="tn-card__head"><span class="tn-card__icon">' + icon('quest') + '</span><div class="tn-stack tn-stack--sm" style="gap:2px"><p class="tn-text-overline">Квест · Этап ' + f.stage + '</p><h3 class="tn-card__title"><a class="tn-card__link" href="' + link('/quest/' + f.id) + '">' + esc(f.name) + '</a></h3></div></div>' +
    '<div class="tn-markers">' + (v === true ? UI.status('done', 'Пройден') : '<span class="tn-status" data-progress="' + prog + '">' + icon(PROGRESS_ICON[prog]) + word + '</span>') + '</div>' +
    (f.req && f.req.length ? UI.deps(f.req.map(evalCond)) : '') +
    '<div class="tn-card__foot">' + (f.wiki ? UI.ext(wikiRu(f.wiki), 'Открыть статью в Wiki') + UI.lang('ru') : f.wikiEn ? UI.ext(wikiEn(f.wikiEn), 'Открыть статью в Wiki') + UI.lang('en') : '') + '</div></article>';
};
UI.vendorCard = function (v) {
  const e = entity('vendor:' + v.id);
  const synd = v.syndicate ? IDX.syndicate.get(v.syndicate) : null;
  const st = synd ? Store.doc.standing[synd.id] || {} : {};
  const reco = v.offers.filter(o => o.reco).length;
  const ranks = v.offers.filter(o => o.rank != null).map(o => o.rank);
  const avail = st.rank != null ? v.offers.filter(o => o.rank == null || o.rank <= st.rank).length : null;
  const marks = [];
  if (reco) marks.push(UI.reco(pl(reco, ['рекомендация', 'рекомендации', 'рекомендаций'])));
  if (avail != null) { marks.push(UI.ready('ready', avail + ' доступно вам')); const hi = v.offers.length - avail; if (hi) marks.push(UI.ready('rank', hi + ' — нужен ранг выше')); }
  else if (synd) marks.push(UI.ready('unknown', 'Ранг не указан'));
  return '<article class="tn-card tn-card--interactive"><div class="tn-card__head"><span class="tn-card__icon">' + icon('vendor') + '</span><div class="tn-stack tn-stack--sm" style="gap:2px"><h3 class="tn-card__title"><a class="tn-card__link" href="' + link(e.path) + '">' + entName(e) + '</a></h3>' +
    '<div class="tn-vendor__meta"><span>' + icon('planet', 'tn-icon--sm') + ' ' + mask(v.where) + '</span><span>' + icon('currency', 'tn-icon--sm') + ' Валюта: ' + mask(v.currency) + '</span>' + (ranks.length ? '<span>' + icon('rank', 'tn-icon--sm') + ' Ранги ' + Math.min(...ranks) + '–' + Math.max(...ranks) + '</span>' : '') + '</div></div></div>' +
    '<div class="tn-markers">' + marks.join('') + '</div></article>';
};
/** Таблица «где собирать» для списка ресурсов */
function lootTable(ids, caption, tid) {
  const rows = [];
  ids.map(id => IDX.item.get(id)).filter(Boolean).forEach(it => {
    const where = (it.where || []);
    if (!where.length) rows.push([UI.ref('item:' + it.id, { cls: 'tn-link tn-link--quiet' }), '', it.note ? mask(it.note) : '']);
    else rows.push([UI.ref('item:' + it.id, { cls: 'tn-link tn-link--quiet' }), where.map(w => mask(w.text)).join('; '), it.note ? mask(it.note) : '—']);
  });
  if (!rows.length) return '';
  return UI.table({ id: tid, caption, head: ['Ресурс', 'Где собирать', 'Замечание'], rows, sortable: true, sort: TableSort[tid], stack: true });
}

Screens.stage = {
  nav: 'map',
  title(p) { const s = IDX.stage.get(p.n); return s ? 'Этап ' + s.n + ': ' + stageTitle(s) : 'Этап не найден'; },
  place(p) { const s = IDX.stage.get(p.n); return s ? 'Этап ' + s.n + ' · ' + stageTitle(s) : null; },
  render(p) {
    const s = IDX.stage.get(p.n);
    if (!s) return Screens.notFound.render();
    const n = s.n, scope = 'stage:' + n;
    const hidden = Spoil.hiddenStage(n, s.spoiler) && !Spoil.revealed.has(scope);
    const prog = stageProgress(n);
    const si = stageInfo(n);
    const focus = IDX.planet.get(s.focus);
    const next = IDX.stage.get(String(n + 1));
    const title = hidden ? 'Скрытый этап' : esc(s.title);
    const allReq = []; const seen = new Set();
    si.main.forEach(g => (g.req || []).forEach(c => { const k = JSON.stringify(c); if (!seen.has(k)) { seen.add(k); allReq.push(c); } }));
    this.reqs = allReq; this.stage = s;
    const quests = []; const qs = new Set();
    si.goals.forEach(g => [...(g.req || []).map(c => c.f), ...(g.marks || [])].forEach(f => { const d = f && IDX.fact.get(f); if (d && d.kind === 'quest' && !qs.has(f)) { qs.add(f); quests.push(d); } }));
    const sections = [
      { id: 'access', title: 'Условия доступа' }, { id: 'goals', title: 'Ближайшие цели' }, { id: 'quests', title: 'Связанные квесты' },
      { id: 'loot', title: 'Полезная добыча' }, { id: 'vendors', title: 'Синдикаты и продавцы' }, { id: 'prep', title: next ? 'Подготовка к этапу ' + (n + 1) : 'Что дальше' }
    ].filter(x => !hidden || ['access', 'goals'].includes(x.id));
    const head = UI.crumbs([{ path: '/?view=list', html: 'Карта и маршрут' }, { html: 'Этап ' + n + '. ' + (hidden ? 'Скрытый этап' : esc(s.short)) }]) +
      UI.pageTitle({
        media: '<div class="tn-pt-media">' + UI.orb(hidden && focus.spoiler ? null : focus.orb, 120, prog === 'current' ? 'current' : null) + '</div>',
        overline: 'Этап ' + n + ' · ' + esc(hidden ? 'поздняя игра' : s.short), title: 'Этап ' + n + ': ' + title,
        lead: hidden ? 'Название и описание этапа скрыты защитой от спойлеров. Условия доступа и прогресс видны.' : mask(s.lead, scope),
        meta: UI.status(prog, PROGRESS_WORD[prog] + (prog !== 'locked' ? ' · ' + si.doneMain + ' из ' + si.total + ' ' + plural(si.total, ['цели', 'целей', 'целей']) : '')) + '<span class="tn-sourcemeta">· По гайду, разделы ' + s.guide.join(', ') + '</span>',
        actions: '<a class="tn-btn" href="' + link('/?view=map&selected=' + s.focus) + '">' + icon('map') + 'На карте</a>' + (si.main.some(g => !isDone('goal:' + g.id) && !findTask('goal:' + g.id)) ? '<button class="tn-btn tn-btn--primary" data-act="add-stage-goals" data-n="' + n + '" data-key="add-stage-goals">' + icon('plus') + 'Добавить цели этапа</button>' : '<a class="tn-btn" href="' + link('/tasks') + '">' + icon('tasks') + 'Мои задачи</a>')
      });
    let art = '';
    art += '<section class="tn-stack" id="access"><h2 class="tn-text-h2" tabindex="-1">Условия доступа</h2>' +
      UI.access({ id: 'stage-access', title: 'Игровые условия целей этапа', titleCls: 'tn-text-body-strong', conds: allReq, add: allReq.length ? { groupRef: 'stage' } : null,
        note: 'Этап — порядок вложения сил по гайду, а не игровая блокировка. Здесь собраны условия игры для его основных целей.' }) + '</section>';
    if (hidden) {
      art += '<section class="tn-stack" id="goals"><h2 class="tn-text-h2" tabindex="-1">Ближайшие цели</h2>' + UI.spoiler(scope, 'Цели, квесты, добыча и продавцы этапа ' + n + ' — поздняя игра. Раскрывается только эта страница до ухода с неё.') + '</section>';
    } else {
      art += '<div data-revealed="' + scope + '" class="tn-stack tn-stack--xl">';
      if (Spoil.revealed.has(scope)) art += UI.spoilerShown(scope, 'этап ' + n);
      const main = si.main, side = si.goals.filter(g => g.kind === 'side');
      art += '<section class="tn-stack" id="goals"><h2 class="tn-text-h2" tabindex="-1">Ближайшие цели</h2><p class="tn-muted">Основной путь — по порядку. ' + (si.nearest ? 'Ближайшая цель подсвечена.' : 'Все основные цели отмечены выполненными.') + '</p>' +
        '<div class="tn-grid tn-grid--2">' + main.map((g, i) => UI.goalCard(g, { current: si.nearest && si.nearest.id === g.id, overline: 'Цель ' + (i + 1) + ' из ' + main.length + (si.nearest && si.nearest.id === g.id && prog === 'current' ? ' · Вы здесь' : ''), open: (this.openDetails || new Set()).has('req-' + g.id) })).join('') + '</div>' +
        (side.length ? '<div class="tn-stack tn-side"><h3 class="tn-text-h3">Дополнительные занятия</h3><p class="tn-muted">По желанию: не обязательны для продвижения, помогают попутно.</p><div class="tn-grid tn-grid--2">' + side.map(g => UI.goalCard(g, { overline: 'Дополнительно · этап ' + n, open: (this.openDetails || new Set()).has('req-' + g.id) })).join('') + '</div></div>' : '') + '</section>';
      art += '<section class="tn-stack" id="quests"><h2 class="tn-text-h2" tabindex="-1">Связанные квесты</h2>' + (quests.length ? '<p class="tn-muted">Квесты — ориентиры и ссылки; прохождение не пересказываем.</p><div class="tn-grid tn-grid--2">' + quests.map(UI.questCard).join('') + '</div>' : '<p class="tn-muted">На этом этапе нет отдельных квестов-ориентиров.</p>') + '</section>';
      const loot = s.loot.map(id => IDX.item.get(id)).filter(Boolean);
      art += '<section class="tn-stack" id="loot"><div class="tn-section-title"><h2 class="tn-text-h2" tabindex="-1">Полезная добыча</h2>' + UI.a('/loot', 'Вся добыча') + '</div>' +
        (loot.length ? '<div class="tn-grid tn-grid--2">' + loot.map(it => UI.itemCard(it)).join('') + '</div>' : '') +
        (s.builds.length ? '<h3 class="tn-text-h3">Сборки этапа</h3><div class="tn-grid tn-grid--2">' + s.builds.map(id => UI.buildCard(IDX.build.get(id))).join('') + '</div>' : '') +
        lootTable(s.loot.filter(id => (IDX.item.get(id).where || []).length), 'Где собирать ресурсы этапа ' + n, 'stage-loot-' + n) +
        (loot.some(it => it.where) ? UI.sourceMeta('g:17') : '') + '</section>';
      art += '<section class="tn-stack" id="vendors"><h2 class="tn-text-h2" tabindex="-1">Синдикаты и продавцы</h2>' + (s.vendors.length ? '<div class="tn-grid tn-grid--2">' + s.vendors.map(id => UI.vendorCard(IDX.vendor.get(id))).join('') + '</div>' : '<p class="tn-muted">На этом этапе покупки у продавцов не нужны.</p>') + '</section>';
      art += '<section class="tn-stack" id="prep"><h2 class="tn-text-h2" tabindex="-1">' + (next ? 'Подготовка к этапу ' + (n + 1) : 'Что дальше') + '</h2>' +
        (s.prep.length ? '<fieldset class="tn-filter"><legend class="tn-sr-only">Подготовка</legend>' + s.prep.map((t, i) => { const k = 'check:prep:' + n + ':' + i; return '<label class="tn-check" data-key="' + k + '"><input type="checkbox" data-act="toggle-step" data-done="' + k + '"' + (isDone(k) ? ' checked' : '') + '><span>' + mask(t, scope) + '</span></label>'; }).join('') + '</fieldset>' : '<p class="tn-muted">Это последний этап маршрута. Дальше — недельный план и широкий арсенал под ограничения эндгейма.</p>') +
        '<p class="tn-faint tn-small">Отметки подготовки — для вашего удобства; игровые условия они не меняют.</p>' + UI.sourceMeta('g:' + s.guide[0]) + '</section>';
      art += '</div>';
    }
    const aside = '<aside class="tn-stack tn-aside">' +
      '<div class="tn-panel tn-stack"><p class="tn-text-overline">Ваш прогресс</p>' + UI.stageProg({ head: '<span class="tn-text-body-strong">Этап ' + n + '</span><span class="tn-num tn-faint">' + si.doneMain + ' из ' + si.total + '</span>', done: si.doneMain, total: si.total, note: si.nearest ? 'Следующий шаг: ' + mask(si.nearest.title, scope) : 'Основные цели выполнены' }) + UI.save() + '</div>' +
      (next ? '<div class="tn-panel tn-stack"><p class="tn-text-overline">Следующий этап</p><div class="tn-cluster">' + UI.orb(Spoil.hiddenStage(next.n, next.spoiler) ? null : IDX.planet.get(next.focus).orb, 40) + '<div><p class="tn-text-body-strong">' + esc(stageTitle(next)) + '</p><p class="tn-faint tn-small">Этап ' + next.n + ' · ' + PROGRESS_WORD[stageProgress(next.n)].toLowerCase() + '</p></div></div><a class="tn-btn" href="' + link('/stage/' + next.n) + '">Открыть этап ' + next.n + '</a></div>' : '') +
      (s.tip && !hidden ? UI.callout(s.tip.tone || 'gold', esc(s.tip.title), mask(s.tip.text, scope)) : '') + '</aside>';
    return '<div class="tn-container tn-page">' + head + '<div class="tn-layout3">' + UI.toc(sections) + '<article class="tn-stack tn-stack--xl tn-article">' + art + '</article>' + aside + '</div></div>';
  },
  missingContext() { const s = this.stage; return { conds: this.reqs, groupRef: 'stage:' + s.n, groupTitle: 'Этап ' + s.n + ' · ' + s.short, stage: s.n }; },
  saveUI() { return { open: [...(this.openDetails || [])] }; },
  mount(main, ctx) { if (ctx.restore && ctx.restore.ui && ctx.restore.ui.open && !ctx.rerender) { this.openDetails = new Set(ctx.restore.ui.open); } },
  unmount() { }
};
Screens.stage.openDetails = new Set();
Actions['add-stage-goals'] = t => {
  const n = +t.dataset.n; const si = stageInfo(n);
  const specs = [], deps = [];
  si.main.filter(g => !isDone('goal:' + g.id)).forEach(g => { const r = goalTaskSpecs(g); const base = specs.length; r.specs.forEach(sp => specs.push(sp)); r.deps.forEach(d => deps.push({ task: base + d.task, on: d.on.map(x => base + x) })); });
  const res = addTasks(specs, deps);
  if (!res.ok) { Toast.saveError(() => Actions['add-stage-goals'](t), 'Задачи не добавлены.'); return; }
  Toast.show({ tone: 'success', title: res.created.length ? pl(res.created.length, ['задача добавлена', 'задачи добавлены', 'задач добавлено']) : 'Все цели уже в задачах', text: (res.reused.length ? 'Уже были: ' + res.reused.length + ' — не дублируем. ' : '') + savedText(res.ok), actions: [{ label: 'Открыть задачи', href: '/tasks' }] });
};

UI.buildCard = function (b) {
  const t = IDX.item.get(b.target);
  const missing = b.slots.filter(s => s.mod && ownedState(s.mod) === 'no').length;
  return '<article class="tn-card tn-card--interactive"><div class="tn-card__head"><span class="tn-card__icon">' + icon('build') + '</span><div class="tn-stack tn-stack--sm" style="gap:2px"><p class="tn-text-overline">Сборка · ' + esc(ITEMTYPE[t.type] === 'Варфрейм' ? 'варфрейм' : (SLOTNAME[t.slot] || 'оружие').toLowerCase()) + ' · этап ' + b.stage + '</p><h3 class="tn-card__title"><a class="tn-card__link" href="' + link('/build/' + b.id) + '">' + mask(b.title) + '</a></h3></div></div>' +
    '<p class="tn-muted tn-small">' + mask(b.lead) + '</p><div class="tn-markers">' + (missing ? UI.ready('rank', 'Не хватает: ' + missing) : '') + UI.tag(pl(b.slots.filter(s => s.mod).length, ['мод', 'мода', 'модов']), 'mod') + '</div></article>';
};

/* ── Страница планеты ─────────────────────────────────── */
Screens.planet = {
  nav: 'map',
  title(p) { const e = entity('planet:' + p.id); return e ? entPlain(e) : 'Место не найдено'; },
  place(p) { const e = entity('planet:' + p.id); return e && !e.hidden ? e.name : null; },
  render(p) {
    const loc = IDX.planet.get(p.id); if (!loc) return Screens.notFound.render();
    const e = entity('planet:' + p.id), scope = 'planet:' + p.id;
    const hidden = e.hidden && !Spoil.revealed.has(scope);
    const n = planetStage(loc); const st = IDX.stage.get(String(n));
    const prog = planetProgress(loc);
    this.loc = loc;
    const sections = [{ id: 'access', title: 'Условия доступа' }, { id: 'stages', title: 'Этапы маршрута' }, { id: 'places', title: 'Что здесь есть' }, { id: 'loot', title: 'Полезная добыча' }, { id: 'related', title: 'Режимы и продавцы' }].filter(x => !hidden || ['access', 'stages', 'places'].includes(x.id));
    const acts = D.activities.filter(a => a.loc === loc.id);
    const vends = D.vendors.filter(v => v.loc === loc.id);
    const synds = D.syndicates.filter(s => s.loc === loc.id);
    let art = '<section class="tn-stack" id="access"><h2 class="tn-text-h2" tabindex="-1">Условия доступа</h2>' +
      UI.access({ id: 'planet-access', title: 'Чтобы попасть сюда', titleCls: 'tn-text-body-strong', conds: loc.access || [], add: (loc.access || []).length ? { groupRef: 'planet' } : null,
        note: (loc.access || []).length ? '' : 'Отдельного условия нет: место открывается переходами Навигации по ходу основной карты. Если уже бывали здесь — отметьте «Открыта в игре» справа.' }) + '</section>';
    art += '<section class="tn-stack" id="stages"><h2 class="tn-text-h2" tabindex="-1">Этапы маршрута</h2><p class="tn-muted">Карта показывает, где находится содержание; что и когда делать — на страницах этапов.</p><ol class="tn-route" aria-label="Этапы, на которых актуально это место">' +
      loc.stages.map(x => { const s = IDX.stage.get(String(x)); const pr = stageProgress(x); return '<li class="tn-route__stage" data-progress="' + pr + '"><span class="tn-node tn-node--static" data-progress="' + pr + '"><span class="tn-node__dot">' + (pr === 'done' ? icon('check') : pr === 'locked' ? icon('lock') : x) + '</span></span><div><p class="tn-text-overline">Этап ' + x + ' · ' + PROGRESS_WORD[pr] + '</p><p class="tn-card__title">' + UI.a('/stage/' + x, esc(stageTitle(s)), 'tn-link tn-link--quiet') + '</p></div></li>'; }).join('') + '</ol></section>';
    if (hidden) art += '<section class="tn-stack" id="places"><h2 class="tn-text-h2" tabindex="-1">Что здесь есть</h2>' + UI.spoiler(scope, 'Описание места поздней игры (этап ' + Math.min(...loc.stages) + ') скрыто. Раскрывается только эта страница.') + '</section>';
    else {
      art += '<div class="tn-stack tn-stack--xl" data-revealed="' + scope + '">' + (Spoil.revealed.has(scope) ? UI.spoilerShown(scope, 'описание места') : '');
      art += '<section class="tn-stack" id="places"><h2 class="tn-text-h2" tabindex="-1">Что здесь есть</h2><p class="tn-prose">' + mask(loc.lead, scope) + '</p>' +
        ((loc.nodes || []).length ? '<ul class="tn-deps">' + loc.nodes.map(nd => { const h = nd.spoiler && Spoil.hiddenStage(nd.stage, true) && !Spoil.revealed.has(scope); return '<li data-met="unknown">' + icon(h ? 'eye-off' : 'mission') + '<span>' + (h ? 'Скрыто · этап ' + nd.stage : mask(nd.name, scope)) + (h ? '' : '<small>' + mask(nd.text, scope) + '</small>') + '</span><span class="tn-deps__state">' + (nd.stage ? 'этап ' + nd.stage : '') + '</span></li>'; }).join('') + '</ul>' : '') + '</section>';
      const loot = (loc.resources || []).map(id => IDX.item.get(id)).filter(Boolean);
      art += '<section class="tn-stack" id="loot"><h2 class="tn-text-h2" tabindex="-1">Полезная добыча</h2>' + (loot.length ? '<div class="tn-grid tn-grid--2">' + loot.map(it => UI.itemCard(it, { place: (it.where.find(w => w.loc === loc.id) || {}).text })).join('') + '</div>' + UI.sourceMeta('g:17') : '<p class="tn-muted">Гайд не выделяет здесь отдельных ресурсов.</p>') + '</section>';
      art += '<section class="tn-stack" id="related"><h2 class="tn-text-h2" tabindex="-1">Режимы и продавцы</h2>' +
        (acts.length || vends.length || synds.length ? '<div class="tn-grid tn-grid--2">' + acts.map(UI.activityCard).join('') + vends.map(UI.vendorCard).join('') + synds.filter(s => !vends.some(v => v.syndicate === s.id)).map(UI.syndicateCard).join('') + '</div>' : '<p class="tn-muted">Отдельных режимов и продавцов здесь нет.</p>') + '</section>';
      art += '</div>';
    }
    const head = UI.crumbs([{ path: '/?view=map', html: 'Карта и маршрут' }, { path: '/stage/' + n, html: 'Этап ' + n }, { html: hidden ? 'Скрытое место' : esc(loc.name) }]) +
      UI.pageTitle({ media: '<div class="tn-pt-media">' + UI.orb(hidden ? null : loc.orb, 120, prog === 'current' ? 'current' : null) + '</div>', overline: 'Планета · Этап ' + loc.stages.join(', '),
        title: hidden ? 'Скрытое место' : esc(loc.name), lead: hidden ? 'Название и описание скрыты защитой от спойлеров. Этапы и условия доступа видны.' : mask(loc.lead, scope),
        meta: UI.status(prog, PLANET_WORD[prog]) + (!hidden && loc.wiki ? '<span class="tn-sourcemeta">· ' + UI.ext(wikiRu(loc.wiki), 'Статья Wiki') + '</span>' : ''),
        actions: '<a class="tn-btn" href="' + link('/?view=map&selected=' + loc.id) + '">' + icon('map') + 'На карте</a><a class="tn-btn tn-btn--primary" href="' + link('/stage/' + n) + '">Открыть этап ' + n + '</a>' });
    const aside = '<aside class="tn-stack tn-aside"><div class="tn-panel tn-stack"><p class="tn-text-overline">Ваш прогресс</p>' + UI.status(prog, PLANET_WORD[prog]) + UI.openMark(loc, hidden) + '<p class="tn-muted tn-small">' + (Store.doc.stage ? 'Вы на этапе ' + Store.doc.stage + '.' : 'Этап не выбран.') + '</p><button class="tn-btn" data-act="change-stage">Изменить этап</button>' + UI.save() + '</div></aside>';
    return '<div class="tn-container tn-page">' + head + '<div class="tn-layout3">' + UI.toc(sections) + '<article class="tn-stack tn-stack--xl tn-article">' + art + '</article>' + aside + '</div></div>';
  },
  missingContext() { const l = this.loc; return { conds: l.access || [], groupRef: 'planet:' + l.id, groupTitle: l.name, stage: l.stages[0] }; }
};

/* ── 12-screen-reference.js ── */
/* 12-screen-reference.js — справочник: страница-список, разделы (Усиление, Моды, Синдикаты, Добыча), статьи гайда, «Поздняя игра». */

/* ── Отрисовка статьи из токенов гайда ─────────────────── */
function inl(toks, scope) {
  return toks.map(t => {
    if (t.t === 'text') return mask(t.v, scope);
    if (t.t === 'b') return '<b>' + inl(t.c, scope) + '</b>';
    if (t.t === 'a' && t.ref) { const e = entity(t.ref); return e ? '<a class="tn-link" href="' + link(e.path) + '">' + inl(t.c, scope) + '</a>' : inl(t.c, scope); }
    if (t.t === 'a') {
      const host = (t.href.match(/^https?:\/\/([^/]+)/) || [])[1] || '';
      const lang = /^ru\./.test(host) ? 'ru' : host.includes('wiki.warframe.com') ? 'en' : null;
      return UI.ext(t.href, inl(t.c, scope), { lang });
    }
    return '';
  }).join('');
}
const plainToks = toks => toks.map(t => t.t === 'text' ? t.v : plainToks(t.c || [])).join('');
function blockText(b) {
  if (b.c) return plainToks(b.c) + (b.title || '');
  if (b.items) return b.items.map(plainToks).join(' ');
  if (b.head) return b.head.map(plainToks).join(' ') + ' ' + b.body.map(r => r.map(plainToks).join(' ')).join(' ');
  return b.alt || '';
}
function renderBlocks(blocks, scope, caption, tidBase) {
  let ti = 0;
  return blocks.map(b => {
    switch (b.k) {
      case 'p': return '<p>' + inl(b.c, scope) + '</p>';
      case 'meta': return '<p class="tn-sourcemeta">' + icon('book') + inl(b.c, scope) + '</p>';
      case 'callout': return UI.callout(b.tone, mask(b.title, scope), inl(b.c, scope).replace(/^\s*[:.]\s*/, ''));
      case 'ol': return '<ol class="tn-prose-list">' + b.items.map(i => '<li>' + inl(i, scope) + '</li>').join('') + '</ol>';
      case 'ul': return '<ul class="tn-prose-list">' + b.items.map(i => '<li>' + inl(i, scope) + '</li>').join('') + '</ul>';
      case 'img': return '<p class="tn-sourcemeta tn-figure">' + icon('image-off') + '<span>Иллюстрация гайда: ' + mask(b.alt, scope) + '. Не встроена: условия использования изображения не проверены. ' + UI.ext(b.href, 'Открыть изображение') + '</span></p>';
      case 'table': {
        const id = tidBase + '-' + (ti++);
        const cols = b.head.length;
        return UI.table({ id, caption: mask(caption, scope) + (ti > 1 ? ' · ' + mask(plainToks(b.head[0]), scope) : ''), head: b.head.map(h => inl(h, scope)), rows: b.body.map(r => r.map(c => inl(c, scope))), num: b.num, sortable: b.body.length > 3, sort: TableSort[id], stack: cols <= 5 });
      }
    }
    return '';
  }).join('');
}

Screens.article = {
  nav: 'ref',
  title(p) { const a = IDX.articleSlug.get(p.slug); return a ? articleTitle(a) : 'Статья не найдена'; },
  place(p) { const a = IDX.articleSlug.get(p.slug); return a ? 'Справочник · ' + articleTitle(a) : null; },
  render(p) {
    const a = IDX.articleSlug.get(p.slug); if (!a) return Screens.notFound.render();
    const T = Spoil.threshold();
    const grp = D.groups.find(g => g.id === a.group);
    const subs = a.subs;
    const toc = subs.map(s => ({ id: 'sub-' + s.id, title: subHidden(a, s) ? 'Скрытый подраздел' : mask(s.title) }));
    let body = '';
    if (a.intro.length) {
      const scope = 'art:' + a.id + ':intro';
      body += '<section class="tn-prose tn-stack" data-revealed="' + scope + '">' + renderBlocks(a.intro, scope, articleTitle(a), 'a' + a.n + 'i') + revealTermsBtn(a.intro, scope) + '</section>';
    }
    subs.forEach(s => {
      const scope = 'art:' + a.id + ':' + s.id;
      if (subHidden(a, s)) {
        body += '<section class="tn-stack" id="sub-' + s.id + '"><h2 class="tn-text-h2" tabindex="-1">Скрытый подраздел</h2>' + UI.spoiler(scope, 'Подраздел о поздней игре (этап ' + s.spoiler + '). Раскрывается только этот блок до ухода со страницы.') + '</section>';
        return;
      }
      body += '<section class="tn-prose tn-stack" id="sub-' + s.id + '" data-revealed="' + scope + '"><h2 class="tn-text-h2" tabindex="-1">' + mask(s.title, scope) + '</h2>' +
        (s.spoiler && Spoil.revealed.has(scope) ? UI.spoilerShown(scope, 'подраздел «' + esc(s.title) + '»') : '') +
        renderBlocks(s.blocks, scope, s.title, 'a' + a.n + s.id) + revealTermsBtn(s.blocks, scope) + '</section>';
    });
    if (a.n === 21) body += '<section class="tn-stack" id="checklists"><h2 class="tn-text-h2" tabindex="-1">Отметить свою готовность</h2>' + readinessLists() + '</section>';
    const tools = (a.tools || []).map(t => toolCard(t)).filter(Boolean);
    const same = D.articles.filter(x => x.group === a.group && x.n !== a.n);
    const aside = '<aside class="tn-stack tn-aside">' +
      (tools.length ? '<div class="tn-panel tn-stack"><p class="tn-text-overline">Инструменты к статье</p>' + tools.join('') + '</div>' : '') +
      (same.length ? '<div class="tn-panel tn-stack"><p class="tn-text-overline">В этом разделе</p>' + same.map(x => UI.a('/article/' + x.slug, esc(articleTitle(x)), 'tn-link tn-link--quiet')).join('') + '</div>' : '') +
      '<p class="tn-faint tn-small">Текст — гайд «Warframe от пробуждения Тенно до эндгейма» v3, раздел ' + a.n + '; механики проверены автором ' + fdate(D.guide.checked) + '. Ссылки на Wiki открываются в новой вкладке.</p></aside>';
    const crumbs = [{ path: '/reference', html: 'Справочник' }];
    if (grp) crumbs.push({ path: grp.path, html: grp.title });
    else if (a.group === 'endgame') crumbs.push({ path: '/endgame', html: 'Поздняя игра' });
    crumbs.push({ html: esc(articleTitle(a)) });
    return '<div class="tn-container tn-page">' + UI.crumbs(crumbs) +
      UI.pageTitle({ overline: 'Раздел ' + a.n + ' гайда', title: esc(articleTitle(a)), lead: mask(a.lead), meta: UI.sourceMeta('g:' + a.n) }) +
      '<div class="tn-layout3">' + (toc.length ? UI.toc(toc) : '<div></div>') + '<article class="tn-stack tn-stack--xl tn-article">' + body + '</article>' + aside + '</div></div>';
  }
};
function articleTitle(a) { return a.spoilerTitle && hasMasked(a.title) ? a.spoilerTitle : maskPlain(a.title); }
function subHidden(a, s) { return s.spoiler && Spoil.hiddenStage(s.spoiler, true) && !Spoil.revealed.has('art:' + a.id + ':' + s.id); }
function revealTermsBtn(blocks, scope) {
  if (Spoil.revealed.has(scope)) return '';
  const txt = blocks.map(blockText).join(' ');
  if (!hasMasked(txt)) return '';
  return '<p class="tn-faint tn-small">' + icon('eye-off', 'tn-icon--sm') + ' Часть названий скрыта защитой от спойлеров. <button class="tn-linkbtn tn-link" data-act="reveal" data-scope="' + attr(scope) + '">Показать в этом блоке</button></p>';
}
/** Карточка инструмента статьи */
function toolCard(t) {
  const e = entity(t); if (!e) return '';
  const ic = { mod: 'mod', item: 'reward', build: 'build', vendor: 'vendor', activity: 'endgame', route: 'route', syndicate: 'syndicate' }[e.kind] || 'book';
  return '<a class="tn-toolink" href="' + link(e.path) + '">' + icon(ic) + '<span>' + entName(e) + '</span>' + icon('chevron-right', 'tn-icon--sm') + '</a>';
}
/** Проверочные списки раздела 21 — отметки сохраняются в браузере */
function readinessLists() {
  return Object.keys(D.readiness).filter(k => D.readiness[k].items).map(k => {
    const r = D.readiness[k];
    const done = r.items.filter((_, i) => isDone('check:ready:' + k + ':' + i)).length;
    return '<fieldset class="tn-filter tn-card" id="ready-' + k + '"><legend class="tn-text-body-strong">' + mask(r.title) + ' <span class="tn-faint tn-num">' + done + ' / ' + r.items.length + '</span></legend>' +
      r.items.map((it, i) => { const key = 'check:ready:' + k + ':' + i; return '<label class="tn-check" data-key="' + key + '"><input type="checkbox" data-act="toggle-step" data-done="' + key + '"' + (isDone(key) ? ' checked' : '') + '><span>' + mask(it) + '</span></label>'; }).join('') +
      '</fieldset>';
  }).join('') + '<p class="tn-faint tn-small">Это рекомендации готовности, а не игровые условия доступа. Отметки хранятся в этом браузере.</p>';
}

/* ── Справочник: страница-список ──────────────────────── */
Screens.reference = {
  nav: 'ref',
  title() { return 'Справочник'; },
  render() {
    const card = a => '<li class="tn-result tn-artlink"><p class="tn-result__title">' + UI.a('/article/' + a.slug, esc(articleTitle(a))) + '</p><p class="tn-result__path">Раздел ' + a.n + ' гайда</p><p class="tn-result__snippet">' + mask(a.lead) + '</p></li>';
    const grp = g => '<section class="tn-stack" id="g-' + g.id + '"><div class="tn-section-title"><h2 class="tn-text-h2">' + icon(g.icon, 'tn-icon--lg') + ' ' + g.title + '</h2>' + UI.a(g.path, 'Открыть раздел') + '</div><p class="tn-muted">' + esc(g.lead) + '</p><ul class="tn-results">' + D.articles.filter(a => a.group === g.id).map(card).join('') + '</ul></section>';
    return '<div class="tn-container tn-page tn-narrow">' + UI.crumbs([{ html: 'Справочник' }]) +
      UI.pageTitle({ overline: 'Справочник', title: 'Справочник по гайду', lead: 'Все 22 раздела гайда — статьями с таблицами, ссылками на Wiki и связанными инструментами: сборками, каталогом модов, магазинами и местами добычи. Заполнять прогресс не нужно.',
        actions: '<button class="tn-btn" data-act="open-search">' + icon('search') + 'Поиск</button>' }) +
      '<div class="tn-stack tn-stack--xl" style="padding:32px 0 64px">' +
      '<section class="tn-stack"><h2 class="tn-text-h2">' + icon('route', 'tn-icon--lg') + ' Маршрут и планирование</h2><ul class="tn-results">' + D.articles.filter(a => a.group === 'route').map(card).join('') + '</ul></section>' +
      D.groups.map(grp).join('') +
      '<section class="tn-stack"><div class="tn-section-title"><h2 class="tn-text-h2">' + icon('endgame', 'tn-icon--lg') + ' Поздняя игра</h2>' + UI.a('/endgame', 'Открыть раздел') + '</div><ul class="tn-results">' + D.articles.filter(a => a.group === 'endgame').map(card).join('') + '</ul></section>' +
      '<section class="tn-stack" id="glossary"><h2 class="tn-text-h2">' + icon('book', 'tn-icon--lg') + ' Словарь</h2>' + UI.table({ id: 'glossary', caption: 'Быстрый словарь (раздел 22)', head: ['Термин', 'Значение'], rows: D.glossary.map(g => [mask(g.term), mask(g.def)]), sortable: true, sort: TableSort.glossary, stack: true }) +
      '<p>' + UI.a('/article/glossary', 'Источники и обновления — раздел 22') + '</p></section></div></div>';
  }
};

/* ── Разделы справочника ──────────────────────────────── */
const ModFilter = { fams: ['galvanized', 'archon', 'augment', 'corrupted', 'sixty', 'primed', 'nightmare', 'companion', 'normal', 'umbra', 'riven'], cats: ['warframe', 'aura', 'rifle', 'shotgun', 'pistol', 'melee', 'companion', 'any'] };
Screens.group = {
  nav: 'ref',
  gid() { return current().path.slice(1); },
  title() { const g = D.groups.find(x => x.id === this.gid()); return g ? g.title : 'Справочник'; },
  render(p, query) {
    const g = D.groups.find(x => x.id === this.gid());
    const arts = D.articles.filter(a => a.group === g.id);
    let tools = '';
    if (g.id === 'boost') tools = this.boostTools();
    if (g.id === 'mods') tools = this.modsTools(query);
    if (g.id === 'syndicates') tools = this.syndTools();
    if (g.id === 'loot') tools = this.lootTools();
    return '<div class="tn-container tn-page">' + UI.crumbs([{ path: '/reference', html: 'Справочник' }, { html: g.title }]) +
      UI.pageTitle({ overline: 'Справочник', title: g.title, lead: esc(g.lead) }) +
      '<div class="tn-stack tn-stack--xl" style="padding:32px 0 64px"><section class="tn-stack"><h2 class="tn-text-h2">Статьи</h2><ul class="tn-results tn-results--grid">' +
      arts.map(a => '<li class="tn-result tn-artlink"><p class="tn-result__title">' + UI.a('/article/' + a.slug, esc(articleTitle(a))) + '</p><p class="tn-result__path">Раздел ' + a.n + ' гайда</p><p class="tn-result__snippet">' + mask(a.lead) + '</p></li>').join('') + '</ul></section>' + tools + '</div></div>';
  },
  boostTools() {
    const frames = D.items.filter(i => i.type === 'warframe');
    const weapons = D.items.filter(i => i.type === 'weapon');
    return '<section class="tn-stack" id="builds"><h2 class="tn-text-h2">Сборки гайда</h2><p class="tn-muted">Реальные слоты, ключевой мод, вместимость и путь к недостающему моду. Соло-сборки для всех варфреймов и оружия — во вкладках «Варфреймы» и «Оружие».</p><div class="tn-grid tn-grid--3">' + D.builds.filter(b => !b.solo).map(b => UI.buildCard(b)).join('') + '</div></section>' +
      '<section class="tn-stack" id="arsenal"><h2 class="tn-text-h2">Варфреймы и оружие</h2><p class="tn-muted">Отдельные вкладки: как получить, полярности, Прайм-версии и соло-сборка для каждого.</p><div class="tn-grid tn-grid--2">' +
        '<a class="tn-card tn-card--interactive tn-stack tn-stack--sm" href="' + link('/warframes') + '"><p class="tn-text-overline">Арсенал</p><p class="tn-card__title">Варфреймы · ' + D.items.filter(i => i.arsenal === 'frame').length + '</p><p class="tn-muted tn-small">Роли, способы получения, полярности, соло-сборки.</p></a>' +
        '<a class="tn-card tn-card--interactive tn-stack tn-stack--sm" href="' + link('/weapons') + '"><p class="tn-text-overline">Арсенал</p><p class="tn-card__title">Оружие · ' + D.items.filter(i => i.arsenal === 'weapon').length + '</p><p class="tn-muted tn-small">Основное, вторичное и ближний бой: ранг мастерства, полярности, соло-сборки.</p></a></div></section>' +
      '<section class="tn-stack" id="arcanes"><h2 class="tn-text-h2">Мистификаторы и поздние улучшения</h2><div class="tn-grid tn-grid--3">' + D.items.filter(i => i.type === 'arcane' || ['helminth-segment', 'archon-shard', 'incarnon-adapter', 'catalyst', 'reactor', 'forma'].includes(i.id)).map(i => UI.itemCard(i)).join('') + '</div></section>';
  },
  modsTools(query) {
    const fam = (query.get('family') || '').split(',').filter(Boolean);
    const cat = query.get('cat') || '';
    const own = query.get('own') || '';
    this.filterState = { fam, cat, own };
    const list = D.mods.filter(m => (!fam.length || fam.includes(m.family)) && (!cat || m.cat === cat || (cat === 'rifle' && m.cat === 'bow')) && (!own || ownedState(m.id) === own));
    const count = f => D.mods.filter(m => m.family === f).length;
    const chips = [...fam.map(f => ({ k: 'family', v: f, l: FAMILY[f] })), ...(cat ? [{ k: 'cat', v: cat, l: MODCAT[cat] }] : []), ...(own ? [{ k: 'own', v: own, l: own === 'yes' ? 'Есть у меня' : own === 'no' ? 'Нет у меня' : 'Не указано' }] : [])];
    const filters = '<div class="tn-filters" id="mod-filters"><fieldset class="tn-filter"><legend class="tn-text-overline">Категория мода</legend>' +
      ModFilter.fams.map(f => '<label class="tn-check" data-key="mf-' + f + '"><input type="checkbox" data-act="mod-filter" data-k="family" data-v="' + f + '"' + (fam.includes(f) ? ' checked' : '') + '>' + FAMILY[f] + '<span class="tn-check__count">' + count(f) + '</span></label>').join('') + '</fieldset>' +
      '<div class="tn-field"><label class="tn-field__label" for="mf-cat">Снаряжение</label><select class="tn-select" id="mf-cat" data-act="mod-filter" data-k="cat"><option value="">Любое</option>' + ModFilter.cats.map(c => '<option value="' + c + '"' + (cat === c ? ' selected' : '') + '>' + MODCAT[c] + '</option>').join('') + '</select></div>' +
      '<div class="tn-field"><label class="tn-field__label" for="mf-own">Наличие у вас</label><select class="tn-select" id="mf-own" data-act="mod-filter" data-k="own"><option value="">Все</option><option value="yes"' + (own === 'yes' ? ' selected' : '') + '>Есть у меня</option><option value="no"' + (own === 'no' ? ' selected' : '') + '>Нет у меня</option><option value="unknown"' + (own === 'unknown' ? ' selected' : '') + '>Не указано</option></select></div></div>';
    return '<section class="tn-stack" id="catalog"><h2 class="tn-text-h2">Каталог модов</h2><p class="tn-muted">Моды из сборок и разделов 7–11 гайда. Вместимость и эффект — по карточкам Wiki, проверено ' + fdate(D.siteChecked) + '; «—» — карточку не сверяли.</p>' +
      '<div class="tn-catalog"><div class="tn-catalog__side">' + filters + '</div><div class="tn-stack">' +
      '<button class="tn-btn tn-btn--block tn-catalog__fbtn" data-act="filters-drawer" data-key="filters-btn">' + icon('filter') + 'Фильтры' + (chips.length ? ' <span class="tn-count">' + chips.length + '</span>' : '') + '</button>' +
      (chips.length ? '<div class="tn-chipbar" aria-label="Активные фильтры">' + chips.map(c => '<span class="tn-chip">' + esc(c.l) + '<button class="tn-chip__remove" data-act="chip-remove" data-k="' + c.k + '" data-v="' + c.v + '" aria-label="Убрать фильтр «' + esc(c.l) + '»" data-key="chip-' + c.k + '-' + c.v + '">' + icon('close', 'tn-icon--sm') + '</button></span>').join('') + '<button class="tn-btn tn-btn--ghost tn-btn--sm" data-act="chip-clear" data-key="chip-clear">Сбросить все</button></div>' : '') +
      '<p class="tn-muted" aria-live="polite" id="mod-count">Найдено ' + pl(list.length, ['мод', 'мода', 'модов']) + '</p>' +
      (list.length ? '<div class="tn-grid tn-grid--3">' + list.map(UI.modCard).join('') + '</div>' : UI.empty('filter', 'Фильтры ничего не нашли', 'Измените или сбросьте фильтры.', '<button class="tn-btn" data-act="chip-clear">Сбросить фильтры</button>')) +
      '</div></div></section>';
  },
  syndTools() {
    const mr = Facts.get('mr');
    const fac = D.syndicates.filter(s => s.kind === 'faction'), grp = D.syndicates.filter(s => s.kind !== 'faction');
    return '<section class="tn-stack" id="factions"><h2 class="tn-text-h2">Шесть основных синдикатов</h2><p class="tn-muted">Присяга — с 3-го ранга мастерства. Союзник получает +50% вашей прибавки, соперник теряет 50%, враг — 100%.</p><div class="tn-grid tn-grid--2">' + fac.map(UI.syndicateCard).join('') + '</div>' + UI.sourceMeta('w:Syndicates') + '</section>' +
      '<section class="tn-stack" id="groups"><h2 class="tn-text-h2">Независимые группы</h2><div class="tn-grid tn-grid--2">' + grp.map(UI.syndicateCard).join('') + '</div></section>' +
      '<section class="tn-stack" id="shops"><h2 class="tn-text-h2">Магазины за отдельные валюты</h2><div class="tn-grid tn-grid--2">' + ['arbitration-honors', 'teshin', 'chipper', 'palladino', 'baro'].map(id => UI.vendorCard(IDX.vendor.get(id))).join('') + '</div></section>' +
      '<section class="tn-stack" id="cap"><h2 class="tn-text-h2">Дневной лимит репутации</h2><div class="tn-card tn-stack"><p>Обычный дневной лимит — <b>16 000 + 500 × ранг мастерства</b>. Остаток конкретной группы смотрите в её интерфейсе; дневной лимит и предел накопления ранга — разные ограничения.</p>' +
      (mr != null ? '<div class="tn-stats" role="list"><div class="tn-stat" role="listitem"><span class="tn-stat__label">Ваш ранг мастерства</span><span class="tn-stat__value">' + mr + '</span></div><div class="tn-stat" role="listitem"><span class="tn-stat__label">Лимит в день</span><span class="tn-stat__value">' + fmt(16000 + 500 * mr) + '</span></div></div>' : '<p class="tn-muted">Ранг мастерства не указан. <button class="tn-linkbtn tn-link" data-act="set-mr">Указать</button></p>') +
      UI.sourceMeta('w:Syndicates') + '</div></section>';
  },
  lootTools() {
    const res = D.items.filter(i => i.type === 'resource' && (i.where || []).length);
    const cur = D.items.filter(i => i.type === 'currency');
    const p = +(this.oddsP || 5), n = +(this.oddsN || 20);
    const at = 1 - Math.pow(1 - p / 100, n);
    return '<section class="tn-stack" id="resources"><h2 class="tn-text-h2">Где собирать ресурсы</h2>' + lootTable(res.map(r => r.id), 'Ресурсы обычной карты и поздних систем', 'loot-all') + UI.sourceMeta('g:17') + '</section>' +
      '<section class="tn-stack" id="currencies"><h2 class="tn-text-h2">Валюты</h2><div class="tn-grid tn-grid--3">' + cur.map(i => UI.itemCard(i)).join('') + '</div></section>' +
      '<section class="tn-stack" id="odds"><h2 class="tn-text-h2">Вероятность без ложных обещаний</h2><div class="tn-card tn-stack"><p>Шанс хотя бы одного выпадения за <i>n</i> независимых попыток: 1 − (1 − <i>p</i>)<sup><i>n</i></sup>. Среднее число попыток не означает гарантию.</p>' +
      '<div class="tn-cluster" style="gap:16px"><div class="tn-field"><label class="tn-field__label" for="odds-p">Шанс за попытку, %</label><input class="tn-input tn-input--num" id="odds-p" type="number" min="0.01" max="100" step="0.01" value="' + p + '" data-act="odds" data-k="p"></div><div class="tn-field"><label class="tn-field__label" for="odds-n">Попыток</label><input class="tn-input tn-input--num" id="odds-n" type="number" min="1" max="1000" value="' + n + '" data-act="odds" data-k="n"></div></div>' +
      '<div class="tn-stats" role="list" aria-live="polite"><div class="tn-stat" role="listitem"><span class="tn-stat__label">Хотя бы одно выпадение</span><span class="tn-stat__value" id="odds-out">' + fmt((at * 100).toFixed(1)) + ' %</span></div><div class="tn-stat" role="listitem"><span class="tn-stat__label">Попыток для ~95%</span><span class="tn-stat__value" id="odds-95">' + (p > 0 && p < 100 ? Math.ceil(Math.log(0.05) / Math.log(1 - p / 100)) : '—') + '</span></div></div>' +
      '<p class="tn-faint tn-small">Пример гайда: при 5% среднее — 20 попыток, но за 20 попыток вероятность ≈ 64%, а для ≈ 95% нужно около 59. Сияющая реликвия: 10% редкой части; при четырёх открытиях ≈ 34,4%.</p>' + UI.sourceMeta('w:Void_Relic_Math') + '</div></section>';
  },
  saveUI() { return null; }
};
Actions.odds = t => {
  const sc = Screens.group; sc['odds' + t.dataset.k.toUpperCase()] = t.value;
  const p = Math.max(0, Math.min(100, +(document.getElementById('odds-p').value) || 0)), n = Math.max(1, Math.floor(+(document.getElementById('odds-n').value) || 1));
  sc.oddsP = p; sc.oddsN = n;
  document.getElementById('odds-out').textContent = fmt((100 * (1 - Math.pow(1 - p / 100, n))).toFixed(1)) + ' %';
  document.getElementById('odds-95').textContent = p > 0 && p < 100 ? Math.ceil(Math.log(0.05) / Math.log(1 - p / 100)) : '—';
};
document.addEventListener('input', e => { if (e.target.dataset && e.target.dataset.act === 'odds') Actions.odds(e.target); });
/** Фильтры пишутся в адрес: возврат от мода восстанавливает их */
function setModFilter(k, v, on) {
  const q0 = current().query;
  if (k === 'family') { const s = new Set((q0.get('family') || '').split(',').filter(Boolean)); if (on) s.add(v); else s.delete(v); if (s.size) q0.set('family', [...s].join(',')); else q0.delete('family'); }
  else if (v) q0.set(k, v); else q0.delete(k);
  const qs = q0.toString();
  try { history.replaceState(Object.assign({}, history.state), '', link('/mods' + (qs ? '?' + qs : '') + '#catalog')); } catch (e) {}
  rerender();
  announce(document.getElementById('mod-count') ? document.getElementById('mod-count').textContent : '');
}
Actions['mod-filter'] = (t, e) => { if (e.type !== 'change') return; setModFilter(t.dataset.k, t.dataset.k === 'family' ? t.dataset.v : t.value, t.checked); };
Actions['chip-remove'] = t => {
  const chip = t.closest('.tn-chip'); const sib = chip.nextElementSibling && chip.nextElementSibling.classList.contains('tn-chip') ? chip.nextElementSibling : chip.previousElementSibling;
  const nextKey = sib ? (sib.querySelector('[data-key]') || sib).dataset.key : 'chip-clear';
  setModFilter(t.dataset.k, t.dataset.k === 'family' ? t.dataset.v : '', false);
  const f = document.querySelector('[data-key="' + nextKey + '"]') || document.querySelector('[data-key="chip-clear"]') || document.getElementById('mod-count'); if (f) { if (!f.matches('button')) f.tabIndex = -1; f.focus(); }
};
Actions['chip-clear'] = () => { try { history.replaceState(Object.assign({}, history.state), '', link('/mods#catalog')); } catch (e) {} rerender(); const h = document.getElementById('mod-count'); if (h) { h.tabIndex = -1; h.focus(); } announce('Фильтры сброшены'); };
Actions['filters-drawer'] = () => {
  const html = document.getElementById('mod-filters').outerHTML.replace('id="mod-filters"', 'id="mod-filters-dr"').replace(/id="mf-/g, 'id="mfd-').replace(/for="mf-/g, 'for="mfd-');
  const dr = Overlay.drawer({ title: 'Фильтры', body: html, sheet: isPhone(), foot: '<button class="tn-btn" data-act="chip-clear" data-ov="close">Сбросить</button><button class="tn-btn tn-btn--primary" data-ov="close">' + esc(document.getElementById('mod-count').textContent) + '</button>',
    onRefresh() { const b = dr.box.querySelector('.tn-objpanel__body'); const ae = document.activeElement; const key = ae && ae.closest('[data-key]') ? ae.closest('[data-key]').dataset.key : null; b.innerHTML = document.getElementById('mod-filters').outerHTML.replace('id="mod-filters"', 'id="mod-filters-dr"').replace(/id="mf-/g, 'id="mfd-').replace(/for="mf-/g, 'for="mfd-'); dr.box.querySelector('.tn-objpanel__foot .tn-btn--primary').textContent = document.getElementById('mod-count').textContent; if (key) { const x = b.querySelector('[data-key="' + key + '"] input'); if (x) x.focus(); } } });
};

/* ── Поздняя игра ─────────────────────────────────────── */
UI.activityCard = function (a) {
  const e = entity('activity:' + a.id);
  const evs = (a.access || []).map(evalCond);
  const loc = a.loc ? IDX.planet.get(a.loc) : null;
  return '<article class="tn-card tn-card--interactive"><div class="tn-card__head"><span class="tn-card__icon">' + icon('endgame') + '</span><div class="tn-stack tn-stack--sm" style="gap:2px"><p class="tn-text-overline">' + ({ weekly: 'Неделя', daily: 'Каждый день', mode: 'Режим', boss: 'Босс', system: 'Система', farm: 'Фарм' }[a.kind] || 'Режим') + ' · этап ' + a.stage + '</p><h3 class="tn-card__title"><a class="tn-card__link" href="' + link(e.path) + '">' + entName(e) + '</a></h3></div></div>' +
    '<p class="tn-muted tn-small">' + mask(a.lead) + '</p><div class="tn-markers">' + UI.condSummary(evs) + (loc ? UI.tag(entName(entity('planet:' + loc.id)), 'planet') : '') + '</div></article>';
};
Screens.endgame = {
  nav: 'endgame',
  title() { return 'Поздняя игра'; },
  render() {
    const acts = D.activities.filter(a => a.stage >= 4 || a.kind === 'weekly');
    const rows = acts.map(a => { const evs = (a.access || []).map(evalCond); const e = entity('activity:' + a.id);
      return [UI.a(e.path, entName(e), 'tn-link tn-link--quiet'), String(a.stage), (a.access || []).length ? evs.map(x => esc(maskPlain(x.label))).join('; ') : 'нет', UI.condSummary(evs), mask(a.rewards[0] || '')]; });
    const arts = D.articles.filter(a => a.group === 'endgame');
    return '<div class="tn-container tn-page">' + UI.crumbs([{ path: '/reference', html: 'Справочник' }, { html: 'Поздняя игра' }]) +
      UI.pageTitle({ overline: 'Поздняя игра', title: 'Поздняя игра: доступ, подготовка, план', lead: 'Обязательный доступ — игровые условия. Рекомендуемая подготовка — советы гайда. Личный план — задачи, которые вы решили сделать.', actions: '<a class="tn-btn" href="' + link('/tasks') + '">' + icon('tasks') + 'Мои задачи</a>' }) +
      '<div class="tn-stack tn-stack--xl" style="padding:32px 0 64px">' +
      '<section class="tn-stack" id="activities"><h2 class="tn-text-h2">Режимы и условия доступа</h2>' +
      UI.table({ id: 'endgame', caption: 'Поздние активности: условия и ваша готовность', head: ['Режим', 'Этап', 'Обязательный доступ', 'Ваш статус', 'Основная награда'], num: [false, true, false, false, false], rows, sortable: true, sort: TableSort.endgame }) +
      '<div class="tn-grid tn-grid--3">' + acts.map(UI.activityCard).join('') + '</div>' + UI.sourceMeta('g:15') + '</section>' +
      '<section class="tn-stack" id="pulses"><h2 class="tn-text-h2">Недельные поисковые импульсы</h2>' + UI.callout('info', 'Пять импульсов на неделю — общие', 'Ячейки Нетры тратят по импульсу за заход с наградой; Глубинная и Временная Архимедия — по два за недельный набор. Сначала осмотрите условия Архимедии, затем распределяйте импульсы.') +
      UI.table({ id: 'pulses', caption: 'Как распределить пять импульсов (раздел 15)', head: ['Распределение', 'Когда разумно'], rows: [['5 заходов в Ячейки Нетры', 'Начинаете и пока не готовы к Архимедии'], ['1 Архимедия + 3 захода в Ячейки Нетры', 'Одна ветка уверенно проходится'], ['Глубинная + Временная Архимедия + 1 заход в Ячейки Нетры', 'Обе ветки доступны, и вы готовы к их прохождению']].map(r => r.map(c => mask(c))), stack: true }) + UI.sourceMeta('w:Deep_Archimedea') + '</section>' +
      '<section class="tn-stack" id="readiness"><h2 class="tn-text-h2">Проверка готовности</h2>' + readinessLists() + '</section>' +
      '<section class="tn-stack" id="articles"><h2 class="tn-text-h2">Статьи</h2><ul class="tn-results tn-results--grid">' + arts.map(a => '<li class="tn-result tn-artlink"><p class="tn-result__title">' + UI.a('/article/' + a.slug, esc(articleTitle(a))) + '</p><p class="tn-result__path">Раздел ' + a.n + ' гайда</p><p class="tn-result__snippet">' + mask(a.lead) + '</p></li>').join('') + '</ul></section>' +
      '</div></div>';
  }
};

/* ── 13-screen-entity.js ── */
/* 13-screen-entity.js — страницы предмета, мода, продавца, синдиката, активности, квеста и сборки.
   Эталон: ScreenItem (вкладки «Обзор / Где получить / В сборках», выбранный источник, покупка, шкала репутации, путь к предмету)
   и BuildSection (слоты, ключевой и недостающий мод, вместимость, параметры, объяснение недостающего). */

UI.syndicateCard = function (s) {
  const e = entity('syndicate:' + s.id);
  const hidden = e.hidden;
  const rel = (list, kind, sym, word) => (list || []).map(id => { const x = entity('syndicate:' + id); return '<p class="tn-relation" data-rel="' + kind + '"><span class="tn-relation__sym" aria-hidden="true">' + sym + '</span> ' + word + ': <b>' + entName(x) + '</b></p>'; }).join('');
  const offers = s.vendor ? IDX.vendor.get(s.vendor).offers.filter(o => o.reco).length : 0;
  return '<article class="tn-card tn-card--interactive tn-synd"><div class="tn-card__head"><span class="tn-emblem" aria-hidden="true">' + (hidden ? '?' : esc(s.short)) + '</span><div class="tn-stack tn-stack--sm" style="gap:2px"><p class="tn-text-overline">' + ({ faction: 'Синдикат', group: 'Группа', garrison: 'Гарнизон' }[s.kind]) + ' · ' + mask(s.where) + '</p><h3 class="tn-card__title"><a class="tn-card__link" href="' + link(e.path) + '">' + entName(e) + '</a></h3></div></div>' +
    UI.standing(s, {}) +
    (s.kind === 'faction' ? '<div class="tn-relations">' + rel(s.allied, 'allied', '⊕', 'Союзник') + rel(s.opposed, 'opposed', '⊖', 'Противник') + rel(s.enemy, 'enemy', '⊗', 'Враг') + '</div>' : '<p class="tn-muted tn-small">' + (hidden ? 'Описание скрыто защитой от спойлеров.' : mask(s.use)) + '</p>') +
    (offers ? '<div class="tn-card__foot"><span class="tn-faint">' + pl(offers, ['полезная покупка', 'полезные покупки', 'полезных покупок']) + '</span></div>' : '') + '</article>';
};

/* ── Общие части страниц сущностей ────────────────────── */
function backFrom(query) {
  const from = query.get('from'); if (!from) return '';
  const slot = query.get('slot');
  const e = entity(from); if (!e) return '';
  const path = e.path + (slot ? '?slot=' + slot : '');
  return '<a class="tn-btn tn-btn--ghost tn-btn--sm tn-backlink" href="' + link(path) + '" data-back="1" data-key="backlink">' + icon('chevron-left', 'tn-icon--sm') + 'Назад к ' + (e.kind === 'build' ? 'сборке ' : '') + '«' + entName(e) + '»' + (slot ? ' · слот ' + slot : '') + '</a>';
}
function tabs(id, list, sel) {
  return '<div class="tn-tabs" role="tablist" aria-label="Разделы" id="' + id + '">' + list.map(t => '<button class="tn-tab" role="tab" id="tab-' + t.id + '" aria-controls="panel-' + t.id + '" aria-selected="' + (t.id === sel) + '"' + (t.id === sel ? '' : ' tabindex="-1"') + ' data-act="tab" data-tab="' + t.id + '" data-key="tab-' + t.id + '">' + t.label + (t.count != null ? ' <span class="tn-count">' + t.count + '</span>' : '') + '</button>').join('') + '</div>';
}
Actions.tab = t => {
  const q0 = current().query; q0.set('tab', t.dataset.tab);
  try { history.replaceState(Object.assign({}, history.state), '', link(current().path + '?' + q0.toString())); } catch (e) {}
  rerender();
  const b = document.querySelector('[data-key="tab-' + t.dataset.tab + '"]'); if (b) b.focus();
};
Actions['select-way'] = t => {
  const q0 = current().query; q0.set('way', t.dataset.way); q0.set('tab', 'where');
  try { history.replaceState(Object.assign({}, history.state), '', link(current().path + '?' + q0.toString())); } catch (e) {}
  rerender();
  const row = document.querySelector('[data-key="way-' + t.dataset.way + '"]'); if (row) { const b = row.querySelector('button'); if (b) b.focus(); }
  announce('Выбран способ получения');
};
/** Вкладка «Где получить»: источники, выбранная цепочка, покупка с рангом и объяснение задач */
function whereTab(obj, ref, query) {
  const ways = obj.ways || [];
  if (!ways.length) return UI.empty('help', 'Нет проверенных сведений о получении', 'Гайд не называет источник, а на сайте его не сверяли. Проверьте страницу в Wiki.', UI.wikiLink(obj, 'Открыть статью Wiki'));
  const wsel = ways.find(w => w.id === query.get('way')) || ways.find(w => w.recommended) || ways[0];
  const from = query.get('from') ? '?from=' + encodeURIComponent(query.get('from')) + (query.get('slot') ? '&slot=' + query.get('slot') : '') : '';
  let h = '<section class="tn-stack"><h2 class="tn-text-h2">Источники</h2>' + (ways.length > 1 ? '<p class="tn-muted">Способов несколько — выберите удобный. Торговлю за платину мы не предлагаем по умолчанию, если есть игровой путь.</p>' : '') +
    '<div class="tn-sources" role="list" aria-label="Где получить">' + ways.map(w => UI.sourceRow(w, { selected: w === wsel })).join('') + '</div></section>';
  // покупка у продавца (если путь — продавец с известным предложением)
  const vids = new Set();
  wsel.steps.forEach(s => { (s.vendors || []).forEach(v => vids.add(v)); if (s.link && s.link.startsWith('vendor:')) vids.add(s.link.slice(7)); });
  const offerKey = obj.id;
  const purchases = [...vids].map(vid => { const v = IDX.vendor.get(vid); const o = v && v.offers.find(x => x.item === offerKey); return o ? { v, o } : null; }).filter(Boolean);
  if (purchases.length) {
    h += '<section class="tn-stack"><h2 class="tn-text-h2">Покупка</h2>' + purchases.map(({ v, o }) => {
      const synd = v.syndicate ? IDX.syndicate.get(v.syndicate) : null;
      const st = synd ? Store.doc.standing[synd.id] || {} : {};
      let explain = 'Создадим задачу «Купить …».';
      if (synd && o.rank != null && st.rank != null && st.rank < o.rank) explain = 'Создадим связанные задачи: «Поднять ранг ' + q(maskPlain(synd.name)) + ' до ' + o.rank + '»' + (o.cost != null && st.value != null && st.value < o.cost ? ', «Накопить репутацию»' : '') + ' и «Купить». Покупка откроется после них.';
      else if (synd && o.rank != null && st.rank == null) explain = 'Ваш ранг не указан, поэтому кроме «Купить» добавим «Поднять ранг ' + q(maskPlain(synd.name)) + ' до ' + o.rank + '» — её можно закрыть сразу, если ранг уже есть. Покупка откроется после неё.';
      return UI.purchase(o, v) + (synd ? '<div class="tn-card">' + UI.standing(synd, { title: '«' + entName(entity('syndicate:' + synd.id)) + '»', target: o.rank, note: o.rank != null && st.rank != null && st.value != null && synd.ranks && synd.ranks.max ? (st.rank < o.rank ? 'Нужен ранг ' + o.rank + '. Ранг повышается в интерфейсе синдиката; лимиты — в ' + UI.a('/article/syndicates', 'статье о репутации') : 'Ранг достаточен. Цена покупки — ' + fmt(o.cost) + '; у вас ' + fmt(st.value) + '.') : UI.a('/syndicate/' + synd.id, 'Как поднять репутацию') }) + '</div>' : '') +
        UI.callout('info', 'При добавлении в задачи', esc(explain) + ' Репутация не списывается — это личный план.') + UI.sourceMeta(o.src);
    }).join('') + '</section>';
  }
  h += '<section class="tn-stack"><h2 class="tn-text-h2">Цепочка: ' + mask(wsel.title) + '</h2>' + UI.chain(wsel, { obj, fromQuery: from }) + UI.sourceMeta(wsel.src || 'guide') + '</section>';
  return h;
}
/** Задача «Получить X» с зависимостями от невыполненных условий выбранного пути */
Actions['add-obtain'] = t => {
  const ref = t.dataset.ref; const e = entity(ref);
  const way = (e.obj.ways || []).find(w => w.id === t.dataset.way) || (e.obj.ways || [])[0];
  const groupTitle = entPlain(e);
  const specs = [{ ref: 'obtain:' + ref, title: 'Получить ' + q(groupTitle), href: e.path + '?tab=where' + (way ? '&way=' + way.id : ''), group: 'obtain:' + ref, groupTitle, kind: 'obtain', ctx: way ? maskPlain(way.title) : '', stage: e.stage }];
  if (way) way.steps.forEach(s => (s.req || []).map(evalCond).filter(x => x.state !== 'yes' && !x.parts).forEach(x => specs.push(taskSpecCond(x, 'obtain:' + ref, groupTitle, e.stage))));
  const res = addTasks(specs, specs.length > 1 ? [{ task: 0, on: specs.map((_, i) => i).slice(1) }] : []);
  if (!res.ok) { Toast.saveError(() => Actions['add-obtain'](t), 'Задача не добавлена.'); return; }
  const n = res.created.length;
  Toast.show({ tone: 'success', title: n > 1 ? pl(n, ['задача добавлена', 'задачи добавлены', 'задач добавлено']) : n ? 'Задача добавлена' : 'Уже в задачах', text: (res.reused.length ? 'Общие условия не дублируем (' + res.reused.length + '). ' : '') + savedText(res.ok), actions: [{ label: 'Открыть задачи', href: '/tasks' }] });
};
function obtainExplain(obj, query) {
  const ways = obj.ways || []; if (!ways.length) return '';
  const w = ways.find(x => x.id === query.get('way')) || ways.find(x => x.recommended) || ways[0];
  const miss = []; w.steps.forEach(s => (s.req || []).map(evalCond).forEach(x => { if (x.state !== 'yes') miss.push(x); }));
  return { way: w, text: miss.length ? 'Вместе с задачей добавим ' + pl(miss.length, ['задачу', 'задачи', 'задач']) + ' на невыполненные или неуказанные условия пути «' + maskPlain(w.title) + '».' : 'Добавим задачу по пути «' + maskPlain(w.title) + '».' };
}
function ownedControls(id, label) {
  const s = ownedState(id);
  return '<div class="tn-stack tn-stack--sm"><p class="tn-text-overline">' + (label || 'Есть ли у вас') + '</p><div class="tn-segmented" role="group" aria-label="' + esc(label || 'Есть ли у вас') + '">' +
    [['yes', 'Есть'], ['no', 'Нет'], ['unset', 'Не указано']].map(o => '<button aria-pressed="' + (s === (o[0] === 'unset' ? 'unknown' : o[0])) + '" data-act="set-owned" data-id="' + id + '" data-val="' + o[0] + '" data-key="own-' + id + '-' + o[0] + '">' + o[1] + '</button>').join('') + '</div><p class="tn-faint tn-small">Отметка только для вашего плана; в игре ничего не меняется.</p></div>';
}
/** Путь к предмету в правой колонке (как «Ваш путь к моду» в ScreenItem) */
function pathAside(e, query, way) {
  const from = query.get('from'); const slot = query.get('slot');
  const steps = [];
  if (from) { const fe = entity(from); if (fe) steps.push(['done', fe.kind === 'build' ? 'Сборка' : 'Откуда пришли', '«' + entName(fe) + '»' + (slot ? ', слот ' + slot : '')]); }
  steps.push(['done', e.kind === 'mod' ? 'Мод' : 'Предмет', 'Вы здесь']);
  if (way) {
    steps.push(['current', 'Источник: ' + ({ vendor: 'продавец', drop: 'добыча', quest: 'квест', craft: 'изготовление', reward: 'награда', trade: 'обмен' }[way.kind] || 'способ'), mask(way.title)]);
    way.steps.forEach(s => (s.req || []).map(evalCond).filter(x => x.state !== 'yes').forEach(x => steps.push([x.state === 'no' ? 'locked' : 'available', 'Условие', mask(x.label)])));
  }
  steps.push([findTask('obtain:' + (e.kind + ':' + e.id)) ? 'done' : 'available', 'Задача сохранена', UI.a('/tasks', '«Мои задачи»', 'tn-link tn-link--quiet')]);
  return '<div class="tn-panel tn-stack"><p class="tn-text-overline">Ваш путь ' + (e.kind === 'mod' ? 'к моду' : 'к предмету') + '</p><ol class="tn-route" aria-label="Путь">' + steps.map((s, i) => '<li class="tn-route__stage" data-progress="' + s[0] + '"><span class="tn-node tn-node--static" data-progress="' + s[0] + '"><span class="tn-node__dot">' + (s[0] === 'done' ? icon('check') : s[0] === 'locked' ? icon('lock') : (i + 1)) + '</span></span><div><p class="tn-text-body-strong">' + s[1] + '</p><p class="tn-faint tn-small">' + s[2] + '</p></div></li>').join('') + '</ol></div>';
}

/* ── Мод ──────────────────────────────────────────────── */
Screens.mod = {
  nav: 'ref',
  title(p) { const e = entity('mod:' + p.id); return e ? entPlain(e) : 'Мод не найден'; },
  place(p) { const e = entity('mod:' + p.id); return e ? 'Мод · ' + entPlain(e) : null; },
  render(p, query) {
    const m = IDX.mod.get(p.id); if (!m) return Screens.notFound.render();
    const e = entity('mod:' + m.id);
    const inBuilds = D.builds.map(b => ({ b, slots: b.slots.map((s, i) => ({ s, i })).filter(x => x.s.mod === m.id || (x.s.alt || []).includes(m.id) || x.s.later === m.id), aura: b.aura && b.aura.mod === m.id })).filter(x => x.slots.length || x.aura);
    const tab = query.get('tab') || (query.get('from') ? 'where' : 'overview');
    const ox = obtainExplain(m, query);
    const keyIn = inBuilds.some(x => x.slots.some(y => y.s.key && y.s.mod === m.id));
    const markers = [UI.rarity(m.rarity), keyIn ? UI.reco('Ключевой в сборке') : '', ownedMarker(m.id)].filter(Boolean).slice(0, 3).join('');
    const head = '<div class="tn-cluster tn-crumbrow">' + UI.crumbs([{ path: '/reference', html: 'Справочник' }, { path: '/mods', html: 'Моды' }, { path: '/mods?family=' + m.family + '#catalog', html: FAMILY[m.family] }, { html: entName(e) }]) + backFrom(query) + '</div>' +
      UI.pageTitle({ media: '<div class="tn-thumb tn-thumb--lg tn-pt-media">' + icon('mod', 'tn-icon--lg') + '</div>', overline: 'Мод · ' + FAMILY[m.family] + ' · ' + (MODCAT[m.cat] || ''), title: entName(e), markers,
        lead: m.effect ? mask(m.effect) + (m.card ? ' на максимальном ранге.' : '') : 'Нет проверенных данных об эффекте.',
        actions: UI.taskBtn('obtain:mod:' + m.id, 'add-obtain', 'Добавить в задачи', { data: ' data-way="' + (ox ? ox.way.id : '') + '"' }) });
    const tabsHtml = tabs('mod-tabs', [{ id: 'overview', label: 'Обзор' }, { id: 'where', label: 'Где получить', count: (m.ways || []).length }, { id: 'builds', label: 'В сборках', count: inBuilds.length }], tab);
    let panel = '';
    if (tab === 'overview') {
      panel = '<section class="tn-stack">' + UI.props([
        ['Тип', 'Мод · ' + FAMILY[m.family]], ['Совместимость', esc(MODCAT[m.cat] || '—') + (m.for ? ' · ' + UI.ref('item:' + m.for) : '')],
        ['Полярность', m.polarity ? esc(m.polarity) : 'нет данных', m.polarity ? '' : 'tn-faint'],
        ['Вместимость', m.card ? m.drain0 + '–' + (m.drain0 + m.maxRank) + (m.aura ? ' (аура добавляет)' : '') : 'нет данных', m.card ? 'tn-num' : 'tn-faint'],
        ['Максимальный ранг', m.card ? String(m.maxRank) : 'нет данных', m.card ? 'tn-num' : 'tn-faint'],
        ['Эффект на максимуме', m.effect ? mask(m.effect) : 'нет данных', m.effect ? '' : 'tn-faint'],
        ['Шанс выпадения', (m.ways || []).every(w => w.kind === 'vendor') ? 'не применим — покупка' : 'не приводим: зависит от источника — см. Wiki', 'tn-faint']
      ].concat(m.upgrade ? [['Полное улучшение', fmt(m.upgrade.endo) + ' Эндо и ' + fmt(m.upgrade.credits) + ' кредитов', 'tn-num']] : [])) +
        (m.compat ? UI.callout('warning', 'Совместимость', mask(m.compat)) : '') + (m.note ? '<p class="tn-muted">' + mask(m.note) + '</p>' : '') +
        ownedControls(m.id) + (m.card ? UI.sourceMeta('r:mods', UI.wikiLink({ wiki: m.name.replace(/ /g, '_') }, 'карточка мода')) : '') + '</section>';
    } else if (tab === 'where') {
      panel = whereTab(m, 'mod:' + m.id, query) + (ox ? UI.callout('info', 'Что сохранится в задачах', esc(ox.text) + ' Общие условия, которые уже есть в задачах, не дублируются.') : '');
    } else {
      panel = '<section class="tn-stack"><h2 class="tn-text-h2">В сборках</h2>' + (inBuilds.length ? '<ul class="tn-results">' + inBuilds.map(x => '<li class="tn-result"><p class="tn-result__title">' + UI.a('/build/' + x.b.id + (x.slots[0] ? '?slot=' + (x.slots[0].i + 1) : ''), mask(x.b.title)) + '</p><p class="tn-result__path">' + (x.aura ? 'Аура' : x.slots.map(y => 'слот ' + (y.i + 1) + (y.s.key ? ' (ключевой)' : y.s.mod === m.id ? '' : y.s.later === m.id ? ' (поздняя замена)' : ' (замена)')).join(', ')) + '</p></li>').join('') + '</ul>' : '<p class="tn-muted">Этот мод не входит в сборки гайда.</p>') + '</section>';
    }
    const wayForAside = (m.ways || []).find(w => w.id === query.get('way')) || (m.ways || []).find(w => w.recommended) || (m.ways || [])[0];
    const aside = '<aside class="tn-stack tn-aside">' + pathAside(e, query, wayForAside) +
      (m.card ? UI.props([['Вместимость', m.drain0 + '–' + (m.drain0 + m.maxRank), 'tn-num'], ['Макс. ранг', String(m.maxRank), 'tn-num'], ['Совместимость', esc(MODCAT[m.cat])]]).replace('class="tn-props"', 'class="tn-props tn-panel tn-props--panel"') : '') + '</aside>';
    return '<div class="tn-container tn-page">' + head + tabsHtml + '<div class="tn-layout2"><div class="tn-stack tn-stack--lg" role="tabpanel" id="panel-' + tab + '" aria-labelledby="tab-' + tab + '">' + panel + '</div>' + aside + '</div></div>';
  }
};

/* ── Предмет ──────────────────────────────────────────── */
Screens.item = {
  get nav() { const it = IDX.item.get((current().path.split('/')[2]) || ''); return it && it.arsenal === 'frame' ? 'frames' : it && it.arsenal === 'weapon' ? 'weapons' : 'ref'; },
  title(p) { const e = entity('item:' + p.id); return e ? entPlain(e) : 'Предмет не найден'; },
  place(p) { const e = entity('item:' + p.id); return e ? entPlain(e) : null; },
  render(p, query) {
    const it = IDX.item.get(p.id); if (!it || it.hidden) return Screens.notFound.render();
    const e = entity('item:' + it.id);
    const res = it.type === 'resource';
    const tab = query.get('tab') || (query.get('from') ? 'where' : 'overview');
    const ox = obtainExplain(it, query);
    const markers = [UI.rarity(it.rarity), it.reco ? UI.reco() : '', ['warframe', 'weapon'].includes(it.type) ? ownedMarker(it.id) : ''].filter(Boolean).join('');
    const builds = (it.builds || []).map(id => IDX.build.get(id));
    const crumbs = it.arsenal === 'frame' ? [{ path: '/warframes', html: 'Варфреймы' }, { html: entName(e) }] : it.arsenal === 'weapon' ? [{ path: '/weapons?cat=' + it.cat, html: 'Оружие · ' + esc(WCAT[it.cat] || '') }, { html: entName(e) }]
      : [{ path: '/reference', html: 'Справочник' }, { path: res || it.type === 'currency' ? '/loot' : '/boost', html: res || it.type === 'currency' ? 'Добыча' : 'Усиление' }, { html: entName(e) }];
    const head = '<div class="tn-cluster tn-crumbrow">' + UI.crumbs(crumbs) + backFrom(query) + '</div>' +
      UI.pageTitle({ media: '<div class="tn-thumb tn-thumb--lg tn-pt-media">' + icon(TYPE_ICON[it.type] || 'reward', 'tn-icon--lg') + '</div>', overline: (ITEMTYPE[it.type] || 'Предмет') + (it.clsRu ? ' · ' + esc(it.clsRu) : it.slot ? ' · ' + SLOTNAME[it.slot] : '') + ' · этап ' + it.stage, title: entName(e), markers: markers + (it.prime ? UI.reco('Есть Прайм') : '') + (it.incarnon ? '<span class="tn-tag">' + (it.incarnon === 'innate' ? 'Инкарнон' : 'Инкарнон-адаптер') + '</span>' : ''),
        lead: mask(it.summary || (res ? 'Ресурс. Где собирать — ниже.' : '')),
        actions: (it.ways && it.ways.length ? UI.taskBtn('obtain:item:' + it.id, 'add-obtain', 'Добавить в задачи', { data: ' data-way="' + (ox ? ox.way.id : '') + '"' }) : res ? UI.taskBtn('obtain:item:' + it.id, 'add-obtain', 'Добавить сбор в задачи') : '') });
    let body;
    if (res || it.type === 'currency') {
      const where = it.where || [];
      body = '<div class="tn-layout2"><div class="tn-stack tn-stack--lg"><section class="tn-stack"><h2 class="tn-text-h2">Где получить</h2>' +
        (where.length ? '<div class="tn-sources" role="list">' + where.map((w, i) => { const l = w.loc ? IDX.planet.get(w.loc) : null; const le = l ? entity('planet:' + l.id) : null;
          return '<div class="tn-source" role="listitem"><span class="tn-card__icon">' + icon('mission') + '</span><div><p class="tn-source__name">' + (le ? UI.a(le.path, entName(le), 'tn-link tn-link--quiet') : 'Источник') + '</p><p class="tn-source__where">' + mask(w.text) + '</p>' + (l && (l.access || []).length ? UI.deps(l.access.map(evalCond)) : '') + '</div><p class="tn-source__chance tn-faint">Нет данных<small>Шанс не указан — см. Wiki</small></p>' +
            '<button class="tn-btn tn-btn--ghost tn-btn--icon" data-act="add-farm" data-item="' + it.id + '" data-i="' + i + '" aria-label="В задачи: ' + attr(maskPlain(it.name)) + (l ? ' — ' + attr(entPlain(le)) : '') + '">' + icon('plus') + '</button></div>'; }).join('') + '</div>' : '<p class="tn-muted">Гайд не называет места сбора. ' + UI.wikiLink(it, 'Проверить в Wiki') + '</p>') +
        (it.note ? UI.callout('gold', 'Совет гайда', mask(it.note)) : '') + UI.sourceMeta(it.src || 'g:17') + '</section>' +
        (it.ways && it.ways.length ? whereTab(it, 'item:' + it.id, query) : '') + '</div>' +
        '<aside class="tn-stack tn-aside">' + UI.props([['Тип', ITEMTYPE[it.type]], ['Редкость', it.rarity ? RARITY[it.rarity][0] : 'нет данных', it.rarity ? '' : 'tn-faint'], ['Этап', String(it.stage), 'tn-num']]).replace('class="tn-props"', 'class="tn-props tn-panel tn-props--panel"') + '<p>' + UI.wikiLink(it) + '</p></aside></div>';
    } else {
      const tabsHtml = tabs('item-tabs', [{ id: 'overview', label: 'Обзор' }, { id: 'where', label: 'Где получить', count: (it.ways || []).length }, { id: 'builds', label: 'В сборках', count: builds.length }], tab);
      let panel;
      if (tab === 'overview') panel = '<section class="tn-stack">' + UI.props([['Тип', ITEMTYPE[it.type] + (it.slot ? ' · ' + SLOTNAME[it.slot] : '')], ['Ранг мастерства', it.mr != null ? (it.mr === 0 ? 'не требуется' : String(it.mr)) + (it.mrNote ? ' (по гайду, не сверено)' : '') : 'нет данных', it.mr != null ? 'tn-num' : 'tn-faint'], ['Этап маршрута', String(it.stage), 'tn-num'], ['Способов получения', String((it.ways || []).length), 'tn-num']]) +
        (it.why ? '<p class="tn-prose">' + mask(it.why) + '</p>' : '') + (it.arsenal ? arsenalOverview(it) : '') + (['warframe', 'weapon'].includes(it.type) ? ownedControls(it.id) : '') + '<p>' + UI.wikiLink(it) + '</p>' + UI.sourceMeta(it.src || (it.guide ? 'g:' + it.guide : it.dataSrc || 'g:2')) + (() => { const ws = [...new Set((it.ways || []).map(w => w.src).filter(x => x && x !== it.src && x !== it.dataSrc && D.sources[x]))]; return ws.map(x => UI.sourceMeta(x)).join(''); })() + '</section>';
      else if (tab === 'where') panel = whereTab(it, 'item:' + it.id, query) + (ox ? UI.callout('info', 'Что сохранится в задачах', esc(ox.text)) : '');
      else panel = '<section class="tn-stack"><h2 class="tn-text-h2">Сборки</h2>' + (builds.length ? '<div class="tn-grid tn-grid--2">' + builds.map(UI.buildCard).join('') + '</div>' : '<p class="tn-muted">Для этого предмета в гайде нет сборки.</p>') + '</section>';
      const wsel = (it.ways || []).find(w => w.id === query.get('way')) || (it.ways || []).find(w => w.recommended) || (it.ways || [])[0];
      body = tabsHtml + '<div class="tn-layout2"><div class="tn-stack tn-stack--lg" role="tabpanel" id="panel-' + tab + '" aria-labelledby="tab-' + tab + '">' + panel + '</div><aside class="tn-stack tn-aside">' + pathAside(e, query, wsel) + '</aside></div>';
    }
    return '<div class="tn-container tn-page">' + head + body + '</div>';
  }
};
/** Ресурс → место → условие доступа → задача */
Actions['add-farm'] = t => {
  const it = IDX.item.get(t.dataset.item); const w = it.where[+t.dataset.i];
  const l = w.loc ? IDX.planet.get(w.loc) : null;
  const le = l ? entity('planet:' + l.id) : null;
  const specs = [{ ref: 'farm:' + it.id + ':' + (w.loc || t.dataset.i), title: 'Собрать ' + it.name + (le ? ' — ' + entPlain(le) : ''), href: '/item/' + it.id, group: 'item:' + it.id, groupTitle: it.name, kind: 'farm', ctx: maskPlain(w.text), stage: it.stage }];
  if (l) (l.access || []).map(evalCond).filter(x => x.state !== 'yes').forEach(x => specs.push(taskSpecCond(x, 'item:' + it.id, it.name, it.stage)));
  const res = addTasks(specs, specs.length > 1 ? [{ task: 0, on: specs.map((_, i) => i).slice(1) }] : []);
  if (!res.ok) { Toast.saveError(() => Actions['add-farm'](t), 'Задача не добавлена.'); return; }
  Toast.show({ tone: 'success', title: res.created.length > 1 ? pl(res.created.length, ['задача добавлена', 'задачи добавлены', 'задач добавлено']) : res.created.length ? 'Задача добавлена' : 'Уже в задачах', text: (specs.length > 1 ? 'Вместе с условием доступа к месту. ' : '') + savedText(res.ok), actions: [{ label: 'Открыть задачи', href: '/tasks' }] });
};

/* ── Продавец ─────────────────────────────────────────── */
Screens.vendor = {
  nav: 'ref',
  title(p) { const e = entity('vendor:' + p.id); return e ? entPlain(e) : 'Продавец не найден'; },
  place(p) { const e = entity('vendor:' + p.id); return e && !e.hidden ? e.name : null; },
  render(p, query) {
    const v = IDX.vendor.get(p.id); if (!v) return Screens.notFound.render();
    const e = entity('vendor:' + v.id), scope = 'vendor:' + v.id;
    const hidden = e.hidden && !Spoil.revealed.has(scope);
    const synd = v.syndicate ? IDX.syndicate.get(v.syndicate) : null;
    this.v = v;
    const view = query.get('view') === 'table' ? 'table' : 'cards';
    const selItem = query.get('item');
    const srcs = [...new Set(v.offers.map(o => o.src).filter(Boolean))];
    let body = '';
    if (v.access && v.access.length) body += UI.access({ id: 'vendor-access', title: 'Доступ к продавцу', conds: v.access, add: { groupRef: 'vendor' } });
    if (hidden) body += UI.spoiler(scope, 'Продавец поздней игры (этап ' + v.stage + '). Раскрывается только эта страница.');
    else {
      body += '<div class="tn-stack tn-stack--lg" data-revealed="' + scope + '">' + (Spoil.revealed.has(scope) ? UI.spoilerShown(scope, 'продавец') : '');
      if (synd) body += '<div class="tn-card">' + UI.standing(synd, { title: '«' + entName(entity('syndicate:' + synd.id)) + '»', note: Store.doc.standing[synd.id] ? UI.a('/syndicate/' + synd.id, 'Синдикат и как поднять репутацию') : 'Укажите ранг и запас репутации — покажем, что доступно и сколько не хватает.' }) + '</div>';
      if (v.note) body += UI.callout('info', 'Важно', mask(v.note));
      body += UI.callout('info', 'Ранг и репутация — разные вещи', 'Ранг открывает товар; репутация — валюта покупки. Добавление в задачи ничего не списывает и не покупает.');
      body += '<div class="tn-cluster" style="justify-content:space-between"><h2 class="tn-text-h2">Предложения</h2>' + UI.segmented('Вид', [{ val: 'cards', label: 'Карточки', on: view === 'cards' }, { val: 'table', label: 'Таблица', on: view === 'table' }], 'vendor-view') + '</div>';
      if (view === 'cards') body += '<div class="tn-stack">' + v.offers.map(o => UI.purchase(o, v, { selected: selItem && selItem === o.item })).join('') + '</div>';
      else body += UI.table({ id: 'vendor-' + v.id, caption: 'Предложения: ' + entName(e), stack: true, head: ['Предмет', 'Стоимость', 'Ранг', 'Готовность', 'Почему полезно', '<span class="tn-sr-only">Действие</span>'], num: [false, true, true, false, false, false],
        rows: v.offers.map(o => { const html = UI.purchase(o, v); const ready = (html.match(/<span class="tn-ready"[\s\S]*?<\/span>/) || [''])[0]; const t = o.item ? entity((IDX.mod.has(o.item) ? 'mod:' : 'item:') + o.item) : null;
          return [t ? UI.a(t.path, entName(t), 'tn-link tn-link--quiet') : mask(o.label), o.cost != null ? fmt(o.cost) : esc(o.costText || ''), o.rank != null ? String(o.rank) : '', ready, o.why ? (o.reco ? UI.reco() + ' ' : '') + mask(o.why) : '—', UI.taskBtn('buy:' + v.id + ':' + (o.item || slug(o.label)), 'add-purchase', 'В задачи', { sm: true, primary: false, data: ' data-vendor="' + v.id + '" data-offer="' + attr(o.item || o.label) + '"' })]; }) });
      body += srcs.map(s => UI.sourceMeta(s)).join('') + '</div>';
    }
    return '<div class="tn-container tn-page">' + UI.crumbs([{ path: '/reference', html: 'Справочник' }, { path: '/syndicates', html: 'Синдикаты' }, { html: hidden ? 'Скрытый продавец' : entName(e) }]) +
      UI.pageTitle({ media: '<div class="tn-thumb tn-thumb--lg tn-pt-media">' + icon('vendor', 'tn-icon--lg') + '</div>', overline: 'Продавец · ' + mask(v.currency), title: hidden ? 'Скрытый продавец · этап ' + v.stage : entName(e), lead: hidden ? '' : mask(v.where), markers: synd ? UI.tag(entName(entity('syndicate:' + synd.id)), 'syndicate') : '' }) +
      '<div class="tn-stack tn-stack--lg tn-narrowcol" style="padding:32px 0 64px">' + body + '</div></div>';
  },
  missingContext() { const v = this.v; return { conds: v.access || [], groupRef: 'vendor:' + v.id, groupTitle: maskPlain(v.name), stage: v.stage }; }
};
Actions['vendor-view'] = t => { const q0 = current().query; q0.set('view', t.dataset.val); try { history.replaceState(Object.assign({}, history.state), '', link(current().path + '?' + q0)); } catch (e) {} rerender(); };

/* ── Синдикат ─────────────────────────────────────────── */
Screens.syndicate = {
  nav: 'ref',
  title(p) { const e = entity('syndicate:' + p.id); return e ? entPlain(e) : 'Синдикат не найден'; },
  place(p) { const e = entity('syndicate:' + p.id); return e && !e.hidden ? e.name : null; },
  render(p) {
    const s = IDX.syndicate.get(p.id); if (!s) return Screens.notFound.render();
    const e = entity('syndicate:' + s.id), scope = 'syndicate:' + s.id;
    const hidden = e.hidden && !Spoil.revealed.has(scope);
    const v = s.vendor ? IDX.vendor.get(s.vendor) : null;
    const st = Store.doc.standing[s.id] || {};
    const best = v ? v.offers.filter(o => o.reco) : [];
    const rel = (list, kind, sym, word) => (list || []).map(id => '<p class="tn-relation" data-rel="' + kind + '"><span class="tn-relation__sym" aria-hidden="true">' + sym + '</span> ' + word + ': ' + UI.ref('syndicate:' + id) + '</p>').join('');
    let body = '<div class="tn-card tn-stack">' + UI.standing(s, { title: 'Ваш ранг' }) + '<div class="tn-cluster"><button class="tn-btn tn-btn--sm" data-act="set-standing" data-synd="' + s.id + '" data-key="set-standing">Указать ранг и репутацию</button>' + (st.rank != null && s.ranks && s.ranks.max && st.value != null ? '<span class="tn-faint tn-small">До конца ранга: ' + fmt(Math.max(0, s.ranks.max[st.rank] - st.value)) + '</span>' : '') + '</div>' + (s.ranks && s.ranks.src ? UI.sourceMeta(s.ranks.src) : '') + '</div>';
    if (hidden) body += UI.spoiler(scope, 'Группа поздней игры (этап ' + s.stage + '). Раскрывается только эта страница.');
    else {
      body += '<div class="tn-stack tn-stack--lg" data-revealed="' + scope + '">' + (Spoil.revealed.has(scope) ? UI.spoilerShown(scope, 'группа') : '') +
        '<section class="tn-stack"><h2 class="tn-text-h2">Для чего полезен</h2><p class="tn-prose">' + mask(s.use, scope) + '</p>' + (s.standingHow ? '<p class="tn-muted">Репутация: ' + mask(s.standingHow, scope) + '</p>' : '') +
        (s.kind === 'faction' ? '<div class="tn-relations">' + rel(s.allied, 'allied', '⊕', 'Союзник') + rel(s.opposed, 'opposed', '⊖', 'Противник') + rel(s.enemy, 'enemy', '⊗', 'Враг') + '</div><p class="tn-faint tn-small">Союзник получает ещё 50% вашей прибавки; у соперника вычитается 50%, у врага — 100%.</p>' : '') + UI.sourceMeta('g:11') + '</section>';
      if (v) body += '<section class="tn-stack"><div class="tn-section-title"><h2 class="tn-text-h2">Полезные покупки</h2>' + UI.a('/vendor/' + v.id, 'Все предложения (' + v.offers.length + ')') + '</div>' + (best.length ? best.map(o => UI.purchase(o, v)).join('') : '<p class="tn-muted">Рекомендаций гайда для этого продавца нет.</p>') + '</section>';
      body += '<section class="tn-stack"><h2 class="tn-text-h2">Как поднимать репутацию</h2><p>Дневной лимит — 16 000 + 500 × ранг мастерства. Медальоны можно сдавать сверх дневного лимита, но предел накопления ранга действует. Перед повышением ранга подготовьте указанные в интерфейсе кредиты и предметы.</p>' + UI.a('/article/syndicates#sub-s8', 'Подробнее в статье') + UI.sourceMeta('w:Syndicates') + '</section></div>';
    }
    return '<div class="tn-container tn-page">' + UI.crumbs([{ path: '/reference', html: 'Справочник' }, { path: '/syndicates', html: 'Синдикаты' }, { html: hidden ? 'Скрытая группа' : entName(e) }]) +
      UI.pageTitle({ media: '<span class="tn-emblem tn-emblem--lg tn-pt-media" aria-hidden="true">' + (hidden ? '?' : esc(s.short)) + '</span>', overline: ({ faction: 'Синдикат', group: 'Независимая группа', garrison: 'Гарнизон' }[s.kind]) + ' · ' + mask(s.where), title: hidden ? 'Скрытая группа · этап ' + s.stage : entName(e), lead: '' }) +
      '<div class="tn-stack tn-stack--lg tn-narrowcol" style="padding:32px 0 64px">' + body + '</div></div>';
  }
};

/* ── Активность ───────────────────────────────────────── */
Screens.activity = {
  nav: 'endgame',
  title(p) { const e = entity('activity:' + p.id); return e ? entPlain(e) : 'Режим не найден'; },
  place(p) { const e = entity('activity:' + p.id); return e ? entPlain(e) : null; },
  render(p) {
    const a = IDX.activity.get(p.id); if (!a) return Screens.notFound.render();
    const e = entity('activity:' + a.id); this.a = a;
    const ready = a.ready ? (D.readiness[a.ready].ref ? D.readiness[D.readiness[a.ready].ref] : D.readiness[a.ready]) : null;
    const rkey = a.ready ? (D.readiness[a.ready].ref || a.ready) : null;
    const evs = (a.access || []).map(evalCond);
    const miss = evs.filter(x => x.state !== 'yes').length;
    const planRef = 'plan:activity:' + a.id;
    let body = '<section class="tn-stack" id="access"><h2 class="tn-text-h2">1. Обязательный доступ</h2>' + UI.access({ id: 'act-access', title: 'Игровые условия', conds: a.access || [], add: (a.access || []).length ? { groupRef: 'activity' } : null }) + '</section>';
    body += '<section class="tn-stack" id="prep"><h2 class="tn-text-h2">2. Рекомендуемая подготовка</h2><p class="tn-muted">Советы гайда — не блокируют доступ.</p><ul class="tn-deps tn-deps--branch">' + a.prep.map(x => '<li data-met="unknown">' + icon('star') + '<span>' + mask(x) + '</span><span class="tn-deps__state">совет</span></li>').join('') + '</ul>' +
      (ready ? '<fieldset class="tn-filter tn-card"><legend class="tn-text-body-strong">' + mask(ready.title) + '</legend>' + ready.items.map((it, i) => { const k = 'check:ready:' + rkey + ':' + i; return '<label class="tn-check" data-key="' + k + '"><input type="checkbox" data-act="toggle-step" data-done="' + k + '"' + (isDone(k) ? ' checked' : '') + '><span>' + mask(it) + '</span></label>'; }).join('') + '</fieldset>' : '') + '</section>';
    body += '<section class="tn-stack" id="rewards"><h2 class="tn-text-h2">Награды</h2><ul class="tn-prose-list">' + a.rewards.map(r => '<li>' + mask(r) + '</li>').join('') + '</ul>' + (a.weekly ? UI.callout('info', 'Недельные правила', mask(a.weekly)) : '') + (a.vendor ? '<p>' + UI.ref('vendor:' + a.vendor, { text: 'Магазин: ' + entName(entity('vendor:' + a.vendor)) }) + '</p>' : '') +
      (a.mods ? '<p class="tn-cluster tn-small">Моды: ' + a.mods.map(m => UI.ref('mod:' + m)).join(' · ') + '</p>' : '') + UI.sourceMeta(a.src || 'g:' + a.guide) + '</section>';
    body += '<section class="tn-stack" id="plan"><h2 class="tn-text-h2">3. Личный план</h2>' + UI.callout('info', 'Что сохранится', 'Задача «Пройти: ' + entPlain(e) + '»' + (miss ? ' и ' + pl(miss, ['задача', 'задачи', 'задач']) + ' на невыполненные или неуказанные условия доступа; задача режима откроется после них' : '') + '. Общие условия, уже добавленные раньше, не дублируются.') +
      '<div>' + UI.taskBtn(planRef, 'add-activity-plan', 'Добавить в план', { data: ' data-id="' + a.id + '"' }) + '</div></section>';
    const loc = a.loc ? entity('planet:' + a.loc) : null;
    return '<div class="tn-container tn-page">' + UI.crumbs([{ path: '/endgame', html: 'Поздняя игра' }, { html: entName(e) }]) +
      UI.pageTitle({ media: '<div class="tn-thumb tn-thumb--lg tn-pt-media">' + icon('endgame', 'tn-icon--lg') + '</div>', overline: 'Режим · этап ' + a.stage, title: entName(e), lead: mask(a.lead), markers: UI.condSummary(evs) + (loc ? UI.tag(entName(loc), 'planet') : ''),
        actions: UI.taskBtn(planRef, 'add-activity-plan', 'Добавить в план', { data: ' data-id="' + a.id + '"' }), meta: UI.wikiLink(a) }) +
      '<div class="tn-layout2"><div class="tn-stack tn-stack--xl">' + body + '</div><aside class="tn-stack tn-aside"><div class="tn-panel tn-stack"><p class="tn-text-overline">Поздняя активность</p><ol class="tn-route" aria-label="Порядок">' +
      [['Обязательный доступ', miss ? miss + ' не выполнено' : 'всё выполнено', miss ? 'locked' : 'done'], ['Рекомендуемая подготовка', ready ? ready.items.filter((_, i) => isDone('check:ready:' + rkey + ':' + i)).length + ' из ' + ready.items.length : 'советы гайда', 'available'], ['Личный план', findTask(planRef) ? 'в задачах' : 'не добавлено', findTask(planRef) ? 'done' : 'available']].map((x, i) => '<li class="tn-route__stage" data-progress="' + x[2] + '"><span class="tn-node tn-node--static" data-progress="' + x[2] + '"><span class="tn-node__dot">' + (x[2] === 'done' ? icon('check') : x[2] === 'locked' ? icon('lock') : i + 1) + '</span></span><div><p class="tn-text-body-strong">' + x[0] + '</p><p class="tn-faint tn-small">' + x[1] + '</p></div></li>').join('') + '</ol></div></aside></div></div>';
  },
  missingContext() { const a = this.a; return { conds: a.access || [], groupRef: 'activity:' + a.id, groupTitle: maskPlain(a.name), stage: a.stage }; }
};
Actions['add-activity-plan'] = t => {
  const a = IDX.activity.get(t.dataset.id); const e = entity('activity:' + a.id);
  const specs = [{ ref: 'plan:activity:' + a.id, title: 'Пройти: ' + entPlain(e), href: '/activity/' + a.id, group: 'activity:' + a.id, groupTitle: entPlain(e), kind: 'plan', ctx: maskPlain(a.lead), stage: a.stage }];
  (a.access || []).map(evalCond).filter(x => x.state !== 'yes' && !x.parts).forEach(x => specs.push(taskSpecCond(x, 'activity:' + a.id, entPlain(e), a.stage)));
  const res = addTasks(specs, specs.length > 1 ? [{ task: 0, on: specs.map((_, i) => i).slice(1) }] : []);
  if (!res.ok) { Toast.saveError(() => Actions['add-activity-plan'](t), 'План не сохранён.'); return; }
  Toast.show({ tone: 'success', title: 'План сохранён: ' + pl(res.created.length, ['задача', 'задачи', 'задач']), text: (res.reused.length ? 'Общие условия не дублируем (' + res.reused.length + '). ' : '') + savedText(res.ok), actions: [{ label: 'Открыть задачи', href: '/tasks' }] });
};

/* ── Квест и другие отметки прогресса ─────────────────── */
Screens.quest = {
  nav: 'map',
  title(p) { const f = IDX.fact.get(p.id); return f ? factName(f) : 'Не найдено'; },
  render(p) {
    const f = IDX.fact.get(p.id); if (!f) return Screens.notFound.render();
    const scope = 'quest:' + f.id;
    const hidden = Spoil.hiddenStage(f.stage || 0, f.spoiler) && !Spoil.revealed.has(scope);
    const v = Store.doc.facts[f.id];
    const needed = D.goals.filter(g => (g.req || []).some(c => c.f === f.id)).map(g => 'goal:' + g.id)
      .concat(D.activities.filter(a => (a.access || []).some(c => c.f === f.id)).map(a => 'activity:' + a.id))
      .concat(D.facts.filter(x => (x.req || []).some(c => c.f === f.id)).map(x => 'quest:' + x.id));
    const kindWord = { quest: 'Квест', junction: 'Переход', flag: 'Отметка прогресса' }[f.kind] || 'Отметка';
    let body = '<div class="tn-card tn-stack"><p class="tn-text-overline">Ваша отметка</p><div class="tn-segmented" role="group" aria-label="Состояние">' + [['yes', f.kind === 'quest' ? 'Пройден' : 'Выполнено', v === true], ['no', f.kind === 'quest' ? 'Не пройден' : 'Не выполнено', v === false], ['unset', 'Не указано', v == null]].map(o => '<button aria-pressed="' + o[2] + '" data-act="fact-set" data-key="fs-' + o[0] + '" data-fact="' + f.id + '" data-v="' + o[0] + '">' + o[1] + '</button>').join('') + '</div><p class="tn-faint tn-small">Только для вашего плана в этом браузере. Выбор этапа эту отметку не меняет.</p></div>';
    body += '<section class="tn-stack"><h2 class="tn-text-h2">Условия</h2>' + ((f.req || []).length ? UI.deps(f.req.map(evalCond)) : '<p class="tn-muted">Отдельных условий не указано' + (f.note ? '' : '; порядок — в официальном справочнике квестов') + '.</p>') + (f.note ? '<p class="tn-muted">' + mask(f.note, scope) + '</p>' : '') + (f.src ? UI.sourceMeta(f.src) : '') + '</section>';
    if (hidden) body += UI.spoiler(scope, 'Что открывает квест поздней игры (этап ' + f.stage + '), скрыто.');
    else if (f.unlocks || f.unlocksSpoiler) body += '<section class="tn-stack" data-revealed="' + scope + '"><h2 class="tn-text-h2">Что открывает</h2>' + (Spoil.revealed.has(scope) ? UI.spoilerShown(scope, 'квест') : '') + (f.unlocks ? '<p class="tn-prose">' + mask(f.unlocks, scope) + '</p>' : '') + (f.unlocksSpoiler ? (Spoil.hiddenStage(f.stage + 1, true) && !Spoil.revealed.has(scope + ':twist') ? UI.spoiler(scope + ':twist', 'Сюжетный поворот этого квеста.', 'Сюжет скрыт') : '<p>' + esc(f.unlocksSpoiler) + '</p>') : '') + '</section>';
    if (needed.length) body += '<section class="tn-stack"><h2 class="tn-text-h2">Нужен для</h2><ul class="tn-results">' + needed.map(r => { const e = entity(r); return e ? '<li class="tn-result"><p class="tn-result__title">' + UI.a(e.path, entName(e)) + '</p><p class="tn-result__path">' + ({ goal: 'Цель этапа ' + e.stage, activity: 'Режим', quest: 'Квест или отметка' }[e.kind] || '') + '</p></li>' : ''; }).join('') + '</ul></section>';
    const wl = f.wiki ? UI.ext(wikiRu(f.wiki), 'Статья на Warframe Wiki') + ' ' + UI.lang('ru') : f.wikiEn ? UI.ext(wikiEn(f.wikiEn), 'Статья на Warframe Wiki') + ' ' + UI.lang('en') : '';
    return '<div class="tn-container tn-page">' + UI.crumbs([{ path: '/?view=list', html: 'Маршрут' }, { path: '/stage/' + (f.stage || 1), html: 'Этап ' + (f.stage || 1) }, { html: hidden ? 'Скрыто' : mask(f.name) }]) +
      UI.pageTitle({ media: '<div class="tn-thumb tn-thumb--lg tn-pt-media">' + icon(hidden ? 'eye-off' : f.kind === 'quest' ? 'quest' : 'route', 'tn-icon--lg') + '</div>', overline: kindWord + ' · этап ' + (f.stage || '—'), title: hidden ? 'Скрытый сюжетный квест' : mask(f.name), lead: hidden ? 'Название скрыто защитой от спойлеров; условия видны.' : '', markers: v === true ? UI.status('done', f.kind === 'quest' ? 'Пройден' : 'Выполнено') : v === false ? UI.ready('locked', 'Не выполнено') : UI.ready('unknown', 'Не указано'), meta: hidden ? '' : wl + (f.kind === 'quest' ? '<span class="tn-faint tn-small">Прохождение не пересказываем — сюжетные страницы открывайте, когда готовы к спойлерам.</span>' : '') }) +
      '<div class="tn-stack tn-stack--lg tn-narrowcol" style="padding:32px 0 64px">' + body + '</div></div>';
  }
};
Actions['fact-set'] = t => { const k = t.dataset.fact, v = t.dataset.v; commit(d => { if (v === 'unset') delete d.facts[k]; else d.facts[k] = v === 'yes'; }, r => { announce('Отметка сохранена'); Toast.show({ tone: 'success', title: 'Отметка сохранена', text: savedText(r) }); }); };

/* ── Обзор предмета арсенала: полярности, характеристики, способности, Прайм ── */
const SYND_EN = { 'Steel Meridian': 'steel-meridian', 'Red Veil': 'red-veil', 'Arbiters of Hexis': 'arbiters', 'Cephalon Suda': 'cephalon-suda', 'The Perrin Sequence': 'perrin', 'New Loka': 'new-loka' };
const DMG_RU = { Impact: 'Удар', Puncture: 'Пронзание', Slash: 'Разрез', Heat: 'Огонь', Cold: 'Холод', Toxin: 'Токсин', Electricity: 'Электричество', Radiation: 'Радиация', Viral: 'Вирус', Corrosive: 'Коррозия', Gas: 'Газ', Blast: 'Взрыв', Magnetic: 'Магнит' };
function arsenalOverview(it) {
  let h = '';
  if (it.arsenal === 'frame') {
    h += '<div class="tn-card tn-stack"><h3 class="tn-text-h3">Полярности</h3>' + UI.props([['Слоты модов', UI.polList(it.pol, 'нет')], ['Аура', it.aura ? UI.pol(it.aura) + ' ' + POLS[it.aura].ru : '<span class="tn-faint">без полярности</span>'], ['Эксилус', it.exilusPol ? UI.pol(it.exilusPol) + ' ' + POLS[it.exilusPol].ru : '<span class="tn-faint">без полярности</span>']]) +
      '<p class="tn-faint tn-small">Мод в слоте своей полярности стоит вдвое меньше; недостающие полярности добавляют Формой. Расчёт — на странице сборки.</p></div>';
    if (it.stats) h += '<div class="tn-card tn-stack"><h3 class="tn-text-h3">Характеристики</h3>' + UI.props([['Здоровье', fmt(it.stats.hp), 'tn-num'], ['Щиты', fmt(it.stats.sh), 'tn-num'], ['Броня', fmt(it.stats.ar), 'tn-num'], ['Энергия', fmt(it.stats.en), 'tn-num']]) + '<p class="tn-faint tn-small">Значения на ранге 0 — Warframe Wiki (Module:Warframes/data), 13.10.2026.</p></div>';
    if (it.abilities) h += '<div class="tn-card tn-stack"><h3 class="tn-text-h3">Способности</h3><ol class="tn-prose-list">' + it.abilities.map(a => '<li>' + esc(a.ru || a.en) + (a.ru && a.ru !== a.en ? ' <span class="tn-faint tn-small" lang="en">' + esc(a.en) + '</span>' : '') + '</li>').join('') + '</ol>' +
      (it.augVendors && it.augVendors.length ? '<p class="tn-small">Моды-улучшения способностей продают: ' + it.augVendors.map(v => SYND_EN[v] ? UI.ref('syndicate:' + SYND_EN[v]) : esc(v)).join(', ') + '.</p>' : '') + '</div>';
    if (it.prime) h += '<div class="tn-card tn-stack"><h3 class="tn-text-h3">' + icon('star', 'tn-icon--sm') + ' ' + esc(it.name) + ' Прайм</h3>' + UI.props([['Слоты модов', UI.polList(it.prime.pol, 'нет')], ['Аура', it.prime.aura ? UI.pol(it.prime.aura) : '<span class="tn-faint">без полярности</span>'], ['Здоровье / щиты / броня / энергия', [it.prime.stats.hp, it.prime.stats.sh, it.prime.stats.ar, it.prime.stats.en].map(fmt).join(' / '), 'tn-num'], ['Хранилище Прайм', it.prime.vaulted ? 'в хранилище: реликвии не выпадают, ждите возвращения или торгуйте' : 'нет данных', it.prime.vaulted ? '' : 'tn-faint']]) +
      '<p class="tn-faint tn-small">Прайм-версия — из реликвий Бездны; отдельной страницы на сайте нет, сборка подходит обеим версиям.</p></div>';
  } else {
    const w = it.wstats || {};
    h += '<div class="tn-card tn-stack"><h3 class="tn-text-h3">Характеристики</h3>' + UI.props([['Класс', esc(it.clsRu || '—')], ['Шанс крита', Math.round((w.cc || 0) * 1000) / 10 + '%', 'tn-num'], ['Крит. множитель', '×' + w.cd, 'tn-num'], ['Шанс статуса', Math.round((w.sc || 0) * 1000) / 10 + '%', 'tn-num'],
      ...(w.fr ? [[it.cat === 'melee' ? 'Скорость атаки' : 'Скорострельность', fmt(w.fr), 'tn-num']] : []), ...(w.mag ? [['Магазин', fmt(w.mag), 'tn-num']] : []),
      ['Урон', w.dmg ? Object.entries(w.dmg).map(([k, v]) => (DMG_RU[k] || k) + ' ' + fmt(v)).join(', ') : '—']]) + '<p class="tn-faint tn-small">Основная атака, без модов — Warframe Wiki (Module:Weapons/data), 13.10.2026.</p></div>';
    h += '<div class="tn-card tn-stack"><h3 class="tn-text-h3">Полярности</h3>' + UI.props([['Слоты модов', UI.polList(it.pol, 'нет')], ...(it.cat === 'melee' ? [['Стойка', it.stancePol ? UI.pol(it.stancePol) + ' ' + POLS[it.stancePol].ru : '<span class="tn-faint">без полярности</span>']] : [])]) + '</div>';
    if (it.incarnon) h += UI.callout('info', it.incarnon === 'innate' ? 'Инкарнон-оружие' : 'Есть Инкарнон-адаптер', it.incarnon === 'innate' ? 'Инкарнон-форма встроена: заряжается попаданиями, эволюции открываются испытаниями.' : 'Инкарнон-адаптер (Генезис) превращает оружие в Инкарнон-версию — сильный апгрейд на позднюю игру. ' + UI.ref('item:incarnon-adapter'));
    if (it.prime) h += '<div class="tn-card tn-stack"><h3 class="tn-text-h3">' + icon('star', 'tn-icon--sm') + ' ' + esc(it.name) + ' Прайм</h3>' + UI.props([['Ранг мастерства', String(it.prime.mr), 'tn-num'], ['Полярности', UI.polList(it.prime.pol, 'нет')], ...(it.cat === 'melee' ? [['Стойка', UI.pol(it.prime.stancePol || null)]] : [])]) + '<p class="tn-faint tn-small">Прайм-версия — из реликвий Бездны; соло-сборка подходит обеим версиям.</p></div>';
  }
  return h;
}

/* ── Сборка (BuildSection) ────────────────────────────── */
const ELEM = { toxin: 'Токсин', cold: 'Холод', fire: 'Огонь', electric: 'Электро' };
const COMBO = { 'cold+toxin': 'Вирус', 'electric+toxin': 'Коррозия', 'electric+fire': 'Радиация', 'cold+electric': 'Магнит', 'fire+toxin': 'Газ', 'cold+fire': 'Взрыв' };
function combineElements(mods, innate) {
  const order = [];
  mods.forEach(id => { const s = D.modStats[id] || {}; Object.keys(ELEM).forEach(k => { if (s[k] && !order.includes(k)) order.push(k); }); });
  // врождённый элемент оружия объединяется последним
  (innate || []).forEach(k => { if (!order.includes(k)) order.push(k); });
  const out = [];
  for (let i = 0; i < order.length; i += 2) { if (order[i + 1]) out.push(COMBO[[order[i], order[i + 1]].sort().join('+')]); else out.push(ELEM[order[i]]); }
  return out;
}
Screens.build = {
  get nav() { const b = IDX.build.get((current().path.split('/')[2]) || ''); const it = b && IDX.item.get(b.target); return it && it.arsenal === 'frame' ? 'frames' : it && it.arsenal === 'weapon' ? 'weapons' : 'ref'; },
  /** Возврат из источника мода: фокус на тот же слот */
  defaultFocus(main, query) { const n = query.get('slot'); return n != null ? main.querySelector('#slot-' + n) : null; },
  title(p) { const b = IDX.build.get(p.id); return b ? maskPlain(b.title) : 'Сборка не найдена'; },
  place(p) { const b = IDX.build.get(p.id); return b ? 'Сборка · ' + maskPlain(b.title) : null; },
  render(p, query) {
    const b = IDX.build.get(p.id); if (!b) return Screens.notFound.render();
    const target = IDX.item.get(b.target);
    const sel = query.get('slot') ? +query.get('slot') : null;
    const doubled = Store.doc.facts['cap:' + b.id] === true;
    const isFrame = b.kind === 'warframe';
    const rankOf = id => { const m = IDX.mod.get(id); const r = Store.doc.facts['rank:mod:' + id]; return typeof r === 'number' ? r : (m && m.card ? m.maxRank : null); };
    const drainOf = id => { const m = IDX.mod.get(id); return m && m.card ? m.drain0 + rankOf(id) : null; };
    // ── Полярности и формы ──
    const isMelee = b.kind === 'melee';
    const exOn = isFrame && b.exilus && Store.doc.facts['exilus:' + b.id] === true;
    const modIn = id => { const m = id && IDX.mod.get(id); return m && m.card ? { drain: drainOf(id), pol: m.polc || null } : null; };
    const auraM = b.aura ? IDX.mod.get(b.aura.mod) : null;
    const exM = b.exilus ? IDX.mod.get(b.exilus.mod) : null;
    const polInput = { mods: b.slots.map(s => modIn(s.mod)), innate: target.pol || [], ex: exOn ? modIn(b.exilus.mod) : null, exInnate: isFrame ? target.exilusPol || null : null,
      aura: auraM && auraM.card ? { bonus: auraM.drain0 + rankOf(auraM.id), pol: auraM.polc || null } : null, auraInnate: isFrame ? target.aura || null : null, base: doubled ? 60 : 30 };
    const lay = polLayout(polInput);
    const fitsInnate = lay.innate.used <= lay.innate.cap;
    const mode = (this.formaMode && this.formaMode[b.id]) || (fitsInnate ? 'innate' : 'forma');
    const L = mode === 'innate' ? lay.innate : lay.minForma;
    const unknownDrain = b.slots.filter(s => s.mod && !IDX.mod.get(s.mod).card).length;
    const slotBtn = (s, i) => {
      if (!s.mod) return '<button class="tn-slot tn-slot--empty" aria-pressed="' + (sel === i + 1) + '" data-act="slot" data-slot="' + (i + 1) + '" data-key="slot-' + (i + 1) + '" id="slot-' + (i + 1) + '"><span class="tn-slot__label">Слот ' + (i + 1) + ' ' + UI.pol(L.pols[i]) + '</span><span>' + icon('plus', 'tn-icon--sm') + ' ' + esc(s.open) + '</span></button>';
      const m = IDX.mod.get(s.mod); const own = ownedState(s.mod);
      const missing = own === 'no';
      const rel = m.card ? polRel(L.pols[i], m.polc) : 'none';
      const cls = cx('tn-slot', s.key && 'tn-slot--key', missing && 'tn-slot--missing');
      const label = (s.key ? 'Ключевой' : 'Слот ' + (i + 1));
      const dr = m.card ? polDrain(drainOf(s.mod), rel) : null;
      const relWord = rel === 'match' ? 'полярность совпадает, стоимость вдвое меньше' : rel === 'mismatch' ? 'полярность не совпадает, стоимость выше на 25%' : '';
      const meta = missing ? '<span>' + icon('warning', 'tn-icon--sm') + ' нет у вас</span><span>→</span>' : '<span class="tn-drain tn-drain--' + rel + '">' + (m.card ? dr : '—') + '</span><span>' + (m.card ? 'Р ' + rankOf(s.mod) + '/' + m.maxRank : own === 'unknown' ? '? не указано' : 'Р —') + '</span>';
      return '<button class="' + cls + '" aria-pressed="' + (sel === i + 1) + '" data-act="slot" data-slot="' + (i + 1) + '" data-key="slot-' + (i + 1) + '" id="slot-' + (i + 1) + '" aria-label="' + attr(label + ': ' + m.name + (dr != null ? ', вместимость ' + dr : '') + (relWord ? ', ' + relWord : '') + (missing ? ', нет у вас' : own === 'unknown' ? ', наличие не указано' : '') + (sel === i + 1 ? ', выбран' : '')) + '"><span class="tn-slot__label">' + label + ' ' + UI.pol(L.pols[i], { state: rel }) + (m.card ? UI.pol(m.polc, { state: 'mod' }) : '') + '</span><span class="tn-slot__name">' + mask(m.name) + '</span><span class="tn-slot__meta">' + meta + '</span></button>';
    };
    const auraRel = auraM && auraM.card ? polRel(L.auraPol, auraM.polc) : 'none';
    const auraBonus = polInput.aura ? polBonus(polInput.aura.bonus, auraRel) : 0;
    const auraBtn = auraM ? '<button class="tn-slot" aria-pressed="' + (sel === 0) + '" data-act="slot" data-slot="0" data-key="slot-0" id="slot-0" aria-label="' + attr('Аура: ' + auraM.name + ', прибавка вместимости ' + auraBonus) + '"><span class="tn-slot__label">Аура ' + UI.pol(L.auraPol, { state: auraRel }) + UI.pol(auraM.polc, { state: 'mod' }) + '</span><span class="tn-slot__name">' + esc(auraM.name) + '</span><span class="tn-slot__meta"><span class="tn-drain tn-drain--' + auraRel + '">+' + auraBonus + '</span><span>Р ' + rankOf(auraM.id) + '/' + auraM.maxRank + '</span></span></button>' : '';
    const exRel = exM && exM.card ? polRel(L.exPol, exM.polc) : 'none';
    const exBtn = exM ? '<button class="tn-slot' + (exOn ? '' : ' tn-slot--off') + '" aria-pressed="' + (sel === 9) + '" data-act="slot" data-slot="9" data-key="slot-9" id="slot-9" aria-label="' + attr('Эксилус: ' + exM.name + (exOn ? ', учитывается' : ', не учитывается — нужен Адаптер эксилуса')) + '"><span class="tn-slot__label">Эксилус ' + UI.pol(exOn ? L.exPol : (target.exilusPol || null), { state: exOn ? exRel : 'none' }) + UI.pol(exM.polc, { state: 'mod' }) + '</span><span class="tn-slot__name">' + esc(exM.name) + '</span><span class="tn-slot__meta">' + (exOn ? '<span class="tn-drain tn-drain--' + exRel + '">' + polDrain(drainOf(exM.id), exRel) + '</span><span>Р ' + rankOf(exM.id) + '/' + exM.maxRank + '</span>' : '<span>нужен адаптер</span>') + '</span></button>'
      : '<div class="tn-slot tn-slot--empty"><span>' + icon('plus', 'tn-icon--sm') + ' Слот эксилус — ' + (b.solo ? 'в сборке не нужен' : 'гайд не указывает мод') + '</span></div>';
    const special = isFrame ? '<div class="tn-modgrid__special">' + auraBtn + exBtn + '</div>'
      : '<div class="tn-modgrid__special">' + (isMelee ? '<div class="tn-slot tn-slot--empty"><span class="tn-slot__label">Стойка ' + UI.pol(target.stancePol || null) + '</span><span>' + icon('plus', 'tn-icon--sm') + ' Стойка — по вкусу</span></div>' : '') + '<div class="tn-slot tn-slot--empty"><span>' + icon('plus', 'tn-icon--sm') + ' Слот эксилус — в сборке не нужен</span></div></div>';
    // вместимость
    const slotMods = b.slots.filter(s => s.mod).map(s => s.mod);
    const used = L.used, cap = L.cap;
    const sum = k => slotMods.reduce((a, id) => a + ((D.modStats[id] || {})[k] || 0), 0);
    const innateEl = !isFrame && target.wstats && target.wstats.dmg ? Object.keys(target.wstats.dmg).map(k => ({ Heat: 'fire', Cold: 'cold', Toxin: 'toxin', Electricity: 'electric' })[k]).filter(Boolean) : [];
    const innateCombo = !isFrame && target.wstats && target.wstats.dmg ? Object.keys(target.wstats.dmg).filter(k => ({ Radiation: 1, Viral: 1, Corrosive: 1, Gas: 1, Blast: 1, Magnetic: 1 })[k]).map(k => ({ Radiation: 'Радиация', Viral: 'Вирус', Corrosive: 'Коррозия', Gas: 'Газ', Blast: 'Взрыв', Magnetic: 'Магнит' })[k]) : [];
    const elems = combineElements(slotMods, innateEl).concat(innateCombo);
    const stats = [['Вместимость', used + ' / ' + cap, used > cap ? '−' + (used - cap) + ' не хватает' : '+' + (cap - used) + ' запас', used > cap]];
    if (isFrame) { [['str', 'Сила способностей'], ['dur', 'Длительность'], ['eff', 'Эффективность'], ['rng', 'Радиус']].forEach(([k, l]) => { const v = sum(k); if (v) stats.push([l, (v > 0 ? '+' : '−') + fmt(Math.abs(v)) + '%', 'от модов', v < 0]); }); }
    else {
      const ms = sum('ms'), dmg = sum('dmg'), cc = sum('cc'), cd = sum('cd'), sc = sum('sc');
      if (dmg) stats.push(['Базовый урон', '+' + dmg + '%', 'от модов']); if (ms) stats.push(['Мультивыстрел', '+' + ms + '%', 'без накопленных бонусов']);
      if (cc) stats.push(['Шанс крита', '+' + cc + '%', 'от модов']); if (cd) stats.push(['Крит. урон', '+' + cd + '%', 'от модов']); if (sc) stats.push(['Шанс статуса', '+' + sc + '%', 'от модов']);
      if (elems.length) stats.push(['Элементы', elems.join(' + '), innateEl.length || innateCombo.length ? 'с врождённым элементом' : 'по порядку слотов']);
    }
    // блок «Полярности и формы»
    const slotName = f => f.slot === 'aura' ? 'аура' : f.slot === 'ex' ? 'эксилус' : 'слот ' + (f.slot + 1) + (b.slots[f.slot] && b.slots[f.slot].mod ? ' (' + mask(IDX.mod.get(b.slots[f.slot].mod).name) + ')' : '');
    const formaList = Lx => Lx.forma.map(f => '<li>' + slotName(f) + ': ' + (f.from ? UI.pol(f.from) + ' → ' : '') + UI.pol(f.to) + ' ' + (POLS[f.to] || {}).ru + '</li>').join('');
    let primeNote = '';
    if (target.prime) {
      const lp = polLayout(Object.assign({}, polInput, { innate: target.prime.pol || [], exInnate: isFrame ? target.prime.exilusPol || null : null, auraInnate: isFrame ? target.prime.aura || null : null }));
      primeNote = '<p class="tn-small">' + icon('star', 'tn-icon--sm') + ' ' + esc(target.name) + ' Прайм: встроенные ' + UI.polList(target.prime.pol) + (isFrame ? ', аура ' + UI.pol(target.prime.aura || null) : '') + ' — ' + (lp.innate.used <= lp.innate.cap ? 'эта сборка помещается без форм' : 'нужно форм: ' + lp.minForma.forma.length + (lp.minForma.used > lp.minForma.cap ? ' (и всё равно не хватает ' + (lp.minForma.used - lp.minForma.cap) + ')' : '')) + '.</p>';
    }
    const polBlock = '<div class="tn-card tn-stack tn-polblock" id="polarity"><div class="tn-section-title"><div><p class="tn-text-overline">Полярности и формы</p><p class="tn-small">Встроенные: ' + UI.polList(target.pol, 'нет') + (isFrame ? ' · аура: ' + UI.pol(target.aura || null) + (target.exilusPol ? ' · эксилус: ' + UI.pol(target.exilusPol) : '') : isMelee ? ' · стойка: ' + UI.pol(target.stancePol || null) : '') + '</p></div>' +
      UI.segmented('Расчёт полярностей', [{ val: 'innate', label: 'Только встроенные', on: mode === 'innate' }, { val: 'forma', label: 'С формами' + (lay.minForma.forma.length ? ' (' + lay.minForma.forma.length + ')' : ''), on: mode === 'forma' }], 'forma-mode').replace(/data-act="forma-mode"/g, 'data-act="forma-mode" data-build="' + b.id + '"') + '</div>' +
      (fitsInnate ? '<p>' + icon('check-circle', 'tn-icon--sm') + ' Без форм помещается: ' + lay.innate.used + ' / ' + lay.innate.cap + '.</p>' : '<p>Без форм не хватает ' + (lay.innate.used - lay.innate.cap) + ' (' + lay.innate.used + ' / ' + lay.innate.cap + ').' + (lay.minForma.used <= lay.minForma.cap ? ' Хватит <b>' + pl(lay.minForma.forma.length, ['формы', 'форм', 'форм']) + '</b>:' : ' Даже со всеми совпадениями не хватает ' + (lay.minForma.used - lay.minForma.cap) + ' — нужен ' + (isFrame ? 'Реактор Орокин' : 'Катализатор Орокин') + ' или ранги модов ниже:') + '</p><ul class="tn-prose-list tn-small">' + formaList(lay.minForma) + '</ul>') +
      (() => { const alt = polLayout(Object.assign({}, polInput, { base: doubled ? 30 : 60 })); const nm = isFrame ? 'Реактора Орокин' : 'Катализатора Орокин';
        const res = alt.innate.used <= alt.innate.cap ? 'помещается без форм' : alt.minForma.used <= alt.minForma.cap ? 'хватит ' + pl(alt.minForma.forma.length, ['формы', 'форм', 'форм']) : 'не помещается даже со всеми формами (−' + (alt.minForma.used - alt.minForma.cap) + ')';
        return '<p class="tn-small">' + icon(doubled ? 'minus' : 'plus', 'tn-icon--sm') + ' ' + (doubled ? 'Без ' + nm : 'С ' + (isFrame ? 'Реактором Орокин' : 'Катализатором Орокин')) + ': ' + res + '.</p>'; })() +
      (lay.fullForma.forma.length > lay.minForma.forma.length ? '<p class="tn-faint tn-small">Все совпадения: ' + pl(lay.fullForma.forma.length, ['форма', 'формы', 'форм']) + ', запас станет ' + (lay.fullForma.cap - lay.fullForma.used) + '.</p>' : '') +
      (isFrame && b.exilus ? UI.switch('toggle-exilus', exOn, 'Адаптер эксилуса установлен', exOn ? 'Мод эксилуса учитывается в вместимости' : 'Без адаптера слот эксилуса закрыт', ' data-build="' + b.id + '" data-key="exilus"') : '') +
      (isMelee ? '<p class="tn-faint tn-small">Стойка в расчёт не входит: стойка с совпадающей полярностью добавит вдвое больше вместимости.</p>' : '') + primeNote +
      '<p class="tn-faint tn-small">В слотах: ' + UI.pol('V', { state: 'match' }) + ' рамка — полярность слота (зелёная — совпадает, жёлтая — нет), ' + UI.pol('V', { state: 'mod' }) + ' — полярность мода. Формы выбраны по наибольшей экономии; порядок слотов в игре не важен — моды можно переставлять.</p>' + (unknownDrain ? '<p class="tn-faint tn-small">' + pl(unknownDrain, ['мод', 'мода', 'модов']) + ' без карточки — их стоимость не учтена.</p>' : '') + '</div>';
    const statsHtml = '<div class="tn-stats" role="list" aria-label="Ключевые параметры">' + stats.slice(0, 5).map(s => '<div class="tn-stat" role="listitem"><span class="tn-stat__label">' + s[0] + '</span><span class="tn-stat__value">' + s[1] + '</span><span class="tn-stat__delta' + (s[3] ? ' tn-stat__delta--down' : '') + '">' + s[2] + '</span></div>').join('') + '</div>';
    const missing = b.slots.map((s, i) => ({ s, i })).filter(x => x.s.mod && ownedState(x.s.mod) === 'no');
    const unknown = b.slots.filter(s => s.mod && ownedState(s.mod) === 'unknown').length;
    let callout = '';
    if (missing.length) {
      callout = UI.callout('warning', 'Не хватает ' + pl(missing.length, ['мода', 'модов', 'модов']), missing.map(x => { const m = IDX.mod.get(x.s.mod); const w = (m.ways || []).find(y => y.recommended) || (m.ways || [])[0];
        return '«' + mask(m.name) + '» — ' + (w ? mask(w.title).replace(/^./, c => c.toLowerCase()) : 'источник не указан') + '. ' + UI.a('/mod/' + m.id + '?from=build:' + b.id + '&slot=' + (x.i + 1) + '&tab=where', 'Где получить'); }).join('<br>'));
    } else if (unknown) callout = UI.callout('info', 'Отметьте, какие моды у вас есть', 'Наличие не указано для ' + pl(unknown, ['мода', 'модов', 'модов']) + '. Выберите слот и отметьте «Есть» или «Нет» — недостающие покажем с путём к источнику.');
    // выбранный слот
    let detail = '';
    if (sel != null) {
      const s = sel === 0 ? (b.aura ? { mod: b.aura.mod, why: b.aura.note } : null) : sel === 9 ? (b.exilus ? { mod: b.exilus.mod, why: b.exilus.note + ' Слот эксилуса открывается Адаптером эксилуса.' } : null) : b.slots[sel - 1];
      if (s && s.mod) {
        const m = IDX.mod.get(s.mod);
        detail = '<div class="tn-card tn-stack tn-slotdetail" id="slot-detail" aria-live="polite"><p class="tn-text-overline">' + (sel === 0 ? 'Аура' : 'Слот ' + sel) + (s.key ? ' · ключевой мод' : '') + '</p><h3 class="tn-card__title tn-card__title--display">' + UI.a('/mod/' + m.id + '?from=build:' + b.id + '&slot=' + sel, mask(m.name)) + '</h3>' +
          '<p class="tn-goal__why">' + mask(s.why || '') + '</p>' + (m.effect ? '<p class="tn-muted tn-small">' + mask(m.effect) + (m.card ? ' на максимальном ранге' : '') + '</p>' : '') +
          (s.alt ? '<p class="tn-small">Замена по гайду: ' + s.alt.map(a => UI.ref('mod:' + a, { query: '?from=build:' + b.id + '&slot=' + sel })).join(', ') + '</p>' : '') + (s.later ? '<p class="tn-small">Поздняя замена: ' + UI.ref('mod:' + s.later, { query: '?from=build:' + b.id + '&slot=' + sel }) + '</p>' : '') +
          '<div class="tn-cluster" style="gap:16px;align-items:flex-start">' + ownedControls(m.id, 'Есть ли у вас этот мод') +
          (m.card ? '<div class="tn-stack tn-stack--sm"><p class="tn-text-overline">Ранг для расчёта</p><div class="tn-mapctl tn-rankstep" role="group" aria-label="Ранг мода"><button class="tn-btn tn-btn--icon" data-act="set-modrank" data-id="' + m.id + '" data-delta="-1" aria-label="Понизить ранг" data-key="rank-down">' + icon('minus') + '</button><div class="tn-mapctl__zoom" aria-live="polite">Р ' + rankOf(m.id) + '/' + m.maxRank + '</div><button class="tn-btn tn-btn--icon" data-act="set-modrank" data-id="' + m.id + '" data-delta="1" aria-label="Повысить ранг" data-key="rank-up">' + icon('plus') + '</button></div><p class="tn-faint tn-small">Вместимость: ' + drainOf(m.id) + '</p></div>' : '') + '</div>' +
          '<div class="tn-card__foot"><a class="tn-btn tn-btn--primary" href="' + link('/mod/' + m.id + '?from=build:' + b.id + '&slot=' + sel + '&tab=where') + '">Где получить' + icon('arrow-right', 'tn-icon--sm') + '</a>' + UI.taskBtn('obtain:mod:' + m.id, 'add-obtain', 'В задачи', { primary: false, data: ' data-way=""' }) + '</div></div>';
      } else if (s) detail = '<div class="tn-card tn-slotdetail" id="slot-detail"><p class="tn-text-overline">Слот ' + sel + '</p><p>' + esc(s.open) + '. Гайд оставляет выбор под задачу.</p></div>';
    }
    return '<div class="tn-container tn-page">' + UI.crumbs(target.arsenal === 'frame' ? [{ path: '/warframes', html: 'Варфреймы' }, { path: '/item/' + target.id, html: entName(entity('item:' + target.id)) }, { html: 'Сборка' }] : target.arsenal === 'weapon' ? [{ path: '/weapons?cat=' + target.cat, html: 'Оружие' }, { path: '/item/' + target.id, html: entName(entity('item:' + target.id)) }, { html: 'Сборка' }] : [{ path: '/reference', html: 'Справочник' }, { path: '/boost#builds', html: 'Сборки' }, { html: mask(b.title) }]) +
      UI.pageTitle({ media: '<div class="tn-thumb tn-thumb--lg tn-pt-media">' + icon('build', 'tn-icon--lg') + '</div>', overline: 'Сборка · ' + (isFrame ? 'варфрейм' : (SLOTNAME[target.slot] || 'оружие').toLowerCase()) + ' · этап ' + b.stage, title: mask(b.title), lead: mask(b.lead), markers: UI.ref('item:' + b.target, { text: entName(entity('item:' + b.target)) }) }) +
      '<div class="tn-layout2"><div class="tn-stack tn-stack--lg">' +
      '<section class="tn-build" aria-labelledby="b-t"><div class="tn-section-title"><div><p class="tn-text-overline">Сборка · ' + (isFrame ? 'Варфрейм' : 'Оружие') + '</p><h2 class="tn-card__title tn-card__title--display" id="b-t">Раскладка модов</h2></div>' +
      UI.switch('toggle-cap', doubled, isFrame ? 'Реактор Орокин установлен' : 'Катализатор Орокин установлен', 'Вместимость: ' + (doubled ? 60 : 30) + (auraBonus ? ' + аура ' + auraBonus : ''), ' data-build="' + b.id + '" data-key="cap"') + '</div>' +
      special + '<div class="tn-modgrid">' + b.slots.map(slotBtn).join('') + '</div>' + statsHtml + polBlock + callout + detail +
      '<p class="tn-faint tn-small">Расчёт: вместимость мода = стоимость на ранге 0 + ранг (карточки Wiki); полярность слота: совпадает — вдвое дешевле, не совпадает — дороже на 25% (Wiki, «Polarity»). Параметры — сумма бонусов модов на максимальном ранге, без базовых значений, Гельминта, осколков и мистификаторов' + (isFrame ? '' : '; элементы — без врождённого элемента оружия') + '.</p></section>' +
      '<section class="tn-stack"><h2 class="tn-text-h2">Как играть</h2><ul class="tn-prose-list">' + b.play.map(x => '<li>' + mask(x) + '</li>').join('') + '</ul>' + (b.later.length ? '<h3 class="tn-text-h3">Позднее</h3><ul class="tn-prose-list">' + b.later.map(x => '<li>' + mask(x) + '</li>').join('') + '</ul>' : '') + (b.limits ? UI.callout('info', 'Ограничения', mask(b.limits)) : '') + (b.solo ? '<p class="tn-faint tn-small">' + icon('build', 'tn-icon--sm') + ' Сборка составлена сайтом для соло-игры из распространённых модов; карточки модов и полярности — Warframe Wiki, 13.10.2026. Подстройте под свой стиль.</p>' : UI.sourceMeta('g:' + b.guide)) + '</section>' +
      '</div><aside class="tn-stack tn-aside"><div class="tn-panel tn-stack"><p class="tn-text-overline">Снаряжение</p>' + UI.ref('item:' + b.target, { text: entName(entity('item:' + b.target)) }) + ownedControls(b.target, 'Есть ли у вас ' + ITEMTYPE[target.type].toLowerCase()) + '</div>' +
      '<div class="tn-panel tn-stack"><p class="tn-text-overline">Наличие модов</p><p class="tn-muted tn-small">Есть: ' + slotMods.filter(id => ownedState(id) === 'yes').length + ' · нет: ' + missing.length + ' · не указано: ' + unknown + '</p><button class="tn-btn tn-btn--sm" data-act="add-build-missing" data-build="' + b.id + '"' + (missing.length ? '' : ' disabled') + '>' + icon('plus') + 'Недостающие — в задачи</button>' + (missing.length ? '' : '<p class="tn-faint tn-small">Нет модов, отмеченных как отсутствующие.</p>') + '</div></aside></div></div>';
  },
  saveUI() { return { slot: current().query.get('slot') }; }
};
Actions.slot = t => {
  const n = t.dataset.slot; const q0 = current().query;
  if (q0.get('slot') === n) q0.delete('slot'); else q0.set('slot', n);
  try { history.replaceState(Object.assign({}, history.state), '', link(current().path + (q0.toString() ? '?' + q0 : ''))); } catch (e) {}
  rerender();
  const b = document.querySelector('[data-key="slot-' + n + '"]'); if (b) b.focus();
};
Actions['forma-mode'] = t => { const S = Screens.build; S.formaMode = S.formaMode || {}; S.formaMode[t.dataset.build] = t.dataset.val; rerender(); announce(t.dataset.val === 'innate' ? 'Расчёт только со встроенными полярностями' : 'Расчёт с формами'); };
Actions['toggle-exilus'] = t => { const id = t.dataset.build; const on = t.getAttribute('aria-checked') !== 'true'; commit(d => { d.facts['exilus:' + id] = on; }, () => announce(on ? 'Эксилус учитывается' : 'Эксилус не учитывается')); };
Actions['toggle-cap'] = t => { const id = t.dataset.build; const on = t.getAttribute('aria-checked') !== 'true'; commit(d => { d.facts['cap:' + id] = on; }, () => announce(on ? 'Вместимость удвоена' : 'Вместимость без удвоения')); };
Actions['add-build-missing'] = t => {
  const b = IDX.build.get(t.dataset.build);
  const specs = []; const deps = [];
  b.slots.forEach((s, i) => { if (s.mod && ownedState(s.mod) === 'no') { const m = IDX.mod.get(s.mod); specs.push({ ref: 'obtain:mod:' + m.id, title: 'Получить ' + q(m.name), href: '/mod/' + m.id + '?from=build:' + b.id + '&slot=' + (i + 1) + '&tab=where', group: 'build:' + b.id, groupTitle: maskPlain(b.title), kind: 'obtain', ctx: 'Слот ' + (i + 1) + ' сборки', stage: b.stage }); } });
  const res = addTasks(specs, deps);
  if (!res.ok) { Toast.saveError(() => Actions['add-build-missing'](t), 'Задачи не добавлены.'); return; }
  Toast.show({ tone: 'success', title: pl(res.created.length, ['задача добавлена', 'задачи добавлены', 'задач добавлено']), text: (res.reused.length ? 'Уже были: ' + res.reused.length + '. ' : '') + savedText(res.ok), actions: [{ label: 'Открыть задачи', href: '/tasks' }] });
};

/* ── 14-screen-arsenal.js ── */
/* 14-screen-arsenal.js — вкладки «Варфреймы» и «Оружие»: каталог с фильтрами, полярности, Прайм-версии, соло-сборки.
   Фильтры хранятся в адресе (возврат со страницы предмета восстанавливает выбор). */
const ROLE_ORDER = ['урон', 'контроль', 'защита', 'выживание', 'поддержка', 'скрытность', 'скорость', 'ближний бой', 'щиты'];
const WCAT = { primary: 'Основное', secondary: 'Вторичное', melee: 'Ближний бой' };
/** Как получить — общие группы для фильтра (по id/виду способа) */
function acqKinds(it) {
  const out = new Set();
  (it.ways || []).forEach(w => {
    const id = w.id || '', k = w.kind || '';
    const txt = (w.title || '') + ' ' + (w.steps || []).map(st => st.text || '').join(' ');
    const hasTable = (w.steps || []).some(st => st.table);
    if (id === 'start') { out.add('start'); if (/Магазин/.test(txt)) out.add('market'); return; }
    if (id === 'circuit' || id === 'duviri') { out.add('duviri'); return; }
    if (/Магазин/.test(txt)) out.add('market');
    if (id === 'lab') out.add('clan');
    if (id === 'quest' || k === 'quest' || id === 'junction' || id === 'lich') out.add('quest');
    if (hasTable || k === 'drop' || ['boss', 'lephantis', 'ropalolyst', 'armatus', 'demolisher', 'onslaught', 'spy', 'voidstorm'].includes(id)) out.add('drop');
    if (id === 'holdfasts' || id === 'solaris' || (k === 'vendor' && id !== 'market')) out.add('vendor');
  });
  return out;
}
const ACQ = { start: 'Стартовый выбор', market: 'Магазин', drop: 'Добыча (боссы, режимы)', quest: 'Квест или переход', clan: 'Клан (додзё)', vendor: 'Синдикат или торговец', duviri: 'Дувири' };

function arsenalSwitch(active) {
  return '<nav class="tn-arsenal-switch" aria-label="Арсенал">' + UI.segmentedLinks([{ href: '/warframes', label: 'Варфреймы', on: active === 'frames' }, { href: '/weapons', label: 'Оружие', on: active === 'weapons' }]) + '</nav>';
}
/** Сегменты-ссылки (вид как у сегментированного переключателя) */
UI.segmentedLinks = items => '<div class="tn-segmented">' + items.map(i => '<a class="tn-segmented__link" href="' + link(i.href) + '"' + (i.on ? ' aria-current="page"' : '') + '>' + esc(i.label) + '</a>').join('') + '</div>';

function arsFilterBar(id, state, parts, count, noun) {
  const chips = parts.filter(p => p.value).map(p => ({ k: p.key, l: p.chip(p.value) }));
  const side = '<div class="tn-filters" id="' + id + '">' + parts.map(p => p.html).join('') + '</div>';
  return { side, chips, top: '<button class="tn-btn tn-btn--block tn-catalog__fbtn" data-act="ars-filters" data-panel="' + id + '" data-key="filters-btn">' + icon('filter') + 'Фильтры' + (chips.length ? ' <span class="tn-count">' + chips.length + '</span>' : '') + '</button>' +
    (chips.length ? '<div class="tn-chipbar" aria-label="Активные фильтры">' + chips.map(c => '<span class="tn-chip">' + esc(c.l) + '<button class="tn-chip__remove" data-act="ars-chip" data-k="' + c.k + '" aria-label="Убрать фильтр «' + esc(c.l) + '»" data-key="achip-' + c.k + '">' + icon('close', 'tn-icon--sm') + '</button></span>').join('') + '<button class="tn-btn tn-btn--ghost tn-btn--sm" data-act="ars-clear" data-key="achip-clear">Сбросить все</button></div>' : '') +
    '<p class="tn-muted" aria-live="polite" id="ars-count">Найдено ' + pl(count, noun) + '</p>' };
}
const selectField = (id, label, key, value, opts) => ({ key, value, chip: v => label + ': ' + (opts.find(o => o[0] === v) || [v, v])[1],
  html: '<div class="tn-field"><label class="tn-field__label" for="' + id + '">' + label + '</label><select class="tn-select" id="' + id + '" data-act="ars-filter" data-k="' + key + '"><option value="">Все</option>' + opts.map(o => '<option value="' + o[0] + '"' + (value === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select></div>' });

/** Карточка варфрейма: роль, получение, полярности, Прайм, сборка */
UI.frameCard = function (it) {
  const e = entity('item:' + it.id);
  const own = ownedState(it.id);
  const b = (it.builds || []).map(id => IDX.build.get(id)).filter(Boolean)[0];
  const ks = acqKinds(it); const acq = ['start', 'market', 'drop', 'quest', 'clan', 'vendor', 'duviri'].filter(k => ks.has(k)).map(k => ACQ[k]).slice(0, 3).join(' · ');
  return '<article class="tn-card tn-card--interactive tn-stack tn-stack--sm tn-arscard"><div class="tn-card__head"><span class="tn-thumb">' + icon('orokin', 'tn-icon--lg') + '</span><div class="tn-stack tn-stack--sm" style="gap:2px;min-width:0">' +
    '<p class="tn-text-overline">Варфрейм · этап ' + it.stage + '</p><h3 class="tn-card__title"><a class="tn-card__link" href="' + link(e.path) + '">' + entName(e) + '</a></h3></div></div>' +
    '<div class="tn-markers">' + (it.roles || []).slice(0, 3).map(r => '<span class="tn-tag">' + esc(r) + '</span>').join('') + (it.prime ? UI.reco('Есть Прайм') : '') + '</div>' +
    '<p class="tn-muted tn-small">' + mask(it.summary || '') + '</p>' +
    '<dl class="tn-arsfacts"><dt>Полярности</dt><dd>' + UI.polList(it.pol, 'нет') + '</dd><dt>Аура</dt><dd>' + (it.aura ? UI.pol(it.aura) : '<span class="tn-faint">без полярности</span>') + '</dd>' + (acq ? '<dt>Получение</dt><dd>' + esc(acq) + '</dd>' : '') + '</dl>' +
    '<div class="tn-cluster" style="justify-content:space-between">' + (b ? UI.a('/build/' + b.id, 'Соло-сборка', 'tn-link') : '<span></span>') + '<span class="tn-faint tn-small">' + (own === 'yes' ? icon('check', 'tn-icon--sm') + ' есть у вас' : own === 'no' ? 'нет у вас' : 'наличие не указано') + '</span></div></article>';
};
UI.weaponCard = function (it) {
  const e = entity('item:' + it.id);
  const own = ownedState(it.id);
  const mr = Facts.get('mr');
  const b = (it.builds || []).map(id => IDX.build.get(id)).filter(Boolean)[0];
  const mrMark = it.mr != null ? (mr != null ? (mr >= it.mr ? UI.ready('ready', 'MR ' + it.mr) : UI.ready('rank', 'Нужен MR ' + it.mr)) : '<span class="tn-tag">MR ' + it.mr + '</span>') : '';
  return '<article class="tn-card tn-card--interactive tn-stack tn-stack--sm tn-arscard"><div class="tn-card__head"><span class="tn-thumb">' + icon('target', 'tn-icon--lg') + '</span><div class="tn-stack tn-stack--sm" style="gap:2px;min-width:0">' +
    '<p class="tn-text-overline">' + esc(it.clsRu || SLOTNAME[it.slot] || 'Оружие') + ' · этап ' + it.stage + '</p><h3 class="tn-card__title"><a class="tn-card__link" href="' + link(e.path) + '">' + entName(e) + '</a></h3></div></div>' +
    '<div class="tn-markers">' + mrMark + (it.incarnon ? '<span class="tn-tag">' + (it.incarnon === 'innate' ? 'Инкарнон' : 'Инкарнон-адаптер') + '</span>' : '') + (it.prime ? UI.reco('Есть Прайм') : '') + '</div>' +
    '<p class="tn-muted tn-small">' + mask(it.summary || '') + '</p>' +
    (it.wstats ? '<dl class="tn-arsfacts"><dt>Крит / статус</dt><dd class="tn-num">' + Math.round(it.wstats.cc * 100) + '% ×' + it.wstats.cd + ' / ' + fmt(Math.round(it.wstats.sc * 1000) / 10) + '%</dd><dt>Полярности</dt><dd>' + UI.polList(it.pol, 'нет') + (it.stancePol ? ' · стойка ' + UI.pol(it.stancePol) : '') + '</dd></dl>' : '') +
    '<div class="tn-cluster" style="justify-content:space-between">' + (b ? UI.a('/build/' + b.id, 'Соло-сборка', 'tn-link') : '<span></span>') + '<span class="tn-faint tn-small">' + (own === 'yes' ? icon('check', 'tn-icon--sm') + ' есть у вас' : own === 'no' ? 'нет у вас' : 'наличие не указано') + '</span></div></article>';
};

Screens.warframes = {
  nav: 'frames',
  title() { return 'Варфреймы'; },
  render(p, query) {
    const all = D.items.filter(i => i.arsenal === 'frame').sort((a, b) => a.stage - b.stage || a.name.localeCompare(b.name, 'ru'));
    const role = query.get('role') || '', acq = query.get('acq') || '', own = query.get('own') || '', avail = query.get('avail') || '';
    const cur = Store.doc.stage;
    const list = all.filter(it => (!role || (it.roles || []).includes(role)) && (!acq || acqKinds(it).has(acq)) && (!own || ownedState(it.id) === own) && (!avail || (cur ? it.stage <= cur : it.stage <= 1)));
    const roles = ROLE_ORDER.filter(r => all.some(i => (i.roles || []).includes(r)));
    const acqs = Object.keys(ACQ).filter(k => all.some(i => acqKinds(i).has(k)));
    const parts = [
      selectField('wf-role', 'Роль', 'role', role, roles.map(r => [r, r[0].toUpperCase() + r.slice(1)])),
      selectField('wf-acq', 'Как получить', 'acq', acq, acqs.map(k => [k, ACQ[k]])),
      selectField('wf-avail', 'Этап маршрута', 'avail', avail, [['now', cur ? 'До моего этапа (' + cur + ')' : 'Только начало игры']]),
      selectField('wf-own', 'Наличие у вас', 'own', own, [['yes', 'Есть у меня'], ['no', 'Нет у меня'], ['unknown', 'Не указано']])];
    const f = arsFilterBar('ars-filters', null, parts, list.length, ['варфрейм', 'варфрейма', 'варфреймов']);
    this.path = '/warframes';
    return '<div class="tn-container tn-page">' + arsenalSwitch('frames') +
      UI.pageTitle({ overline: 'Арсенал', title: 'Варфреймы', lead: 'Как получить, встроенные полярности, Прайм-версия и соло-сборка для каждого. Числа — Warframe Wiki, проверено ' + fdate('2026-10-13') + '.' }) +
      '<div class="tn-catalog" style="padding:24px 0 64px"><div class="tn-catalog__side">' + f.side + '</div><div class="tn-stack">' + f.top +
      (list.length ? '<div class="tn-grid tn-grid--3">' + list.map(UI.frameCard).join('') + '</div>' : UI.empty('filter', 'Фильтры ничего не нашли', 'Измените или сбросьте фильтры.', '<button class="tn-btn" data-act="ars-clear">Сбросить фильтры</button>')) +
      '<p class="tn-faint tn-small">Полярности: ' + UI.pol('V') + ' Мадурай, ' + UI.pol('D') + ' Вазарин, ' + UI.pol('-') + ' Нарамон, ' + UI.pol('=') + ' Зенурик, ' + UI.pol('*') + ' любая аура. Совпадение полярности слота и мода вдвое снижает стоимость мода.</p>' +
      '</div></div></div>';
  },
  saveUI() { return null; }
};

Screens.weapons = {
  nav: 'weapons',
  title() { return 'Оружие'; },
  render(p, query) {
    const cat = query.get('cat') || 'primary';
    const cls = query.get('cls') || '', acq = query.get('acq') || '', own = query.get('own') || '', mrq = query.get('mr') || '';
    const myMr = Facts.get('mr');
    const inCat = D.items.filter(i => i.arsenal === 'weapon' && i.cat === cat).sort((a, b) => a.stage - b.stage || (a.mr || 0) - (b.mr || 0) || a.name.localeCompare(b.name, 'ru'));
    const list = inCat.filter(it => (!cls || it.cls === cls) && (!acq || acqKinds(it).has(acq)) && (!own || ownedState(it.id) === own) && (!mrq || (myMr != null && (it.mr || 0) <= myMr)));
    const classes = [...new Set(inCat.map(i => i.cls))];
    const acqs = Object.keys(ACQ).filter(k => inCat.some(i => acqKinds(i).has(k)));
    const parts = [
      selectField('wp-cls', 'Класс', 'cls', cls, classes.map(c => [c, (inCat.find(i => i.cls === c) || {}).clsRu || c])),
      selectField('wp-acq', 'Как получить', 'acq', acq, acqs.map(k => [k, ACQ[k]])),
      selectField('wp-mr', 'Ранг мастерства', 'mr', mrq, [['mine', myMr != null ? 'Доступно мне (MR ' + myMr + ')' : 'Доступно мне (укажите ранг)']]),
      selectField('wp-own', 'Наличие у вас', 'own', own, [['yes', 'Есть у меня'], ['no', 'Нет у меня'], ['unknown', 'Не указано']])];
    const f = arsFilterBar('ars-filters', null, parts, list.length, ['вид оружия', 'вида оружия', 'видов оружия']);
    this.path = '/weapons';
    const tabs = '<nav class="tn-tabs" aria-label="Категория оружия">' + Object.entries(WCAT).map(([k, l]) => '<a class="tn-tab tn-tab--link" href="' + link('/weapons?cat=' + k) + '"' + (k === cat ? ' aria-current="page"' : '') + ' data-key="wcat-' + k + '">' + l + ' <span class="tn-count">' + D.items.filter(i => i.arsenal === 'weapon' && i.cat === k).length + '</span></a>').join('') + '</nav>';
    return '<div class="tn-container tn-page">' + arsenalSwitch('weapons') +
      UI.pageTitle({ overline: 'Арсенал', title: 'Оружие', lead: 'Основное, вторичное и ближний бой: как получить, ранг мастерства, полярности, Прайм-версия и соло-сборка. Числа — Warframe Wiki, проверено ' + fdate('2026-10-13') + '.' }) +
      tabs + '<div class="tn-catalog" style="padding:24px 0 64px"><div class="tn-catalog__side">' + f.side + '</div><div class="tn-stack">' + f.top +
      (myMr == null ? '<p class="tn-faint tn-small">Ранг мастерства не указан — <button class="tn-linkbtn tn-link" data-act="set-mr">указать</button>, чтобы видеть, что вам уже доступно.</p>' : '') +
      (list.length ? '<div class="tn-grid tn-grid--3">' + list.map(UI.weaponCard).join('') + '</div>' : UI.empty('filter', 'Фильтры ничего не нашли', 'Измените или сбросьте фильтры.', '<button class="tn-btn" data-act="ars-clear">Сбросить фильтры</button>')) +
      '</div></div></div>';
  },
  saveUI() { return null; }
};

function setArsFilter(k, v) {
  const cur = current(); const q0 = cur.query;
  if (v) q0.set(k, v); else q0.delete(k);
  try { history.replaceState(Object.assign({}, history.state), '', link(cur.path + (q0.toString() ? '?' + q0 : ''))); } catch (e) {}
  rerender();
  const c = document.getElementById('ars-count'); if (c) announce(c.textContent);
}
Actions['ars-filter'] = (t, e) => { if (e.type !== 'change') return; setArsFilter(t.dataset.k, t.value); };
Actions['ars-chip'] = t => { setArsFilter(t.dataset.k, ''); const f = document.querySelector('[data-key="achip-clear"]') || document.getElementById('ars-count'); if (f) { if (!f.matches('button')) f.tabIndex = -1; f.focus(); } };
Actions['ars-clear'] = () => {
  const cur = current(); const q0 = new URLSearchParams(); if (cur.query.get('cat')) q0.set('cat', cur.query.get('cat'));
  try { history.replaceState(Object.assign({}, history.state), '', link(cur.path + (q0.toString() ? '?' + q0 : ''))); } catch (e) {}
  rerender(); const h = document.getElementById('ars-count'); if (h) { h.tabIndex = -1; h.focus(); } announce('Фильтры сброшены');
};
Actions['ars-filters'] = t => {
  const src = () => document.getElementById(t.dataset.panel).outerHTML.replace(/id="(w[fp]-[a-z]+)"/g, 'id="$1-dr"').replace(/for="(w[fp]-[a-z]+)"/g, 'for="$1-dr"').replace('id="ars-filters"', 'id="ars-filters-dr"');
  const dr = Overlay.drawer({ title: 'Фильтры', body: src(), sheet: isPhone(), foot: '<button class="tn-btn" data-act="ars-clear" data-ov="close">Сбросить</button><button class="tn-btn tn-btn--primary" data-ov="close">' + esc(document.getElementById('ars-count').textContent) + '</button>',
    onRefresh() { dr.box.querySelector('.tn-objpanel__body').innerHTML = src(); dr.box.querySelector('.tn-objpanel__foot .tn-btn--primary').textContent = document.getElementById('ars-count').textContent; } });
};

/* ── 15-screen-search.js ── */
/* 15-screen-search.js — поиск (ScreenSearch, ScreenSearchStates, FlowWikiSearch).
   На сайте — локальный индекс, по мере ввода от 2 символов, 250 мс; скрытые результаты — «Скрытая страница · этап N».
   Warframe Wiki — по Enter или после паузы 600 мс; сначала русская Wiki, английская — отдельным запросом
   (если включено «Показывать английские статьи» или русских нет); таймаут 8 с; кэш на сессию. */
const norm = s => String(s || '').toLowerCase().replace(/ё/g, 'е');
let SITE_INDEX = null;
function siteIndex() {
  if (SITE_INDEX) return SITE_INDEX;
  const out = [];
  const add = (ref, title, section, text, stage, spoiler, extra) => out.push(Object.assign({ ref, title, section, text: text || '', stage: stage || 0, spoiler: !!spoiler }, extra || {}));
  D.stages.forEach(s => add('stage:' + s.n, 'Этап ' + s.n + ': ' + s.title, 'Маршрут · Этапы', s.lead + ' ' + (s.goal || ''), s.n, s.spoiler));
  D.goals.forEach(g => { const s = IDX.stage.get(String(g.stage)); add('goal:' + g.id, g.title, 'Маршрут · Этап ' + g.stage + (g.kind === 'side' ? ' · Дополнительно' : ' · Цель'), [g.why, g.result, ...(g.steps || []).map(x => x.text)].filter(Boolean).join(' · '), g.stage, s.spoiler); });
  D.articles.forEach(a => {
    add('article:' + a.id, a.title, 'Справочник · Раздел ' + a.n, a.lead + ' ' + a.intro.map(blockText).join(' '), a.stage || 0, false);
    a.subs.forEach(s => add('article:' + a.id, s.title, 'Справочник · ' + a.title, s.blocks.map(blockText).join(' '), s.spoiler || 0, !!s.spoiler, { anchor: 'sub-' + s.id, sub: true }));
  });
  D.mods.forEach(m => add('mod:' + m.id, m.name, 'Моды · ' + FAMILY[m.family], [m.effect, m.en, ...(m.ways || []).map(w => w.title)].filter(Boolean).join(' · '), m.stage, false, { rarity: m.rarity }));
  D.items.filter(i => !i.hidden).forEach(i => add('item:' + i.id, i.name, (i.type === 'resource' || i.type === 'currency' ? 'Добыча · ' : 'Усиление · ') + ITEMTYPE[i.type], [i.summary, i.en, ...(i.where || []).map(w => w.text), i.note].filter(Boolean).join(' · '), i.stage, i.spoiler, { rarity: i.rarity }));
  D.vendors.forEach(v => add('vendor:' + v.id, v.name, 'Синдикаты · Продавцы', v.where + ' ' + v.currency + ' ' + (v.note || ''), v.stage, v.spoiler));
  D.syndicates.forEach(s => add('syndicate:' + s.id, s.name, 'Синдикаты', s.use + ' ' + s.where, s.stage, s.spoiler));
  D.activities.forEach(a => add('activity:' + a.id, a.name, 'Поздняя игра · Режимы', a.lead + ' ' + a.prep.join(' ') + ' ' + a.rewards.join(' '), a.stage, false));
  D.builds.forEach(b => add('build:' + b.id, b.title, 'Усиление · Сборки', b.lead, b.stage, false));
  D.locations.forEach(l => add('planet:' + l.id, l.name, 'Карта · Планеты', l.lead + ' ' + (l.nodes || []).map(n => n.name + ' ' + n.text).join(' '), Math.min(...l.stages), l.spoiler));
  D.facts.filter(f => f.kind === 'quest').forEach(f => add('quest:' + f.id, f.name, 'Маршрут · Квесты', (f.unlocks || '') + ' ' + (f.note || ''), f.stage, f.spoiler));
  D.glossary.forEach(g => add('route:reference', g.term, 'Справочник · Словарь', g.def, 0, false, { path: '/reference#glossary' }));
  SITE_INDEX = out.map(x => Object.assign(x, { nt: norm(x.title), nx: norm(x.text) }));
  return SITE_INDEX;
}
function siteSearch(q0) {
  const words = norm(q0).split(/\s+/).filter(w => w.length > 1);
  if (!words.length) return [];
  const res = [];
  siteIndex().forEach(x => {
    if (!words.every(w => x.nt.includes(w) || x.nx.includes(w))) return;
    let score = 0; words.forEach(w => { if (x.nt.includes(w)) score += 10; if (x.nt.startsWith(w)) score += 5; if (x.nx.includes(w)) score += 1; });
    if (x.nt === norm(q0)) score += 20;
    if (x.sub) score -= 2;
    res.push(Object.assign({ score }, x));
  });
  return res.sort((a, b) => b.score - a.score).slice(0, 60);
}
function hl(text, q0, scope) {
  const words = norm(q0).split(/\s+/).filter(w => w.length > 1);
  const t = String(text);
  const nt = norm(t);
  let pos = -1; words.forEach(w => { const i = nt.indexOf(w); if (i >= 0 && (pos < 0 || i < pos)) pos = i; });
  let a = Math.max(0, pos - 60), b = Math.min(t.length, (pos < 0 ? 0 : pos) + 160);
  let frag = (a > 0 ? '…' : '') + t.slice(a, b) + (b < t.length ? '…' : '');
  let html = mask(frag, scope);
  words.forEach(w => { const re = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/е/g, '[её]') + ')', 'gi'); html = html.replace(new RegExp(re.source + '(?![^<]*>)', 'gi'), '<mark>$1</mark>'); });
  return html;
}

const Wiki = {
  cache: new Map(),
  hosts: { ru: 'https://ru.wiki.warframe.com', en: 'https://wiki.warframe.com' },
  url(lang, q0) { return this.hosts[lang] + '/api.php?action=query&list=search&srsearch=' + encodeURIComponent(q0) + '&srlimit=10&srprop=snippet&format=json&utf8=1&origin=*'; },
  searchPage(lang, q0) { return this.hosts[lang] + '/index.php?search=' + encodeURIComponent(q0) + '&title=Special%3ASearch&fulltext=1'; },
  article(lang, title) { return this.hosts[lang] + '/w/' + encodeURIComponent(title.replace(/ /g, '_')).replace(/%2F/g, '/'); },
  /** Возвращает Promise<{items:[{title,snippet}]}>; ошибка — reject */
  fetch(lang, q0, signal) {
    const key = lang + ':' + q0;
    if (this.cache.has(key)) return Promise.resolve(this.cache.get(key));
    const dbg = sessionStorage.getItem('tn:debug') || '';
    if (dbg.includes('wiki-fail')) return Promise.reject(new Error('debug'));
    if (dbg.includes('wiki-slow')) return new Promise((res, rej) => { const t = setTimeout(() => rej(new Error('timeout')), 20000); signal.addEventListener('abort', () => { clearTimeout(t); rej(new DOMException('abort', 'AbortError')); }); });
    return fetch(this.url(lang, q0), { signal, credentials: 'omit' }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(j => {
      const items = ((j.query || {}).search || []).map(x => ({ title: x.title, snippet: String(x.snippet || '') }));
      const v = { items, total: ((j.query || {}).searchinfo || {}).totalhits };
      this.cache.set(key, v); return v;
    });
  }
};
/** Фрагмент Wiki: без HTML, совпадения — в <mark> */
function wikiSnippet(s) {
  const tmp = document.createElement('div');
  tmp.innerHTML = s.replace(/<span class="searchmatch">/g, '\u0001').replace(/<\/span>/g, '\u0002');
  const txt = tmp.textContent;
  return esc(txt).replace(/\u0001/g, '<mark>').replace(/\u0002/g, '</mark>');
}

Screens.search = {
  nav: null,
  st: { ru: null, en: null, status: 'idle', q: '', error: null, slow: false },
  title(p, query) { const q0 = query && query.get('q'); return q0 ? 'Поиск: ' + q0 : 'Поиск'; },
  render(p, query) {
    const q0 = query.get('q') || '';
    const source = query.get('source') === 'wiki' ? 'wiki' : 'site';
    this.q = q0; this.source = source;
    const site = q0.trim().length >= 2 ? siteSearch(q0) : [];
    this.siteCount = site.length;
    const tooShort = q0.trim().length === 1;
    const wst = this.st.q === q0 ? this.st : { status: 'idle' };
    const wcount = wst.status === 'done' ? (wst.ru ? wst.ru.items.length : 0) + (wst.en ? wst.en.items.length : 0) : null;
    const flag = wst.status === 'error' ? '<span class="tn-tab__flag">' + icon('warning', 'tn-icon--sm') + 'недоступна</span>' : '';
    let h = '<div class="tn-container tn-page tn-searchpage"><div class="tn-stack" style="padding-top:40px"><h1 class="tn-text-h1 tn-h1-adapt" tabindex="-1" id="page-h1">Поиск</h1>' +
      '<div class="tn-field"><div class="tn-search' + (wst.status === 'loading' && source === 'wiki' ? ' is-loading' : '') + '">' + icon('search') + '<input class="tn-input" id="q" type="search" value="' + attr(q0) + '" aria-label="Поисковый запрос" placeholder="Мод, ресурс, планета или квест" autocomplete="off" data-key="q"' + (tooShort ? ' aria-invalid="true" aria-describedby="q-err"' : '') + '>' +
      (q0 ? '<button class="tn-btn tn-btn--ghost tn-btn--icon tn-search__clear" data-act="search-clear" aria-label="Очистить запрос">' + icon('close') + '</button>' : '') + '</div>' +
      (tooShort ? '<p class="tn-field__error" id="q-err">' + icon('info', 'tn-icon--sm') + 'Введите хотя бы 2 символа.</p>' : '<p class="tn-field__hint">На сайте — по мере ввода; в Warframe Wiki — по Enter или после паузы. Клавиша / — из любого места, Esc — очистить.</p>') + '</div>' +
      '<div class="tn-tabs" role="tablist" aria-label="Источник результатов"><button class="tn-tab" role="tab" id="tab-site" aria-controls="panel-site" aria-selected="' + (source === 'site') + '"' + (source === 'site' ? '' : ' tabindex="-1"') + ' data-act="search-source" data-val="site" data-key="tab-site">' + icon('orokin', 'tn-icon--sm') + 'На сайте' + (q0.trim().length >= 2 ? ' <span class="tn-count">' + site.length + '</span>' : '') + '</button>' +
      '<button class="tn-tab" role="tab" id="tab-wiki" aria-controls="panel-wiki" aria-selected="' + (source === 'wiki') + '"' + (source === 'wiki' ? '' : ' tabindex="-1"') + ' data-act="search-source" data-val="wiki" data-key="tab-wiki">' + icon('globe', 'tn-icon--sm') + 'Warframe Wiki' + (wcount != null ? ' <span class="tn-count">' + wcount + '</span>' : '') + flag + '</button></div></div>';
    if (source === 'site') h += '<div role="tabpanel" id="panel-site" aria-labelledby="tab-site" class="tn-search__panel">' + this.sitePanel(q0, site) + '</div>';
    else h += '<div role="tabpanel" id="panel-wiki" aria-labelledby="tab-wiki" class="tn-search__panel">' + this.wikiPanel(q0, wst, site) + '</div>';
    return h + '</div>';
  },
  sitePanel(q0, site) {
    if (q0.trim().length < 2) return '<div style="padding:24px 0 64px">' + UI.empty('search', 'Что ищем?', 'Например: «гальванизированный», «Рино», «Эссенция Витус», «Ячейки Нетры».') + '</div>';
    if (!site.length) {
      const wst = this.st.q === q0 ? this.st : null;
      const wc = wst && wst.status === 'done' ? (wst.ru ? wst.ru.items.length : 0) + (wst.en ? wst.en.items.length : 0) : null;
      return '<div style="padding:24px 0 64px">' + UI.empty('search', 'На сайте нет «' + esc(q0) + '»', 'Проверьте написание или поищите в Warframe Wiki' + (wc ? ' — там ' + pl(wc, ['статья', 'статьи', 'статей']) + ' по запросу' : '') + '.', '<button class="tn-btn" data-act="search-source" data-val="wiki">Открыть вкладку Wiki</button>') + '</div>';
    }
    const items = site.map((x, i) => {
      const e = entity(x.ref);
      const hidden = x.spoiler && Spoil.hiddenStage(x.stage, true) && !Spoil.revealed.has('sr:' + i + ':' + x.ref);
      const path = x.path || (e ? e.path : '/') + (x.anchor ? '#' + x.anchor : '');
      if (hidden) return '<li class="tn-result"><h3 class="tn-result__title"><span class="tn-spoiler--inline tn-spoiler" style="background:none">' + icon('eye-off', 'tn-icon--sm') + 'Скрытая страница · этап ' + x.stage + '</span></h3><p class="tn-result__path">' + esc(x.section.split(' · ')[0]) + '</p><p class="tn-result__snippet">Название и фрагмент скрыты защитой от спойлеров. <button class="tn-btn tn-btn--ghost tn-btn--sm" data-act="reveal" data-scope="sr:' + i + ':' + attr(x.ref) + '" style="position:relative;z-index:1">Показать</button></p></li>';
      const scope = 'sr:' + i + ':' + x.ref;
      return '<li class="tn-result"><h3 class="tn-result__title"><a href="' + link(path) + '" data-key="sr-' + i + '">' + hl(x.title, q0, scope) + '</a></h3><p class="tn-result__path">' + mask(x.section, scope) + '</p><p class="tn-result__snippet">' + hl(x.text, q0, scope) + '</p>' + (x.rarity ? '<div class="tn-result__aside">' + UI.rarity(x.rarity) + '</div>' : '') + '</li>';
    });
    return '<div class="tn-searchgrid"><div><p class="tn-muted" aria-live="polite">Найдено на сайте: ' + site.length + '</p><ul class="tn-results">' + items.join('') + '</ul></div><aside class="tn-stack" style="align-self:start"><div class="tn-panel tn-stack"><p class="tn-text-overline">Также в Warframe Wiki</p><p class="tn-muted tn-small">Статьи Wiki — внешний источник: открываются в новой вкладке.</p><button class="tn-btn tn-btn--sm" data-act="search-source" data-val="wiki">Искать «' + esc(q0) + '» в Wiki</button></div></aside></div>';
  },
  wikiPanel(q0, wst, site) {
    if (q0.trim().length < 2) return '<div style="padding:24px 0 64px">' + UI.empty('globe', 'Поиск в Warframe Wiki', 'Введите запрос и нажмите Enter. Сначала — русская Wiki, английская — отдельным запросом.') + '</div>';
    const showEn = Store.doc.settings.showEnglish !== false;
    const scopeBar = '<div class="tn-search-scope"><span>Сначала русские статьи' + (wst.status === 'done' ? ' · ' + (wst.ru ? wst.ru.items.length : 0) + ' на русском' + (wst.en ? ', ' + wst.en.items.length + ' на английском' : '') : '') + '</span>' +
      '<span class="tn-faint">Источники: ru.wiki.warframe.com, wiki.warframe.com</span>' + UI.switch('set-english', showEn, 'Показывать английские статьи', '', ' style="margin-left:auto"') + '</div>';
    let main;
    if (wst.status === 'idle') main = UI.empty('globe', 'Нажмите Enter, чтобы искать в Wiki', 'Запрос «' + esc(q0) + '» отправим в Warframe Wiki.', '<button class="tn-btn tn-btn--primary" data-act="wiki-run">Искать в Wiki</button>');
    else if (wst.status === 'loading') main = UI.loading('Ищем в Warframe Wiki…') + '<div class="tn-card" aria-hidden="true"><span class="tn-skel" style="width:50%;height:18px"></span><span class="tn-skel" style="width:90%"></span></div>' +
      (wst.slow ? UI.callout('info', 'Загрузка занимает больше обычного', 'Можно подождать или открыть поиск на Wiki в новой вкладке — запрос сохранится.', '<a class="tn-btn tn-btn--sm" href="' + attr(Wiki.searchPage('ru', q0)) + '" target="_blank" rel="noopener">Искать на Wiki' + icon('external', 'tn-icon--sm') + '</a><button class="tn-btn tn-btn--ghost tn-btn--sm" data-act="wiki-cancel">Отменить</button>', { role: 'status' }) : '');
    else if (wst.status === 'error') main = UI.error('globe', 'Warframe Wiki сейчас недоступна', 'Поиск по сайту работает. Можно открыть поиск на Wiki в новой вкладке — запрос «' + esc(q0) + '» сохранится.', '<a class="tn-btn tn-btn--primary" href="' + attr(Wiki.searchPage('ru', q0)) + '" target="_blank" rel="noopener">Открыть поиск на Wiki' + icon('external', 'tn-icon--sm') + '</a><button class="tn-btn" data-act="wiki-run">' + icon('refresh', 'tn-icon--sm') + 'Повторить</button>');
    else if (wst.status === 'cancelled') main = UI.empty('globe', 'Поиск в Wiki отменён', '', '<button class="tn-btn" data-act="wiki-run">Искать снова</button><a class="tn-btn tn-btn--ghost" href="' + attr(Wiki.searchPage('ru', q0)) + '" target="_blank" rel="noopener">Открыть на Wiki' + icon('external', 'tn-icon--sm') + '</a>');
    else {
      const ru = wst.ru ? wst.ru.items : [], en = wst.en ? wst.en.items : [];
      const res = (lang, x) => {
        const href = Wiki.article(lang, x.title);
        const spoil = Spoil.on() && (lang === 'en' || hasMasked(x.title));
        const title = lang === 'ru' && hasMasked(x.title) ? 'Статья поздней игры' : esc(x.title);
        return '<li class="tn-result"><h3 class="tn-result__title">' + UI.lang(lang) + '<a href="' + attr(href) + '" target="_blank" rel="noopener"' + (lang === 'en' ? ' lang="en"' : '') + '>' + title + '<span class="tn-sr-only"> — статья Warframe Wiki на ' + (lang === 'ru' ? 'русском' : 'английском') + ', откроется в новой вкладке</span></a></h3>' +
          '<p class="tn-result__path">' + icon('globe', 'tn-icon--sm') + (lang === 'ru' ? 'ru.wiki.warframe.com' : 'wiki.warframe.com · Английская статья') + (spoil ? ' · ' + icon('warning', 'tn-icon--sm') + ' Может раскрывать сюжет' : '') + '</p>' +
          '<p class="tn-result__snippet"' + (lang === 'en' ? ' lang="en"' : '') + '>' + (lang === 'ru' && hasMasked(x.title) ? 'Фрагмент скрыт: статья может относиться к этапам после вашего текущего.' : wikiSnippet(x.snippet)) + '</p>' +
          '<div class="tn-result__aside"><a class="tn-btn tn-btn--sm" href="' + attr(href) + '" target="_blank" rel="noopener">Открыть статью' + icon('external', 'tn-icon--sm') + '<span class="tn-sr-only"> (новая вкладка)</span></a></div></li>';
      };
      main = '';
      if (!ru.length && !en.length) main = UI.empty('search', 'В Wiki нет «' + esc(q0) + '»', 'Попробуйте другое написание или поиск на сайте.', '<a class="tn-btn" href="' + attr(Wiki.searchPage('ru', q0)) + '" target="_blank" rel="noopener">Открыть поиск на Wiki' + icon('external', 'tn-icon--sm') + '</a>');
      else {
        if (!ru.length) main += UI.callout('warning', 'Русских статей по запросу «' + esc(q0) + '» нет', en.length ? 'Найдено ' + pl(en.length, ['статья', 'статьи', 'статей']) + ' на английском.' : '', !showEn ? '<button class="tn-btn tn-btn--sm" data-act="set-english" aria-checked="false">Показать английские статьи</button>' : '', { icon: 'globe' });
        if (ru.length) main += '<h2 class="tn-text-overline" style="margin:8px 0">На русском</h2><ul class="tn-results">' + ru.map(x => res('ru', x)).join('') + '</ul>';
        if (en.length && (showEn || !ru.length)) main += '<h2 class="tn-text-overline" style="margin:24px 0 8px">На английском</h2><ul class="tn-results">' + en.map(x => res('en', x)).join('') + '</ul>';
      }
    }
    const aside = '<aside class="tn-stack" style="align-self:start"><div class="tn-panel tn-stack"><p class="tn-text-overline">На сайте тоже есть</p>' + (site.length ? site.slice(0, 3).map(x => { const e = entity(x.ref); const hid = x.spoiler && Spoil.hiddenStage(x.stage, true); return hid ? '<span class="tn-faint">Скрытая страница · этап ' + x.stage + '</span>' : UI.a(x.path || (e ? e.path : '/') + (x.anchor ? '#' + x.anchor : ''), mask(x.title), 'tn-link tn-link--quiet'); }).join('') + '<button class="tn-btn tn-btn--sm" data-act="search-source" data-val="site">Все ' + site.length + ' на сайте</button>' : '<p class="tn-muted tn-small">На сайте ничего не нашлось.</p>') + '</div>' +
      '<p class="tn-faint tn-small">Статьи Wiki открываются в новой вкладке. Их содержимое мы не проверяем и не скрываем.</p></aside>';
    return scopeBar + '<div class="tn-searchgrid"><div>' + main + '</div>' + aside + '</div>';
  },
  defaultFocus(main) { return main.querySelector('#q'); },
  mount(main) {
    const inp = main.querySelector('#q');
    if (inp && !this.keepFocus) { if (document.activeElement === document.body || document.activeElement === main.querySelector('#page-h1') || this.focusInput) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); } }
    this.focusInput = false;
    const onInput = debounce(() => this.setQuery(inp.value, true), 250);
    inp.addEventListener('input', () => { onInput(); if (this.source === 'wiki') this.wikiDebounced(); });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); this.setQuery(inp.value, true); if (this.source === 'wiki') this.runWiki(); }
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); if (inp.value) { inp.value = ''; this.setQuery('', true); } else { const st = history.state || {}; if (st.prev) history.back(); else Router.go('/'); } }
    });
    if (this.source === 'wiki' && this.q.trim().length >= 2 && !(this.st.q === this.q && this.st.status !== 'idle')) this.runWiki();
  },
  wikiDebounced: debounce(function () { Screens.search.runWiki(); }, 600),
  setQuery(v, focus) {
    const q0 = current().query; if (v) q0.set('q', v); else q0.delete('q');
    if (!q0.get('source')) q0.set('source', this.source);
    try { history.replaceState(Object.assign({}, history.state), '', link('/search?' + q0)); } catch (e) {}
    this.focusInput = focus;
    rerender();
    const inp = document.getElementById('q'); if (inp && focus) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
  },
  runWiki() {
    const q0 = (current().query.get('q') || '').trim();
    if (q0.length < 2) return;
    if (this.ctrl) this.ctrl.abort();
    const ctrl = new AbortController(); this.ctrl = ctrl;
    this.st = { q: current().query.get('q'), status: 'idle', ru: null, en: null, slow: false };
    const st = this.st;
    const showT = setTimeout(() => { if (st.status === 'idle') { st.status = 'loading'; this.refresh(); } }, 300);
    const slowT = setTimeout(() => { if (st.status === 'loading' || st.status === 'idle') { st.status = 'loading'; st.slow = true; this.refresh(); } }, 8000);
    const finish = () => { clearTimeout(showT); clearTimeout(slowT); };
    const timeout = setTimeout(() => ctrl.abort(), 30000);
    Wiki.fetch('ru', q0, ctrl.signal).then(ru => {
      st.ru = ru;
      const needEn = Store.doc.settings.showEnglish !== false || !ru.items.length;
      return needEn ? Wiki.fetch('en', q0, ctrl.signal).then(en => { st.en = en; }).catch(e => { if (e.name === 'AbortError') throw e; st.en = null; }) : null;
    }).then(() => { finish(); clearTimeout(timeout); st.status = 'done'; this.refresh(); announce('Wiki: найдено ' + ((st.ru ? st.ru.items.length : 0) + (st.en ? st.en.items.length : 0))); })
      .catch(e => { finish(); clearTimeout(timeout); if (this.st !== st) return; st.status = e.name === 'AbortError' && st.cancelled ? 'cancelled' : 'error'; this.refresh(); });
  },
  refresh() { if (Router.screen === this) { const inpFocused = document.activeElement && document.activeElement.id === 'q'; this.focusInput = inpFocused; rerender(); if (inpFocused) { const i = document.getElementById('q'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } } } },
  unmount() { if (this.ctrl && this.st.status !== 'done') { this.st.cancelled = true; this.ctrl.abort(); } }
};
Actions['search-source'] = t => {
  const q0 = current().query; q0.set('source', t.dataset.val);
  try { history.replaceState(Object.assign({}, history.state), '', link('/search?' + q0)); } catch (e) {}
  Screens.search.source = t.dataset.val;
  rerender();
  const b = document.querySelector('[data-key="tab-' + t.dataset.val + '"]'); if (b) b.focus();
  if (t.dataset.val === 'wiki' && (q0.get('q') || '').trim().length >= 2 && !(Screens.search.st.q === q0.get('q') && Screens.search.st.status === 'done')) Screens.search.runWiki();
};
Actions['search-clear'] = () => { Screens.search.setQuery('', true); };
Actions['wiki-run'] = () => Screens.search.runWiki();
Actions['wiki-cancel'] = () => { const s = Screens.search; s.st.cancelled = true; if (s.ctrl) s.ctrl.abort(); };

/* ── 16-screen-tasks.js ── */
/* 16-screen-tasks.js — «Мои задачи» (ScreenTasks): продолжение с последнего места, группы, зависимые задачи,
   ручные отметки прогресса, честное описание хранения, сброс, 404. */
Screens.tasks = {
  nav: 'tasks',
  openFacts: new Set(),
  saveUI() { const m = document.getElementById('main'); if (m) $$('details.tn-factgroup', m).forEach(d => d.open ? this.openFacts.add(d.dataset.fg) : this.openFacts.delete(d.dataset.fg)); return null; },
  title() { return 'Мои задачи'; },
  render(p, query) {
    const tasks = activeTasks();
    const groupBy = query.get('group') === 'type' ? 'type' : 'stage';
    const hideDone = query.get('hideDone') === '1';
    const open = tasks.filter(t => !t.done).length, done = tasks.length - open;
    const lp = Store.doc.lastPlace;
    const cur = Store.doc.stage;
    const head = UI.pageTitle({ overline: tasks.length ? 'С возвращением' : 'Личный план', title: 'Мои задачи',
      lead: tasks.length ? pl(open, ['активная задача', 'активные задачи', 'активных задач']) + ', ' + done + ' ' + plural(done, ['выполнена', 'выполнены', 'выполнено']) + '.' + (Store.doc.updatedAt ? ' Последнее изменение — ' + ftime(Store.doc.updatedAt) + '.' : '') : 'Задачи — то, что вы решили сделать. Они не меняют игровые отметки и ничего не покупают.',
      actions: UI.save() });
    let mainCol = '';
    if (Store.status === 'unavailable') mainCol += UI.callout('warning', 'Сохранение недоступно', 'Браузер запрещает хранилище (приватный режим или запрет cookies). Задачи и отметки действуют до закрытия вкладки.', null, { role: 'status' });
    if (Store.status === 'error') mainCol += UI.callout('danger', 'Не удалось сохранить прогресс', 'Последнее изменение не записано и отменено на экране. Освободите место в хранилище браузера или проверьте его настройки.', '<button class="tn-btn tn-btn--sm" data-act="retry-save">' + icon('refresh', 'tn-icon--sm') + 'Проверить снова</button><button class="tn-btn tn-btn--ghost tn-btn--sm" data-act="export">Скачать копию</button>', { role: 'alert' });
    if (cur) {
      const si = stageInfo(cur);
      const tgt = lp && lp.href ? lp : { href: '/stage/' + cur, title: 'Этап ' + cur + ' · ' + IDX.stage.get(String(cur)).short };
      mainCol += '<div class="tn-card is-current"><div class="tn-section-title"><div><p class="tn-text-overline">Продолжить с того места</p><p class="tn-card__title tn-card__title--display">' + mask(tgt.title) + '</p>' +
        (si.nearest ? '<p class="tn-muted tn-small">Ближайшая цель этапа ' + cur + ': ' + UI.a('/stage/' + cur + '#goal-' + si.nearest.id, mask(si.nearest.title)) + '</p>' : '') + '</div><a class="tn-btn tn-btn--primary" href="' + link(tgt.href) + '">Продолжить' + icon('arrow-right', 'tn-icon--sm') + '</a></div>' +
        '<div class="tn-stageprog">' + UI.steps(si.doneMain, si.total) + '<span class="tn-faint tn-small">Этап ' + cur + ': ' + si.doneMain + ' из ' + si.total + ' ' + plural(si.total, ['цели', 'целей', 'целей']) + ' отмечено</span></div></div>';
    }
    if (!tasks.length) {
      mainCol += UI.empty('tasks', 'Задач пока нет', 'Добавляйте цели, покупки и недостающие условия кнопкой «Добавить в задачи». Они сохранятся в этом браузере.', cur ? '<a class="tn-btn tn-btn--primary" href="' + link('/stage/' + cur) + '">Открыть этап ' + cur + '</a>' : '<button class="tn-btn tn-btn--primary" data-act="change-stage">Выбрать текущий этап</button>');
    } else {
      mainCol += '<div class="tn-cluster" style="justify-content:space-between">' + UI.segmented('Группировка', [{ val: 'stage', label: 'По этапам', on: groupBy === 'stage' }, { val: 'type', label: 'По типу', on: groupBy === 'type' }], 'task-group') +
        '<label class="tn-check" style="padding:0" data-key="hide-done"><input type="checkbox" data-act="task-hide-done"' + (hideDone ? ' checked' : '') + '>Скрыть выполненные</label></div>';
      const groups = new Map();
      const TYPE = { goal: 'Цели этапов', cond: 'Условия доступа', purchase: 'Покупки', standing: 'Репутация', obtain: 'Получить предметы', farm: 'Сбор ресурсов', plan: 'Поздние режимы' };
      tasks.forEach(t => {
        let key, title;
        if (groupBy === 'type') { key = t.kind || 'other'; title = TYPE[key] || 'Другое'; }
        else if (t.group && t.group.startsWith('stage:')) { key = t.group; title = t.groupTitle; }
        else { key = t.group || 'other'; title = t.groupTitle || 'Другое'; }
        if (!groups.has(key)) groups.set(key, { title, items: [], order: t.stage || 99 });
        groups.get(key).items.push(t);
      });
      const sorted = [...groups.entries()].sort((a, b) => (a[1].order - b[1].order) || a[1].title.localeCompare(b[1].title, 'ru'));
      sorted.forEach(([key, g], gi) => {
        // внутри группы — сначала то, от чего зависят другие задачи (условие раньше покупки)
        const byId = new Map(g.items.map(t => [t.id, t])); const depth = new Map();
        const dep = (t, seen) => { if (depth.has(t.id)) return depth.get(t.id); if (seen.has(t.id)) return 0; seen.add(t.id); const ds = (t.dependsOn || []).map(id => byId.get(id)).filter(Boolean); const v = ds.length ? 1 + Math.max(...ds.map(x => dep(x, seen))) : 0; depth.set(t.id, v); return v; };
        g.items.forEach(t => dep(t, new Set()));
        g.items.sort((a, b) => depth.get(a.id) - depth.get(b.id));
        const items = hideDone ? g.items.filter(t => !t.done) : g.items;
        const dn = g.items.filter(t => t.done).length;
        if (!items.length) return;
        mainCol += '<section class="tn-taskgroup" aria-labelledby="tg-' + gi + '"><div class="tn-taskgroup__head"><h2 class="tn-taskgroup__title" id="tg-' + gi + '">' + mask(g.title) + '</h2><span class="tn-taskgroup__count">' + pl(g.items.length, ['задача', 'задачи', 'задач']) + (dn ? ' · ' + dn + ' ' + plural(dn, ['выполнена', 'выполнены', 'выполнено']) : '') + '</span><div class="tn-meter" role="img" aria-label="Выполнено ' + dn + ' из ' + g.items.length + '"><i style="width:' + Math.round(dn / g.items.length * 100) + '%"></i></div></div>' +
          items.map(t => this.row(t)).join('') + '</section>';
      });
      if (hideDone && !tasks.some(t => !t.done)) mainCol += UI.empty('check-circle', 'Все задачи выполнены', 'Выполненные скрыты фильтром.', '<button class="tn-btn" data-act="task-hide-done-off">Показать выполненные</button>');
    }
    // Отметки прогресса
    const facts = D.facts.filter(f => f.kind !== 'number');
    const factRow = f => { const v = Store.doc.facts[f.id]; const h = Spoil.hiddenStage(f.stage || 0, f.spoiler);
      return '<div class="tn-factrow"><span>' + (h ? '<span class="tn-faint">Скрытый сюжетный квест · этап ' + f.stage + '</span>' : UI.a('/quest/' + f.id, mask(f.name), 'tn-link tn-link--quiet')) + '</span><div class="tn-segmented tn-segmented--sm" role="group" aria-label="' + attr(h ? 'Скрытый квест, этап ' + f.stage : f.name) + '">' +
        [['yes', 'Да', v === true], ['no', 'Нет', v === false], ['unset', '—', v == null]].map(o => '<button aria-pressed="' + o[2] + '" data-act="fact-set" data-fact="' + f.id + '" data-v="' + o[0] + '" data-key="pf-' + f.id + '-' + o[0] + '" aria-label="' + ({ yes: 'выполнено', no: 'не выполнено', unset: 'не указано' }[o[0]]) + '">' + o[1] + '</button>').join('') + '</div></div>'; };
    const mr = Facts.get('mr');
    const progress = '<section class="tn-stack" id="progress"><h2 class="tn-text-h2">Отметки прогресса в игре</h2><p class="tn-muted">«—» — не указано. Не указано ≠ «нет». Выбор этапа и выполнение задач эти отметки не меняют.</p>' +
      '<div class="tn-card tn-stack"><div class="tn-factrow"><span>Ранг мастерства</span><span class="tn-cluster"><span class="tn-num">' + (mr != null ? mr : 'не указан') + '</span><button class="tn-btn tn-btn--sm" data-act="set-mr" data-key="set-mr">Указать</button></span></div>' +
      (() => { const marked = D.locations.filter(l => Store.doc.facts['open:' + l.id] != null).length;
        return '<details class="tn-factgroup" data-fg="planet"' + (this.openFacts.has('planet') ? ' open' : '') + '><summary data-key="fg-planet"><span class="tn-text-body-strong">Открытые планеты</span><span class="tn-faint tn-small">отмечено ' + marked + ' из ' + D.locations.length + '</span>' + icon('chevron-down', 'tn-icon--sm tn-factgroup__chev') + '</summary><div class="tn-factlist">' +
          D.locations.slice().sort((a, b) => Math.min(...a.stages) - Math.min(...b.stages)).map(l => { const e = entity('planet:' + l.id); const h = e.hidden; const v = Store.doc.facts['open:' + l.id];
            return '<div class="tn-factrow"><span>' + (h ? '<span class="tn-faint">Скрытое место · этап ' + Math.min(...l.stages) + '</span>' : UI.a('/planet/' + l.id, esc(l.name), 'tn-link tn-link--quiet')) + '</span><div class="tn-segmented tn-segmented--sm" role="group" aria-label="' + attr(h ? 'Скрытое место' : l.name) + ': открыта в игре">' +
              [['yes', 'Да', v === true], ['no', 'Нет', v === false], ['unset', '—', v == null]].map(o => '<button aria-pressed="' + o[2] + '" data-act="fact-set" data-fact="open:' + l.id + '" data-v="' + o[0] + '" data-key="pf-open-' + l.id + '-' + o[0] + '" aria-label="' + ({ yes: 'открыта', no: 'не открыта', unset: 'не указано' }[o[0]]) + '">' + o[1] + '</button>').join('') + '</div></div>'; }).join('') + '</div></details>'; })() +
      [['quest', 'Квесты'], ['junction', 'Переходы'], ['flag', 'Состояние аккаунта']].map(([k, t]) => { const list = facts.filter(f => f.kind === k).sort((a, b) => (a.stage || 0) - (b.stage || 0)); const marked = list.filter(f => Store.doc.facts[f.id] != null).length;
        return '<details class="tn-factgroup" data-fg="' + k + '"' + (this.openFacts.has(k) ? ' open' : '') + '><summary data-key="fg-' + k + '"><span class="tn-text-body-strong">' + t + '</span><span class="tn-faint tn-small">отмечено ' + marked + ' из ' + list.length + '</span>' + icon('chevron-down', 'tn-icon--sm tn-factgroup__chev') + '</summary><div class="tn-factlist">' + list.map(factRow).join('') + '</div></details>'; }).join('') +
      (() => { const marked = D.syndicates.filter(s => Store.doc.standing[s.id] && Store.doc.standing[s.id].rank != null).length;
        return '<details class="tn-factgroup" data-fg="synd"' + (this.openFacts.has('synd') ? ' open' : '') + '><summary data-key="fg-synd"><span class="tn-text-body-strong">Синдикаты</span><span class="tn-faint tn-small">указано ' + marked + ' из ' + D.syndicates.length + '</span>' + icon('chevron-down', 'tn-icon--sm tn-factgroup__chev') + '</summary><div class="tn-factlist">' +
        D.syndicates.map(s => { const st = Store.doc.standing[s.id]; return '<div class="tn-factrow"><span>' + UI.ref('syndicate:' + s.id, { cls: 'tn-link tn-link--quiet' }) + '</span><span class="tn-cluster"><span class="tn-faint tn-small">' + (st && st.rank != null ? 'ранг ' + st.rank + (st.value != null ? ', ' + fmt(st.value) : '') : 'не указан') + '</span><button class="tn-btn tn-btn--sm" data-act="set-standing" data-synd="' + s.id + '" data-key="ss-' + s.id + '">Указать</button></span></div>'; }).join('') + '</div></details>'; })() +
      '</div></section>';
    const aside = '<aside class="tn-stack tn-aside"><div class="tn-panel tn-stack"><p class="tn-text-overline">Настройки прогресса</p>' + UI.props([['Текущий этап', cur ? cur + ' · ' + esc(IDX.stage.get(String(cur)).short) : 'не выбран']]) +
      '<button class="tn-btn" data-act="change-stage" data-key="change-stage">' + (cur ? 'Изменить этап' : 'Выбрать этап') + '</button>' +
      UI.switch('set-spoilers', Spoil.on(), 'Защита от спойлеров', Spoil.on() ? 'Скрывать сведения после этапа ' + Spoil.threshold() : 'Выключена') + '</div>' +
      '<div class="tn-panel tn-stack" id="storage"><p class="tn-text-overline">Где хранится прогресс</p><p class="tn-muted tn-small">Только в этом браузере на этом устройстве. Очистка данных сайта удалит задачи и отметки. Синхронизации между устройствами нет — можно перенести файлом.</p>' +
      '<div class="tn-cluster"><button class="tn-btn tn-btn--sm" data-act="export">Скачать копию</button><button class="tn-btn tn-btn--sm" data-act="import">Загрузить из файла…</button></div>' +
      '<button class="tn-btn tn-btn--danger" data-act="reset-ask" data-key="reset">' + icon('trash') + 'Сбросить прогресс…</button></div></aside>';
    return '<div class="tn-container tn-page">' + head + '<div class="tn-layout2 tn-layout2--tasks"><div class="tn-stack tn-stack--lg">' + mainCol + progress + '</div>' + aside + '</div></div>';
  },
  row(t) {
    const blockers = taskBlockers(t);
    const blocked = blockers.length > 0 && !t.done;
    const ctx = [];
    if (t.ctx) ctx.push('<span>' + mask(t.ctx) + '</span>');
    if (blocked) ctx.push('<span class="tn-ready" data-state="locked">' + icon('lock') + 'После: ' + blockers.map(b => mask(b.title)).join(', ') + '</span>');
    const dependents = Store.doc.tasks.filter(x => !x.removed && !x.done && (x.dependsOn || []).includes(t.id));
    if (dependents.length && !t.done) ctx.push('<span>Нужна для: ' + dependents.map(d => mask(d.title)).join(', ') + '</span>');
    if (t.done) ctx.push('<span>Выполнено ' + fdate(t.doneAt || t.createdAt) + '</span>');
    else if (Date.now() - new Date(t.createdAt) < 60000) ctx.push('<span>Добавлено только что</span>');
    if (t.fact && t.done && Store.doc.facts[t.factKey || t.fact] !== true && !t.fact.startsWith('rank:')) ctx.push('<button class="tn-linkbtn tn-link" data-act="task-mark-fact" data-id="' + t.id + '">Отметить в прогрессе</button>');
    return '<div class="tn-task' + (Date.now() - new Date(t.createdAt) < 3000 ? ' is-new' : '') + '"' + (t.done ? ' data-done="true"' : '') + (blocked ? ' data-blocked="true"' : '') + ' data-key="task-' + t.id + '">' +
      '<label class="tn-check"><input type="checkbox" data-act="task-check" data-id="' + t.id + '"' + (t.done ? ' checked' : '') + (blocked ? ' disabled aria-label="' + attr('Выполнено: ' + maskPlain(t.title) + ' — недоступно до задачи выше') + '"' : ' aria-label="' + attr('Выполнено: ' + maskPlain(t.title)) + '"') + ' data-key="tc-' + t.id + '"></label>' +
      '<div><p class="tn-task__title">' + (t.href ? '<a href="' + link(t.href) + '">' + mask(t.title) + '</a>' : mask(t.title)) + '</p><div class="tn-task__ctx">' + ctx.join('') + '</div></div>' +
      '<button class="tn-btn tn-btn--ghost tn-btn--icon tn-btn--sm" data-act="task-menu" data-id="' + t.id + '" aria-label="' + attr('Действия с задачей «' + maskPlain(t.title) + '»') + '" aria-haspopup="true" data-key="tm-' + t.id + '">' + icon('more') + '</button></div>';
  }
};
const setQuery = (k, v) => { const q0 = current().query; if (v) q0.set(k, v); else q0.delete(k); try { history.replaceState(Object.assign({}, history.state), '', link(current().path + (q0.toString() ? '?' + q0 : ''))); } catch (e) {} rerender(); };
Actions['task-group'] = t => setQuery('group', t.dataset.val === 'type' ? 'type' : '');
Actions['task-hide-done'] = t => setQuery('hideDone', t.checked ? '1' : '');
Actions['task-hide-done-off'] = () => setQuery('hideDone', '');
Actions['retry-save'] = () => { const ok = Store.update(() => {}); if (ok === true) Toast.show({ tone: 'success', title: 'Сохранение снова работает', text: 'Сохранено в этом браузере.' }); else Toast.saveError(null, 'Хранилище по-прежнему отказывает.'); };
Actions['task-check'] = t => {
  const id = t.dataset.id; const on = t.checked;
  const task = Store.doc.tasks.find(x => x.id === id);
  if (on && taskBlockers(task).length) { t.checked = false; return; }
  const ok = commit(d => { const x = d.tasks.find(y => y.id === id); if (x) { x.done = on; x.doneAt = on ? new Date().toISOString() : null; } }, r => {
    announce(on ? 'Задача выполнена' : 'Отметка снята');
    if (!on) return;
    // выполнение задачи не меняет игровые отметки — предлагаем отдельным действием
    const fk = task.factKey || task.fact;
    const goal = task.ref && task.ref.startsWith('goal:') ? IDX.goal.get(task.ref.slice(5)) : null;
    if (goal) { commit(d => { d.done['goal:' + goal.id] = todayISO(); }, null); offerMarks(goal, 'Задача выполнена'); return; }
    if (fk && !fk.startsWith('rank:') && fk !== 'mr' && Store.doc.facts[fk] !== true) {
      const def = IDX.fact.get(fk);
      Toast.show({ tone: 'success', title: 'Задача выполнена', text: 'Игровая отметка не меняется сама. Отметить «' + (def ? markLabel(fk) : maskPlain(task.title)) + '» в прогрессе?', actions: [{ label: 'Отметить в прогрессе', fn: () => commit(d => { d.facts[fk] = true; }, rr => Toast.show({ tone: 'success', title: 'Отмечено в прогрессе', text: savedText(rr) })) }], ms: 10000 });
    } else if (task.kind === 'purchase') {
      Toast.show({ tone: 'success', title: 'Покупка отмечена выполненной', text: 'Репутация в навигаторе не списывается. Обновите запас репутации, если указывали его.', actions: task.href ? [] : [] });
    } else Toast.show({ tone: 'success', title: 'Задача выполнена', text: savedText(r) });
  });
  if (!ok) t.checked = !on;
};
Actions['task-mark-fact'] = t => { const task = Store.doc.tasks.find(x => x.id === t.dataset.id); const fk = task.factKey || task.fact; commit(d => { d.facts[fk] = true; }, r => Toast.show({ tone: 'success', title: 'Отмечено в прогрессе', text: savedText(r) })); };
Actions['task-menu'] = t => {
  const task = Store.doc.tasks.find(x => x.id === t.dataset.id); if (!task) return;
  const items = [];
  if (task.href) items.push('<a class="tn-menu__item" role="menuitem" href="' + link(task.href) + '" data-ov="close">' + icon('arrow-right') + '<span>Открыть<small>' + mask(task.title) + '</small></span></a>');
  if (task.stage) { const s = IDX.stage.get(String(task.stage)); if (s) items.push('<a class="tn-menu__item" role="menuitem" href="' + link('/?view=map&selected=' + s.focus) + '" data-ov="close">' + icon('map') + '<span>Показать на карте<small>Этап ' + task.stage + '</small></span></a>'); }
  items.push('<button class="tn-menu__item" role="menuitem" data-tm="remove">' + icon('trash') + '<span>Убрать из задач<small>Можно вернуть в течение 8 секунд</small></span></button>');
  const dlg = Overlay.dialog({ title: 'Действия с задачей', body: '<p class="tn-text-body-strong">' + mask(task.title) + '</p><div class="tn-stack tn-stack--sm" role="menu">' + items.join('') + '</div>', initialFocus: '[role="menuitem"]',
    onMount(box) { box.querySelector('[data-tm="remove"]').addEventListener('click', () => { Overlay.close(dlg, { noFocus: true }); removeTask(task.id); const n = document.querySelector('.tn-task [data-act="task-check"]'); if (n) n.focus(); }); } });
};

Screens.notFound = {
  nav: null,
  title() { return 'Страница не найдена'; },
  render() {
    return '<div class="tn-container tn-page" style="padding:48px 0 64px"><h1 class="tn-sr-only" id="page-h1" tabindex="-1">Страница не найдена</h1>' + UI.error('error', 'Страница не найдена', 'Возможно, ссылка устарела. Карта, справочник и ваши задачи на месте.', '<a class="tn-btn tn-btn--primary" href="' + link('/') + '">На карту</a><a class="tn-btn" href="' + link('/reference') + '">Справочник</a><button class="tn-btn tn-btn--ghost" data-act="open-search">Поиск</button>') + '</div>';
  }
};

/* ── 90-main.js ── */
/* 90-main.js — запуск, отрисовка экранов, общие действия (data-act). */
const SITE = 'Навигатор Тенно';

function renderShell(screen) {
  document.getElementById('tn-header').innerHTML = UI.header(screen.nav);
  document.getElementById('tn-menu-host').innerHTML = UI.refMenu();
  document.getElementById('tn-tabbar').innerHTML = UI.tabbar(screen.nav);
  renderBanner();
}
function renderBanner() {
  const b = document.getElementById('tn-banner');
  let h = '';
  if (Store.status === 'unknown-format') h += '<div class="tn-banner" role="status">' + icon('save-error') + '<span><b>Сохранённый прогресс в неизвестном формате.</b> Мы его не изменяем и не перезаписываем; новые отметки не сохраняются.</span><span class="tn-banner__actions"><button class="tn-btn tn-btn--sm" data-act="export">Скачать копию</button><button class="tn-btn tn-btn--sm tn-btn--danger" data-act="reset-ask">Начать заново…</button></span></div>';
  if (navigator.onLine === false) h += '<div class="tn-banner" role="status">' + icon('offline') + '<span><b>Нет соединения.</b> Открытые страницы и задачи доступны; поиск в Wiki — нет.</span><button class="tn-btn tn-btn--sm" data-act="check-online">Проверить снова</button></div>';
  b.innerHTML = h;
}

Router.onRender = function (screen, params, cur, ctx) {
  const main = document.getElementById('main');
  renderShell(screen);
  let html;
  try { html = screen.render(params, cur.query, ctx, cur); }
  catch (e) { console.error(e); html = '<div class="tn-container" style="padding:48px 0">' + UI.error('error', 'Не удалось показать раздел', 'Попробуйте ещё раз. Ваши задачи и отметки не затронуты.', '<button class="tn-btn tn-btn--primary" data-act="reload">' + icon('refresh', 'tn-icon--sm') + 'Повторить</button><a class="tn-btn tn-btn--ghost" href="' + link('/') + '">На карту</a>') + '</div>'; screen = Screens.notFound; }
  main.innerHTML = html;
  document.title = maskPlain(screen.title ? screen.title(params, cur.query) : SITE) + ' — ' + SITE;
  if (screen.mount) { try { screen.mount(main, ctx, cur); } catch (e) { console.error(e); } }
  mountCommon(main);
  // прокрутка и фокус
  const r = ctx.restore;
  if (r && (r.scrollY != null || r.focusKey)) {
    requestAnimationFrame(() => {
      if (r.scrollY != null) window.scrollTo(0, r.scrollY);
      const t = r.focusKey && main.querySelector('[data-key="' + cssEsc(r.focusKey) + '"]') || r.focusKey && document.querySelector('[data-key="' + cssEsc(r.focusKey) + '"]');
      if (t && !ctx.rerender) t.focus({ preventScroll: true });
      else if (t && ctx.rerender && ctx.keepFocusKey === r.focusKey) t.focus({ preventScroll: true });
      else if (!t && !ctx.rerender) { const df = screen.defaultFocus && screen.defaultFocus(main, cur.query); if (df) df.focus({ preventScroll: true }); }
    });
  } else if (cur.frag) {
    requestAnimationFrame(() => {
      const t = document.getElementById(cur.frag);
      if (t) { t.scrollIntoView({ block: 'start' }); const h = t.matches('h1,h2,h3,[tabindex]') ? t : t.querySelector('h2,h3,[tabindex]'); if (h) { if (!h.hasAttribute('tabindex')) h.tabIndex = -1; h.focus({ preventScroll: true }); } }
    });
  } else if (ctx.nav) {
    window.scrollTo(0, 0);
    const df = screen.defaultFocus && screen.defaultFocus(main, cur.query);
    const h1 = df || main.querySelector('#page-h1');
    if (df) { const rr = df.getBoundingClientRect(); if (rr.top < 64 || rr.bottom > window.innerHeight) df.scrollIntoView({ block: 'center' }); }
    if (h1) h1.focus({ preventScroll: true });
  }
  if (ctx.nav || !ctx.rerender) rememberPlace(screen, params, cur);
};
function cssEsc(s) { return window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/"/g, '\\"'); }

/** Повторная отрисовка после изменения данных — с сохранением прокрутки, фокуса и состояния экрана */
function rerender() {
  const sc = Router.screen; if (!sc) return;
  const ae = document.activeElement;
  const fk = ae && ae.closest && ae.closest('[data-key]');
  const key = fk ? fk.dataset.key : null;
  const ui = sc.saveUI ? sc.saveUI() : null;
  const y = window.scrollY;
  const overlayOpen = !!Overlay.top();
  Router.render({ rerender: true, restore: { scrollY: y, focusKey: overlayOpen ? null : key, ui }, keepFocus: true });
  if (!overlayOpen && key) {
    const t = document.querySelector('[data-key="' + cssEsc(key) + '"]');
    if (t) t.focus({ preventScroll: true });
  }
  if (overlayOpen && Overlay.top().o.onRefresh) Overlay.top().o.onRefresh();
}
Store.on(ev => { renderBanner(); if (ev && ev.skipRender) return; rerender(); });

/** «Продолжить с того места» — последняя открытая страница содержания */
let lastSavedPlace = null;
function rememberPlace(screen, params, cur) {
  if (!screen.place || Store.status !== 'saved') return;
  const title = screen.place(params);
  if (!title) return;
  const href = cur.full;
  if (lastSavedPlace === href || (Store.doc.lastPlace && Store.doc.lastPlace.href === href)) return;
  lastSavedPlace = href;
  // тихая запись без перерисовки: место не меняет содержимое страницы
  const prev = Store.listeners; Store.listeners = new Set([() => renderBanner()]);
  Store.update(d => { d.lastPlace = { href, title, at: new Date().toISOString() }; });
  Store.listeners = prev;
}

/* ── Общие элементы после отрисовки: оглавление, таблицы ── */
let tocObserver = null;
function mountCommon(main) {
  if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
  const links = $$('[data-toc]', main);
  if (links.length && 'IntersectionObserver' in window) {
    const ids = [...new Set(links.map(a => a.dataset.toc))];
    const vis = new Map();
    tocObserver = new IntersectionObserver(entries => {
      entries.forEach(en => vis.set(en.target.id, en.isIntersecting ? en.boundingClientRect.top : null));
      const firstVisible = ids.find(id => vis.get(id) != null);
      if (!firstVisible) return;
      links.forEach(a => a.setAttribute('aria-current', String(a.dataset.toc === firstVisible)));
      const curEl = main.querySelector('[data-toc-current]'); const ln = links.find(a => a.dataset.toc === firstVisible);
      if (curEl && ln) curEl.textContent = ln.textContent;
    }, { rootMargin: '-80px 0px -55% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); if (el) tocObserver.observe(el); });
  }
  $$('.tn-tablewrap', main).forEach(w => {
    if (w.scrollWidth > w.clientWidth + 1 && !w.querySelector('.tn-table--stack')) {
      w.classList.add('tn-tablewrap--scroll'); w.tabIndex = 0; w.setAttribute('role', 'region');
      const cap = w.querySelector('caption'); w.setAttribute('aria-label', (cap ? cap.textContent : 'Таблица') + ', прокручивается вбок');
      if (!w.previousElementSibling || !w.previousElementSibling.classList.contains('tn-tablewrap__hint')) w.insertAdjacentHTML('beforebegin', '<p class="tn-tablewrap__hint is-visible">' + icon('arrow-right', 'tn-icon--sm') + 'Таблицу можно прокрутить вбок</p>');
    }
  });
}

/* ── Делегирование действий ───────────────────────────── */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]');
  if (!t || t.tagName === 'INPUT' || t.tagName === 'SELECT') return;
  const fn = Actions[t.dataset.act];
  if (!fn) return;
  if (t.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
  e.preventDefault();
  fn(t, e);
});
document.addEventListener('change', e => {
  const t = e.target.closest('[data-act]');
  if (!t) return;
  const fn = Actions[t.dataset.act];
  if (fn) fn(t, e);
});
/* Вкладки (role=tab): стрелки, Home/End — как в TN.init */
document.addEventListener('keydown', e => {
  const t = e.target.closest && e.target.closest('[role="tab"]'); if (!t) return;
  const list = $$('[role="tab"]:not([aria-disabled="true"])', t.closest('[role="tablist"]'));
  const i = list.indexOf(t); let j = null;
  if (e.key === 'ArrowRight') j = (i + 1) % list.length; else if (e.key === 'ArrowLeft') j = (i - 1 + list.length) % list.length;
  else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = list.length - 1;
  if (j !== null) { e.preventDefault(); list[j].focus(); list[j].click(); }
});
/* Клавиши: «/» — поиск; на карте + − 0 */
document.addEventListener('keydown', e => {
  if (Overlay.top()) return;
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
  if (e.key === '/' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); Actions['open-search'](); return; }
  if (Router.screen === Screens.home && Screens.home.mode === 'map') {
    if (e.key === '+' || e.key === '=') { e.preventDefault(); MapView.setZoom(MapView.zoom + 0.25); }
    else if (e.key === '-' || e.key === '_') { e.preventDefault(); MapView.setZoom(MapView.zoom - 0.25); }
    else if (e.key === '0') { e.preventDefault(); Actions['zoom-current'](); }
    else if (e.key === 'Escape' && Screens.home.selected) { e.preventDefault(); Screens.home.closePanel(); }
  }
});

Actions.skip = () => { const m = document.getElementById('main'); const h = m.querySelector('#page-h1') || m; h.tabIndex = -1; h.focus(); };
Actions.reload = () => rerender();
Actions['ref-menu'] = (t, e) => RefMenu.toggle(e.detail === 0);
Actions['open-search'] = () => { const q = Router.screen === Screens.search ? '' : ''; Router.go('/search' + q); };
Actions['check-online'] = () => { renderBanner(); if (navigator.onLine) Toast.show({ tone: 'info', title: 'Соединение восстановлено' }); };
window.addEventListener('online', () => { renderBanner(); Toast.show({ tone: 'info', title: 'Соединение восстановлено' }); });
window.addEventListener('offline', renderBanner);

/** Запись с честным откликом: успех — только после подтверждения; ошибка — тост с «Повторить» */
function commit(mutator, ok, opts) {
  opts = opts || {};
  const r = Store.update(mutator);
  if (r === true) { if (ok) ok(true); return true; }
  if (r === 'memory') { if (ok) ok('memory'); return 'memory'; }
  if (Store.status === 'unknown-format') Toast.show({ tone: 'danger', title: 'Изменение не сохранено', text: 'Сохранённые данные в неизвестном формате — мы их не перезаписываем. Скачайте копию или начните заново.' });
  else Toast.saveError(() => commit(mutator, ok, opts), opts.what);
  return false;
}
const savedText = r => r === 'memory' ? 'Хранилище недоступно: действует до закрытия вкладки.' : 'Сохранено в этом браузере.';

/* ── Представление и карта ────────────────────────────── */
Actions.view = t => {
  const v = t.dataset.val;
  commit(d => { d.settings.view = v; }, null);
  Router.go('/?view=' + v, { replace: false });
};
Actions['toggle-legend'] = t => {
  const lg = document.getElementById('map-legend'); if (!lg) return;
  const show = lg.hidden; lg.hidden = !show; t.setAttribute('aria-expanded', String(show));
};
Actions['zoom-in'] = () => MapView.setZoom(MapView.zoom + 0.25);
Actions['zoom-out'] = () => MapView.setZoom(MapView.zoom - 0.25);
Actions['zoom-current'] = () => {
  const s = Store.doc.stage ? IDX.stage.get(String(Store.doc.stage)) : null;
  MapView.zoom = 1; MapView.centerOn(s ? s.focus : 'earth');
  announce('Карта у текущего этапа');
};
Actions['close-panel'] = () => Screens.home.closePanel();
Actions['route-expand'] = t => {
  const v = t.dataset.val; const set = Screens.home.openStages;
  if (set.has(v)) set.delete(v); else set.add(v);
  rerender();
};

/* ── Выбор этапа ──────────────────────────────────────── */
const STAGE_GROUPS = [
  { id: 'start', label: 'Только начинаю', hint: 'Этапы 1–2 · первые планеты и основная карта', stages: [1, 2] },
  { id: 'mid', label: 'Середина игры', hint: 'Этапы 3–5 · сюжетные открытия, Арбитражи, подготовка к «Новой Войне»', stages: [3, 4, 5] },
  { id: 'late', label: 'Готовлюсь к поздней игре', hint: 'Этапы 6+ · после «Новой Войны»; названия скрыты', stages: [6, 7, 8] }
];
Actions['change-stage'] = (t) => {
  const cur = Store.doc.stage;
  let chosen = cur || null;
  const body = () => '<p>Этап — место на маршруте гайда. Выбор этапа не отмечает квесты и покупки: игровые условия вы отмечаете отдельно.</p>' +
    '<fieldset class="tn-filter tn-stagepick"><legend class="tn-text-overline">Выберите этап</legend>' +
    STAGE_GROUPS.map(g => '<div class="tn-stagepick__group"><p class="tn-text-body-strong">' + g.label + '</p><p class="tn-faint tn-small">' + g.hint + '</p>' +
      g.stages.map(n => { const s = IDX.stage.get(String(n)); const hid = Spoil.hiddenStage(n, s.spoiler) && Spoil.on() && (!cur || n > (Store.doc.settings.spoilerStage || cur || 5));
        return '<label class="tn-check tn-pickopt' + (chosen === n ? ' is-on' : '') + '"><input type="radio" name="stagepick" value="' + n + '"' + (chosen === n ? ' checked' : '') + '><span><b>Этап ' + n + ': ' + esc(hid ? s.hidden || 'Скрытый этап' : s.title) + '</b><br><span class="tn-faint tn-small">' + (hid ? 'Название скрыто защитой от спойлеров' : esc(s.lead)) + '</span></span></label>'; }).join('') + '</div>').join('') +
    '</fieldset>' + (Store.status === 'unavailable' ? UI.callout('warning', 'Хранилище недоступно', 'Выбор будет действовать до закрытия вкладки.') : '');
  const dlg = Overlay.dialog({
    title: cur ? 'Изменить текущий этап' : 'Где вы сейчас в игре?', body: body(),
    foot: '<button class="tn-btn" data-ov="close">Отмена</button><button class="tn-btn tn-btn--primary" data-pick="ok">Сохранить этап</button>',
    initialFocus: 'input[checked], input[type=radio]',
    onMount(box) {
      box.addEventListener('change', e => { if (e.target.name === 'stagepick') { chosen = +e.target.value; $$('.tn-pickopt', box).forEach(l => l.classList.toggle('is-on', l.querySelector('input').checked)); } });
      box.querySelector('[data-pick="ok"]').addEventListener('click', () => {
        if (!chosen) { const f = box.querySelector('input'); f.focus(); announce('Выберите этап'); return; }
        Overlay.close(dlg, { noFocus: true });
        setStage(chosen);
      });
    }
  });
};
function setStage(n) {
  commit(d => { d.stage = n; d.onboarded = true; if (d.settings.spoilerStage && d.settings.spoilerStage < n) d.settings.spoilerStage = null; }, r => {
    Toast.show({ tone: 'success', title: 'Этап ' + n + ' сохранён', text: savedText(r) + ' Квесты и покупки не отмечены автоматически.', actions: [{ label: 'Открыть этап', href: '/stage/' + n }] });
    const h = document.querySelector('#page-h1'); if (h) h.focus();
  });
}
Actions['start-first'] = () => setStage(1);
Actions['skip-onboarding'] = () => commit(d => { d.onboarded = true; }, () => announce('Можно смотреть карту и справочник без настройки'));
/** «Не знаю — помогите определить»: три вопроса; ответы сохраняются как отметки прогресса */
Actions['stage-quiz'] = () => {
  const Qs = [
    { id: 'quest:new-war', text: 'Вы прошли квест «Новая Война»?' },
    { id: 'quest:second-dream', text: 'Вы прошли квест «Второй Сон»?' },
    { id: 'junction:pluto-eris', text: 'У вас открыты Арбитражи (задача перехода Плутон → Эрида)?' },
    { id: 'junction:earth-mars', text: 'У вас открыт Марс (переход Земля → Марс)?' }
  ];
  const ans = {};
  const order = () => { if (ans['quest:new-war'] === true) return ['quest:new-war']; if (ans['quest:new-war'] === false) { if (ans['quest:second-dream'] === true) return ['quest:new-war', 'quest:second-dream', 'junction:pluto-eris']; if (ans['quest:second-dream'] === false) return ['quest:new-war', 'quest:second-dream', 'junction:earth-mars']; return ['quest:new-war', 'quest:second-dream']; } return ['quest:new-war']; };
  const result = () => {
    if (ans['quest:new-war'] === true) return 6;
    if (ans['quest:second-dream'] === true) return ans['junction:pluto-eris'] === true ? 4 : ans['junction:pluto-eris'] === false ? 3 : null;
    if (ans['quest:second-dream'] === false) return ans['junction:earth-mars'] === true ? 2 : ans['junction:earth-mars'] === false ? 1 : null;
    return null;
  };
  const draw = box => {
    const list = order();
    const res = result();
    box.querySelector('.tn-dialog__body').innerHTML = '<p>Три коротких вопроса. Ответы «да» и «нет» сохраним как отметки прогресса — их можно изменить в «Моих задачах».</p>' +
      list.map((id, i) => { const q0 = Qs.find(x => x.id === id); return '<fieldset class="tn-filter"><legend class="tn-text-body-strong">' + (i + 1) + '. ' + q0.text + '</legend><div class="tn-segmented" role="group">' +
        [['yes', 'Да', true], ['no', 'Нет', false]].map(o => '<button type="button" aria-pressed="' + (ans[id] === o[2]) + '" data-q="' + id + '" data-a="' + o[0] + '">' + o[1] + '</button>').join('') + '</div></fieldset>'; }).join('') +
      (res ? UI.callout('success', 'Похоже, вы на этапе ' + res, esc(stageTitle(IDX.stage.get(String(res))))) : '');
    box.querySelector('[data-quiz="ok"]').disabled = !res;
  };
  const dlg = Overlay.dialog({
    title: 'Определим этап', body: '',
    foot: '<button class="tn-btn" data-ov="close">Отмена</button><button class="tn-btn tn-btn--primary" data-quiz="ok" disabled>Сохранить этап и ответы</button>',
    onMount(box) {
      draw(box);
      box.addEventListener('click', e => {
        const b = e.target.closest('[data-q]');
        if (b) { ans[b.dataset.q] = b.dataset.a === 'yes'; Object.keys(ans).forEach(k => { if (!order().includes(k)) delete ans[k]; }); draw(box); const nb = box.querySelector('[data-q="' + b.dataset.q + '"][data-a="' + b.dataset.a + '"]'); if (nb) nb.focus(); return; }
        if (e.target.closest('[data-quiz="ok"]')) {
          const n = result(); if (!n) return;
          Overlay.close(dlg, { noFocus: true });
          commit(d => { Object.keys(ans).forEach(k => { d.facts[k] = ans[k]; }); d.stage = n; d.onboarded = true; },
            r => Toast.show({ tone: 'success', title: 'Этап ' + n + ' и ' + pl(Object.keys(ans).length, ['отметка', 'отметки', 'отметок']) + ' сохранены', text: savedText(r), actions: [{ label: 'Открыть этап', href: '/stage/' + n }] }));
        }
      });
    }
  });
};

/* ── Ручные отметки прогресса ────────────────────────── */
Actions['set-fact'] = t => {
  const key = t.dataset.key;
  const min = t.dataset.min ? +t.dataset.min : null;
  if (key === 'mr') return numberFact('mr', 'Ранг мастерства', 0, 40);
  if (key.startsWith('rank:')) return Actions['set-standing']({ dataset: { synd: key.slice(5) } });
  const def = IDX.fact.get(key);
  const label = def ? factName(def) : key.startsWith('owned:') ? markLabel(key) : (t.closest('li') ? t.closest('li').querySelector('span').childNodes[0].textContent : key);
  const v = Store.doc.facts[key];
  const dlg = Overlay.dialog({
    title: 'Указать прогресс', body: '<p class="tn-text-body-strong">' + mask(label) + '</p>' + (def && def.note ? '<p class="tn-muted tn-small">' + mask(def.note) + '</p>' : '') +
      '<div class="tn-segmented" role="group" aria-label="Состояние">' + [['yes', 'Выполнено', v === true], ['no', 'Не выполнено', v === false], ['unset', 'Не указано', v == null]].map(o => '<button type="button" aria-pressed="' + o[2] + '" data-v="' + o[0] + '">' + o[1] + '</button>').join('') + '</div>' +
      '<p class="tn-faint tn-small">Отметка хранится только в этом браузере и ничего не меняет в игре.</p>',
    foot: '<button class="tn-btn" data-ov="close">Закрыть</button>',
    initialFocus: '[aria-pressed="true"]',
    onMount(box) {
      box.addEventListener('click', e => {
        const b = e.target.closest('[data-v]'); if (!b) return;
        const val = b.dataset.v === 'yes' ? true : b.dataset.v === 'no' ? false : null;
        commit(d => { if (val === null) delete d.facts[key]; else d.facts[key] = val; }, r => {
          Overlay.close(dlg);
          announce('Отметка сохранена');
          Toast.show({ tone: 'success', title: 'Отметка сохранена', text: savedText(r) });
        });
      });
    }
  });
};
function numberFact(key, title, lo, hi) {
  const v = Store.doc.facts[key];
  const dlg = Overlay.dialog({
    title, body: '<div class="tn-field"><label class="tn-field__label" for="nf">' + title + '</label><input class="tn-input tn-input--num" id="nf" type="number" inputmode="numeric" min="' + lo + '" max="' + hi + '" value="' + (v != null ? v : '') + '"><p class="tn-field__hint">Пустое поле — «не указано».</p><p class="tn-field__error" id="nf-e" hidden>' + icon('info', 'tn-icon--sm') + 'Введите число от ' + lo + ' до ' + hi + '.</p></div>',
    foot: '<button class="tn-btn" data-ov="close">Отмена</button><button class="tn-btn tn-btn--primary" data-nf="ok">Сохранить</button>',
    initialFocus: '#nf',
    onMount(box) {
      const inp = box.querySelector('#nf');
      const go = () => {
        const raw = inp.value.trim();
        const n = raw === '' ? null : Number(raw);
        if (n !== null && (!Number.isInteger(n) || n < lo || n > hi)) { inp.setAttribute('aria-invalid', 'true'); inp.setAttribute('aria-describedby', 'nf-e'); box.querySelector('#nf-e').hidden = false; inp.focus(); return; }
        commit(d => { if (n === null) delete d.facts[key]; else d.facts[key] = n; }, r => { Overlay.close(dlg); Toast.show({ tone: 'success', title: title + (n === null ? ': не указан' : ': ' + n), text: savedText(r) }); });
      };
      box.querySelector('[data-nf="ok"]').addEventListener('click', go);
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    }
  });
}
Actions['set-mr'] = () => numberFact('mr', 'Ранг мастерства', 0, 40);
Actions['set-standing'] = t => {
  const s = IDX.syndicate.get(t.dataset.synd);
  const cur = Store.doc.standing[s.id] || {};
  const lo = s.ranks ? s.ranks.lo : 0, hi = s.ranks ? s.ranks.hi : 5;
  const opts = []; for (let r = lo; r <= hi; r++) opts.push('<option value="' + r + '"' + (cur.rank === r ? ' selected' : '') + '>' + (r < 0 ? '−' + (-r) + ' (отрицательная репутация)' : r) + '</option>');
  const dlg = Overlay.dialog({
    title: 'Ранг и репутация: ' + mask(s.name),
    body: '<p class="tn-muted">Ранг открывает товары; репутация — валюта покупки. Это разные значения: укажите оба, если знаете.</p>' +
      '<div class="tn-field"><label class="tn-field__label" for="sr">Ранг</label><select class="tn-select" id="sr"><option value="">Не указан</option>' + opts.join('') + '</select></div>' +
      (s.ranks && s.ranks.rankOnly ? '' : '<div class="tn-field"><label class="tn-field__label" for="sv">Текущий запас репутации</label><input class="tn-input tn-input--num" id="sv" type="number" inputmode="numeric" value="' + (cur.value != null ? cur.value : '') + '"><p class="tn-field__hint">Сколько показывает игра сейчас. Пустое поле — не указано.</p><p class="tn-field__error" id="sv-e" hidden>' + icon('info', 'tn-icon--sm') + 'Введите целое число.</p></div>'),
    foot: '<button class="tn-btn" data-ov="close">Отмена</button><button class="tn-btn tn-btn--primary" data-sv="ok">Сохранить</button>',
    initialFocus: '#sr',
    onMount(box) {
      box.querySelector('[data-sv="ok"]').addEventListener('click', () => {
        const rv = box.querySelector('#sr').value;
        const vi = box.querySelector('#sv');
        const raw = vi ? vi.value.trim() : '';
        const val = raw === '' ? null : Number(raw);
        if (val !== null && !Number.isInteger(val)) { vi.setAttribute('aria-invalid', 'true'); vi.setAttribute('aria-describedby', 'sv-e'); box.querySelector('#sv-e').hidden = false; vi.focus(); return; }
        commit(d => { const o = {}; if (rv !== '') o.rank = +rv; if (val !== null) o.value = val; if (Object.keys(o).length) d.standing[s.id] = o; else delete d.standing[s.id]; },
          r => { Overlay.close(dlg); Toast.show({ tone: 'success', title: 'Ранг сохранён', text: savedText(r) }); });
      });
    }
  });
};
Actions['set-owned'] = t => {
  const id = t.dataset.id; const val = t.dataset.val;
  commit(d => { const k = 'owned:' + id; if (val === 'unset') delete d.facts[k]; else d.facts[k] = val === 'yes'; }, r => announce('Отметка сохранена'));
};
Actions['set-modrank'] = t => {
  const id = t.dataset.id; const delta = +t.dataset.delta; const m = IDX.mod.get(id);
  const cur = typeof Store.doc.facts['rank:mod:' + id] === 'number' ? Store.doc.facts['rank:mod:' + id] : m.maxRank;
  const n = Math.max(0, Math.min(m.maxRank, cur + delta));
  commit(d => { d.facts['rank:mod:' + id] = n; }, () => announce('Ранг ' + n + ' из ' + m.maxRank));
};

/* ── Выполнение ───────────────────────────────────────── */
Actions['toggle-done'] = t => {
  const key = t.dataset.done;
  const on = !isDone(key);
  commit(d => { if (on) d.done[key] = todayISO(); else delete d.done[key]; }, r => {
    announce(on ? 'Отмечено выполненным' : 'Отметка снята');
    if (on && key.startsWith('goal:')) {
      const g = IDX.goal.get(key.slice(5));
      // связанная задача тоже выполнена — без изменения игровых сведений
      const task = findTask(key); if (task && !task.done) Store.update(d => { const x = d.tasks.find(y => y.id === task.id); if (x) { x.done = true; x.doneAt = new Date().toISOString(); } });
      offerMarks(g, 'Цель выполнена');
    }
  });
};
Actions['toggle-step'] = t => {
  const key = t.dataset.done; const on = t.checked;
  commit(d => { if (on) d.done[key] = todayISO(); else delete d.done[key]; }, () => announce(on ? 'Шаг отмечен выполненным' : 'Отметка шага снята'));
  if (!isDone(key) === on) t.checked = !on; // откат при ошибке
};
/** После выполнения цели предлагаем — но не применяем сами — отметки прогресса */
function offerMarks(g, title) {
  const pend = pendingMarks(g && g.marks);
  const si = g ? stageInfo(g.stage) : null;
  const next = g && g.next ? (g.next.startsWith('stage:') ? entity(g.next) : entity('goal:' + g.next)) : null;
  const actions = [];
  if (pend.length) actions.push({ label: 'Отметить в прогрессе', fn: () => commit(d => { pend.forEach(k => { d.facts[k] = true; }); }, r => Toast.show({ tone: 'success', title: 'Отмечено: ' + pend.map(markLabel).join(', '), text: savedText(r) })) });
  if (next) actions.push({ label: 'Дальше: ' + entPlain(next).slice(0, 40), href: next.path });
  Toast.show({ tone: 'success', title: title, text: (pend.length ? 'Игровые отметки не меняются сами: ' + pend.map(markLabel).join(', ') + '?' : (si ? 'Этап ' + g.stage + ': ' + si.doneMain + ' из ' + si.total + ' целей.' : '')), actions, ms: pend.length ? 10000 : 6000 });
}

/* ── Задачи ───────────────────────────────────────────── */
function goalTaskSpecs(g) {
  const gi = goalInfo(g);
  const specs = [taskSpecGoal(g)];
  const deps = [];
  gi.conds.filter(c => c.state === 'no').forEach(c => { specs.push(taskSpecCond(c, 'stage:' + g.stage, specs[0].groupTitle, g.stage)); });
  if (specs.length > 1) deps.push({ task: 0, on: specs.map((_, i) => i).slice(1) });
  return { specs, deps };
}
Actions['add-goal'] = t => {
  const g = IDX.goal.get(t.dataset.ref.slice(5));
  const { specs, deps } = goalTaskSpecs(g);
  const res = addTasks(specs, deps);
  if (!res.ok) { Toast.saveError(() => Actions['add-goal'](t), 'Задача не добавлена.'); return; }
  const n = res.created.length;
  Toast.show({ tone: 'success', title: n > 1 ? pl(n, ['задача добавлена', 'задачи добавлены', 'задач добавлено']) : 'Задача добавлена', text: (n > 1 ? 'Цель откроется после задач на невыполненные условия. ' : '') + (res.reused.length ? 'Уже были в задачах: ' + res.reused.length + '. ' : '') + savedText(res.ok), actions: [{ label: 'Открыть задачи', href: '/tasks' }] });
};
Actions['add-missing-goal'] = t => {
  const g = IDX.goal.get(t.dataset.ref);
  const gi = goalInfo(g);
  addMissing(gi.conds, 'stage:' + g.stage, 'Этап ' + g.stage + ' · ' + IDX.stage.get(String(g.stage)).short, g.stage, { goalRef: 'goal:' + g.id, goal: g });
};
/** «Добавить недостающее в задачи»: по задаче на каждый невыполненный или неуказанный пункт; общие не дублируются */
function addMissing(evs, groupRef, groupTitle, stage, opts) {
  opts = opts || {};
  const miss = evs.filter(e => e.state !== 'yes' && !e.parts);
  const anyParts = evs.filter(e => e.parts && e.state !== 'yes');
  if (!miss.length && !anyParts.length) { Toast.show({ tone: 'info', title: 'Все условия выполнены', text: 'Добавлять нечего.' }); return; }
  const specs = miss.map(e => taskSpecCond(e, groupRef, groupTitle, stage));
  anyParts.forEach(e => specs.push({ ref: 'cond:any:' + slug(e.label), title: e.label, group: groupRef, groupTitle, kind: 'cond', ctx: e.note || 'Достаточно одного из вариантов', stage }));
  const deps = [];
  if (opts.goal) { specs.unshift(taskSpecGoal(opts.goal)); deps.push({ task: 0, on: specs.map((_, i) => i).slice(1) }); }
  const res = addTasks(specs, deps);
  if (!res.ok) { Toast.saveError(() => addMissing(evs, groupRef, groupTitle, stage, opts), 'Задачи не добавлены.'); return; }
  const n = res.created.length;
  Toast.show({ tone: 'success', title: n ? pl(n, ['задача добавлена', 'задачи добавлены', 'задач добавлено']) : 'Новых задач нет', text: (res.reused.length ? 'Уже были в задачах: ' + res.reused.length + ' — не дублируем. ' : '') + savedText(res.ok), actions: [{ label: 'Открыть задачи', href: '/tasks' }] });
}
Actions['add-missing'] = t => {
  const ctx = Router.screen && Router.screen.missingContext ? Router.screen.missingContext(t.dataset.group) : null;
  if (!ctx) return;
  addMissing(ctx.conds.map(evalCond), ctx.groupRef, ctx.groupTitle, ctx.stage, ctx.opts);
};
Actions['add-purchase'] = t => addPurchase(t.dataset.vendor, t.dataset.offer);
function addPurchase(vendorId, offerKey) {
  const v = IDX.vendor.get(vendorId);
  const o = v.offers.find(x => (x.item || x.label) === offerKey);
  const target = o.item ? entity((IDX.mod.has(o.item) ? 'mod:' : 'item:') + o.item) : null;
  const nm = target ? entPlain(target) : maskPlain(o.label);
  const ref = 'buy:' + v.id + ':' + (o.item || slug(o.label));
  const synd = v.syndicate ? IDX.syndicate.get(v.syndicate) : null;
  const st = synd ? (Store.doc.standing[synd.id] || {}) : {};
  const groupTitle = nm;
  const specs = [{ ref, title: 'Купить ' + q(nm), href: (target ? target.path : '/vendor/' + v.id), group: ref, groupTitle, kind: 'purchase', ctx: (o.cost != null ? fmt(o.cost) + ' ' + v.currency : o.costText || '') + ' · ' + maskPlain(v.name), stage: v.stage }];
  const deps = [];
  if (synd && o.rank != null && (st.rank == null || st.rank < o.rank)) {
    specs.push({ ref: 'cond:rank:' + synd.id + ':' + o.rank, title: 'Поднять ранг ' + q(maskPlain(synd.name)) + ' до ' + o.rank, href: '/syndicate/' + synd.id, group: ref, groupTitle, kind: 'cond', fact: 'rank:' + synd.id, min: o.rank, ctx: st.rank == null ? 'Ваш ранг не указан — проверьте в игре и отметьте на странице синдиката' : 'Сейчас: ранг ' + st.rank, stage: v.stage });
  }
  if (synd && o.cost != null && st.value != null && st.value < o.cost) {
    specs.push({ ref: 'standing:' + synd.id + ':' + ref, title: 'Накопить ' + fmt(o.cost - st.value) + ' репутации ' + q(maskPlain(synd.name)), href: '/syndicate/' + synd.id, group: ref, groupTitle, kind: 'standing', ctx: fmt(st.value) + ' из ' + fmt(o.cost), stage: v.stage });
  }
  (o.extraReq || []).map(evalCond).filter(e => e.state !== 'yes').forEach(e => specs.push(taskSpecCond(e, ref, groupTitle, v.stage)));
  if (specs.length > 1) deps.push({ task: 0, on: specs.map((_, i) => i).slice(1) });
  const res = addTasks(specs, deps);
  if (!res.ok) { Toast.saveError(() => addPurchase(vendorId, offerKey), 'Задача не добавлена.'); return; }
  const n = res.created.length;
  Toast.show({ tone: 'success', title: n > 1 ? pl(n, ['задача добавлена', 'задачи добавлены', 'задач добавлено']) : n ? 'Задача добавлена' : 'Уже в задачах', text: (n > 1 ? 'Покупка откроется после связанных задач. ' : '') + 'Репутация не списывается — это личный план. ' + savedText(res.ok), actions: [{ label: 'Открыть задачи', href: '/tasks' }] });
}
Actions['task-remove-ask'] = t => removeTaskByRef(t.dataset.ref);
function removeTaskByRef(ref) {
  const task = findTask(ref); if (!task) return;
  removeTask(task.id);
}
function removeTask(id) {
  const task = Store.doc.tasks.find(t => t.id === id); if (!task) return;
  commit(d => { const x = d.tasks.find(t => t.id === id); if (x) x.removed = new Date().toISOString(); }, r => {
    Toast.show({ tone: 'info', title: 'Задача убрана', text: q(maskPlain(task.title)), actions: [{ label: 'Вернуть', undo: true, fn: () => commit(d => { const x = d.tasks.find(t => t.id === id); if (x) delete x.removed; }, () => Toast.show({ tone: 'success', title: 'Задача возвращена', text: savedText(true) })) }] });
  });
}

/* ── Спойлеры ─────────────────────────────────────────── */
Actions.reveal = t => { const s = t.dataset.scope; Spoil.revealed.add(s); rerender(); const box = document.querySelector('[data-revealed="' + cssEsc(s) + '"]'); if (box) { const h = box.querySelector('h2,h3,[tabindex]') || box; h.tabIndex = -1; h.focus(); } announce('Блок раскрыт'); };
Actions['hide-again'] = t => { const s = t.dataset.scope; Spoil.revealed.delete(s); rerender(); const b = document.querySelector('[data-key="sp-' + cssEsc(s) + '"] button'); if (b) b.focus(); announce('Блок снова скрыт'); };

/* ── Раскрытие подробностей ──────────────────────────── */
Actions['toggle-details'] = t => {
  const id = t.getAttribute('aria-controls'); const el = document.getElementById(id); if (!el) return;
  const open = el.hidden; el.hidden = !open; t.setAttribute('aria-expanded', String(open));
  const sc = Router.screen; if (sc) { sc.openDetails = sc.openDetails || new Set(); if (open) sc.openDetails.add(id); else sc.openDetails.delete(id); }
};

/* ── Таблицы ──────────────────────────────────────────── */
const TableSort = {};
Actions['sort-table'] = t => {
  const id = t.dataset.table, col = +t.dataset.col;
  const s = TableSort[id] || {};
  TableSort[id] = { col, dir: s.col === col && s.dir !== 'desc' ? 'desc' : 'asc' };
  rerender();
  const b = document.querySelector('[data-table="' + id + '"][data-col="' + col + '"]'); if (b) b.focus();
  announce('Сортировка: ' + (TableSort[id].dir === 'desc' ? 'по убыванию' : 'по возрастанию'));
};

/* ── Настройки и хранение ────────────────────────────── */
Actions['open-settings'] = () => {
  const body = () => {
    const s = Store.doc.settings;
    const T = Spoil.threshold();
    const opts = ['<option value="">По выбранному этапу' + (Store.doc.stage ? ' (' + Store.doc.stage + ')' : ' (не выбран — 5)') + '</option>'].concat(D.stages.map(x => '<option value="' + x.n + '"' + (s.spoilerStage === x.n ? ' selected' : '') + '>После этапа ' + x.n + '</option>')).join('');
    return '<div class="tn-stack">' +
      UI.switch('set-spoilers', s.spoilers !== 'off', 'Защита от спойлеров', s.spoilers !== 'off' ? 'Скрывать сюжетные сведения после этапа ' + T : 'Названия поздних квестов, мест и персонажей видны') +
      '<div class="tn-field"><label class="tn-field__label" for="sp-stage">Порог защиты</label><select class="tn-select" id="sp-stage" data-act="set-spoiler-stage"' + (s.spoilers === 'off' ? ' disabled' : '') + '>' + opts + '</select><p class="tn-field__hint">Игровые режимы, моды и ресурсы не скрываются — они нужны для планирования.</p></div>' +
      UI.switch('set-static', !!s.staticMap, 'Статичная карта', 'Без анимации, звёзд и свечения — для слабых устройств' + (reduceMotion() ? '. Сейчас уже включено настройкой «уменьшить движение» в системе' : '')) +
      UI.switch('set-english', s.showEnglish !== false, 'Показывать английские статьи Wiki', 'Английская Wiki — отдельным запросом после русской') +
      '<hr class="tn-divider">' +
      '<div class="tn-stack tn-stack--sm"><p class="tn-text-overline">Где хранится прогресс</p>' + UI.save() + '<p class="tn-muted tn-small">Только в этом браузере на этом устройстве. Очистка данных сайта удалит задачи и отметки. Синхронизации между устройствами нет.</p>' +
      '<div class="tn-cluster"><button class="tn-btn tn-btn--sm" data-act="export">' + icon('save', 'tn-icon--sm') + 'Скачать копию</button><button class="tn-btn tn-btn--sm" data-act="import">Загрузить из файла…</button></div>' +
      '<button class="tn-btn tn-btn--danger" data-act="reset-ask">' + icon('trash') + 'Сбросить прогресс…</button></div></div>';
  };
  const dr = Overlay.drawer({ title: 'Настройки', body: body(), onRefresh() { const b = dr.box.querySelector('.tn-objpanel__body'); const k = document.activeElement && document.activeElement.dataset.act; b.innerHTML = body(); if (k) { const x = b.querySelector('[data-act="' + k + '"]'); if (x) x.focus(); } } });
};
Actions['set-spoilers'] = t => { const on = t.getAttribute('aria-checked') !== 'true'; commit(d => { d.settings.spoilers = on ? 'on' : 'off'; }, () => announce(on ? 'Защита от спойлеров включена' : 'Защита от спойлеров выключена')); };
Actions['set-spoiler-stage'] = t => { const v = t.value ? +t.value : null; commit(d => { d.settings.spoilerStage = v; }, () => announce('Порог защиты сохранён')); };
Actions['set-static'] = t => { const on = t.getAttribute('aria-checked') !== 'true'; commit(d => { d.settings.staticMap = on; }, () => announce(on ? 'Статичная карта включена' : 'Статичная карта выключена')); };
Actions['set-english'] = t => { const on = t.getAttribute('aria-checked') !== 'true'; commit(d => { d.settings.showEnglish = on; }, () => announce(on ? 'Английские статьи показываются' : 'Английские статьи скрыты')); };
Actions['save-info'] = () => {
  const st = Store.status;
  const text = {
    saved: 'Задачи и отметки хранятся только в этом браузере на этом устройстве. Очистка данных сайта удалит их. Синхронизации между устройствами нет.',
    error: 'Последнее изменение не сохранилось: браузер отказал в записи. Отметки на экране возвращены к сохранённому состоянию.',
    unavailable: 'Браузер запрещает хранилище (например, приватный режим или запрет cookies). Изменения действуют до закрытия вкладки.',
    'unknown-format': 'В хранилище найден прогресс в неизвестном формате. Мы его не перезаписываем. Скачайте копию или начните заново.'
  }[st];
  Overlay.dialog({ title: 'Где хранится прогресс', body: '<p>' + text + '</p>' + (Store.doc.updatedAt ? '<p class="tn-faint tn-small">Последнее изменение — ' + ftime(Store.doc.updatedAt) + '.</p>' : ''),
    foot: '<a class="tn-btn" href="' + link('/tasks#storage') + '" data-ov="close">Управление прогрессом</a><button class="tn-btn tn-btn--primary" data-ov="close">Понятно</button>' });
};
Actions.export = () => {
  const blob = new Blob([Store.exportText()], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'navigator-tenno-progress-' + todayISO() + '.json';
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  Toast.show({ tone: 'info', title: 'Копия прогресса скачана', text: 'Файл можно загрузить в другом браузере.' });
};
Actions.import = () => {
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'application/json,.json';
  inp.onchange = () => {
    const f = inp.files[0]; if (!f) return;
    f.text().then(txt => {
      let d; try { d = JSON.parse(txt); } catch (e) { d = null; }
      if (!d || d.version !== DOC_VERSION) { Toast.show({ tone: 'danger', title: 'Файл не подходит', text: 'Ожидался файл прогресса Навигатора Тенно версии ' + DOC_VERSION + '. Текущий прогресс не изменён.' }); return; }
      const tasks = (d.tasks || []).filter(x => !x.removed).length;
      const dlg = Overlay.dialog({ role: 'alertdialog', title: 'Заменить прогресс из файла?', body: '<p>Текущий прогресс в этом браузере будет заменён: ' + pl(tasks, ['задача', 'задачи', 'задач']) + ', этап ' + (d.stage || 'не указан') + '.</p>',
        foot: '<button class="tn-btn" data-ov="close">Оставить текущий</button><button class="tn-btn tn-btn--primary" data-imp="ok">Заменить</button>',
        onMount(box) { box.querySelector('[data-imp="ok"]').addEventListener('click', () => { Overlay.close(dlg, { noFocus: true }); if (Store.status === 'unknown-format') { Store.status = 'saved'; } commit(x => { Object.keys(x).forEach(k => delete x[k]); Object.assign(x, normalize(d)); }, r => Toast.show({ tone: 'success', title: 'Прогресс загружен', text: savedText(r) })); }); } });
    });
  };
  inp.click();
};
Actions['reset-ask'] = () => {
  const d = Store.doc;
  const tasks = d.tasks.filter(t => !t.removed).length;
  const marks = Object.keys(d.done).length + Object.keys(d.facts).length + Object.keys(d.standing).length;
  const dlg = Overlay.dialog({ role: 'alertdialog', title: 'Сбросить весь прогресс?',
    body: Store.status === 'unknown-format' ? '<p>Из этого браузера будут удалены сохранённые данные в неизвестном формате. Скачайте копию, если она нужна.</p><p>Отменить сброс будет нельзя.</p>' :
      '<p>Из этого браузера будут удалены:</p><ul><li>выбранный этап' + (d.stage ? ' (' + d.stage + ')' : '') + ';</li><li>' + pl(marks, ['отметка', 'отметки', 'отметок']) + ' выполнения и прогресса;</li><li>' + pl(tasks, ['задача', 'задачи', 'задач']) + ';</li><li>настройки защиты от спойлеров и карты.</li></ul><p>Отменить сброс будет нельзя. На других устройствах ничего не изменится — там прогресс не хранится.</p>',
    foot: '<button class="tn-btn" data-ov="close" data-reset="keep">Оставить прогресс</button><button class="tn-btn tn-btn--danger-solid" data-reset="go">' + icon('trash') + 'Сбросить прогресс</button>',
    initialFocus: '[data-reset="keep"]', closeLabel: 'Закрыть без сброса',
    onMount(box) { box.querySelector('[data-reset="go"]').addEventListener('click', () => { Overlay.closeAll(); if (Store.reset()) Toast.show({ tone: 'info', title: 'Прогресс сброшен' }); else Toast.saveError(null, 'Сброс не выполнен.'); Router.go('/'); }); } });
};

// После переключения английских статей — повторить поиск в Wiki
const _setEnglish = Actions['set-english'];
Actions['set-english'] = t => { _setEnglish(t); if (Router.screen === Screens.search && Screens.search.source === 'wiki') Screens.search.runWiki(); };

/* ── Запуск ───────────────────────────────────────────── */
function boot() {
  sprite();
  Store.init();
  const dbg = new URLSearchParams(location.search).get('debug'); if (dbg) sessionStorage.setItem('tn:debug', dbg);
  Router.add('/', Screens.home);
  Router.add('/stage/:n', Screens.stage);
  Router.add('/planet/:id', Screens.planet);
  Router.add('/reference', Screens.reference);
  Router.add('/boost', Screens.group); Router.add('/mods', Screens.group); Router.add('/syndicates', Screens.group); Router.add('/loot', Screens.group);
  Router.add('/endgame', Screens.endgame);
  Router.add('/article/:slug', Screens.article);
  Router.add('/mod/:id', Screens.mod);
  Router.add('/item/:id', Screens.item);
  Router.add('/vendor/:id', Screens.vendor);
  Router.add('/syndicate/:id', Screens.syndicate);
  Router.add('/activity/:id', Screens.activity);
  Router.add('/quest/:id', Screens.quest);
  Router.add('/build/:id', Screens.build);
  Router.add('/search', Screens.search);
  Router.add('/tasks', Screens.tasks);
  Router.add('/warframes', Screens.warframes);
  Router.add('/weapons', Screens.weapons);
  if (Store.status === 'unavailable') setTimeout(() => Toast.show({ tone: 'warning', title: 'Сохранение недоступно', text: 'Браузер запрещает хранилище. Изменения будут действовать до закрытия вкладки.' }), 400);
  let resizeT; let lastW = window.innerWidth;
  window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => { const w = window.innerWidth; const bp = x => x < 640 ? 0 : x < 1100 ? 1 : 2; if (bp(w) !== bp(lastW)) { lastW = w; rerender(); } lastW = w; }, 150); });
  Router.render({ restore: history.state && history.state.tn ? history.state : null });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

})();
