/* 16-screen-tasks.js — «Мои задачи» (ScreenTasks): продолжение с последнего места, группы, зависимые задачи,
   ручные отметки прогресса, честное описание хранения, сброс, 404. */
Screens.tasks = {
  nav: 'tasks',
  openFacts: new Set(),
  saveUI() { const m = document.getElementById('main'); if (m) $$('details.tn-factgroup', m).forEach(d => d.open ? this.openFacts.add(d.dataset.fg) : this.openFacts.delete(d.dataset.fg)); return null; },
  title() { return 'Мои задачи'; },
  render(p, query) {
    const tasks = activeTasks();
    const groupBy = query.get('group') === 'type' ? 'type' : 'stage';
    const hideDone = query.get('hideDone') === '1';
    const open = tasks.filter(t => !t.done).length, done = tasks.length - open;
    const lp = Store.doc.lastPlace;
    const cur = Store.doc.stage;
    const head = UI.pageTitle({ overline: tasks.length ? 'С возвращением' : 'Личный план', title: 'Мои задачи',
      lead: tasks.length ? pl(open, ['активная задача', 'активные задачи', 'активных задач']) + ', ' + done + ' ' + plural(done, ['выполнена', 'выполнены', 'выполнено']) + '.' + (Store.doc.updatedAt ? ' Последнее изменение — ' + ftime(Store.doc.updatedAt) + '.' : '') : 'Задачи — то, что вы решили сделать. Они не меняют игровые отметки и ничего не покупают.',
      actions: UI.save() });
    let mainCol = '';
    if (Store.status === 'unavailable') mainCol += UI.callout('warning', 'Сохранение недоступно', 'Браузер запрещает хранилище (приватный режим или запрет cookies). Задачи и отметки действуют до закрытия вкладки.', null, { role: 'status' });
    if (Store.status === 'error') mainCol += UI.callout('danger', 'Не удалось сохранить прогресс', 'Последнее изменение не записано и отменено на экране. Освободите место в хранилище браузера или проверьте его настройки.', '<button class="tn-btn tn-btn--sm" data-act="retry-save">' + icon('refresh', 'tn-icon--sm') + 'Проверить снова</button><button class="tn-btn tn-btn--ghost tn-btn--sm" data-act="export">Скачать копию</button>', { role: 'alert' });
    if (cur) {
      const si = stageInfo(cur);
      const tgt = lp && lp.href ? lp : { href: '/stage/' + cur, title: 'Этап ' + cur + ' · ' + IDX.stage.get(String(cur)).short };
      mainCol += '<div class="tn-card is-current"><div class="tn-section-title"><div><p class="tn-text-overline">Продолжить с того места</p><p class="tn-card__title tn-card__title--display">' + mask(tgt.title) + '</p>' +
        (si.nearest ? '<p class="tn-muted tn-small">Ближайшая цель этапа ' + cur + ': ' + UI.a('/stage/' + cur + '#goal-' + si.nearest.id, mask(si.nearest.title)) + '</p>' : '') + '</div><a class="tn-btn tn-btn--primary" href="' + link(tgt.href) + '">Продолжить' + icon('arrow-right', 'tn-icon--sm') + '</a></div>' +
        '<div class="tn-stageprog">' + UI.steps(si.doneMain, si.total) + '<span class="tn-faint tn-small">Этап ' + cur + ': ' + si.doneMain + ' из ' + si.total + ' ' + plural(si.total, ['цели', 'целей', 'целей']) + ' отмечено</span></div></div>';
    }
    if (!tasks.length) {
      mainCol += UI.empty('tasks', 'Задач пока нет', 'Добавляйте цели, покупки и недостающие условия кнопкой «Добавить в задачи». Они сохранятся в этом браузере.', cur ? '<a class="tn-btn tn-btn--primary" href="' + link('/stage/' + cur) + '">Открыть этап ' + cur + '</a>' : '<button class="tn-btn tn-btn--primary" data-act="change-stage">Выбрать текущий этап</button>');
    } else {
      mainCol += '<div class="tn-cluster" style="justify-content:space-between">' + UI.segmented('Группировка', [{ val: 'stage', label: 'По этапам', on: groupBy === 'stage' }, { val: 'type', label: 'По типу', on: groupBy === 'type' }], 'task-group') +
        '<label class="tn-check" style="padding:0" data-key="hide-done"><input type="checkbox" data-act="task-hide-done"' + (hideDone ? ' checked' : '') + '>Скрыть выполненные</label></div>';
      const groups = new Map();
      const TYPE = { goal: 'Цели этапов', cond: 'Условия доступа', purchase: 'Покупки', standing: 'Репутация', obtain: 'Получить предметы', farm: 'Сбор ресурсов', plan: 'Поздние режимы' };
      tasks.forEach(t => {
        let key, title;
        if (groupBy === 'type') { key = t.kind || 'other'; title = TYPE[key] || 'Другое'; }
        else if (t.group && t.group.startsWith('stage:')) { key = t.group; title = t.groupTitle; }
        else { key = t.group || 'other'; title = t.groupTitle || 'Другое'; }
        if (!groups.has(key)) groups.set(key, { title, items: [], order: t.stage || 99 });
        groups.get(key).items.push(t);
      });
      const sorted = [...groups.entries()].sort((a, b) => (a[1].order - b[1].order) || a[1].title.localeCompare(b[1].title, 'ru'));
      sorted.forEach(([key, g], gi) => {
        // внутри группы — сначала то, от чего зависят другие задачи (условие раньше покупки)
        const byId = new Map(g.items.map(t => [t.id, t])); const depth = new Map();
        const dep = (t, seen) => { if (depth.has(t.id)) return depth.get(t.id); if (seen.has(t.id)) return 0; seen.add(t.id); const ds = (t.dependsOn || []).map(id => byId.get(id)).filter(Boolean); const v = ds.length ? 1 + Math.max(...ds.map(x => dep(x, seen))) : 0; depth.set(t.id, v); return v; };
        g.items.forEach(t => dep(t, new Set()));
        g.items.sort((a, b) => depth.get(a.id) - depth.get(b.id));
        const items = hideDone ? g.items.filter(t => !t.done) : g.items;
        const dn = g.items.filter(t => t.done).length;
        if (!items.length) return;
        mainCol += '<section class="tn-taskgroup" aria-labelledby="tg-' + gi + '"><div class="tn-taskgroup__head"><h2 class="tn-taskgroup__title" id="tg-' + gi + '">' + mask(g.title) + '</h2><span class="tn-taskgroup__count">' + pl(g.items.length, ['задача', 'задачи', 'задач']) + (dn ? ' · ' + dn + ' ' + plural(dn, ['выполнена', 'выполнены', 'выполнено']) : '') + '</span><div class="tn-meter" role="img" aria-label="Выполнено ' + dn + ' из ' + g.items.length + '"><i style="width:' + Math.round(dn / g.items.length * 100) + '%"></i></div></div>' +
          items.map(t => this.row(t)).join('') + '</section>';
      });
      if (hideDone && !tasks.some(t => !t.done)) mainCol += UI.empty('check-circle', 'Все задачи выполнены', 'Выполненные скрыты фильтром.', '<button class="tn-btn" data-act="task-hide-done-off">Показать выполненные</button>');
    }
    // Отметки прогресса
    const facts = D.facts.filter(f => f.kind !== 'number');
    const factRow = f => { const v = Store.doc.facts[f.id]; const h = Spoil.hiddenStage(f.stage || 0, f.spoiler);
      return '<div class="tn-factrow"><span>' + (h ? '<span class="tn-faint">Скрытый сюжетный квест · этап ' + f.stage + '</span>' : UI.a('/quest/' + f.id, mask(f.name), 'tn-link tn-link--quiet')) + '</span><div class="tn-segmented tn-segmented--sm" role="group" aria-label="' + attr(h ? 'Скрытый квест, этап ' + f.stage : f.name) + '">' +
        [['yes', 'Да', v === true], ['no', 'Нет', v === false], ['unset', '—', v == null]].map(o => '<button aria-pressed="' + o[2] + '" data-act="fact-set" data-fact="' + f.id + '" data-v="' + o[0] + '" data-key="pf-' + f.id + '-' + o[0] + '" aria-label="' + ({ yes: 'выполнено', no: 'не выполнено', unset: 'не указано' }[o[0]]) + '">' + o[1] + '</button>').join('') + '</div></div>'; };
    const mr = Facts.get('mr');
    const progress = '<section class="tn-stack" id="progress"><h2 class="tn-text-h2">Отметки прогресса в игре</h2><p class="tn-muted">«—» — не указано. Не указано ≠ «нет». Выбор этапа и выполнение задач эти отметки не меняют.</p>' +
      '<div class="tn-card tn-stack"><div class="tn-factrow"><span>Ранг мастерства</span><span class="tn-cluster"><span class="tn-num">' + (mr != null ? mr : 'не указан') + '</span><button class="tn-btn tn-btn--sm" data-act="set-mr" data-key="set-mr">Указать</button></span></div>' +
      (() => { const marked = D.locations.filter(l => Store.doc.facts['open:' + l.id] != null).length;
        return '<details class="tn-factgroup" data-fg="planet"' + (this.openFacts.has('planet') ? ' open' : '') + '><summary data-key="fg-planet"><span class="tn-text-body-strong">Открытые планеты</span><span class="tn-faint tn-small">отмечено ' + marked + ' из ' + D.locations.length + '</span>' + icon('chevron-down', 'tn-icon--sm tn-factgroup__chev') + '</summary><div class="tn-factlist">' +
          D.locations.slice().sort((a, b) => Math.min(...a.stages) - Math.min(...b.stages)).map(l => { const e = entity('planet:' + l.id); const h = e.hidden; const v = Store.doc.facts['open:' + l.id];
            return '<div class="tn-factrow"><span>' + (h ? '<span class="tn-faint">Скрытое место · этап ' + Math.min(...l.stages) + '</span>' : UI.a('/planet/' + l.id, esc(l.name), 'tn-link tn-link--quiet')) + '</span><div class="tn-segmented tn-segmented--sm" role="group" aria-label="' + attr(h ? 'Скрытое место' : l.name) + ': открыта в игре">' +
              [['yes', 'Да', v === true], ['no', 'Нет', v === false], ['unset', '—', v == null]].map(o => '<button aria-pressed="' + o[2] + '" data-act="fact-set" data-fact="open:' + l.id + '" data-v="' + o[0] + '" data-key="pf-open-' + l.id + '-' + o[0] + '" aria-label="' + ({ yes: 'открыта', no: 'не открыта', unset: 'не указано' }[o[0]]) + '">' + o[1] + '</button>').join('') + '</div></div>'; }).join('') + '</div></details>'; })() +
      [['quest', 'Квесты'], ['junction', 'Переходы'], ['flag', 'Состояние аккаунта']].map(([k, t]) => { const list = facts.filter(f => f.kind === k).sort((a, b) => (a.stage || 0) - (b.stage || 0)); const marked = list.filter(f => Store.doc.facts[f.id] != null).length;
        return '<details class="tn-factgroup" data-fg="' + k + '"' + (this.openFacts.has(k) ? ' open' : '') + '><summary data-key="fg-' + k + '"><span class="tn-text-body-strong">' + t + '</span><span class="tn-faint tn-small">отмечено ' + marked + ' из ' + list.length + '</span>' + icon('chevron-down', 'tn-icon--sm tn-factgroup__chev') + '</summary><div class="tn-factlist">' + list.map(factRow).join('') + '</div></details>'; }).join('') +
      (() => { const marked = D.syndicates.filter(s => Store.doc.standing[s.id] && Store.doc.standing[s.id].rank != null).length;
        return '<details class="tn-factgroup" data-fg="synd"' + (this.openFacts.has('synd') ? ' open' : '') + '><summary data-key="fg-synd"><span class="tn-text-body-strong">Синдикаты</span><span class="tn-faint tn-small">указано ' + marked + ' из ' + D.syndicates.length + '</span>' + icon('chevron-down', 'tn-icon--sm tn-factgroup__chev') + '</summary><div class="tn-factlist">' +
        D.syndicates.map(s => { const st = Store.doc.standing[s.id]; return '<div class="tn-factrow"><span>' + UI.ref('syndicate:' + s.id, { cls: 'tn-link tn-link--quiet' }) + '</span><span class="tn-cluster"><span class="tn-faint tn-small">' + (st && st.rank != null ? 'ранг ' + st.rank + (st.value != null ? ', ' + fmt(st.value) : '') : 'не указан') + '</span><button class="tn-btn tn-btn--sm" data-act="set-standing" data-synd="' + s.id + '" data-key="ss-' + s.id + '">Указать</button></span></div>'; }).join('') + '</div></details>'; })() +
      '</div></section>';
    const aside = '<aside class="tn-stack tn-aside"><div class="tn-panel tn-stack"><p class="tn-text-overline">Настройки прогресса</p>' + UI.props([['Текущий этап', cur ? cur + ' · ' + esc(IDX.stage.get(String(cur)).short) : 'не выбран']]) +
      '<button class="tn-btn" data-act="change-stage" data-key="change-stage">' + (cur ? 'Изменить этап' : 'Выбрать этап') + '</button>' +
      UI.switch('set-spoilers', Spoil.on(), 'Защита от спойлеров', Spoil.on() ? 'Скрывать сведения после этапа ' + Spoil.threshold() : 'Выключена') + '</div>' +
      '<div class="tn-panel tn-stack" id="storage"><p class="tn-text-overline">Где хранится прогресс</p><p class="tn-muted tn-small">Только в этом браузере на этом устройстве. Очистка данных сайта удалит задачи и отметки. Синхронизации между устройствами нет — можно перенести файлом.</p>' +
      '<div class="tn-cluster"><button class="tn-btn tn-btn--sm" data-act="export">Скачать копию</button><button class="tn-btn tn-btn--sm" data-act="import">Загрузить из файла…</button></div>' +
      '<button class="tn-btn tn-btn--danger" data-act="reset-ask" data-key="reset">' + icon('trash') + 'Сбросить прогресс…</button></div></aside>';
    return '<div class="tn-container tn-page">' + head + '<div class="tn-layout2 tn-layout2--tasks"><div class="tn-stack tn-stack--lg">' + mainCol + progress + '</div>' + aside + '</div></div>';
  },
  row(t) {
    const blockers = taskBlockers(t);
    const blocked = blockers.length > 0 && !t.done;
    const ctx = [];
    if (t.ctx) ctx.push('<span>' + mask(t.ctx) + '</span>');
    if (blocked) ctx.push('<span class="tn-ready" data-state="locked">' + icon('lock') + 'После: ' + blockers.map(b => mask(b.title)).join(', ') + '</span>');
    const dependents = Store.doc.tasks.filter(x => !x.removed && !x.done && (x.dependsOn || []).includes(t.id));
    if (dependents.length && !t.done) ctx.push('<span>Нужна для: ' + dependents.map(d => mask(d.title)).join(', ') + '</span>');
    if (t.done) ctx.push('<span>Выполнено ' + fdate(t.doneAt || t.createdAt) + '</span>');
    else if (Date.now() - new Date(t.createdAt) < 60000) ctx.push('<span>Добавлено только что</span>');
    if (t.fact && t.done && Store.doc.facts[t.factKey || t.fact] !== true && !t.fact.startsWith('rank:')) ctx.push('<button class="tn-linkbtn tn-link" data-act="task-mark-fact" data-id="' + t.id + '">Отметить в прогрессе</button>');
    return '<div class="tn-task' + (Date.now() - new Date(t.createdAt) < 3000 ? ' is-new' : '') + '"' + (t.done ? ' data-done="true"' : '') + (blocked ? ' data-blocked="true"' : '') + ' data-key="task-' + t.id + '">' +
      '<label class="tn-check"><input type="checkbox" data-act="task-check" data-id="' + t.id + '"' + (t.done ? ' checked' : '') + (blocked ? ' disabled aria-label="' + attr('Выполнено: ' + maskPlain(t.title) + ' — недоступно до задачи выше') + '"' : ' aria-label="' + attr('Выполнено: ' + maskPlain(t.title)) + '"') + ' data-key="tc-' + t.id + '"></label>' +
      '<div><p class="tn-task__title">' + (t.href ? '<a href="' + link(t.href) + '">' + mask(t.title) + '</a>' : mask(t.title)) + '</p><div class="tn-task__ctx">' + ctx.join('') + '</div></div>' +
      '<button class="tn-btn tn-btn--ghost tn-btn--icon tn-btn--sm" data-act="task-menu" data-id="' + t.id + '" aria-label="' + attr('Действия с задачей «' + maskPlain(t.title) + '»') + '" aria-haspopup="true" data-key="tm-' + t.id + '">' + icon('more') + '</button></div>';
  }
};
const setQuery = (k, v) => { const q0 = current().query; if (v) q0.set(k, v); else q0.delete(k); try { history.replaceState(Object.assign({}, history.state), '', link(current().path + (q0.toString() ? '?' + q0 : ''))); } catch (e) {} rerender(); };
Actions['task-group'] = t => setQuery('group', t.dataset.val === 'type' ? 'type' : '');
Actions['task-hide-done'] = t => setQuery('hideDone', t.checked ? '1' : '');
Actions['task-hide-done-off'] = () => setQuery('hideDone', '');
Actions['retry-save'] = () => { const ok = Store.update(() => {}); if (ok === true) Toast.show({ tone: 'success', title: 'Сохранение снова работает', text: 'Сохранено в этом браузере.' }); else Toast.saveError(null, 'Хранилище по-прежнему отказывает.'); };
Actions['task-check'] = t => {
  const id = t.dataset.id; const on = t.checked;
  const task = Store.doc.tasks.find(x => x.id === id);
  if (on && taskBlockers(task).length) { t.checked = false; return; }
  const ok = commit(d => { const x = d.tasks.find(y => y.id === id); if (x) { x.done = on; x.doneAt = on ? new Date().toISOString() : null; } }, r => {
    announce(on ? 'Задача выполнена' : 'Отметка снята');
    if (!on) return;
    // выполнение задачи не меняет игровые отметки — предлагаем отдельным действием
    const fk = task.factKey || task.fact;
    const goal = task.ref && task.ref.startsWith('goal:') ? IDX.goal.get(task.ref.slice(5)) : null;
    if (goal) { commit(d => { d.done['goal:' + goal.id] = todayISO(); }, null); offerMarks(goal, 'Задача выполнена'); return; }
    if (fk && !fk.startsWith('rank:') && fk !== 'mr' && Store.doc.facts[fk] !== true) {
      const def = IDX.fact.get(fk);
      Toast.show({ tone: 'success', title: 'Задача выполнена', text: 'Игровая отметка не меняется сама. Отметить «' + (def ? markLabel(fk) : maskPlain(task.title)) + '» в прогрессе?', actions: [{ label: 'Отметить в прогрессе', fn: () => commit(d => { d.facts[fk] = true; }, rr => Toast.show({ tone: 'success', title: 'Отмечено в прогрессе', text: savedText(rr) })) }], ms: 10000 });
    } else if (task.kind === 'purchase') {
      Toast.show({ tone: 'success', title: 'Покупка отмечена выполненной', text: 'Репутация в навигаторе не списывается. Обновите запас репутации, если указывали его.', actions: task.href ? [] : [] });
    } else Toast.show({ tone: 'success', title: 'Задача выполнена', text: savedText(r) });
  });
  if (!ok) t.checked = !on;
};
Actions['task-mark-fact'] = t => { const task = Store.doc.tasks.find(x => x.id === t.dataset.id); const fk = task.factKey || task.fact; commit(d => { d.facts[fk] = true; }, r => Toast.show({ tone: 'success', title: 'Отмечено в прогрессе', text: savedText(r) })); };
Actions['task-menu'] = t => {
  const task = Store.doc.tasks.find(x => x.id === t.dataset.id); if (!task) return;
  const items = [];
  if (task.href) items.push('<a class="tn-menu__item" role="menuitem" href="' + link(task.href) + '" data-ov="close">' + icon('arrow-right') + '<span>Открыть<small>' + mask(task.title) + '</small></span></a>');
  if (task.stage) { const s = IDX.stage.get(String(task.stage)); if (s) items.push('<a class="tn-menu__item" role="menuitem" href="' + link('/?view=map&selected=' + s.focus) + '" data-ov="close">' + icon('map') + '<span>Показать на карте<small>Этап ' + task.stage + '</small></span></a>'); }
  items.push('<button class="tn-menu__item" role="menuitem" data-tm="remove">' + icon('trash') + '<span>Убрать из задач<small>Можно вернуть в течение 8 секунд</small></span></button>');
  const dlg = Overlay.dialog({ title: 'Действия с задачей', body: '<p class="tn-text-body-strong">' + mask(task.title) + '</p><div class="tn-stack tn-stack--sm" role="menu">' + items.join('') + '</div>', initialFocus: '[role="menuitem"]',
    onMount(box) { box.querySelector('[data-tm="remove"]').addEventListener('click', () => { Overlay.close(dlg, { noFocus: true }); removeTask(task.id); const n = document.querySelector('.tn-task [data-act="task-check"]'); if (n) n.focus(); }); } });
};

Screens.notFound = {
  nav: null,
  title() { return 'Страница не найдена'; },
  render() {
    return '<div class="tn-container tn-page" style="padding:48px 0 64px"><h1 class="tn-sr-only" id="page-h1" tabindex="-1">Страница не найдена</h1>' + UI.error('error', 'Страница не найдена', 'Возможно, ссылка устарела. Карта, справочник и ваши задачи на месте.', '<a class="tn-btn tn-btn--primary" href="' + link('/') + '">На карту</a><a class="tn-btn" href="' + link('/reference') + '">Справочник</a><button class="tn-btn tn-btn--ghost" data-act="open-search">Поиск</button>') + '</div>';
  }
};
