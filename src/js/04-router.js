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
