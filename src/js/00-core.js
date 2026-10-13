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
