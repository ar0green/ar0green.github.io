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
