// Источники сведений. Каждое изменчивое значение (цена, ранг, условие доступа, шанс) ссылается на ключ отсюда.
// checked — дата фактической проверки на этом сайте. Для гайда — дата проверки, указанная его автором.
export const SITE_CHECKED = '2026-10-12';
export const GUIDE = {
  title: 'Гайд «Warframe от пробуждения Тенно до эндгейма» v3',
  short: 'гайд v3',
  checked: '2026-10-10',
  note: 'Механики проверены автором гайда 10.10.2026; учитывает обновление 44.1.1 и The Icebind.'
};

const W = (page, extra) => Object.assign({ url: 'https://wiki.warframe.com/w/' + page, lang: 'en', title: 'Warframe Wiki — ' + page.replace(/_/g, ' ').replace(/%27/g, "'"), checked: SITE_CHECKED }, extra || {});
const R = (page, extra) => Object.assign({ url: 'https://ru.wiki.warframe.com/w/' + page, lang: 'ru', title: 'Warframe Wiki (рус.) — ' + page.replace(/_/g, ' '), checked: SITE_CHECKED }, extra || {});

// w:* — англоязычная Wiki, r:* — русская Wiki; все открыты и сверены 12.10.2026
export const sources = {
  'w:The_New_War': W('The_New_War'),
  'w:Angels_of_the_Zariman': W('Angels_of_the_Zariman'),
  'w:Whispers_in_the_Walls': W('Whispers_in_the_Walls'),
  'w:Veilbreaker': W('Veilbreaker'),
  'w:The_Duviri_Paradox': W('The_Duviri_Paradox'),
  'w:Arbitrations': W('Arbitrations'),
  'w:The_Steel_Path': W('The_Steel_Path'),
  'w:Helminth': W('Helminth'),
  'w:Syndicates': W('Syndicates'),
  'w:The_Holdfasts': W('The_Holdfasts'),
  'w:Cavia': W('Cavia'),
  'w:Bird_3': W('Bird_3'),
  'w:Cavalero': W('Cavalero'),
  'w:Warframe_Augment_Mods': W('Warframe_Augment_Mods'),
  'w:Kahls_Garrison': W("Kahl%27s_Garrison"),
  'w:Ironclad_Charge': W('Ironclad_Charge'),
  'w:Mesmer_Shield': W('Mesmer_Shield'),
  'w:Capacitance': W('Capacitance'),
  'w:Fused_Reservoir': W('Fused_Reservoir'),
  'w:Scattered_Justice': W('Scattered_Justice'),
  'w:Despoil': W('Despoil'),
  'w:Pilfering_Strangledome': W('Pilfering_Strangledome'),
  'w:Infiltrate': W('Infiltrate'),
  'w:Safeguard': W('Safeguard'),
  'w:Rhino': W('Rhino'),
  'w:Hek': W('Hek'),
  'w:Xoris': W('Xoris'),
  'w:Nataruk': W('Nataruk'),
  'w:Laetum': W('Laetum'),
  'w:Revenant': W('Revenant'),
  'w:The_Second_Dream': W('The_Second_Dream'),
  'w:The_War_Within': W('The_War_Within'),
  'w:Prelude_to_War': W('Prelude_to_War'),
  'w:Heart_of_Deimos': W('Heart_of_Deimos'),
  'w:Rising_Tide': W('Rising_Tide'),
  'w:Chains_of_Harrow': W('Chains_of_Harrow'),
  'w:Palladino': W('Palladino'),
  'w:Void_Relic_Math': W('Void_Relic/Math', { title: 'Warframe Wiki — Void Relic/Math' }),
  'w:Cephalon_Simaris': W('Cephalon_Simaris'),
  'w:The_Icebind': W('The_Icebind'),
  'w:Update_44': W('Update_44'),
  'w:Deep_Archimedea': W('Deep_Archimedea'),
  'w:Temporal_Archimedea': W('Temporal_Archimedea'),
  'w:Netracells': W('Netracells'),
  'w:Archon_Hunt': W('Archon_Hunt'),
  'w:The_Circuit': W('The_Circuit'),
  'w:Quests': W('Quests'),
  'w:The_Deadlock_Protocol': W('The_Deadlock_Protocol'),
  'w:The_Lotus_Eaters': W('The_Lotus_Eaters'),
  'w:The_Old_Peace': W('The_Old_Peace'),
  'w:The_Hex_Quest': W('The_Hex_(Quest)', { title: 'Warframe Wiki — The Hex (Quest)' }),
  'w:Orokin_Vault': W('Orokin_Vault'),
  // Карточки модов на русской Wiki: стоимость (вместимость) на ранге 0, максимальный ранг, полярность, эффект
  'r:mods': { url: 'https://ru.wiki.warframe.com/w/Моды', lang: 'ru', title: 'Warframe Wiki (рус.) — карточки модов', checked: SITE_CHECKED }
};
export const ruWiki = R;
export const enWiki = W;
