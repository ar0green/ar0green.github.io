/* 02-store.js — хранение прогресса только в этом браузере (HANDOFF → «Сохранение прогресса»).
   Ключ tn:progress:v1, один JSON-документ. Запись: setItem → повторное чтение → сравнение.
   Ошибка записи — откат изменения и состояние error; успех показывается только после подтверждения.
   Неизвестная версия документа — не перезаписываем, предлагаем сброс. Несколько вкладок — событие storage. */
const STORE_KEY = 'tn:progress:v1';
const DOC_VERSION = 1;

function emptyDoc() {
  return {
    version: DOC_VERSION,
    updatedAt: null,
    stage: null,          // выбранный этап маршрута (число) или null — «не указан»
    goalId: null,         // выбранная цель (необязательно)
    done: {},             // отметки выполнения: { 'goal:<id>': ISO, 'step:<goal>:<step>': ISO, 'check:<list>:<i>': ISO }
    facts: {},            // ручные отметки прогресса: { 'quest:new-war': true|false, 'mr': 12, 'owned:mod:vitality': true }
    standing: {},         // { '<syndicate>': { rank: 2, value: 42000 } } — только то, что указал игрок
    tasks: [],            // личные задачи
    lastPlace: null,      // { href, title, at } — для «Продолжить с того места»
    settings: { spoilers: 'on', spoilerStage: null, staticMap: false, showEnglish: true, view: null, density: 'normal' },
    onboarded: false
  };
}

const Store = {
  doc: emptyDoc(),
  status: 'saved',        // saved | error | unavailable | unknown-format
  lastError: null,
  listeners: new Set(),
  available: true,
  raw: null,              // исходная строка при неизвестном формате (для экспорта)

  storage() {
    const dbg = new URLSearchParams(location.search).get('debug') || sessionStorage.getItem('tn:debug') || '';
    if (dbg.includes('storage-off')) throw Object.assign(new Error('SecurityError'), { name: 'SecurityError' });
    return window.localStorage;
  },

  init() {
    try {
      const ls = this.storage();
      const probe = '__tn_probe__';
      ls.setItem(probe, '1'); ls.removeItem(probe);
      this.available = true;
    } catch (e) {
      this.available = false; this.status = 'unavailable'; this.lastError = e;
      this.doc = emptyDoc();
      return;
    }
    const r = this.read();
    if (r.state === 'ok') { this.doc = r.doc; this.status = 'saved'; }
    else if (r.state === 'empty') { this.doc = emptyDoc(); this.status = 'saved'; }
    else { this.doc = emptyDoc(); this.status = 'unknown-format'; this.raw = r.raw; }
    window.addEventListener('storage', e => {
      if (e.key !== STORE_KEY && e.key !== null) return;
      const rr = this.read();
      if (rr.state === 'ok') { this.doc = rr.doc; if (this.status !== 'unavailable') this.status = 'saved'; }
      else if (rr.state === 'empty') { this.doc = emptyDoc(); this.status = 'saved'; this.raw = null; }
      else { this.status = 'unknown-format'; this.raw = rr.raw; }
      this.emit({ external: true });
    });
  },

  /** Читает документ из хранилища. state: ok | empty | unknown */
  read() {
    let raw;
    try { raw = this.storage().getItem(STORE_KEY); } catch (e) { return { state: 'empty' }; }
    if (raw == null) return { state: 'empty' };
    let d;
    try { d = JSON.parse(raw); } catch (e) { return { state: 'unknown', raw }; }
    if (!d || typeof d !== 'object' || d.version !== DOC_VERSION) return { state: 'unknown', raw };
    return { state: 'ok', doc: normalize(d) };
  },

  /** Изменение документа. mutator(doc) меняет копию. Возвращает true (записано), 'memory' (только до закрытия вкладки) или false (ошибка). */
  update(mutator) {
    if (this.status === 'unknown-format') { this.emit({ blocked: true }); return false; }
    // берём свежую версию из хранилища, чтобы не затереть изменения из другой вкладки
    let base = this.doc;
    if (this.available) { const r = this.read(); if (r.state === 'ok') base = r.doc; }
    const next = clone(base);
    mutator(next);
    next.updatedAt = new Date().toISOString();
    if (!this.available) { this.doc = next; this.status = 'unavailable'; this.emit({}); return 'memory'; }
    const str = JSON.stringify(next);
    try {
      const dbg = new URLSearchParams(location.search).get('debug') || sessionStorage.getItem('tn:debug') || '';
      if (dbg.includes('storage-fail')) throw Object.assign(new Error('QuotaExceededError'), { name: 'QuotaExceededError' });
      const ls = this.storage();
      ls.setItem(STORE_KEY, str);
      if (ls.getItem(STORE_KEY) !== str) throw new Error('Проверка записи не совпала');
    } catch (e) {
      this.lastError = e; this.status = 'error';
      // откат: остаёмся на последнем подтверждённом документе
      this.doc = base;
      this.emit({ error: e });
      return false;
    }
    this.doc = next; this.status = 'saved'; this.lastError = null;
    this.emit({});
    return true;
  },

  /** Полный сброс: удаляется ключ целиком */
  reset() {
    try { if (this.available) this.storage().removeItem(STORE_KEY); }
    catch (e) { this.lastError = e; this.status = 'error'; this.emit({ error: e }); return false; }
    this.doc = emptyDoc(); this.raw = null;
    this.status = this.available ? 'saved' : 'unavailable';
    this.emit({});
    return true;
  },

  /** Импорт документа из файла (после проверки формата) */
  replace(doc) {
    const d = normalize(doc);
    return this.update(x => { Object.keys(x).forEach(k => delete x[k]); Object.assign(x, d); });
  },

  exportText() { return this.status === 'unknown-format' && this.raw ? this.raw : JSON.stringify(this.doc, null, 2); },

  on(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  emit(ev) { this.listeners.forEach(fn => { try { fn(ev); } catch (e) { console.error(e); } }); }
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }
function normalize(d) {
  const e = emptyDoc();
  const out = Object.assign(e, d);
  out.settings = Object.assign(emptyDoc().settings, d.settings || {});
  out.done = d.done && typeof d.done === 'object' ? d.done : {};
  out.facts = d.facts && typeof d.facts === 'object' ? d.facts : {};
  out.standing = d.standing && typeof d.standing === 'object' ? d.standing : {};
  out.tasks = Array.isArray(d.tasks) ? d.tasks.filter(t => t && t.id && t.title) : [];
  return out;
}
TN.Store = Store;
