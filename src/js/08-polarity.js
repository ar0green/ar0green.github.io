/* 08-polarity.js — полярности и формы (Warframe Wiki, «Polarity», 13.10.2026):
   мод в слоте совпадающей полярности стоит вдвое меньше (с округлением вверх), в слоте другой полярности — на 25% больше
   (с округлением вверх). Аура/стойка: совпадение удваивает прибавку вместимости, несовпадение — 80% с округлением вниз.
   Полярность «любая» (Aura/Omni) совпадает со всеми, кроме Умбры. Слот без полярности — стоимость как на карточке.
   Мод можно поставить в любой слот, поэтому встроенные полярности раскладываются так, чтобы стоимость была минимальной. */
const POLS = {
  V: { ru: 'Мадурай', g: 'V' }, D: { ru: 'Вазарин', g: 'D' }, '-': { ru: 'Нарамон', g: '—' }, '=': { ru: 'Зенурик', g: '=' },
  R: { ru: 'Унайру', g: 'R' }, Y: { ru: 'Пенджага', g: 'Y' }, U: { ru: 'Умбра', g: 'Ω' }, '*': { ru: 'любая (кроме Умбры)', g: '✱' }
};
const polRel = (slot, mod) => !slot || !mod ? 'none' : slot === '*' ? (mod === 'U' ? 'mismatch' : 'match') : slot === mod ? 'match' : 'mismatch';
const polDrain = (d, rel) => rel === 'match' ? Math.ceil(d / 2) : rel === 'mismatch' ? Math.ceil(d * 1.25) : d;
const polBonus = (b, rel) => rel === 'match' ? b * 2 : rel === 'mismatch' ? Math.floor(b * 0.8) : b;

/**
 * Раскладка сборки.
 * mods: массив из 8 элементов { drain, pol } | null (пустой слот);
 * innate: встроенные полярности обычных слотов; ex: { drain, pol } | null; exInnate; aura: { bonus, pol } | null; auraInnate; base: 30 | 60.
 * Возвращает { innate: L, minForma: L, fullForma: L }, где L = { pols[8], exPol, auraPol, used, cap, forma: [{ slot, from, to }] }.
 */
function polLayout(o) {
  const n = o.mods.length;
  const cost = (pols, exPol, auraPol) => {
    let used = 0;
    o.mods.forEach((m, i) => { if (m) used += polDrain(m.drain, polRel(pols[i], m.pol)); });
    if (o.ex) used += polDrain(o.ex.drain, polRel(exPol, o.ex.pol));
    const cap = o.base + (o.aura ? polBonus(o.aura.bonus, polRel(auraPol, o.aura.pol)) : 0);
    return { used, cap };
  };
  // 1. Встроенные полярности — перебор размещений (их не больше 4)
  const innate = (o.innate || []).filter(Boolean);
  let best = null;
  const place = (k, pols, usedSlots) => {
    if (k === innate.length) {
      const c = cost(pols, o.exInnate || null, o.auraInnate || null);
      if (!best || c.used < best.used) best = { pols: pols.slice(), used: c.used, cap: c.cap };
      return;
    }
    for (let i = 0; i < n; i++) { if (usedSlots[i]) continue; usedSlots[i] = true; pols[i] = innate[k]; place(k + 1, pols, usedSlots); pols[i] = null; usedSlots[i] = false; }
  };
  place(0, new Array(n).fill(null), new Array(n).fill(false));
  const L0 = { pols: best.pols, exPol: o.exInnate || null, auraPol: o.auraInnate || null, used: best.used, cap: best.cap, forma: [] };
  // 2. Формы: жадно берём слот с наибольшим выигрышем
  const step = L => {
    let pick = null;
    o.mods.forEach((m, i) => {
      if (!m || polRel(L.pols[i], m.pol) === 'match') return;
      const gain = polDrain(m.drain, polRel(L.pols[i], m.pol)) - Math.ceil(m.drain / 2);
      if (gain > 0 && (!pick || gain > pick.gain)) pick = { slot: i, gain, to: m.pol, from: L.pols[i] };
    });
    if (o.ex && polRel(L.exPol, o.ex.pol) !== 'match') { const gain = polDrain(o.ex.drain, polRel(L.exPol, o.ex.pol)) - Math.ceil(o.ex.drain / 2); if (gain > 0 && (!pick || gain > pick.gain)) pick = { slot: 'ex', gain, to: o.ex.pol, from: L.exPol }; }
    if (o.aura && polRel(L.auraPol, o.aura.pol) !== 'match') { const gain = o.aura.bonus * 2 - polBonus(o.aura.bonus, polRel(L.auraPol, o.aura.pol)); if (gain > 0 && (!pick || gain > pick.gain)) pick = { slot: 'aura', gain, to: o.aura.pol, from: L.auraPol }; }
    if (!pick) return null;
    const N = { pols: L.pols.slice(), exPol: L.exPol, auraPol: L.auraPol, forma: L.forma.concat([{ slot: pick.slot, from: pick.from, to: pick.to }]) };
    if (pick.slot === 'ex') N.exPol = pick.to; else if (pick.slot === 'aura') N.auraPol = pick.to; else N.pols[pick.slot] = pick.to;
    Object.assign(N, cost(N.pols, N.exPol, N.auraPol));
    return N;
  };
  let minF = L0;
  while (minF.used > minF.cap) { const N = step(minF); if (!N) break; minF = N; }
  let full = minF;
  for (;;) { const N = step(full); if (!N) break; full = N; }
  return { innate: L0, minForma: minF, fullForma: full };
}

/** Значок полярности: глиф + скрытое название для экранных дикторов */
UI.pol = (code, opts) => {
  if (!code) return '<span class="tn-pol tn-pol--none" title="Без полярности"><span class="tn-sr-only">без полярности</span></span>';
  const p = POLS[code] || { ru: code, g: code };
  return '<span class="tn-pol' + (opts && opts.state ? ' tn-pol--' + opts.state : '') + '" data-pol="' + attr(code) + '" title="' + attr(p.ru) + '" aria-hidden="' + (opts && opts.decor ? 'true' : 'false') + '"><span aria-hidden="true">' + p.g + '</span><span class="tn-sr-only">' + p.ru + '</span></span>';
};
UI.polList = (list, empty) => (list && list.filter(Boolean).length) ? '<span class="tn-pollist">' + list.filter(Boolean).map(c => UI.pol(c)).join('') + '</span>' : '<span class="tn-faint">' + (empty || 'нет') + '</span>';
TN.polLayout = polLayout;
