/* 06-overlays.js — Dialog, Drawer, Toast, меню «Справочник».
   Диалоги и панели: ловушка фокуса, Esc, возврат фокуса на вызвавший элемент, фон не прокручивается (HANDOFF → «Взаимодействие»). */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const Overlay = {
  stack: [],
  root() { return document.getElementById('tn-overlays'); },
  /** Открыть диалог: { title, body (html), foot (html), role, id, onMount(el), onClose(), initialFocus } */
  dialog(o) {
    const id = o.id || uid('dlg');
    const el = document.createElement('div');
    el.className = 'tn-scrim';
    el.innerHTML = '<div class="tn-dialog" role="' + (o.role || 'dialog') + '" aria-modal="true" aria-labelledby="' + id + '-t"' + (o.body ? ' aria-describedby="' + id + '-d"' : '') + ' id="' + id + '">' +
      '<div class="tn-dialog__head"><h2 class="tn-dialog__title" id="' + id + '-t" tabindex="-1">' + o.title + '</h2><button class="tn-btn tn-btn--ghost tn-btn--icon" data-ov="close" aria-label="' + (o.closeLabel || 'Закрыть') + '">' + icon('close') + '</button></div>' +
      '<div class="tn-dialog__body" id="' + id + '-d">' + (o.body || '') + '</div>' + (o.foot ? '<div class="tn-dialog__foot">' + o.foot + '</div>' : '') + '</div>';
    return this.open(el, o, el.querySelector('.tn-dialog'));
  },
  /** Боковая панель или нижний лист: { title, overline, body, foot, sheet, onClose } */
  drawer(o) {
    const id = o.id || uid('dr');
    const el = document.createElement('div');
    el.className = 'tn-overlay-drawer';
    el.innerHTML = '<div class="tn-scrim tn-scrim--drawer" data-ov="close"></div><aside class="tn-drawer' + (o.sheet ? ' tn-drawer--sheet' : '') + '" role="dialog" aria-modal="true" aria-labelledby="' + id + '-t" id="' + id + '">' +
      (o.sheet ? '<div class="tn-drawer__grip" aria-hidden="true"></div>' : '') +
      '<div class="tn-objpanel__head tn-drawer__head"><div>' + (o.overline ? '<p class="tn-text-overline">' + o.overline + '</p>' : '') + '<h2 class="tn-objpanel__title" id="' + id + '-t" tabindex="-1">' + o.title + '</h2></div><button class="tn-btn tn-btn--ghost tn-btn--icon" data-ov="close" aria-label="Закрыть">' + icon('close') + '</button></div>' +
      '<div class="tn-objpanel__body">' + o.body + '</div>' + (o.foot ? '<div class="tn-objpanel__foot">' + o.foot + '</div>' : '') + '</aside>';
    return this.open(el, o, el.querySelector('.tn-drawer'));
  },
  open(el, o, box) {
    const opener = document.activeElement;
    this.root().appendChild(el);
    document.body.classList.add('tn-noscroll');
    const entry = { el, box, opener, o };
    this.stack.push(entry);
    el.addEventListener('click', e => {
      const c = e.target.closest('[data-ov="close"]');
      if (c && el.contains(c)) { e.preventDefault(); this.close(entry); }
    });
    // свайп вниз — дополнительный способ закрыть нижний лист
    if (o.sheet) {
      let y0 = null;
      box.addEventListener('touchstart', e => { y0 = e.touches[0].clientY; }, { passive: true });
      box.addEventListener('touchend', e => { if (y0 != null && e.changedTouches[0].clientY - y0 > 80 && box.querySelector('.tn-objpanel__body').scrollTop === 0) this.close(entry); y0 = null; });
    }
    if (o.onMount) o.onMount(box);
    const first = o.initialFocus ? box.querySelector(o.initialFocus) : box.querySelector('h2[tabindex]');
    (first || box).focus();
    return entry;
  },
  close(entry, opts) {
    entry = entry || this.stack[this.stack.length - 1];
    if (!entry) return;
    this.stack = this.stack.filter(x => x !== entry);
    entry.el.remove();
    if (!this.stack.length) document.body.classList.remove('tn-noscroll');
    if (entry.o.onClose) entry.o.onClose(opts || {});
    if (!(opts && opts.noFocus) && entry.opener && document.contains(entry.opener)) entry.opener.focus();
    else if (!(opts && opts.noFocus) && entry.o.returnKey) { const t = document.querySelector('[data-key="' + entry.o.returnKey + '"]'); if (t) t.focus(); }
  },
  closeAll() { while (this.stack.length) this.close(null, { noFocus: true }); },
  top() { return this.stack[this.stack.length - 1]; }
};
document.addEventListener('keydown', e => {
  const top = Overlay.top();
  if (!top) return;
  if (e.key === 'Escape') { e.preventDefault(); top.o.onEscape ? top.o.onEscape() : Overlay.close(top); return; }
  if (e.key === 'Tab') {
    const f = $$(FOCUSABLE, top.box).filter(x => x.offsetParent !== null || x === document.activeElement);
    if (!f.length) { e.preventDefault(); return; }
    const a = f[0], b = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === a || !top.box.contains(document.activeElement))) { e.preventDefault(); b.focus(); }
    else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
  }
});

