// Моды. Числа карточки (полярность, вместимость на ранге 0, максимальный ранг, редкость, эффект на максимуме)
// сверены по карточкам русской Warframe Wiki 12.10.2026 (card: true); 13.10.2026 сверены с Module:Mods/data англ. Wiki —
// при расхождении взяты значения англ. Wiki (у шести модов на рус. Wiki была устаревшая базовая стоимость). Где карточку не открывали — card: false и прочерки.
// Вместимость на ранге r = drain0 + r (для ауры это прибавка вместимости).
// family: normal | corrupted | galvanized | archon | primed | augment | nightmare | sixty | companion | umbra | riven

const DROP = { id: 'drop', title: 'Обычная добыча и награды', kind: 'drop',
  steps: [{ k: 'source', text: 'Выпадает с врагов и в наградах обычной карты. Гайд советует проверять источник конкретного мода в Wiki — точные места и шансы здесь не приводятся.', wikiCheck: true }] };

const VAULT = { id: 'vault', title: 'Хранилище Орокин на Деймосе', kind: 'drop', recommended: true, src: 'w:Orokin_Vault',
  steps: [
    { k: 'access', text: 'Многоразовые чертежи ключей Дракона исследованы в Лаборатории Орокин клана', req: [{ f: 'flag:clan-orokin-lab' }] },
    { k: 'craft', text: 'Изготовить ключи и добавить их в снаряжение; в одиночку можно взять все четыре, но штрафы суммируются' },
    { k: 'source', text: 'Миссия заброшенных кораблей Деймоса, удобный вариант — Horend, Захват', loc: 'deimos' },
    { k: 'obtain', text: 'Открыть особую дверь подходящим ключом, забрать артефакт и успешно эвакуироваться — выдаётся случайный повреждённый мод' },
    { k: 'install', text: 'После фарма убрать ключи из снаряжения: забытые штрафы — частая причина внезапно слабой сборки' }
  ] };

const ARBI = { id: 'arbitration', title: 'Магазин Наград Арбитража за Эссенцию Витус', kind: 'vendor', recommended: true, src: 'w:Arbitrations',
  steps: [
    { k: 'access', text: 'Арбитражи открыты задачей перехода Плутон → Эрида', req: [{ f: 'junction:pluto-eris' }] },
    { k: 'source', text: 'Эссенция Витус — награда за ротации Арбитража и с дронов Арбитража', link: 'activity:arbitrations' },
    { k: 'currency', text: '20 Эссенции Витус за мод' },
    { k: 'obtain', text: 'Комната Арбитров Гексиса на любом Реле — отдельный магазин; присяга и репутация Гексиса не нужны', link: 'vendor:arbitration-honors' }
  ] };

const syndAug = (vendors, srcKey, rank) => ({ id: 'syndicate', title: 'Покупка у синдиката', kind: 'vendor', recommended: true, src: srcKey,
  steps: [
    { k: 'access', text: 'Присяга одному из продавцов и ' + (rank || 5) + '-й ранг', req: [{ f: 'mr', min: 3, label: 'Ранг мастерства 3 — для присяги синдикату' }] },
    { k: 'currency', text: '25 000 репутации синдиката' },
    { k: 'obtain', text: 'Предложения синдиката: консоль на Орбитере или комната синдиката на Реле', vendors },
    { k: 'install', text: 'Мод-улучшение занимает обычный слот; без присяги его можно получить обменом' }
  ] });

const SIXTY = (where, src) => ({ id: 'sixty', title: where.title, kind: 'drop', recommended: true, src,
  steps: [{ k: 'source', text: where.text, loc: where.loc }, { k: 'obtain', text: 'Проверьте уровень миссии и таблицу наград на странице мода: не всякая миссия даёт нужный мод' }] });

const NIGHTMARE = { id: 'nightmare', title: 'Миссии Кошмара', kind: 'drop', steps: [{ k: 'source', text: 'Миссии Кошмара с подходящей таблицей наград' }] };

const BARO = (price) => ({ id: 'baro', title: 'Баро Ки\'Тиир или обмен', kind: 'vendor', steps: [
  { k: 'source', text: 'Баро Ки\'Тиир регулярно приезжает на Реле на ограниченное время; набор товаров меняется', link: 'vendor:baro' },
  { k: 'currency', text: price || 'Дукаты и кредиты' },
  { k: 'obtain', text: 'Или купить у игрока: налог 1 млн кредитов за Прайм-мод на стороне покупателя' }] });

const CHIPPER = { id: 'chipper', title: 'Чиппер, Гарнизон Кахла', kind: 'vendor', recommended: true, src: 'w:Kahls_Garrison',
  steps: [
    { k: 'access', text: 'Пройден «Срывающий Вуаль»', req: [{ f: 'quest:veilbreaker' }] },
    { k: 'access', text: '3-й ранг Гарнизона: растёт от недельных заданий Кахла, до максимума — четыре недели', req: [{ f: 'rank:kahl', min: 3 }] },
    { k: 'currency', text: '40 Запаса за мод — за задания Кахла и их дополнительные условия' },
    { k: 'obtain', text: 'Магазин Чиппера', link: 'vendor:chipper' }
  ] };

