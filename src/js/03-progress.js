/* 03-progress.js — отметки прогресса, проверка условий, цели этапов и личные задачи.
   Правила задания: отсутствие отметки = «не указано», а не «нет»; выбор этапа ничего не отмечает автоматически;
   выполнение задачи не меняет игровые сведения — для этого игрок нажимает отдельное действие. */

const Facts = {
  /** true | false | undefined */
  get(id) {
    const d = Store.doc;
    if (id.startsWith('rank:')) { const s = d.standing[id.slice(5)]; return s && s.rank != null ? s.rank : undefined; }
    const v = d.facts[id];
    return v === undefined || v === null ? undefined : v;
  },
  def(id) { return IDX.fact.get(id); },
  label(c) {
    if (c.label) return c.label;
    const f = c.f || '';
    if (f === 'mr') return 'Ранг мастерства ' + c.min;
    if (f.startsWith('rank:')) { const s = IDX.syndicate.get(f.slice(5)); return (s ? s.name : f) + ': ранг ' + c.min; }
    if (f.startsWith('owned:')) { const e = entity((IDX.mod.has(f.slice(6)) ? 'mod:' : 'item:') + f.slice(6)); return 'Есть ' + (e ? e.name : f.slice(6)); }
    const def = IDX.fact.get(f); return def ? factName(def) : f;
  },
  /** Ключ условия для ручной отметки: факт или «note:…» для условий без отдельной отметки */
  key(c) { return c.f || ('note:' + slug(c.label || '')); }
};
function slug(s) { return String(s).toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60); }

/** Проверка условия → { state: yes|no|unknown, label, current, hint } */
function evalCond(c) {
  if (c.any) {
    const parts = c.any.map(evalCond);
    const state = parts.some(p => p.state === 'yes') ? 'yes' : parts.every(p => p.state === 'no') ? 'no' : 'unknown';
    return { state, label: c.label || parts.map(p => p.label).join(' или '), note: c.note, parts, key: null, cond: c };
  }
  const key = Facts.key(c);
  const label = Facts.label(c);
  let state = 'unknown', current = null;
  if (c.f === 'mr' || (c.f && c.f.startsWith('rank:'))) {
    const v = Facts.get(c.f);
    if (v !== undefined) { state = v >= c.min ? 'yes' : 'no'; current = c.f === 'mr' ? 'у вас ' + v : 'сейчас: ранг ' + v; }
  } else {
    const v = Store.doc.facts[key];
    if (v === true) state = 'yes'; else if (v === false) state = 'no';
    else if (c.f && c.f.startsWith('junction:')) {
      // переход, ведущий к планете, которую игрок отметил открытой, пройден: без него на планету не попасть
      const to = junctionTarget(c.f);
      if (to && Store.doc.facts['open:' + to] === true) { state = 'yes'; current = 'следует из отметки «' + entPlain(entity('planet:' + to)) + ' — открыта»'; }
    }
  }
  const def = c.f ? IDX.fact.get(c.f) : null;
  return { state, label, current, note: c.note || (def && def.note), key, cond: c, def };
}

