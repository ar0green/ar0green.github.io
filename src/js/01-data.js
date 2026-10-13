/* 01-data.js — доступ к содержанию (window.TN_DATA), ссылки между сущностями и защита от спойлеров.
   Защита (HANDOFF → «Защита от спойлеров»): сущность скрыта, если защита включена, spoiler === true и stage > порога.
   Порог: настройка игрока → выбранный этап → 5 (середина игры), если этап не выбран.
   Скрытые тексты не попадают в DOM: подстановка выполняется до вставки разметки. */
const D = window.TN_DATA;
const by = (arr, key) => new Map(arr.map(x => [x[key || 'id'], x]));
const IDX = {
  fact: by(D.facts), mod: by(D.mods), item: by(D.items), vendor: by(D.vendors), syndicate: by(D.syndicates), activity: by(D.activities),
  build: by(D.builds), planet: by(D.locations), goal: by(D.goals), stage: new Map(D.stages.map(s => [String(s.n), s])),
  article: by(D.articles), articleSlug: by(D.articles, 'slug')
};
const RARITY = { common: ['Обычный', 1], uncommon: ['Необычный', 2], rare: ['Редкий', 3], legendary: ['Легендарный', 4] };
const FAMILY = { normal: 'Обычный мод', corrupted: 'Повреждённый', galvanized: 'Гальванизированный', archon: 'Архонтовый', primed: 'Прайм', augment: 'Мод-улучшение', nightmare: 'Мод Кошмара', sixty: '60/60', companion: 'Мод Связи', umbra: 'Умбра', riven: 'Мод разлома' };
const MODCAT = { warframe: 'Варфрейм', aura: 'Аура', shotgun: 'Дробовик', rifle: 'Винтовка и лук', bow: 'Лук', pistol: 'Пистолет', melee: 'Ближний бой', companion: 'Компаньон', any: 'Оружие' };
const ITEMTYPE = { warframe: 'Варфрейм', weapon: 'Оружие', resource: 'Ресурс', currency: 'Валюта', arcane: 'Мистификатор', misc: 'Предмет' };
const SLOTNAME = { primary: 'Основное оружие', secondary: 'Вторичное оружие', melee: 'Ближний бой', shotgun: 'Дробовик' };

/* ── Защита от спойлеров ─────────────────────────────── */
const Spoil = {
  revealed: new Set(),            // раскрытые блоки — до ухода со страницы
  on() { return Store.doc.settings.spoilers !== 'off'; },
  threshold() {
    const s = Store.doc.settings;
    if (s.spoilerStage) return s.spoilerStage;
    return Store.doc.stage || 5;
  },
  hiddenStage(stage, spoiler) { return !!spoiler && this.on() && stage > this.threshold(); },
  isHidden(obj) { return !!obj && this.hiddenStage(obj.stage || (obj.stages ? Math.min(...obj.stages) : 0), obj.spoiler); },
  reset() { this.revealed.clear(); }
};
let TERM_RE = null;
function termRegex() {
  if (TERM_RE) return TERM_RE;
  TERM_RE = D.spoilerTerms.map(t => ({ stage: t.stage, kind: t.kind, re: new RegExp('(?<![\\p{L}\\d])(?:' + t.re + ')(?![\\p{L}])', 'gu') }));
  return TERM_RE;
}
/** Экранирует текст и заменяет скрытые сюжетные слова меткой «Скрыто · этап N». scope — ключ раскрытого блока. */
function mask(text, scope) {
  const raw = String(text == null ? '' : text);
  if (!Spoil.on() || (scope && Spoil.revealed.has(scope))) return esc(raw);
  const T = Spoil.threshold();
  const hits = [];
  termRegex().forEach(t => {
    if (t.stage <= T) return;
    t.re.lastIndex = 0; let m;
    while ((m = t.re.exec(raw))) hits.push({ a: m.index, b: m.index + m[0].length, stage: t.stage, kind: t.kind });
  });
  if (!hits.length) return esc(raw);
  hits.sort((x, y) => x.a - y.a);
  let out = '', pos = 0;
  hits.forEach(h => {
    if (h.a < pos) return;
    out += esc(raw.slice(pos, h.a)) + spoilerInline(h.stage);
    pos = h.b;
  });
  return out + esc(raw.slice(pos));
}
/** Есть ли в тексте скрытые слова (для кнопки «Показать скрытое в разделе») */
function hasMasked(text) {
  if (!Spoil.on()) return false;
  const T = Spoil.threshold();
  return termRegex().some(t => { if (t.stage <= T) return false; t.re.lastIndex = 0; return t.re.test(String(text)); });
}
/** Простой текст без скрытых слов — для title вкладки, aria-label и подсказок */
function maskPlain(text) {
  if (!Spoil.on()) return String(text);
  const T = Spoil.threshold();
  let s = String(text);
  termRegex().forEach(t => { if (t.stage > T) { t.re.lastIndex = 0; s = s.replace(t.re, '[скрыто]'); } });
  return s;
}
function spoilerInline(stage) {
  return '<span class="tn-spoiler tn-spoiler--inline">' + icon('eye-off', 'tn-icon--sm') + 'Скрыто · этап ' + stage + '</span>';
}

