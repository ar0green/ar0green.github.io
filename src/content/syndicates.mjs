// Синдикаты, независимые группы и продавцы. Ранг синдиката открывает товар; репутация — валюта покупки.
// Это разные вещи: «ранг 5» не означает «есть 25 000 репутации».
// ranks — верхние границы репутации по рангам (только если сверены по Wiki).

const FACTION_RANKS = { src: 'w:Syndicates', max: { '-2': 0, '-1': 0, 0: 5000, 1: 22000, 2: 44000, 3: 70000, 4: 99000, 5: 132000 }, min: { '-2': -44000, '-1': -22000, 0: -5000 }, lo: -2, hi: 5 };
const SIX_RANKS = (src) => ({ src, max: { 0: 5000, 1: 22000, 2: 44000, 3: 70000, 4: 99000, 5: 132000 }, lo: 0, hi: 5 });

export const syndicates = [
  // ── Шесть соперничающих синдикатов ─────────────────
  { id: 'steel-meridian', name: 'Стальной Меридиан', short: 'СМ', kind: 'faction', where: 'Реле и консоль Орбитера', wiki: 'Стальной_Меридиан', ranks: FACTION_RANKS,
    allied: ['red-veil'], opposed: ['new-loka'], enemy: ['perrin'], vendor: 'steel-meridian', stage: 2,
    use: 'Переменная Справедливость для обычного Хека; улучшения Рино, Коры и Нэчжи.' },
  { id: 'red-veil', name: 'Красная Вуаль', short: 'КВ', kind: 'faction', where: 'Реле и консоль Орбитера', wiki: 'Красная_Вуаль', ranks: FACTION_RANKS,
    allied: ['steel-meridian'], opposed: ['cephalon-suda'], enemy: ['arbiters'], vendor: 'red-veil', stage: 2,
    use: 'Улучшения Некроса, Коры, Вольта и Эша.' },
  { id: 'arbiters', name: 'Арбитры Гексиса', short: 'АГ', kind: 'faction', where: 'Реле и консоль Орбитера', wiki: 'Арбитры_Гексиса', ranks: FACTION_RANKS,
    allied: ['cephalon-suda'], opposed: ['perrin'], enemy: ['red-veil'], vendor: 'arbiters', stage: 2,
    use: 'Улучшения Вольта и Эша; оружие Телос. Магазин Наград Арбитража — отдельный и репутации не требует.' },
  { id: 'cephalon-suda', name: 'Цефалон Суда', short: 'ЦС', kind: 'faction', where: 'Реле и консоль Орбитера', wiki: 'Цефалон_Суда', ranks: FACTION_RANKS,
    allied: ['arbiters'], opposed: ['red-veil'], enemy: ['new-loka'], vendor: 'cephalon-suda', stage: 2,
    use: 'Улучшения Ревенанта, Висп, Ивары и Нэчжи.' },
  { id: 'perrin', name: 'Последовательность Перрина', short: 'ПП', kind: 'faction', where: 'Реле и консоль Орбитера', wiki: 'Последовательность_Перрина', ranks: FACTION_RANKS,
    allied: ['new-loka'], opposed: ['arbiters'], enemy: ['steel-meridian'], vendor: 'perrin', stage: 2,
    use: 'Улучшения Рино, Ревенанта, Некроса и Ивары.' },
  { id: 'new-loka', name: 'Новая Лока', short: 'НЛ', kind: 'faction', where: 'Реле и консоль Орбитера', wiki: 'Новая_Лока', ranks: FACTION_RANKS,
    allied: ['perrin'], opposed: ['steel-meridian'], enemy: ['cephalon-suda'], vendor: 'new-loka', stage: 2,
    use: 'В том числе улучшения Висп; оружие Санкти.' },
  // ── Независимые группы ─────────────────────────────
  { id: 'entrati', name: 'Энтрати', short: 'ЭН', kind: 'group', where: 'Некралиск, Деймос', loc: 'deimos', wiki: 'Энтрати', vendor: 'son', stage: 2,
    use: 'К рангу мастерства 8 и 3-му рангу — сегмент Гельминта у Сына; у Сына также моды Связи.', standingHow: 'Жетоны, прежде всего за заказы Матери; сдавать нужную часть Бабушке.' },
  { id: 'necraloid', name: 'Некралоид', short: 'НК', kind: 'group', where: 'Некралиск, Деймос', loc: 'deimos', wiki: 'Некралоид', stage: 5,
    use: 'Части и улучшения некрамеха; репутация — за матрицы из Изолированных хранилищ.' },
  { id: 'ostron', name: 'Острон', short: 'ОС', kind: 'group', where: 'Цетус, Земля', loc: 'earth', wiki: 'Острон', stage: 2,
    use: 'Зо, инструменты и моды компаньонов (Мастер Тисонай — Разнородная Связь); развивать под конкретную покупку.' },
  { id: 'quills', name: 'Перья', short: 'ПР', kind: 'group', where: 'Цетус, Земля (Онкко)', loc: 'earth', wiki: 'Перья', stage: 3,
    use: 'Первый модульный усилитель Оператора и мистификаторы; со 2-го ранга — квест «Маска Ревенанта».' },
  { id: 'solaris', name: 'Объединение Солярис', short: 'ОБ', kind: 'group', where: 'Фортуна, Венера', loc: 'venus', wiki: 'Объединение_Солярис', stage: 2,
    use: 'Моды Связи (Бизнес), Китганы; 5-й ранг нужен для ограбления Сферы Извлечения Прибыли.' },
  { id: 'vox-solaris', name: 'Глас Солярис', short: 'ГС', kind: 'group', where: 'Фортуна, Венера (Уточка)', loc: 'venus', wiki: 'Глас_Солярис', stage: 3,
    use: 'Поздние части усилителей и мистификаторы Оператора; репутация за тороиды.' },
  { id: 'holdfasts', name: 'Неукротимые', short: 'НУ', kind: 'group', where: 'Хризалит, Зариман', loc: 'zariman', wiki: 'Неукротимые', vendor: 'cavalero', ranks: SIX_RANKS('w:The_Holdfasts'), stage: 6,
    use: 'Оригинальное Инкарнон-оружие, мистификаторы и адаптер усилителя; один из главных поздних приоритетов.' },
  { id: 'cavia', name: 'Кавия', short: 'КА', kind: 'group', where: 'Санктум Анатомика', loc: 'sanctum', wiki: 'Кавия', vendor: 'bird3', ranks: SIX_RANKS('w:Cavia'), stage: 6,
    use: 'Мистификаторы ближнего боя, адаптеры и недельный осколок; 5-й ранг открывает Глубинную Архимедию.' },
  { id: 'hex', name: 'Гекс', short: 'ГК', kind: 'group', where: 'Хёльвания', loc: 'hollvania', wiki: 'Гекс', spoiler: true, stage: 7, vendor: 'eleanor',
    use: 'Мистификаторы, чертежи и поздние усиления; 5-й ранг нужен для Временной Архимедии.' },
  { id: 'simaris', name: 'Цефалон Симэрис', short: 'СИ', kind: 'group', where: 'Реле', wiki: 'Цефалон_Симэрис', vendor: 'simaris', stage: 2,
    use: 'Симулякрум, специальные моды, улучшения сканера и повторные чертежи квестовых вещей. Репутация — за сканирование и задания Симэриса; присяга её не заменяет.' },
  { id: 'kahl', name: 'Гарнизон Кахла', short: 'ГК', kind: 'garrison', where: 'Гарнизон Кахла', wiki: 'Гарнизон_Кахла', vendor: 'chipper', spoiler: true, stage: 6,
    ranks: { src: 'w:Kahls_Garrison', lo: 0, hi: 5, rankOnly: true },
    use: 'Ранг растёт от недельных заданий Кахла, а не от ежедневной репутации; архонтовые моды — с 3-го ранга за Запас.' }
];

