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
