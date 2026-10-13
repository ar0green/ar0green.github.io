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