// Продавцы и предложения. cost — в валюте продавца; rank — требуемый ранг группы; limit — ограничение.
// why — «Почему полезно» (рекомендация редакции по гайду); reco — рекомендуем.
const AUG = (item, why) => ({ item, rank: 5, cost: 25000, reco: !!why, why });
const commonFaction = [
  { label: 'Моды-улучшения конкретного оружия', rank: 4, cost: 25000, costNote: 'обычно', why: 'Сначала нужный мод: например, Переменная Справедливость для обычного Хека.', src: 'guide' },
  { label: 'Моды-улучшения способностей варфрейма', rank: 5, cost: 25000, src: 'w:Warframe_Augment_Mods', why: 'Меняют работу способности; выбирайте под сборку, а не весь ассортимент.' },
  { label: 'Оружие синдиката: вторичное', rank: 5, cost: 100000, src: 'guide' },
  { label: 'Оружие синдиката: основное и ближнего боя', rank: 5, cost: 125000, src: 'guide' },
  { label: 'Чертёж оружейного адаптера Эксилус', rank: 5, cost: 75000, src: 'guide', why: 'Позднее: вспомогательный слот обычно менее важен, чем восемь основных.' },
  { label: 'Набор из трёх реликвий', rank: 2, cost: 20000, src: 'w:Syndicates', why: 'Удобный способ потратить излишки после обязательных покупок.' },
  { label: 'Чертежи больших групповых восстановителей', rank: 3, cost: 25000, costNote: 'обычно', src: 'guide' },
  { label: 'Набор из 200 единиц Восфора', rank: 5, cost: 30000, src: 'guide', why: 'Переработка излишков в случайные мистификаторы — после целевых покупок.' }
];