/* ── Тосты: успех/инфо — 6 с, с «Вернуть» — 8 с, ошибка — до закрытия; пауза при наведении и фокусе ── */
const Toast = {
  show(o) {
    const host = document.getElementById('tn-toasts');
    while (host.children.length >= 3) host.firstElementChild.remove();
    const el = document.createElement('div');
    el.className = 'tn-toast';
    el.dataset.tone = o.tone || 'success';
    el.setAttribute('role', o.tone === 'danger' ? 'alert' : 'status');
    const ic = { success: 'check-circle', info: 'info', warning: 'warning', danger: 'save-error' }[el.dataset.tone];
    el.innerHTML = icon(ic) + '<div><p class="tn-text-body-strong">' + o.title + '</p>' + (o.text ? '<p>' + o.text + '</p>' : '') +
      (o.actions && o.actions.length ? '<div class="tn-toast__actions">' + o.actions.map((a, i) => a.href ? '<a class="tn-btn tn-btn--sm" href="' + link(a.href) + '" data-ti="' + i + '">' + a.label + '</a>' : '<button class="tn-btn tn-btn--sm" data-ti="' + i + '">' + (a.icon ? icon(a.icon, 'tn-icon--sm') : '') + a.label + '</button>').join('') + '</div>' : '') +
      '</div><button class="tn-btn tn-btn--ghost tn-btn--icon tn-btn--sm" aria-label="Закрыть уведомление" data-tclose>' + icon('close', 'tn-icon--sm') + '</button>';
    host.appendChild(el);
    const ms = o.tone === 'danger' ? 0 : (o.ms || ((o.actions || []).some(a => a.undo) ? 8000 : 6000));
    let left = ms, t0 = Date.now(), timer = null;
    const close = () => { clearTimeout(timer); el.remove(); };
    const start = () => { if (!ms) return; t0 = Date.now(); timer = setTimeout(close, left); };
    const pause = () => { if (!ms) return; clearTimeout(timer); left -= Date.now() - t0; };
    el.addEventListener('mouseenter', pause); el.addEventListener('mouseleave', start);
    el.addEventListener('focusin', pause); el.addEventListener('focusout', e => { if (!el.contains(e.relatedTarget)) start(); });
    el.addEventListener('click', e => {
      if (e.target.closest('[data-tclose]')) { close(); return; }
      const b = e.target.closest('[data-ti]');
      if (b) { const a = o.actions[+b.dataset.ti]; if (a.fn) { e.preventDefault(); a.fn(); } close(); }
    });
    start();
    return { close };
  },
  saveError(retry, what) {
    if (Store.status === 'unknown-format') {
      this.show({ tone: 'danger', title: 'Не сохранено', text: 'Сохранённый прогресс в неизвестном формате, поэтому запись отключена — мы его не перезаписываем. ' + (what || '') + ' Скачайте копию или начните заново (кнопки вверху страницы).' });
      return;
    }
    const err = Store.lastError;
    const reason = err && err.name === 'QuotaExceededError' ? 'Хранилище браузера переполнено.' : err && err.name === 'SecurityError' ? 'Хранилище запрещено настройками браузера.' : 'Браузер не подтвердил запись.';
    this.show({ tone: 'danger', title: 'Не удалось сохранить', text: reason + ' ' + (what || 'Изменение не применено.'), actions: retry ? [{ label: 'Повторить', icon: 'refresh', fn: retry }] : [] });
  }
};

/* ── Меню «Справочник»: кнопка с aria-expanded, стрелки, Esc с возвратом фокуса ── */
const RefMenu = {
  btn() { return document.getElementById('ref-menu-btn'); },
  el() { return document.getElementById('ref-menu'); },
  open(focusFirst) {
    const b = this.btn(), m = this.el(); if (!b || !m) return;
    const r = b.getBoundingClientRect();
    m.style.left = Math.max(8, r.left) + 'px'; m.style.top = (r.bottom + 4) + 'px';
    m.hidden = false; b.setAttribute('aria-expanded', 'true');
    if (focusFirst) { const f = m.querySelector('[role="menuitem"]'); if (f) f.focus(); }
  },
  close(returnFocus) {
    const b = this.btn(), m = this.el(); if (!m || m.hidden) return;
    m.hidden = true; if (b) b.setAttribute('aria-expanded', 'false');
    if (returnFocus && b) b.focus();
  },
  toggle(kb) { const m = this.el(); if (m && m.hidden) this.open(kb); else this.close(true); }
};
document.addEventListener('keydown', e => {
  const m = RefMenu.el();
  if (!m || m.hidden) {
    if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && document.activeElement === RefMenu.btn() && e.key === 'ArrowDown') { e.preventDefault(); RefMenu.open(true); }
    return;
  }
  const items = $$('[role="menuitem"]', m);
  const i = items.indexOf(document.activeElement);
  if (e.key === 'Escape') { e.preventDefault(); RefMenu.close(true); }
  else if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
  else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
  else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
  else if (e.key === 'Tab') RefMenu.close(false);
});
document.addEventListener('click', e => {
  const m = RefMenu.el(); if (!m || m.hidden) return;
  if (!m.contains(e.target) && !e.target.closest('#ref-menu-btn')) RefMenu.close(false);
  if (e.target.closest('[role="menuitem"]')) RefMenu.close(false);
});
Object.assign(TN, { Overlay, Toast });