/* ── Цели и этапы ─────────────────────────────────────── */
const isDone = key => !!Store.doc.done[key];
function goalInfo(g) {
  const steps = g.steps || [];
  const stepsDone = steps.filter(s => isDone('step:' + g.id + ':' + s.id)).length;
  const done = isDone('goal:' + g.id);
  const conds = (g.req || []).map(evalCond);
  const unmet = conds.filter(c => c.state === 'no').length;
  const unknown = conds.filter(c => c.state === 'unknown').length;
  return { done, steps, stepsDone, conds, unmet, unknown, inTasks: !!findTask('goal:' + g.id) };
}
function stageGoals(n) { const s = IDX.stage.get(String(n)); return s ? s.goals.map(id => IDX.goal.get(id)).filter(Boolean) : []; }
function stageInfo(n) {
  const gs = stageGoals(n);
  const main = gs.filter(g => g.kind === 'main');
  const doneMain = main.filter(g => isDone('goal:' + g.id)).length;
  const nearest = main.find(g => !isDone('goal:' + g.id)) || gs.find(g => !isDone('goal:' + g.id)) || null;
  return { goals: gs, main, doneMain, total: main.length, nearest };
}
/** Состояние этапа маршрута относительно выбранного: done | current | available | locked */
function stageProgress(n) {
  const cur = Store.doc.stage;
  if (!cur) return n === 1 ? 'available' : 'locked';
  if (n < cur) return 'done';
  if (n === cur) return 'current';
  if (n === cur + 1) return 'available';
  return 'locked';
}
const PROGRESS_WORD = { locked: 'Закрыто', available: 'Доступно', current: 'Текущий этап', done: 'Пройдено' };
const PROGRESS_ICON = { locked: 'lock', available: 'unlock', current: 'target', done: 'check' };
/** Подписи состояния для планет: «пройдено» для места звучит странно — планета «открыта» */
const PLANET_WORD = { locked: 'Закрыта', available: 'Впереди по маршруту', current: 'Текущий этап', done: 'Открыта' };
/** Переход → планета, которую он открывает (по условиям доступа мест) */
let JUNCTION_TO = null;
function junctionTarget(f) {
  if (!JUNCTION_TO) { JUNCTION_TO = {}; D.locations.forEach(l => (l.access || []).forEach(c => { if (c.f && c.f.startsWith('junction:') && c.gate !== false) JUNCTION_TO[c.f] = l.id; })); }
  return JUNCTION_TO[f] || null;
}
/** Открыта ли планета в игре: yes | no | unknown.
    Явная отметка игрока важнее; иначе — по условиям, без которых на планету не попасть (переходы и квесты). */
function planetOpen(loc) {
  const v = Store.doc.facts['open:' + loc.id];
  if (v === true) return { state: 'yes', how: 'mark' };
  if (v === false) return { state: 'no', how: 'mark' };
  const gates = (loc.access || []).filter(c => c.gate !== false).map(evalCond);
  if (!gates.length) return { state: 'unknown', how: 'none' };
  if (gates.every(e => e.state === 'yes')) return { state: 'yes', how: 'conds' };
  if (gates.some(e => e.state === 'no')) return { state: 'no', how: 'conds' };
  return { state: 'unknown', how: 'conds' };
}
/** Состояние планеты на карте: current — фокус выбранного этапа; done — открыта (по отметкам или условиям);
    locked — точно закрыта; иначе — по выбранному этапу (без отметок предполагаем, что ранние этапы пройдены) */
function planetProgress(loc) {
  const cur = Store.doc.stage;
  const st = loc.stages;
  const curStage = cur ? IDX.stage.get(String(cur)) : null;
  if (curStage && curStage.focus === loc.id) return 'current';
  const op = planetOpen(loc).state;
  if (op === 'yes') return 'done';
  if (op === 'no') return st.includes(cur) || st.includes((cur || 0) + 1) ? 'available' : 'locked';
  if (!cur) return st[0] === 1 ? 'available' : 'locked';
  if (st.every(x => x < cur) || st[0] < cur) return 'done';
  if (st.includes(cur) || st.includes(cur + 1)) return 'available';
  return 'locked';
}
/** Этап, ради которого показываем планету: текущий, иначе ближайший будущий, иначе первый */
function planetStage(loc) {
  const cur = Store.doc.stage;
  if (cur && loc.stages.includes(cur)) return cur;
  const fut = cur ? loc.stages.find(x => x > cur) : null;
  return fut || loc.stages[0];
}

