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
