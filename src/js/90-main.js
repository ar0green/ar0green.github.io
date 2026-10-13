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