export const vendors = [
  { id: 'steel-meridian', name: 'Предложения Стального Меридиана', syndicate: 'steel-meridian', where: 'Реле, консоль Орбитера', currency: 'репутация', stage: 2,
    offers: [
      { item: 'scattered-justice', rank: 4, cost: 25000, reco: true, why: 'Ключевой мод сборки обычного Хека: +200% к мультивыстрелу.', src: 'w:Scattered_Justice' },
      AUG('ironclad-charge', 'Броня за попадания Рывком — полезно перед Железной кожей.'),
      AUG('pilfering-strangledome'), AUG('safeguard'), ...commonFaction] },
  { id: 'red-veil', name: 'Предложения Красной Вуали', syndicate: 'red-veil', where: 'Реле, консоль Орбитера', currency: 'репутация', stage: 2,
    offers: [AUG('despoil', 'Удобно для сбора ресурсов Некросом при наличии лечения.'), AUG('pilfering-strangledome'), AUG('capacitance'), ...commonFaction] },
  { id: 'arbiters', name: 'Предложения Арбитров Гексиса', syndicate: 'arbiters', where: 'Реле, консоль Орбитера', currency: 'репутация', stage: 2,
    offers: [AUG('capacitance', 'Восстановление щитов через Разряд при наличии целей.'), ...commonFaction] },
  { id: 'cephalon-suda', name: 'Предложения Цефалон Суды', syndicate: 'cephalon-suda', where: 'Реле, консоль Орбитера', currency: 'репутация', stage: 2,
    offers: [AUG('mesmer-shield', 'Дополнительные защитные заряды Ревенанта; помогает и отряду.'), AUG('fused-reservoir'), AUG('infiltrate'), AUG('safeguard'), ...commonFaction] },
  { id: 'perrin', name: 'Предложения Последовательности Перрина', syndicate: 'perrin', where: 'Реле, консоль Орбитера', currency: 'репутация', stage: 2,
    offers: [AUG('ironclad-charge'), AUG('mesmer-shield', 'Дополнительные защитные заряды Ревенанта.'), AUG('despoil'), AUG('infiltrate'), ...commonFaction] },
  { id: 'new-loka', name: 'Предложения Новой Локи', syndicate: 'new-loka', where: 'Реле, консоль Орбитера', currency: 'репутация', stage: 2,
    offers: [AUG('fused-reservoir'), ...commonFaction] },
  { id: 'son', name: 'Сын', syndicate: 'entrati', where: 'Некралиск, Деймос', loc: 'deimos', currency: 'репутация Энтрати', stage: 2,
    offers: [
      { item: 'helminth-segment', label: 'Чертёж сегмента Гельминта', rank: 3, cost: 15000, reco: true, extraReq: [{ f: 'mr', min: 8 }], why: 'Перенос способностей между варфреймами; отдельный сегмент — для архонтовых осколков.', src: 'w:Helminth' },
      { item: 'link-duplex', rank: 3, cost: 20000, src: 'guide' }] },
  { id: 'cavalero', name: 'Кавальеро', syndicate: 'holdfasts', where: 'Хризалит, Зариман', loc: 'zariman', currency: 'репутация Неукротимых', stage: 6, spoiler: true,
    offers: [
      { item: 'laetum', label: 'Чертёж Летума', rank: 0, cost: 3000, reco: true, why: 'Сильный ранний приоритет на Заримане; пользоваться — с ранга мастерства 14.', extraReq: [{ f: 'mr', min: 14 }], src: 'w:Cavalero' },
      { item: 'innodem', label: 'Чертёж Иннодема', rank: 1, cost: 5500, src: 'w:Cavalero' },
      { item: 'phenmor', label: 'Чертёж Фенмора', rank: 2, cost: 6000, src: 'w:Cavalero', why: 'Вместе с Прадосом помогает выполнить условие пятой эволюции Летума.' },
      { item: 'felarx', label: 'Чертёж Феларкса', rank: 3, cost: 8000, src: 'w:Cavalero' },
      { item: 'praedos', label: 'Чертёж Прадоса', rank: 4, cost: 9000, src: 'w:Cavalero' },
      { item: 'arc-eternal-eradicate', label: 'Вечное Искоренение', rank: 1, cost: 5000, src: 'w:Cavalero' },
      { label: 'Вечный Натиск', rank: 2, cost: 5500, src: 'w:Cavalero' },
      { item: 'arc-molt', label: 'Линька: Улучшение', rank: 5, cost: 10000, reco: true, why: 'Сила способностей растёт по мере убийств; полный ранг — 21 копия (210 000).', src: 'w:Cavalero' },
      { label: 'Адаптер мистификатора усилителя', rank: 5, cost: 20000, why: 'Открывает второй слот мистификатора усилителя.', src: 'w:Cavalero' }] },
  { id: 'bird3', name: 'Птичка-3', syndicate: 'cavia', where: 'Санктум Анатомика', loc: 'sanctum', currency: 'репутация Кавии', stage: 6, spoiler: true,
    offers: [
      { label: 'Чертёж коалесцентного сегмента Гельминта', rank: 2, cost: 30000, src: 'w:Bird_3', why: 'Для смешивания архонтовых осколков, когда это действительно нужно сборке.' },
      { label: 'Адаптер мистификатора ближнего боя', rank: 3, cost: 50000, src: 'w:Bird_3', why: 'Для выбранного оружия; также бывает среди наград Ячеек Нетры.' },
      { item: 'arc-melee-influence', label: 'Влияние Ближнего Боя', rank: 4, cost: 7500, reco: true, why: 'Целевая покупка под подходящее оружие и условие активации.', src: 'w:Bird_3' },
      { label: 'Обнаружение Ближнего Боя', rank: 4, cost: 7500, src: 'guide' },
      { item: 'archon-shard', label: 'Недельный архонтовый осколок', rank: 5, cost: 30000, limit: 'Одна покупка в неделю; цвет меняется', reco: true, why: 'Полезный постоянный расход репутации.', src: 'w:Bird_3' }] },
  { id: 'eleanor', name: 'Элеонора', syndicate: 'hex', where: 'Хёльвания', loc: 'hollvania', currency: 'репутация Гекса', stage: 7, spoiler: true,
    offers: [{ label: 'Мистификаторы', cost: 7500, costNote: 'за копию', rankNote: 'разные требования к рангу', src: 'guide', why: 'Берите конкретный эффект для готовой сборки.' }] },
  { id: 'simaris', name: 'Цефалон Симэрис', syndicate: 'simaris', where: 'Реле', currency: 'репутация Симэриса', stage: 2,
    offers: [
      { label: 'Ключ Симулякрума', cost: 50000, src: 'w:Cephalon_Simaris', why: 'Удобен для проверки сборок; окончательную оценку делайте в настоящей миссии.' },
      { label: 'Преобразование Энергии', cost: 100000, src: 'w:Cephalon_Simaris' },
      { label: 'Преобразование Здоровья', cost: 100000, src: 'w:Cephalon_Simaris' },
      { label: 'Улучшение сканера «Солнечная батарея» (Sol-Battery)', cost: 50000, src: 'w:Cephalon_Simaris', why: 'По гайду избавляет от покупки зарядов сканера; Wiki на 12.10.2026 эффект не описывает.' },
      { item: 'nataruk', label: 'Чертёж Натарука', cost: 100000, extraReq: [{ f: 'quest:new-war' }], src: 'w:Cephalon_Simaris' },
      { item: 'revenant', label: 'Основной чертёж Ревенанта', cost: 50000, extraReq: [{ f: 'quest:mask-revenant' }], src: 'w:Cephalon_Simaris' }] },
  // ── Магазины за отдельные валюты ──────────────────
  { id: 'arbitration-honors', name: 'Награды Арбитража', where: 'Комната Арбитров Гексиса на любом Реле', currency: 'Эссенция Витус', currencyItem: 'vitus', stage: 4,
    note: 'Присяга Арбитрам Гексиса и положительная репутация у них не требуются.', access: [{ f: 'junction:pluto-eris' }],
    offers: [
      { item: 'galvanized-chamber', cost: 20, reco: true, why: 'Мод мультивыстрела для основного типа оружия — первая покупка.', src: 'w:Arbitrations' },
      { item: 'galvanized-diffusion', cost: 20, reco: true, why: 'Мультивыстрел для пистолетов, в том числе Летума.', src: 'w:Arbitrations' },
      { item: 'galvanized-shot', cost: 20, src: 'w:Arbitrations' },
      { item: 'galvanized-aptitude', cost: 20, src: 'w:Arbitrations' },
      { item: 'galvanized-scope', cost: 20, src: 'w:Arbitrations' },
      { item: 'galvanized-crosshairs', cost: 20, src: 'w:Arbitrations' },
      { item: 'galvanized-steel', cost: 20, src: 'w:Arbitrations' },
      { item: 'galvanized-reflex', cost: 20, src: 'w:Arbitrations' },
      { item: 'galvanized-elementalist', cost: 20, src: 'w:Arbitrations' },
      { label: 'Гальванизированный Ад, Оглушение, Ускорение (дробовики)', cost: 20, src: 'w:Arbitrations' },
      { item: 'rolling-guard', cost: 20, reco: true, why: 'Аварийная неуязвимость и очищение статусов после переката.', src: 'r:mods' }] },
  { id: 'teshin', name: 'Тешин: предложения Стального пути', where: 'Реле', currency: 'Эссенция Стали', currencyItem: 'steel-essence', stage: 4, access: [{ f: 'flag:steel-path' }],
    note: 'Отдельный магазин от Конклава; репутация Конклава не нужна.',
    offers: [
      { label: 'Адаптеры мистификаторов основного и вторичного оружия', reco: true, why: 'Сначала нужные адаптеры и приоритетные недельные товары.', src: 'guide' },
      { label: 'Кува и недельные предложения', src: 'guide', why: 'Не тратьте всё на Куву до подготовки оружия.' }] },
  { id: 'chipper', name: 'Чиппер', syndicate: 'kahl', where: 'Гарнизон Кахла', currency: 'Запас', currencyItem: 'stock', stage: 6, spoiler: true, access: [{ f: 'quest:veilbreaker' }],
    offers: ['archon-stretch', 'archon-vitality', 'archon-continuity', 'archon-flow', 'archon-intensify'].map(item => ({ item, rank: 3, cost: 40, src: 'w:Kahls_Garrison' })),
    note: 'Осколки Архонта Чиппер больше не продаёт: с обновления 35.5 недельный осколок — у Птички-3.' },
  { id: 'palladino', name: 'Палладино', where: 'Железная Цитадель, Земля', loc: 'earth', currency: 'Осколки Разлома', currencyItem: 'riven-sliver', stage: 3, access: [{ f: 'quest:chains-of-harrow' }],
    offers: [
      { item: 'riven', label: 'Закрытый мод разлома', cost: 10, limit: 'Две покупки в неделю', src: 'w:Palladino', why: 'Попутный источник модов разлома для оружия нужной категории.' },
      { label: 'Шифр закрытого мода разлома', cost: 10, limit: 'Раз в неделю', src: 'w:Palladino' }] },
  { id: 'baro', name: 'Баро Ки\'Тиир', where: 'Реле (приезжает на ограниченное время)', currency: 'дукаты и кредиты', currencyItem: 'ducats', stage: 3,
    note: 'Набор вещей меняется; заранее проверьте ценность сдаваемых Прайм-частей.',
    offers: [{ item: 'primed-continuity', costText: '350 дукатов и 110 000 кредитов', src: 'r:mods', note: 'цена по Wiki на 12.10.2026; есть не в каждый приезд' }, { item: 'primed-flow' }, { item: 'primed-pistol-gambit' }] }
];
