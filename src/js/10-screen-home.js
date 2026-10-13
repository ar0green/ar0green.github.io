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