/* ── Сущности и ссылки ───────────────────────────────── */
/** ref: 'mod:id' | 'item:id' | 'vendor:id' | ... | 'route' и т. п. → { kind, id, obj, name, path, stage, hidden } */
function entity(ref) {
  if (!ref) return null;
  const simple = { route: ['/?view=list', 'Маршрут списком'], stages: ['/?view=list', 'Маршрут развития'], mods: ['/mods', 'Моды'], syndicates: ['/syndicates', 'Синдикаты'], loot: ['/loot', 'Добыча'],
    endgame: ['/endgame', 'Поздняя игра'], tasks: ['/tasks', 'Мои задачи'], builds: ['/boost#builds', 'Сборки'], checklists: ['/endgame#readiness', 'Проверка готовности'], reference: ['/reference', 'Справочник'], search: ['/search', 'Поиск'] };
  if (simple[ref]) return { kind: 'route', id: ref, name: simple[ref][1], path: simple[ref][0], stage: 0, hidden: false };
  const i = ref.indexOf(':'); const kind = ref.slice(0, i), id = ref.slice(i + 1);
  let obj, name, path, stage = 0, spoiler = false;
  switch (kind) {
    case 'mod': obj = IDX.mod.get(id); path = '/mod/' + id; break;
    case 'item': obj = IDX.item.get(id); path = '/item/' + id; break;
    case 'vendor': obj = IDX.vendor.get(id); path = '/vendor/' + id; break;
    case 'syndicate': obj = IDX.syndicate.get(id); path = '/syndicate/' + id; break;
    case 'activity': obj = IDX.activity.get(id); path = '/activity/' + id; break;
    case 'build': obj = IDX.build.get(id); path = '/build/' + id; if (obj) name = obj.title; break;
    case 'planet': obj = IDX.planet.get(id); path = '/planet/' + id; if (obj) stage = Math.min(...obj.stages); break;
    case 'goal': obj = IDX.goal.get(id); if (obj) { path = '/stage/' + obj.stage + '#goal-' + id; name = obj.title; stage = obj.stage; spoiler = (IDX.stage.get(String(obj.stage)) || {}).spoiler; } break;
    case 'stage': obj = IDX.stage.get(id); if (obj) { path = '/stage/' + id; name = 'Этап ' + id + ': ' + obj.title; stage = obj.n; spoiler = obj.spoiler; } break;
    case 'article': obj = IDX.article.get(id); if (obj) { path = '/article/' + obj.slug; name = obj.title; stage = obj.stage || 0; } break;
    case 'quest': case 'fact': obj = IDX.fact.get(id); path = '/quest/' + encodeURIComponent(id); break;
    default: return null;
  }
  if (!obj) return null;
  if (!name) name = obj.name || obj.title;
  if (!stage) stage = obj.stage || 0;
  if (kind !== 'goal' && kind !== 'stage') spoiler = !!obj.spoiler;
  const hidden = Spoil.hiddenStage(stage, spoiler);
  return { kind, id, obj, name, path, stage, spoiler, hidden };
}
/** Название сущности для показа: скрытое — «Скрытая … · этап N» */
function entName(e, scope) {
  if (!e) return '';
  if (e.hidden && !(scope && Spoil.revealed.has(scope))) {
    const what = { planet: 'Скрытое место', quest: 'Скрытый сюжетный квест', fact: 'Скрытый сюжетный квест', vendor: 'Скрытый продавец', syndicate: 'Скрытая группа', stage: 'Скрытый этап', goal: 'Скрытая цель', item: 'Скрытый предмет', activity: 'Скрытый режим' }[e.kind] || 'Скрыто';
    return esc(what) + ' · этап ' + e.stage;
  }
  return mask(e.name, scope);
}
function entPlain(e) {
  if (!e) return '';
  if (e.hidden) return ({ planet: 'Скрытое место', quest: 'Скрытый сюжетный квест', vendor: 'Скрытый продавец', stage: 'Скрытый этап' }[e.kind] || 'Скрыто') + ' · этап ' + e.stage;
  return maskPlain(e.name);
}
const factName = f => {
  const e = { kind: 'quest', name: f.name, stage: f.stage || 0, hidden: Spoil.hiddenStage(f.stage || 0, f.spoiler) };
  return e.hidden ? 'Скрытый сюжетный квест · этап ' + f.stage : (f.kind === 'quest' ? 'Квест ' + q(f.name) : f.name);
};
const stageTitle = s => (Spoil.hiddenStage(s.n, s.spoiler) ? 'Скрытый этап' : s.title);
const wikiRu = page => 'https://ru.wiki.warframe.com/w/' + encodeURI(page);
const wikiEn = page => 'https://wiki.warframe.com/w/' + encodeURI(page).replace(/'/g, '%27');
function srcInfo(key) {
  if (!key || key === 'guide' || /^g:/.test(key)) return { guide: true, title: D.guide.title, checked: D.guide.checked, section: key && key.startsWith('g:') ? key.slice(2) : null };
  const s = D.sources[key]; return s ? Object.assign({ key }, s) : null;
}
Object.assign(TN, { D, IDX, Spoil, mask, entity });