export const mods = [
  // ── Варфрейм: основа ─────────────────────────────────
  { id: 'vitality', name: 'Живучесть', en: 'Vitality', cat: 'warframe', family: 'normal', polarity: 'Вазарин', drain0: 2, maxRank: 10, rarity: 'common', effect: '+100% к здоровью', card: true, stage: 1, ways: [DROP] },
  { id: 'steel-fiber', name: 'Стальное Волокно', en: 'Steel Fiber', cat: 'warframe', family: 'normal', polarity: 'Вазарин', drain0: 4, maxRank: 10, rarity: 'common', effect: '+100% к броне', card: true, stage: 1, ways: [DROP] },
  { id: 'intensify', name: 'Усиление', en: 'Intensify', cat: 'warframe', family: 'normal', polarity: 'Мадурай', drain0: 6, maxRank: 5, rarity: 'rare', effect: '+30% к силе способностей', card: true, stage: 1, ways: [DROP], stat: { key: 'str', v: 30 } },
  { id: 'streamline', name: 'Обтекаемость', en: 'Streamline', cat: 'warframe', family: 'normal', polarity: 'Нарамон', drain0: 4, maxRank: 5, rarity: 'rare', effect: '+30% к эффективности способностей', card: true, stage: 1, ways: [DROP], stat: { key: 'eff', v: 30 } },
  { id: 'continuity', name: 'Непрерывность', en: 'Continuity', cat: 'warframe', family: 'normal', polarity: 'Мадурай', drain0: 2, maxRank: 5, rarity: 'rare', effect: '+30% к длительности способностей', card: true, stage: 1, ways: [DROP], stat: { key: 'dur', v: 30 } },
  { id: 'stretch', name: 'Растяжение', en: 'Stretch', cat: 'warframe', family: 'normal', polarity: 'Нарамон', drain0: 4, maxRank: 5, rarity: 'uncommon', effect: '+45% к радиусу способностей', card: true, stage: 1, ways: [DROP], stat: { key: 'rng', v: 45 } },
  { id: 'flow', name: 'Поток', en: 'Flow', cat: 'warframe', family: 'normal', polarity: 'Нарамон', drain0: 4, maxRank: 5, rarity: 'rare', effect: '+100% к запасу энергии', card: true, stage: 1, ways: [DROP],
    note: 'Увеличивает запас, но не создаёт энергию.' },
  { id: 'equilibrium', name: 'Равновесие', en: 'Equilibrium', cat: 'warframe', family: 'normal', polarity: 'Нарамон', drain0: 4, maxRank: 10, rarity: 'uncommon', effect: 'Сферы здоровья дают 110 энергии, сферы энергии — 110 здоровья', card: true, stage: 1, ways: [DROP] },
  { id: 'steel-charge', name: 'Стальной Натиск', en: 'Steel Charge', cat: 'aura', family: 'normal', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'uncommon', effect: '+60% к урону ближнего боя всего отряда', card: true, stage: 1, ways: [DROP], aura: true,
    note: 'Аура добавляет вместимость: +4 на ранге 0, +9 на максимуме.' },
  { id: 'energy-siphon', name: 'Энергетический Источник', en: 'Energy Siphon', cat: 'aura', family: 'normal', polarity: 'Нарамон', drain0: 2, maxRank: 5, rarity: 'uncommon', effect: '+0,6 энергии в секунду', card: true, stage: 2, ways: [DROP], aura: true,
    note: 'Аура добавляет вместимость: +2 на ранге 0, +7 на максимуме.' },
  { id: 'augur-secrets', name: 'Секреты Предвестника', en: 'Augur Secrets', cat: 'warframe', family: 'normal', polarity: 'Нарамон', drain0: 2, maxRank: 5, rarity: 'rare', effect: '+24% к силе способностей', card: true, stage: 4, ways: [DROP], stat: { key: 'str', v: 24 } },
  { id: 'transient-fortitude', name: 'Кратковременное Усиление', en: 'Transient Fortitude', cat: 'warframe', family: 'corrupted', polarity: 'Мадурай', drain0: 6, maxRank: 10, rarity: 'rare', effect: '+55% к силе способностей, −27,5% к длительности', card: true, stage: 2, ways: [VAULT], stat: { key: 'str', v: 55, dur: -27.5 } },
  { id: 'blind-rage', name: 'Слепая Ярость', cat: 'warframe', family: 'corrupted', en: 'Blind Rage', polarity: 'Мадурай', drain0: 6, maxRank: 10, rarity: 'rare', effect: '+99% к силе способностей, −55% к эффективности', card: true, stage: 2, ways: [VAULT] },
  { id: 'fleeting-expertise', name: 'Мимолётное Мастерство', cat: 'warframe', family: 'corrupted', en: 'Fleeting Expertise', polarity: 'Нарамон', drain0: 6, maxRank: 5, rarity: 'rare', effect: '+60% к эффективности, −60% к длительности', card: true, stage: 2, ways: [VAULT] },
  { id: 'narrow-minded', name: 'Упрощённое Мышление', cat: 'warframe', family: 'corrupted', en: 'Narrow Minded', polarity: 'Вазарин', drain0: 6, maxRank: 10, rarity: 'rare', effect: '+99% к длительности, −66% к радиусу', card: true, stage: 2, ways: [VAULT] },
  { id: 'overextended', name: 'Перенапряжение', cat: 'warframe', family: 'corrupted', en: 'Overextended', polarity: 'Вазарин', drain0: 6, maxRank: 5, rarity: 'rare', effect: '+90% к радиусу, −60% к силе способностей', card: true, stage: 2, ways: [VAULT] },
  { id: 'rolling-guard', name: 'Защитный Перекат', en: 'Rolling Guard', cat: 'warframe', family: 'normal', polarity: 'Вазарин', drain0: 2, maxRank: 10, rarity: 'rare', effect: '3 с неуязвимости и очищение статусов после переката; перезарядка 7 с', card: true, stage: 4, ways: [ARBI],
    note: 'Покупается за Эссенцию Витус; Адаптация — награда Арбитражей. Источники различаются.' },
  { id: 'adaptation', name: 'Адаптация', cat: 'warframe', family: 'normal', en: 'Adaptation', polarity: 'Вазарин', drain0: 2, maxRank: 10, rarity: 'rare', effect: 'При получении урона: +10% сопротивления этому типу урона на 20 с, до 90%', card: true, stage: 4,
    ways: [{ id: 'arb-reward', title: 'Награда Арбитражей', kind: 'drop', steps: [{ k: 'access', text: 'Арбитражи открыты', req: [{ f: 'junction:pluto-eris' }] }, { k: 'source', text: 'Награды Арбитражей', link: 'activity:arbitrations' }] }] },
  { id: 'primed-continuity', name: 'Непрерывность Прайм', en: 'Primed Continuity', cat: 'warframe', family: 'primed', polarity: 'Мадурай', drain0: 4, maxRank: 10, rarity: 'legendary', effect: '+55% к длительности способностей', card: true, stage: 4,
    ways: [BARO('350 дукатов и 110 000 кредитов — цена по Wiki на 12.10.2026')], stat: { key: 'dur', v: 55 } },
  { id: 'primed-flow', name: 'Поток Прайм', en: 'Primed Flow', cat: 'warframe', family: 'primed', polarity: 'Нарамон', drain0: 4, maxRank: 10, rarity: 'legendary', effect: '+185% к запасу энергии', card: true, stage: 4, ways: [BARO()] },
  // ── Моды-улучшения способностей ─────────────────────
  { id: 'mesmer-shield', name: 'Щит Месмера', en: 'Mesmer Shield', cat: 'warframe', family: 'augment', polarity: 'Зенурик', drain0: 6, maxRank: 3, rarity: 'rare', card: true, stage: 4, for: 'revenant',
    effect: 'Усиливает Чешую Месмера; союзники рядом получают защитные заряды', ways: [syndAug(['cephalon-suda', 'perrin'], 'w:Mesmer_Shield')] },
  { id: 'ironclad-charge', name: 'Нерушимый Рывок', en: 'Ironclad Charge', cat: 'warframe', family: 'augment', card: false, stage: 4, for: 'rhino',
    effect: 'Временно повышает броню Рино за каждого врага, задетого Рывком', ways: [syndAug(['steel-meridian', 'perrin'], 'w:Ironclad_Charge')] },
  { id: 'despoil', name: 'Лишение', cat: 'warframe', family: 'augment', en: 'Despoil', polarity: 'Зенурик', drain0: 6, maxRank: 3, rarity: 'rare', card: true, stage: 4, for: 'nekros',
    effect: '«Осквернение» тратит 10 здоровья за труп вместо энергии', ways: [syndAug(['red-veil', 'perrin'], 'w:Despoil')] },
  { id: 'pilfering-strangledome', name: 'Ворующий Удушающий Купол', en: 'Pilfering Strangledome', cat: 'warframe', family: 'augment', card: false, stage: 4, for: 'khora',
    effect: 'Враги в куполе с шансом дают дополнительную добычу (до 65% на максимуме)', ways: [syndAug(['steel-meridian', 'red-veil'], 'w:Pilfering_Strangledome')] },
  { id: 'fused-reservoir', name: 'Смешанный Резервуар', en: 'Fused Reservoir', cat: 'warframe', family: 'augment', card: false, stage: 4, for: 'wisp',
    effect: 'Объединённый резервуар со всеми тремя эффектами; на 200% дороже по энергии', ways: [syndAug(['cephalon-suda', 'new-loka'], 'w:Fused_Reservoir')] },
  { id: 'infiltrate', name: 'Проникновение', en: 'Infiltrate', cat: 'warframe', family: 'augment', card: false, stage: 4, for: 'ivara',
    effect: 'Прохождение защитных барьеров в невидимости; удобно для Шпионажа', ways: [syndAug(['cephalon-suda', 'perrin'], 'w:Infiltrate')] },
  { id: 'safeguard', name: 'Защитные Меры', en: 'Safeguard', cat: 'warframe', family: 'augment', card: false, stage: 4, for: 'nezha',
    effect: 'Охранный ореол можно накладывать на союзников, но он слабее', ways: [syndAug(['cephalon-suda', 'steel-meridian'], 'w:Safeguard')] },
  { id: 'capacitance', name: 'Конденсатор', en: 'Capacitance', cat: 'warframe', family: 'augment', card: false, stage: 4, for: 'volt',
    effect: 'Часть урона Разряда превращается в щиты Вольта и отряда', ways: [syndAug(['arbiters', 'red-veil'], 'w:Capacitance')] },
  // ── Архонтовые моды ─────────────────────────────────
  { id: 'archon-stretch', name: 'Архонтовое Растяжение', cat: 'warframe', family: 'archon', card: false, stage: 6, ways: [CHIPPER], effect: 'Способности с Электро восстанавливают энергию' },
  { id: 'archon-vitality', name: 'Архонтовая Живучесть', cat: 'warframe', family: 'archon', card: false, stage: 6, ways: [CHIPPER], effect: 'Дополнительные статусы Огня от способностей' },
  { id: 'archon-continuity', name: 'Архонтовая Непрерывность', cat: 'warframe', family: 'archon', card: false, stage: 6, ways: [CHIPPER], effect: 'Статусы Токсина от способностей дополнительно накладывают Коррозию' },
  { id: 'archon-flow', name: 'Архонтовый Поток', cat: 'warframe', family: 'archon', card: false, stage: 6, ways: [CHIPPER], effect: 'Убийство способностью с уроном Холодом может создать сферу энергии' },
  { id: 'archon-intensify', name: 'Архонтовое Усиление', cat: 'warframe', family: 'archon', card: false, stage: 6, ways: [CHIPPER], effect: 'Лечение способностью временно повышает силу способностей' },

  // ── Дробовик (Хек) ──────────────────────────────────
  { id: 'point-blank', name: 'В Упор', en: 'Point Blank', cat: 'shotgun', family: 'normal', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'uncommon', effect: '+90% к базовому урону', card: true, stage: 2, ways: [DROP] },
  { id: 'hells-chamber', name: 'Адский Патронник', en: "Hell's Chamber", cat: 'shotgun', family: 'normal', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'rare', effect: '+120% к мультивыстрелу', card: true, stage: 2, ways: [DROP] },
  { id: 'scattered-justice', name: 'Переменная Справедливость', en: 'Scattered Justice', cat: 'shotgun', family: 'augment', polarity: 'Мадурай', drain0: 4, maxRank: 3, rarity: 'rare', effect: '+200% к мультивыстрелу и эффект «Справедливость»', card: true, stage: 4, for: 'hek',
    compat: 'Хек и Кува Хек; Вэйкор Хек не подходит (Wiki, 12.10.2026). Гайд осторожнее и не советует переносить совместимость на варианты — проверьте своё оружие.',
    ways: [{ id: 'meridian', title: 'Стальной Меридиан, 4-й ранг', kind: 'vendor', recommended: true, src: 'w:Scattered_Justice',
      steps: [
        { k: 'access', text: 'Присяга Стальному Меридиану и 4-й ранг — оружейные улучшения открываются раньше, чем улучшения способностей', req: [{ f: 'rank:steel-meridian', min: 4 }] },
        { k: 'currency', text: '25 000 репутации Стального Меридиана' },
        { k: 'obtain', text: 'Предложения Стального Меридиана', link: 'vendor:steel-meridian' },
        { k: 'install', text: 'Установить на обычный Хек; без присяги — обмен с игроком' }
      ] }] },
  { id: 'shotgun-barrage', name: 'Выстрел Дробовика', en: 'Shotgun Barrage', cat: 'shotgun', family: 'normal', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'uncommon', effect: '+90% к скорострельности', card: true, stage: 2, ways: [DROP] },
  { id: 'toxic-barrage', name: 'Токсичный Шквал', en: 'Toxic Barrage', cat: 'shotgun', family: 'sixty', polarity: 'Мадурай', drain0: 4, maxRank: 3, rarity: 'rare', effect: '+60% к урону Токсином и +60% к шансу статуса', card: true, stage: 3,
    ways: [SIXTY({ title: 'Порабощённый Вор', text: 'Порабощённый Вор на высокоуровневых миссиях Бездны (по Wiki — 25% с него)', loc: 'void' })] },
  { id: 'contagious-spread', name: 'Заразный Разброс', en: 'Contagious Spread', cat: 'shotgun', family: 'normal', polarity: 'Нарамон', drain0: 4, maxRank: 5, rarity: 'uncommon', effect: '+90% к урону Токсином', card: true, stage: 2, ways: [DROP] },
  { id: 'frigid-blast', name: 'Холодный Взрыв', en: 'Frigid Blast', cat: 'shotgun', family: 'sixty', polarity: 'Мадурай', drain0: 4, maxRank: 3, rarity: 'rare', effect: '+60% к урону Холодом и +60% к шансу статуса', card: true, stage: 3,
    ways: [SIXTY({ title: 'Шпионаж уровня 3', text: 'Шпионаж Крепости Кувы (уровень 3) с вскрытием трёх хранилищ', loc: 'kuva' })] },
  { id: 'chilling-grasp', name: 'Ледяное Прикосновение', en: 'Chilling Grasp', cat: 'shotgun', family: 'normal', polarity: 'Вазарин', drain0: 2, maxRank: 5, rarity: 'uncommon', effect: '+90% к урону Холодом', card: true, stage: 2, ways: [DROP] },
  { id: 'blaze', name: 'Пламя', en: 'Blaze', cat: 'shotgun', family: 'nightmare', polarity: 'Мадурай', drain0: 6, maxRank: 3, rarity: 'rare', effect: '+60% к базовому урону и +60% к урону Огнём', card: true, stage: 3, ways: [NIGHTMARE],
    note: 'Если «Пламени» нет, поставьте доступный мод урона Огнём.' },
  // ── Винтовки и лук (Натарук) ────────────────────────
  { id: 'serration', name: 'Зазубрины', en: 'Serration', cat: 'rifle', family: 'normal', polarity: 'Мадурай', drain0: 4, maxRank: 10, rarity: 'uncommon', effect: '+165% к базовому урону', card: true, stage: 1, ways: [DROP] },
  { id: 'split-chamber', name: 'Раздельный Патронник', en: 'Split Chamber', cat: 'rifle', family: 'normal', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'rare', effect: '+90% к мультивыстрелу', card: true, stage: 2, ways: [DROP] },
  { id: 'point-strike', name: 'Точечный Удар', en: 'Point Strike', cat: 'rifle', family: 'normal', polarity: 'Мадурай', drain0: 2, maxRank: 5, rarity: 'common', effect: '+150% к шансу критического удара', card: true, stage: 1, ways: [DROP] },
  { id: 'vital-sense', name: 'Чутьё На Уязвимости', en: 'Vital Sense', cat: 'rifle', family: 'normal', polarity: 'Мадурай', drain0: 2, maxRank: 5, rarity: 'rare', effect: '+120% к критическому урону', card: true, stage: 2, ways: [DROP] },
  { id: 'hunter-munitions', name: 'Боеприпасы Охотника', en: 'Hunter Munitions', cat: 'rifle', family: 'normal', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'uncommon', effect: '30% шанс кровотечения (Разрез) при критах', card: true, stage: 3,
    ways: [{ id: 'ghouls', title: 'Заказы «Истребление Гулей» или обмен', kind: 'drop', steps: [{ k: 'source', text: 'Противники события «Истребление Гулей» (по Wiki: Gull-Grimace Alpha 11,05%, Hemocyte 10,53%); событие периодическое' }, { k: 'obtain', text: 'Или купить у игрока' }] }] },
  { id: 'malignant-force', name: 'Пагубная Сила', en: 'Malignant Force', cat: 'rifle', family: 'sixty', polarity: 'Мадурай', drain0: 4, maxRank: 3, rarity: 'rare', effect: '+60% к урону Токсином и +60% к шансу статуса', card: true, stage: 3,
    ways: [SIXTY({ title: 'Порабощённый Вор', text: 'Порабощённый Вор на миссиях Бездны уровня 40–45', loc: 'void' })] },
  { id: 'rime-rounds', name: 'Иней-Патроны', en: 'Rime Rounds', cat: 'rifle', family: 'sixty', polarity: 'Мадурай', drain0: 4, maxRank: 3, rarity: 'rare', effect: '+60% к урону Холодом и +60% к шансу статуса', card: true, stage: 3,
    ways: [SIXTY({ title: 'Шпионаж', text: 'Шпионаж подходящего уровня с вскрытием трёх хранилищ (по Wiki — в том числе Луа, уровень 2)', loc: 'lua' })] },
  { id: 'speed-trigger', name: 'Скоростной Курок', en: 'Speed Trigger', cat: 'rifle', family: 'normal', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'uncommon', effect: '+60% к скорострельности (+120% для луков)', card: true, stage: 2, ways: [DROP] },
  { id: 'galvanized-chamber', name: 'Гальванизированный Патронник', en: 'Galvanized Chamber', cat: 'rifle', family: 'galvanized', polarity: 'Мадурай', drain0: 6, maxRank: 10, rarity: 'rare', card: true, stage: 4,
    effect: '+80% к мультивыстрелу и +30% за убийство, до 5 раз (всего 230%)', ways: [ARBI], upgrade: { endo: 30690, credits: 1482327 } },
  { id: 'galvanized-aptitude', name: 'Гальванизированная Боеспособность', cat: 'rifle', family: 'galvanized', en: 'Galvanized Aptitude', polarity: 'Вазарин', drain0: 2, maxRank: 10, rarity: 'rare', effect: '+80% к шансу статуса; за убийство +40% к прямому урону за каждый тип статуса на цели на 20 с, до 2 раз', card: true, stage: 4, ways: [ARBI] },
  { id: 'galvanized-scope', name: 'Гальванизированный Прицел', cat: 'rifle', family: 'galvanized', en: 'Galvanized Scope', polarity: 'Мадурай', drain0: 2, maxRank: 10, rarity: 'rare', effect: 'Попадание в уязвимое место: +120% к шансу крита при прицеливании на 12 с; убийство в уязвимое место — ещё +40%, до 5 раз', card: true, stage: 4, ways: [ARBI] },
  { id: 'thermite-rounds', name: 'Термитные Патроны', cat: 'rifle', family: 'sixty', en: 'Thermite Rounds', polarity: 'Мадурай', drain0: 4, maxRank: 3, rarity: 'rare', effect: '+60% к урону Огнём, +60% к шансу статуса', card: true, stage: 3, ways: [SIXTY({ title: 'Шпионаж', text: 'Шпионаж соответствующего уровня с вскрытием трёх хранилищ' })] },
  { id: 'high-voltage', name: 'Высокое Напряжение', cat: 'rifle', family: 'sixty', en: 'High Voltage', polarity: 'Мадурай', drain0: 4, maxRank: 3, rarity: 'rare', effect: '+60% к урону Электричеством, +60% к шансу статуса', card: true, stage: 4,
    ways: [{ id: 'naeglar', title: 'Три тайника Диверсии Улья на Naeglar', kind: 'drop', steps: [{ k: 'source', text: 'Naeglar, Эрида: третий тайник — 4,51% за попытку (по гайду); фарм может быть долгим', loc: 'eris' }, { k: 'obtain', text: 'Если мод дёшев на рынке, быстрее продать другую добычу и купить его' }] }, BARO()] },
  // ── Пистолет (Летум) ────────────────────────────────
  { id: 'hornet-strike', name: 'Удар Осы', en: 'Hornet Strike', cat: 'pistol', family: 'normal', polarity: 'Мадурай', drain0: 4, maxRank: 10, rarity: 'uncommon', effect: '+220% к базовому урону', card: true, stage: 1, ways: [DROP] },
  { id: 'galvanized-diffusion', name: 'Гальванизированный Двойной Ствол', en: 'Galvanized Diffusion', cat: 'pistol', family: 'galvanized', polarity: 'Мадурай', drain0: 4, maxRank: 10, rarity: 'rare', card: true, stage: 4,
    effect: '+110% к мультивыстрелу и +30% за убийство, до 4 раз (всего 230%)', ways: [ARBI] },
  { id: 'lethal-torrent', name: 'Смертоносный Ливень', en: 'Lethal Torrent', cat: 'pistol', family: 'nightmare', polarity: 'Мадурай', drain0: 6, maxRank: 5, rarity: 'rare', effect: '+60% к мультивыстрелу и +60% к скорострельности', card: true, stage: 3, ways: [NIGHTMARE] },
  { id: 'pistol-pestilence', name: 'Чумной Пистолет', en: 'Pistol Pestilence', cat: 'pistol', family: 'sixty', polarity: 'Мадурай', drain0: 4, maxRank: 3, rarity: 'rare', effect: '+60% к урону Токсином и +60% к шансу статуса', card: true, stage: 3,
    ways: [SIXTY({ title: 'Порабощённый Вор', text: 'Порабощённый Вор (по Wiki — 25%) на миссиях Бездны уровня 40–45', loc: 'void' })] },
  { id: 'frostbite', name: 'Обморожение', en: 'Frostbite', cat: 'pistol', family: 'sixty', polarity: 'Мадурай', drain0: 4, maxRank: 3, rarity: 'rare', effect: '+60% к урону Холодом и +60% к шансу статуса', card: true, stage: 3,
    ways: [SIXTY({ title: 'Шпионаж', text: 'Шпионаж Крепости Кувы уровня 3; по Wiki — также ротации Урана, Седны, Нептуна и Плутона', loc: 'kuva' })] },
  { id: 'scorch', name: 'Напалм', en: 'Scorch', cat: 'pistol', family: 'sixty', polarity: 'Мадурай', drain0: 4, maxRank: 3, rarity: 'rare', effect: '+60% к урону Огнём и +60% к шансу статуса', card: true, stage: 3,
    ways: [SIXTY({ title: 'Шпионаж уровня 3', text: 'Шпионаж Крепости Кувы уровня 3; по Wiki мод также был у Баро Ки\'Тиира (последний раз 18.09.2026)', loc: 'kuva' })] },
  { id: 'galvanized-shot', name: 'Гальванизированный Выстрел', en: 'Galvanized Shot', cat: 'pistol', family: 'galvanized', polarity: 'Вазарин', drain0: 2, maxRank: 10, rarity: 'rare', card: true, stage: 4,
    effect: '+80% к шансу статуса; +40% урона за каждый уникальный статус убитой цели, до 3 раз', ways: [ARBI] },
  { id: 'galvanized-crosshairs', name: 'Гальванизированные Перекрестия', cat: 'pistol', family: 'galvanized', en: 'Galvanized Crosshairs', polarity: 'Мадурай', drain0: 2, maxRank: 10, rarity: 'rare', effect: 'Попадание в уязвимое место: +120% к шансу крита при прицеливании на 12 с; убийство в уязвимое место — ещё +40%, до 5 раз', card: true, stage: 4, ways: [ARBI] },
  { id: 'primed-pistol-gambit', name: 'Пистолетный Гамбит Прайм', cat: 'pistol', family: 'primed', card: false, stage: 4, ways: [BARO()], note: 'Для некритической сборки Летума не нужен — только из-за высокой редкости покупать не стоит.' },
  // ── Ближний бой (Зорис) ─────────────────────────────
  { id: 'pressure-point', name: 'Болевая Точка', en: 'Pressure Point', cat: 'melee', family: 'normal', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'common', effect: '+120% к базовому урону ближнего боя', card: true, stage: 1, ways: [DROP] },
  { id: 'true-steel', name: 'Закалка', en: 'True Steel', cat: 'melee', family: 'normal', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'common', effect: '+120% к шансу критического удара', card: true, stage: 1, ways: [DROP] },
  { id: 'sacrificial-steel', name: 'Закалка Жертвы', en: 'Sacrificial Steel', cat: 'melee', family: 'umbra', polarity: 'Умбра', drain0: 6, maxRank: 10, rarity: 'legendary', effect: '+220% к шансу крита и ×1,32 урона по Сентиентам', card: true, stage: 4,
    ways: [{ id: 'check', title: 'Источник — проверьте в Wiki', kind: 'drop', steps: [{ k: 'source', text: 'Гайд не называет источник, при сверке его не уточняли. Откройте страницу мода в Wiki.', wikiCheck: true }] }] },
  { id: 'organ-shatter', name: 'Крушитель Органов', en: 'Organ Shatter', cat: 'melee', family: 'normal', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'common', effect: '+90% к критическому урону', card: true, stage: 1, ways: [DROP] },
  { id: 'killing-blow', name: 'Смертельный Удар', en: 'Killing Blow', cat: 'melee', family: 'normal', polarity: 'Мадурай', drain0: 6, maxRank: 5, rarity: 'uncommon', effect: '+120% к урону и +60% к скорости тяжёлой атаки', card: true, stage: 2, ways: [DROP] },
  { id: 'corrupt-charge', name: 'Разлагающий Заряд', en: 'Corrupt Charge', cat: 'melee', family: 'corrupted', polarity: 'Мадурай', drain0: 4, maxRank: 3, rarity: 'rare', effect: '+30 к начальному комбо, −50% к длительности комбо', card: true, stage: 2,
    ways: [VAULT], note: 'По Wiki — единственный источник: хранилище Орокин.' },
  { id: 'volatile-quick-return', name: 'Нестабильное Быстрое Возвращение', en: 'Volatile Quick Return', cat: 'melee', family: 'normal', polarity: 'Нарамон', drain0: 2, maxRank: 3, rarity: 'uncommon', effect: '100% шанс взрыва, +3 м радиуса взрыва, −4 рикошета, без пробивания', card: true, stage: 3, ways: [DROP] },
  { id: 'fever-strike', name: 'Лихорадочный Удар', en: 'Fever Strike', cat: 'melee', family: 'normal', polarity: 'Нарамон', drain0: 6, maxRank: 5, rarity: 'uncommon', effect: '+90% к урону Токсином', card: true, stage: 1, ways: [DROP] },
  { id: 'shocking-touch', name: 'Шокирующее Касание', en: 'Shocking Touch', cat: 'melee', family: 'normal', polarity: 'Нарамон', drain0: 6, maxRank: 5, rarity: 'uncommon', effect: '+90% к урону Электричеством', card: true, stage: 1, ways: [DROP] },
  { id: 'galvanized-steel', name: 'Гальваническая Закалка', cat: 'melee', family: 'galvanized', card: false, stage: 4, ways: [ARBI] },
  { id: 'galvanized-reflex', name: 'Гальванизированный Рефлекс', cat: 'melee', family: 'galvanized', card: false, stage: 4, ways: [ARBI] },
  { id: 'galvanized-elementalist', name: 'Гальванизированный Элементалист', cat: 'melee', family: 'galvanized', card: false, stage: 4, ways: [ARBI] },
  { id: 'condition-overload', name: 'Избыточное Состояние', cat: 'melee', family: 'normal', en: 'Condition Overload', polarity: 'Мадурай', drain0: 10, maxRank: 5, rarity: 'rare', effect: '+80% к урону ближнего боя за каждый тип статуса на цели', card: true, stage: 4, ways: [DROP] },
  { id: 'blood-rush', name: 'Приток Крови', cat: 'melee', family: 'normal', en: 'Blood Rush', polarity: 'Мадурай', drain0: 4, maxRank: 10, rarity: 'uncommon', effect: '+40% к шансу крита за каждый множитель комбо', card: true, stage: 4,
    ways: [{ id: 'cambion', title: 'Заказы Камбионского Дрейфа', kind: 'drop', steps: [{ k: 'access', text: 'Пройдено «Сердце Деймоса»', req: [{ f: 'quest:heart-of-deimos' }] }, { k: 'source', text: 'Заказы с нужной текущей таблицей наград — проверьте присутствие мода, а не только уровень заказа', loc: 'deimos' }] }] },
  { id: 'weeping-wounds', name: 'Стенающие Раны', cat: 'melee', family: 'normal', en: 'Weeping Wounds', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'uncommon', effect: '+40% к шансу статуса за каждый множитель комбо', card: true, stage: 4,
    ways: [{ id: 'cambion', title: 'Заказы Камбионского Дрейфа', kind: 'drop', steps: [{ k: 'access', text: 'Пройдено «Сердце Деймоса»', req: [{ f: 'quest:heart-of-deimos' }] }, { k: 'source', text: 'Заказы с нужной текущей таблицей наград', loc: 'deimos' }] }] },
  // ── Для соло-сборок вкладок «Варфреймы» и «Оружие» (карточки — Module:Mods/data, 13.10.2026) ──
  { id: 'redirection', name: 'Перенаправление', cat: 'warframe', family: 'normal', en: 'Redirection', polarity: 'Вазарин', drain0: 2, maxRank: 10, rarity: 'common', effect: '+100% к ёмкости щитов', card: true, stage: 1, ways: [DROP] },
  { id: 'quick-thinking', name: 'Быстрое Мышление', cat: 'warframe', family: 'normal', en: 'Quick Thinking', polarity: 'Вазарин', drain0: 4, maxRank: 5, rarity: 'rare', effect: 'Энергия тратится, чтобы остановить смертельный урон (эффективность 240%)', card: true, stage: 2, ways: [DROP] },
  { id: 'growing-power', name: 'Растущая Мощь', cat: 'aura', family: 'normal', en: 'Growing Power', polarity: 'Мадурай', drain0: 2, maxRank: 5, rarity: 'rare', effect: 'Статус от оружия: отряд получает +25% к собственной силе способностей на 6 с', card: true, stage: 3, ways: [DROP] },
  { id: 'corrosive-projection', name: 'Коррозийный Выброс', cat: 'aura', family: 'normal', en: 'Corrosive Projection', polarity: 'Нарамон', drain0: 2, maxRank: 5, rarity: 'uncommon', effect: 'Противники теряют 18% брони', card: true, stage: 2, ways: [DROP] },
  { id: 'power-drift', name: 'Силовое Течение', cat: 'warframe', family: 'normal', en: 'Power Drift', polarity: 'Зенурик', drain0: 4, maxRank: 5, rarity: 'rare', effect: '+15% к силе способностей, +30% к шансу устоять при опрокидывании', card: true, stage: 3, exilus: true, ways: [DROP] },
  { id: 'cunning-drift', name: 'Хитрое Течение', cat: 'warframe', family: 'normal', en: 'Cunning Drift', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'rare', effect: '+12% к скольжению, −30% к трению, +15% к радиусу способностей', card: true, stage: 3, exilus: true, ways: [DROP] },
  { id: 'handspring', name: 'Сальто', cat: 'warframe', family: 'normal', en: 'Handspring', polarity: 'Нарамон', drain0: 6, maxRank: 3, rarity: 'rare', effect: 'Подъём после опрокидывания быстрее на 160%', card: true, stage: 2, exilus: true, ways: [DROP] },
  { id: 'enemy-sense', name: 'Инстинкт Охотника', cat: 'warframe', family: 'normal', en: 'Enemy Sense', polarity: 'Нарамон', drain0: 2, maxRank: 5, rarity: 'rare', effect: 'Противники видны на радаре в радиусе 30 м', card: true, stage: 2, exilus: true, ways: [DROP] },
  { id: 'infected-clip', name: 'Токсичный Магазин', cat: 'rifle', family: 'normal', en: 'Infected Clip', polarity: 'Нарамон', drain0: 4, maxRank: 5, rarity: 'uncommon', effect: '+90% к урону Токсином', card: true, stage: 1, ways: [DROP] },
  { id: 'cryo-rounds', name: 'Крио Патроны', cat: 'rifle', family: 'normal', en: 'Cryo Rounds', polarity: 'Вазарин', drain0: 2, maxRank: 5, rarity: 'uncommon', effect: '+90% к урону Холодом', card: true, stage: 1, ways: [DROP] },
  { id: 'hellfire', name: 'Адское Пламя', cat: 'rifle', family: 'normal', en: 'Hellfire', polarity: 'Нарамон', drain0: 6, maxRank: 5, rarity: 'uncommon', effect: '+90% к урону Огнём', card: true, stage: 1, ways: [DROP] },
  { id: 'stormbringer', name: 'Громовержец', cat: 'rifle', family: 'normal', en: 'Stormbringer', polarity: 'Нарамон', drain0: 6, maxRank: 5, rarity: 'uncommon', effect: '+90% к урону Электричеством', card: true, stage: 1, ways: [DROP] },
  { id: 'heavy-caliber', name: 'Увеличение Калибра', cat: 'rifle', family: 'corrupted', en: 'Heavy Caliber', polarity: 'Мадурай', drain0: 6, maxRank: 10, rarity: 'rare', effect: '+165% к урону, −55% к точности', card: true, stage: 3, ways: [VAULT] },
  { id: 'barrel-diffusion', name: 'Двойной Ствол', cat: 'pistol', family: 'normal', en: 'Barrel Diffusion', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'rare', effect: '+120% к мультивыстрелу', card: true, stage: 2, ways: [DROP] },
  { id: 'pistol-gambit', name: 'Пистолетный Гамбит', cat: 'pistol', family: 'normal', en: 'Pistol Gambit', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'common', effect: '+120% к шансу критического удара', card: true, stage: 1, ways: [DROP] },
  { id: 'target-cracker', name: 'Дробитель', cat: 'pistol', family: 'normal', en: 'Target Cracker', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'uncommon', effect: '+60% к критическому урону', card: true, stage: 1, ways: [DROP] },
  { id: 'pathogen-rounds', name: 'Патогенные Патроны', cat: 'pistol', family: 'normal', en: 'Pathogen Rounds', polarity: 'Нарамон', drain0: 6, maxRank: 5, rarity: 'uncommon', effect: '+90% к урону Токсином', card: true, stage: 1, ways: [DROP] },
  { id: 'deep-freeze', name: 'Глубокая Заморозка', cat: 'pistol', family: 'normal', en: 'Deep Freeze', polarity: 'Вазарин', drain0: 2, maxRank: 5, rarity: 'uncommon', effect: '+90% к урону Холодом', card: true, stage: 1, ways: [DROP] },
  { id: 'heated-charge', name: 'Горячий Заряд', cat: 'pistol', family: 'normal', en: 'Heated Charge', polarity: 'Нарамон', drain0: 6, maxRank: 5, rarity: 'uncommon', effect: '+90% к урону Огнём', card: true, stage: 1, ways: [DROP] },
  { id: 'convulsion', name: 'Конвульсия', cat: 'pistol', family: 'normal', en: 'Convulsion', polarity: 'Нарамон', drain0: 4, maxRank: 5, rarity: 'uncommon', effect: '+90% к урону Электричеством', card: true, stage: 1, ways: [DROP] },
  { id: 'reach', name: 'Размах', cat: 'melee', family: 'normal', en: 'Reach', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'common', effect: '+1,5 м к дальности ближнего боя', card: true, stage: 1, ways: [DROP] },
  { id: 'primed-reach', name: 'Размах Прайм', cat: 'melee', family: 'primed', en: 'Primed Reach', polarity: 'Мадурай', drain0: 4, maxRank: 10, rarity: 'legendary', effect: '+3 м к дальности ближнего боя', card: true, stage: 4, ways: [BARO()] },
  { id: 'north-wind', name: 'Северный Ветер', cat: 'melee', family: 'normal', en: 'North Wind', polarity: 'Вазарин', drain0: 6, maxRank: 5, rarity: 'uncommon', effect: '+90% к урону Холодом', card: true, stage: 1, ways: [DROP] },
  { id: 'molten-impact', name: 'Обжигающий Удар', cat: 'melee', family: 'normal', en: 'Molten Impact', polarity: 'Нарамон', drain0: 6, maxRank: 5, rarity: 'uncommon', effect: '+90% к урону Огнём', card: true, stage: 1, ways: [DROP] },
  { id: 'berserker-fury', name: 'Ярость Берсерка', cat: 'melee', family: 'normal', en: 'Berserker Fury', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'rare', effect: 'Убийство в ближнем бою: +35% к скорости атаки на 10 с, до 2 раз', card: true, stage: 2, ways: [DROP] },
  { id: 'spoiled-strike', name: 'Удар Порчи', cat: 'melee', family: 'corrupted', en: 'Spoiled Strike', polarity: 'Мадурай', drain0: 4, maxRank: 3, rarity: 'rare', effect: '+100% к урону ближнего боя, −20% к скорости атаки', card: true, stage: 3, ways: [VAULT] },
  { id: 'gladiator-might', name: 'Сила Гладиатора', cat: 'melee', family: 'normal', en: 'Gladiator Might', polarity: 'Мадурай', drain0: 4, maxRank: 5, rarity: 'uncommon', effect: '+60% к критическому урону', card: true, stage: 2, ways: [DROP] },
  // ── Компаньон ───────────────────────────────────────
  { id: 'vacuum', name: 'Вакуум', en: 'Vacuum', cat: 'companion', family: 'normal', drain0: 2, maxRank: 5, rarity: 'common', effect: 'Радиус подбора 13,5 м', card: true, stage: 1,
    ways: [{ id: 'check', title: 'Источник — проверьте в Wiki', kind: 'drop', steps: [{ k: 'source', text: 'Карточка Wiki не указывает источник; гайд советует поставить «Вакуум» или «Апорт!» сразу после создания компаньона.', wikiCheck: true }] }] },
  { id: 'fetch', name: 'Апорт!', cat: 'companion', family: 'normal', card: false, stage: 1, effect: 'Автоматический подбор для зверей', ways: [] },
  { id: 'link-tenacious', name: 'Цепкая Связь', cat: 'companion', family: 'companion', card: false, stage: 3, effect: 'При шансе крита компаньона выше 50% усиливает критический множитель вашего оружия',
    ways: [{ id: 'business', title: 'Бизнес, Объединение Солярис', kind: 'vendor', steps: [{ k: 'access', text: '3-й ранг Объединения Солярис', req: [{ f: 'rank:solaris', min: 3 }] }, { k: 'currency', text: '20 000 репутации (по гайду)' }] }] },
  { id: 'link-reinforced', name: 'Усиленная Связь', cat: 'companion', family: 'companion', card: false, stage: 3, effect: 'Прибавка скорострельности при щитах компаньона от 1 200',
    ways: [{ id: 'business', title: 'Бизнес, Объединение Солярис', kind: 'vendor', steps: [{ k: 'access', text: '3-й ранг Объединения Солярис', req: [{ f: 'rank:solaris', min: 3 }] }, { k: 'currency', text: '20 000 репутации (по гайду)' }] }] },
  { id: 'link-manifold', name: 'Разнородная Связь', cat: 'companion', family: 'companion', card: false, stage: 3, effect: 'Роботизированный компаньон накладывает статусы своего оружия способностями',
    ways: [{ id: 'tisonai', title: 'Мастер Тисонай, Острон', kind: 'vendor', steps: [{ k: 'access', text: '3-й ранг Острона', req: [{ f: 'rank:ostron', min: 3 }] }, { k: 'currency', text: '20 000 репутации (по гайду)' }] }] },
  { id: 'link-duplex', name: 'Двойная Связь', cat: 'companion', family: 'companion', card: false, stage: 4, effect: 'Временные копии компаньона после расхода энергии',
    ways: [{ id: 'son', title: 'Сын, Энтрати', kind: 'vendor', steps: [{ k: 'access', text: '3-й ранг Энтрати', req: [{ f: 'rank:entrati', min: 3 }] }, { k: 'currency', text: '20 000 репутации (по гайду)' }, { k: 'obtain', text: 'Предложения Сына', link: 'vendor:son' }] }] },
  // ── Мод разлома ────────────────────────────────────
  { id: 'riven', name: 'Мод разлома', cat: 'any', family: 'riven', card: false, stage: 3, effect: 'Случайные параметры для определённого оружия; раскрывается испытанием',
    ways: [
      { id: 'palladino', title: 'Палладино в Железной Цитадели', kind: 'vendor', recommended: true, src: 'w:Palladino',
        steps: [{ k: 'access', text: 'Пройдены «Цепи Харроу»', req: [{ f: 'quest:chains-of-harrow' }] }, { k: 'currency', text: '10 Осколков Разлома за закрытый мод разлома; по Wiki — не более двух в неделю' }, { k: 'install', text: 'Поставить на оружие нужной категории и пройти испытание раскрытия' }] },
      { id: 'sortie', title: 'Вылазки', kind: 'drop', steps: [{ k: 'access', text: 'Пройдена «Война Внутри»', req: [{ f: 'quest:war-within' }] }, { k: 'source', text: 'Попутная ежедневная попытка, выпадение случайное', link: 'activity:sorties' }] },
      { id: 'trade', title: 'Торговля', kind: 'trade', steps: [{ k: 'currency', text: 'Платина и кредиты на налог' }, { k: 'obtain', text: 'Покупайте мод для нужного оружия, а не рассчитывайте на случайное раскрытие' }] }
    ] }
];
