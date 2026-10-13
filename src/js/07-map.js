/* 07-map.js — звёздная карта. Отрисовка перенесена из TN.renderMap (bundle.js): SVG связей + HTML-кнопки планет.
   Добавлено: масштаб 50–200% (шаг 25%), перетаскивание, перелёт камеры к выбранной планете,
   клавиатура (Tab — в порядке маршрута, стрелки — к связанной планете, Enter — выбор, Esc — снять выбор, + − 0). */
const PROG = { locked: 'закрыта', available: 'впереди по маршруту', current: 'текущий этап', done: 'открыта' };
const BADGE = { locked: 'lock', available: 'unlock', current: 'target', done: 'check' };
/** Видимый диаметр планет (px при масштабе 1) — как в игровой Навигации: газовые гиганты крупнее, луны мельче */
const PLANET_PX = { xl: 72, lg: 48, md: 38, sm: 30, xs: 20 };
/** Декоративные орбиты навигационной сетки (полуоси по X в координатах карты) */
const NAV_ORBITS = [110, 190, 275, 365, 455, 545, 640];

const MapView = {
  zoom: 1, tx: 0, ty: 0, base: null, el: null, selected: null, onSelect: null, avail: null, drag: null,
  model() {
    const cur = Store.doc.stage;
    const T = Spoil.threshold();
    const planets = D.locations.map(l => {
      const progress = planetProgress(l);
      const hidden = Spoil.hiddenStage(Math.min(...l.stages), l.spoiler);
      const st = l.stages;
      let meta = st.length > 1 ? 'Этапы ' + st.slice(0, -1).join(', ') + ' и ' + st[st.length - 1] : 'Этап ' + st[0];
      if (progress === 'current') meta = 'Этап ' + cur + ' · Вы здесь';
      return { id: l.id, name: l.name, orb: l.orb, x: l.x, y: l.y, size: l.size, progress, hidden, meta, stage: planetStage(l) };
    });
    const edges = D.edges.map(e => {
      let type;
      const k = e.kind === 'main' ? 'required' : e.kind === 'branch' ? 'optional' : 'return';
      if (!cur) type = e.stage <= 2 ? k : 'inactive';
      else if (e.stage < cur) type = e.kind === 'return' ? 'return' : 'done';
      else if (e.stage === cur || e.stage === cur + 1) type = k;
      else type = 'inactive';
      return Object.assign({}, e, { type, current: false });
    });
    // Текущий путь: связь, ведущая в фокус текущего этапа
    if (cur) {
      const s = IDX.stage.get(String(cur));
      const into = edges.find(e => e.to === s.focus && e.stage === cur) || edges.find(e => e.to === s.focus && e.stage <= cur);
      if (into) { into.current = true; if (into.type === 'done' || into.type === 'inactive') into.type = 'required'; }
    }
    return { width: D.map.width, height: D.map.height, sun: D.map.sun, tilt: D.map.tilt, planets, edges };
  },
  render(el, opts) {
    this.el = el; this.onSelect = opts.onSelect; this.selected = opts.selected || null;
    const m = this.model();
    const W = m.width, H = m.height, sx = m.sun[0], sy = m.sun[1], pos = {}, size = {};
    m.planets.forEach(p => { pos[p.id] = [p.x, p.y]; size[p.id] = PLANET_PX[p.size] || PLANET_PX.sm; });
    // Навигационная сетка в духе игровой карты: наклонённые эллиптические орбиты вокруг солнца и лучи от центра
    const tilt = m.tilt || 0.52;
    let grid = '<g class="tn-navgrid">';
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 8, dx = Math.cos(a) * 1500, dy = Math.sin(a) * 1500 * tilt;
      grid += '<line class="tn-navgrid__spoke" x1="' + (sx - dx).toFixed(1) + '" y1="' + (sy - dy).toFixed(1) + '" x2="' + (sx + dx).toFixed(1) + '" y2="' + (sy + dy).toFixed(1) + '"/>';
    }
    NAV_ORBITS.forEach((r, i) => { grid += '<ellipse class="tn-orbit tn-navgrid__orbit" cx="' + sx + '" cy="' + sy + '" rx="' + r + '" ry="' + (r * tilt).toFixed(1) + '"/>'; });
    grid += '</g>';
    let svg = '<svg class="tn-map__svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true"><defs>' +
      '<marker id="tn-ar-required" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="var(--tn-color-route-required)"/></marker>' +
      '<marker id="tn-ar-optional" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 9 5 0 9" fill="none" stroke="var(--tn-color-route-optional)" stroke-width="1.6"/></marker>' +
      '<marker id="tn-ar-done" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="var(--tn-color-route-done)"/></marker>' +
      '<marker id="tn-ar-return" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1 9 5 0 9" fill="none" stroke="var(--tn-color-text-tertiary)" stroke-width="1.6"/></marker></defs>' + grid;
    m.edges.forEach(e => {
      const a = pos[e.from], b = pos[e.to], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
      const g1 = (size[e.from] / 2 + 10) / d, g2 = (size[e.to] / 2 + 12) / d;
      const x1 = a[0] + dx * g1, y1 = a[1] + dy * g1, x2 = b[0] - dx * g2, y2 = b[1] - dy * g2;
      // дуга всегда выгибается от солнца — линии идут «по орбите», а не в случайную сторону
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, nx = -dy / d, ny = dx / d;
      const side = (nx * (mx - sx) + ny * (my - sy)) >= 0 ? 1 : -1;
      const k = Math.min(0.14, 60 / d) * d * side, cx = mx + nx * k, cy = my + ny * k;
      const linked = this.selected && (e.from === this.selected || e.to === this.selected);
      const dim = this.selected && !linked && !e.current ? ' is-dimmed' : '';
      // стрелки — только у шагов, которые предстоит сделать; пройденное и фоновое — без стрелок
      const mk = e.type === 'required' || e.type === 'optional' ? ' marker-end="url(#tn-ar-' + e.type + ')"' : '';
      svg += '<path class="tn-edge tn-edge--' + e.type + (e.current ? ' is-current-path' : '') + (linked ? ' is-linked' : '') + dim + '" data-from="' + e.from + '" data-to="' + e.to + '" d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '"' + mk + '/>';
    });
    svg += '</svg>';
    let btns = '';
    m.planets.forEach(p => {
      const name = p.hidden ? 'Скрытая планета' : p.name;
      btns += '<button class="tn-planet tn-planet--nav" data-size="' + (p.size || 'sm') + '" data-planet="' + p.id + '" style="left:' + (p.x / W * 100).toFixed(2) + '%;top:' + (p.y / H * 100).toFixed(2) + '%" data-progress="' + p.progress + '"' + (p.hidden ? ' data-spoiler="hidden"' : '') +
        ' aria-pressed="' + (this.selected === p.id) + '" aria-label="' + name + ', этап ' + p.stage + ', ' + PROG[p.progress] + '">' +
        '<span class="tn-planet__name">' + name + '</span>' +
        '<span class="tn-planet__body"><span class="tn-orb tn-orb--' + p.orb + '"></span><span class="tn-planet__ring"></span><span class="tn-planet__badge">' + icon(p.hidden && p.progress === 'locked' ? 'eye-off' : BADGE[p.progress]) + '</span></span>' +
        '<span class="tn-planet__meta">' + p.meta + '</span></button>';
    });
    el.innerHTML = '<div class="tn-map__stars"></div><div class="tn-map__nebula" aria-hidden="true"></div><div class="tn-map__layer" data-tn-selectgroup style="aspect-ratio:' + W + '/' + H + '">' +
      '<div class="tn-map__sun" aria-hidden="true" style="left:' + (sx / W * 100).toFixed(2) + '%;top:' + (sy / H * 100).toFixed(2) + '%"></div>' + svg + btns + '</div>';
    this.layer = el.querySelector('.tn-map__layer');
    this.layout(opts);
    this.bind();
  },
  /** Размещение слоя в доступной области (слева от панели, под блоком контекста) */
  layout(opts) {
    opts = opts || this.lastOpts || {};
    this.lastOpts = opts;
    const r = this.el.getBoundingClientRect();
    const full = { x: 24, y: 24, w: r.width - 48, h: r.height - 48 };
    const got = opts.avail ? opts.avail(r) : { fit: full, view: full };
    const av = got.fit;
    this.avail = got.view;
    const ratio = D.map.width / D.map.height;
    let w = Math.min(av.w, av.h * ratio);
    if (opts.minWidth) w = Math.max(w, opts.minWidth);
    const h = w / ratio;
    this.base = { x: av.x + (av.w - w) / 2, y: av.y + Math.max(0, (av.h - h) / 2), w, h };
    Object.assign(this.layer.style, { left: this.base.x + 'px', top: this.base.y + 'px', width: w + 'px' });
    // размеры планет и подписей следуют за масштабом карты, но в разумных пределах
    this.layer.style.setProperty('--k', Math.max(0.72, Math.min(1.15, w / D.map.width)).toFixed(3));
    this.apply(true);
  },
  apply(instant) {
    if (!this.layer) return;
    this.layer.style.transition = instant ? 'none' : '';
    this.layer.style.transform = 'translate(' + this.tx + 'px,' + this.ty + 'px) scale(' + this.zoom + ')';
    const z = document.querySelector('[data-zoom-label]'); if (z) z.textContent = Math.round(this.zoom * 100) + '%';
  },
  setZoom(z, center) {
    z = Math.max(0.5, Math.min(2, Math.round(z * 4) / 4));
    const c = center || { x: this.avail.x + this.avail.w / 2, y: this.avail.y + this.avail.h / 2 };
    // точка под центром остаётся на месте
    const lx = (c.x - this.base.x - this.tx) / this.zoom, ly = (c.y - this.base.y - this.ty) / this.zoom;
    this.zoom = z;
    this.tx = c.x - this.base.x - lx * z; this.ty = c.y - this.base.y - ly * z;
    this.apply(false);
    announce('Масштаб ' + Math.round(z * 100) + '%');
  },
  /** Центрировать планету в доступной области */
  centerOn(id, instant, onlyIfHidden) {
    const p = IDX.planet.get(id); if (!p || !this.base) return;
    const px = p.x / D.map.width * this.base.w, py = p.y / D.map.height * this.base.h;
    if (onlyIfHidden) {
      // планета уже видна целиком (с подписью) — карту не двигаем, чтобы не терять ориентир
      const sx = this.base.x + this.tx + px * this.zoom, sy = this.base.y + this.ty + py * this.zoom, a = this.avail;
      if (sx - 70 >= a.x && sx + 70 <= a.x + a.w && sy - 50 >= a.y && sy + 70 <= a.y + a.h) return;
      // сдвигаем ровно настолько, чтобы планета с подписью вышла из-под панелей, — без «перелёта» всей карты
      const mx = 110, my = 90;
      let ddx = 0, ddy = 0;
      if (sx - mx < a.x) ddx = a.x - (sx - mx); else if (sx + mx > a.x + a.w) ddx = (a.x + a.w) - (sx + mx);
      if (sy - my < a.y) ddy = a.y - (sy - my); else if (sy + my > a.y + a.h) ddy = (a.y + a.h) - (sy + my);
      if (Math.abs(ddx) < a.w / 2 && Math.abs(ddy) < a.h / 2) { this.tx += ddx; this.ty += ddy; this.apply(instant || reduceMotion() || Store.doc.settings.staticMap); return; }
    }
    const cx = this.avail.x + this.avail.w / 2, cy = this.avail.y + this.avail.h / 2;
    this.tx = cx - this.base.x - px * this.zoom; this.ty = cy - this.base.y - py * this.zoom;
    this.apply(instant || reduceMotion() || Store.doc.settings.staticMap);
  },
  reset() { this.zoom = 1; this.tx = 0; this.ty = 0; this.apply(false); },
  select(id, opts) {
    this.selected = id;
    $$('.tn-planet', this.el).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.planet === id)));
    $$('.tn-edge', this.el).forEach(p => { const l = !!id && (p.dataset.from === id || p.dataset.to === id); p.classList.toggle('is-linked', l); p.classList.toggle('is-dimmed', !!id && !l && !p.classList.contains('is-current-path')); });
    if (id && !(opts && opts.noCamera)) this.centerOn(id, false, true);
  },
  bind() {
    const el = this.el;
    // Перетаскивание — дополнительный способ, не единственный
    el.onpointerdown = e => {
      if (e.target.closest('.tn-planet') || e.button !== 0) return;
      this.drag = { x: e.clientX, y: e.clientY, tx: this.tx, ty: this.ty, moved: false };
      el.setPointerCapture(e.pointerId);
    };
    el.onpointermove = e => {
      if (!this.drag) return;
      const dx = e.clientX - this.drag.x, dy = e.clientY - this.drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) this.drag.moved = true;
      this.tx = this.drag.tx + dx; this.ty = this.drag.ty + dy; this.apply(true);
    };
    el.onpointerup = () => { this.drag = null; };
    el.onwheel = e => {
      if (!e.ctrlKey && Math.abs(e.deltaY) < 4) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      this.setZoom(this.zoom + (e.deltaY < 0 ? 0.25 : -0.25), { x: e.clientX - r.left, y: e.clientY - r.top });
    };
    el.onkeydown = e => {
      const b = e.target.closest('.tn-planet');
      if (!b) return;
      const dirs = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (dirs[e.key]) {
        e.preventDefault();
        const from = IDX.planet.get(b.dataset.planet);
        const linked = D.edges.filter(x => x.from === from.id || x.to === from.id).map(x => x.from === from.id ? x.to : x.from);
        const [dx, dy] = dirs[e.key];
        let best = null, bestScore = Infinity;
        linked.forEach(id => {
          const p = IDX.planet.get(id); const vx = p.x - from.x, vy = p.y - from.y;
          const along = vx * dx + vy * dy; if (along <= 0) return;
          const across = Math.abs(vx * dy - vy * dx);
          const score = along + across * 2;
          if (score < bestScore) { bestScore = score; best = id; }
        });
        if (best) { const t = el.querySelector('[data-planet="' + best + '"]'); if (t) t.focus(); }
      }
    };
    el.onclick = e => {
      const b = e.target.closest('.tn-planet');
      if (!b) return;
      if (this.onSelect) this.onSelect(b.dataset.planet, b);
    };
  }
};
TN.MapView = MapView;
