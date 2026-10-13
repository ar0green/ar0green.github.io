// Проверка: соло-сборки помещаются с Реактором/Катализатором и разумным числом форм (по расчёту сайта).
import fs from 'fs'; import vm from 'vm';
const root = new URL('../../', import.meta.url).pathname;
const ctx = { window: {}, UI: {}, TN: {}, attr: s => s, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(root + 'assets/data.js', 'utf8'), ctx);
vm.runInContext(fs.readFileSync(root + 'src/js/08-polarity.js', 'utf8') + '\nthis.polLayout = polLayout;', ctx);
const D = ctx.window.TN_DATA; const M = new Map(D.mods.map(m => [m.id, m])); const I = new Map(D.items.map(i => [i.id, i]));
let bad = 0;
const rows = D.builds.map(b => {
  const it = I.get(b.target); const isF = b.kind === 'warframe';
  const mi = id => { const m = id && M.get(id); return m && m.card ? { drain: m.drain0 + m.maxRank, pol: m.polc } : null; };
  const aura = b.aura && M.get(b.aura.mod); 
  const inp = base => ({ mods: b.slots.map(s => mi(s.mod)), innate: it.pol || [], ex: null, exInnate: isF ? it.exilusPol : null, aura: aura && aura.card ? { bonus: aura.drain0 + aura.maxRank, pol: aura.polc } : null, auraInnate: isF ? it.aura : null, base });
  const L30 = ctx.polLayout(inp(30)), L60 = ctx.polLayout(inp(60));
  const fit60 = L60.minForma.used <= L60.minForma.cap;
  const f60 = L60.innate.used <= L60.innate.cap ? 0 : L60.minForma.forma.length;
  if (!fit60 || f60 > 6) bad++;
  return [b.id, 'без: ' + L30.innate.used + '/' + L30.innate.cap, 'с удв.: ' + L60.innate.used + '/' + L60.innate.cap, 'форм с удв.: ' + (fit60 ? f60 : 'НЕ ПОМЕЩАЕТСЯ')].join(' | ');
});
console.log(rows.join('\n'));
console.log(bad ? 'Проблемных сборок: ' + bad : 'Все сборки помещаются (с удвоением, не больше 6 форм)');
process.exit(bad ? 1 : 0);
