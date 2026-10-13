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
