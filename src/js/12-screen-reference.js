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