/* ── Личные задачи ───────────────────────────────────── */
function findTask(ref) { return Store.doc.tasks.find(t => t.ref === ref && !t.removed); }
/** Описание задачи для цели этапа */
function taskSpecGoal(g) {
  const s = IDX.stage.get(String(g.stage));
  return { ref: 'goal:' + g.id, title: g.title, href: '/stage/' + g.stage + '#goal-' + g.id, group: 'stage:' + g.stage, groupTitle: 'Этап ' + g.stage + ' · ' + (s ? s.short : ''), kind: 'goal', stage: g.stage, ctx: g.why };
}
/** Описание задачи для невыполненного условия */
function taskSpecCond(ev, groupRef, groupTitle, stage) {
  const c = ev.cond;
  let href = null, ctx = ev.note || '';
  const f = c.f || '';
  if (f.startsWith('quest:')) href = '/quest/' + f;
  else if (f.startsWith('rank:')) href = '/syndicate/' + f.slice(5);
  else if (f.startsWith('junction:') || f.startsWith('flag:')) href = '/quest/' + f;
  else if (f === 'mr') href = '/article/mastery';
  const verb = f.startsWith('quest:') ? 'Пройти: ' : f.startsWith('rank:') ? 'Поднять ' : f === 'mr' ? 'Достичь: ' : '';
  let title = ev.label;
  if (f.startsWith('quest:')) { const d = IDX.fact.get(f); title = verb + (d ? q(d.name) : f); }
  else if (f.startsWith('rank:')) { const s = IDX.syndicate.get(f.slice(5)); title = 'Поднять ранг ' + q(s ? s.name : f) + ' до ' + c.min; }
  else if (f === 'mr') title = 'Достичь ранга мастерства ' + c.min;
  return { ref: 'cond:' + Facts.key(c) + (c.min != null ? ':' + c.min : ''), title, href, group: groupRef, groupTitle, kind: 'cond', fact: c.f || null, factKey: Facts.key(c), min: c.min, ctx, stage };
}
/**
 * Добавляет задачи. specs — массив описаний; deps — индексы зависимостей: [{ task: i, on: [j, …] }].
 * Общие предпосылки не дублируются: если задача с тем же ref уже есть, используется она.
 * Возвращает { ok, created: [titles], reused: [titles] }.
 */
function addTasks(specs, deps) {
  const created = [], reused = [];
  const res = Store.update(doc => {
    const ids = specs.map(sp => {
      const ex = doc.tasks.find(t => t.ref === sp.ref && !t.removed);
      if (ex) { reused.push(ex.title); return ex.id; }
      const t = Object.assign({ id: uid('t'), done: false, createdAt: new Date().toISOString(), dependsOn: [] }, sp);
      doc.tasks.push(t); created.push(t.title); return t.id;
    });
    (deps || []).forEach(d => {
      const t = doc.tasks.find(x => x.id === ids[d.task]);
      if (!t) return;
      d.on.forEach(j => { const dep = ids[j]; if (dep && dep !== t.id && !t.dependsOn.includes(dep)) t.dependsOn.push(dep); });
    });
  });
  return { ok: res, created, reused };
}
function taskBlockers(t) {
  return (t.dependsOn || []).map(id => Store.doc.tasks.find(x => x.id === id)).filter(x => x && !x.done && !x.removed);
}
function activeTasks() { return Store.doc.tasks.filter(t => !t.removed); }
function openTaskCount() { return activeTasks().filter(t => !t.done).length; }

/** Подсказка для отметки прогресса после выполнения цели или задачи (не применяется автоматически) */
function pendingMarks(keys) {
  return (keys || []).filter(k => {
    if (k.startsWith('owned:')) return Store.doc.facts[k] !== true;
    const v = Store.doc.facts[k];
    return v !== true;
  });
}
function markLabel(k) {
  if (k.startsWith('owned:')) { const id = k.slice(6); const e = entity((IDX.mod.has(id) ? 'mod:' : 'item:') + id); return 'есть ' + (e ? entPlain(e) : id); }
  const d = IDX.fact.get(k); if (!d) return k;
  if (Spoil.hiddenStage(d.stage || 0, d.spoiler)) return 'скрытый квест · этап ' + d.stage;
  return d.kind === 'quest' ? 'квест ' + q(d.name) + ' пройден' : d.name;
}
Object.assign(TN, { evalCond, goalInfo, stageInfo, addTasks });
