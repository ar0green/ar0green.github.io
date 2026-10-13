// Предметы: варфреймы, оружие, ресурсы, валюты, мистификаторы и прочее.
// ways — способы получения; каждый способ — проверенная цепочка шагов:
//   source (источник) → access (доступ к нему) → currency/resources (ресурсы или валюта) → obtain (получение)
//   → craft (изготовление, если нужно) → install (установка или применение, если это отдельное действие).
// src — ключ источника из sources.mjs или 'g:N' (раздел гайда). Без src шаг считается сведением гайда.
// Значения, которые не удалось сверить, помечены note: 'unverified'.

export const items = [
  // ══ Варфреймы ═════════════════════════════════════════
  { id: 'rhino', type: 'warframe', name: 'Рино', en: 'Rhino', stage: 1, wiki: 'Рино', wikiEn: 'Rhino', reco: true, mr: 0,
    summary: 'Первая полезная замена стартового варфрейма: Железная кожа помогает выживать, Рёв усиливает урон.',
    why: 'На нём удобно осваивать игру, и он остаётся полезным на поздних этапах.', guide: 2, builds: ['rhino-starchart'],
    ways: [
      { id: 'jackal', title: 'Шакал на Fossa и основной чертёж за кредиты', kind: 'craft', recommended: true, src: 'w:Rhino',
        steps: [
          { k: 'source', text: 'Части выпадают с Шакала — убийство босса на узле Fossa, Венера', loc: 'venus',
            table: { caption: 'Шанс выпадения чертежа за одно убийство Шакала', rows: [['Системы', '22.56'], ['Нейрооптика', '38.72'], ['Каркас', '38.72']], src: 'w:Rhino' } },
          { k: 'access', text: 'Узел Fossa на Венере открыт', req: [{ f: 'junction:earth-venus' }] },
          { k: 'currency', text: 'Основной чертёж — в Магазине за 35 000 кредитов (не за платину)' },
          { k: 'resources', text: 'Ресурсы частей: Феррит, Рубедо, Полимеры, Сплавы, Схемы, Нейроды — по гайду, всё собирается на Земле и Венере',
            items: ['ferrite', 'rubedo', 'polymer', 'alloy', 'circuits', 'neurodes'] },
          { k: 'craft', text: 'Изготовить Нейрооптику, Каркас и Системы: по 15 000 кредитов и 12 часов; части строятся параллельно' },
          { k: 'craft', text: 'Изготовить Рино: 25 000 кредитов, 1 Нейрод и три части, 1 день' },
          { k: 'install', text: 'Поставить моды по сборке; реактор Орокин — когда решите играть им долго', link: 'build:rhino-starchart' }
        ] },
      { id: 'circuit', title: 'Цепь Дувири в неделю Рино', kind: 'reward', src: 'w:Rhino',
        steps: [
          { k: 'access', text: 'Пройден «Парадокс Дувири»', req: [{ f: 'quest:duviri' }] },
          { k: 'source', text: 'Выбрать Рино в Цепи в неделю, когда он есть в ротации' },
          { k: 'obtain', text: 'Ступень 10 Цепи — все его чертежи' },
          { k: 'craft', text: 'Изготовление — как в первом способе' }
        ] }
    ] },
  { id: 'revenant', type: 'warframe', name: 'Ревенант', en: 'Revenant', stage: 4, wiki: 'Ревенант', wikiEn: 'Revenant', reco: true,
    summary: 'Надёжная защита в поздних одиночных миссиях благодаря Чешуе Месмера.', guide: 7, builds: ['revenant-late'],
    ways: [
      { id: 'quest', title: '«Маска Ревенанта» и заказы Цетуса', kind: 'quest', recommended: true, src: 'w:Revenant',
        steps: [
          { k: 'access', text: 'Квест «Маска Ревенанта» открывается со 2-го ранга Перьев', req: [{ f: 'rank:quills', min: 2 }] },
          { k: 'source', text: 'Чертежи частей — награды заказов Равнин Эйдолона (Цетус)', loc: 'earth' },
          { k: 'craft', text: 'По ходу квеста нужно изготовить хотя бы две разные части' },
          { k: 'obtain', text: 'Основной чертёж — награда за квест' },
          { k: 'craft', text: 'Изготовить Ревенанта' }
        ] },
      { id: 'circuit', title: 'Цепь Дувири в неделю Ревенанта', kind: 'reward', src: 'w:Revenant',
        steps: [{ k: 'access', text: 'Пройден «Парадокс Дувири»', req: [{ f: 'quest:duviri' }] }, { k: 'obtain', text: 'Ступени 2, 5, 8 — части, ступень 10 — основной чертёж' }] }
    ] },
  { id: 'nezha', type: 'warframe', name: 'Нэчжа', stage: 2, wiki: 'Нэчжа', summary: 'Подвижная защита и удобная игра оружием.', guide: 7,
    ways: [{ id: 'lab', title: 'Лаборатория Тэнно в клане', kind: 'craft', steps: [{ k: 'source', text: 'Чертежи исследуются в Лаборатории Тэнно клана' }, { k: 'craft', text: 'Изготовить в Кузнице' }] }] },
  { id: 'wukong', type: 'warframe', name: 'Вуконг', stage: 2, wiki: 'Вуконг', summary: 'Удобное перемещение, разведка и часть одиночных задач.', guide: 7,
    ways: [{ id: 'lab', title: 'Лаборатория Тэнно в клане', kind: 'craft', steps: [{ k: 'source', text: 'Чертежи исследуются в Лаборатории Тэнно клана' }, { k: 'craft', text: 'Изготовить в Кузнице' }] }] },
  { id: 'kullervo', type: 'warframe', name: 'Куллерво', stage: 3, wiki: 'Куллерво', summary: 'Сильный ближний бой и тяжёлые атаки.', guide: 7,
    ways: [{ id: 'duviri', title: 'Дувири: Крепость Куллерво и покупки у Акритис', kind: 'reward', steps: [{ k: 'access', text: 'Пройден «Парадокс Дувири»', req: [{ f: 'quest:duviri' }] }, { k: 'source', text: 'Крепость Куллерво и покупки у Акритис в Дувири' }] }] },
  { id: 'wisp', type: 'warframe', name: 'Висп', stage: 3, wiki: 'Висп', summary: 'Здоровье, лечение, скорость и оружейные усиления.', guide: 7,
    ways: [{ id: 'ropalolyst', title: 'Ропалолист на Юпитере', kind: 'drop', steps: [{ k: 'access', text: 'Пройдена «Химера: Пролог»', req: [{ f: 'quest:chimera' }] }, { k: 'source', text: 'Бой с Ропалолистом на Юпитере', loc: 'jupiter' }] }] },
  { id: 'dante', type: 'warframe', name: 'Данте', stage: 4, wiki: 'Данте', summary: 'Сверхзащита и удобная зачистка при стабильном снабжении энергией.', guide: 7,
    ways: [{ id: 'armatus', title: 'Сбой на Armatus (Деймос)', kind: 'drop', steps: [{ k: 'source', text: 'Сбой на Armatus, Деймос', loc: 'deimos' }, { k: 'obtain', text: 'Страховочная покупка — у Лойда' }] }] },
  { id: 'nekros', type: 'warframe', name: 'Некрос', stage: 2, wiki: 'Некрос', summary: 'Дополнительный лут через способность «Осквернение».', guide: 7,
    ways: [{ id: 'lephantis', title: 'Лефантис, Деймос', kind: 'drop', steps: [{ k: 'source', text: 'Бой с Лефантисом на Деймосе', loc: 'deimos' }] }] },
  { id: 'ivara', type: 'warframe', name: 'Ивара', stage: 3, wiki: 'Ивара', summary: 'Невидимость и аккуратное прохождение Шпионажа.', guide: 7,
    ways: [{ id: 'spy', title: 'Награды Шпионажа', kind: 'drop', steps: [{ k: 'source', text: 'Награды Шпионажа за вскрытие хранилищ на миссиях нужного уровня' }] }] },
  { id: 'helminth-frames', type: 'note', name: 'Обычные варфреймы для Гельминта', stage: 4, hidden: true },

  // ══ Оружие ════════════════════════════════════════════
  { id: 'hek', type: 'weapon', slot: 'shotgun', name: 'Хек', en: 'Hek', stage: 2, wiki: 'Хек', wikiEn: 'Hek', reco: true, mr: 4,
    summary: 'Понятное оружие с хорошим запасом эффективности для обычных миссий.', guide: 8, builds: ['hek-starchart'],
    ways: [{ id: 'market', title: 'Чертёж в Магазине за кредиты', kind: 'craft', recommended: true, src: 'w:Hek',
      steps: [
        { k: 'access', text: 'Ранг мастерства 4', req: [{ f: 'mr', min: 4 }] },
        { k: 'currency', text: 'Чертёж — в Магазине за 25 000 кредитов' },
        { k: 'resources', text: '5 Нейродов, 900 Схем, 1 200 Вторсырья, 1 000 Рубедо', items: ['neurodes', 'circuits', 'salvage', 'rubedo'] },
        { k: 'craft', text: 'Изготовление: 25 000 кредитов, 1 день' },
        { k: 'install', text: 'Поставить моды по сборке «Хек для обычной карты»', link: 'build:hek-starchart' }
      ] }] },
  { id: 'atomos', type: 'weapon', slot: 'secondary', name: 'Атомос', stage: 2, wiki: 'Атомос', mr: 5, mrNote: 'unverified',
    summary: 'Вариант ранней карты из гайда; требование ранга мастерства 5 — по гайду.', guide: 8, ways: [] },
  { id: 'xoris', type: 'weapon', slot: 'melee', name: 'Зорис', en: 'Xoris', stage: 3, wiki: 'Зорис', wikiEn: 'Xoris', reco: true, mr: 4,
    summary: 'Сильное бесплатное бросковое оружие ближнего боя с дальним взрывом.', guide: 8, builds: ['xoris-heavy'],
    ways: [{ id: 'quest', title: 'Квест «Протокол Мёртвой Точки»', kind: 'quest', recommended: true, src: 'w:The_Deadlock_Protocol',
      steps: [
        { k: 'access', text: 'Переход на Сатурн и ранг мастерства 4', req: [{ f: 'junction:jupiter-saturn' }, { f: 'mr', min: 4 }] },
        { k: 'obtain', text: 'Чертёж, ядро, рукоять и лезвие выдаются по ходу квеста', src: 'w:Xoris' },
        { k: 'craft', text: 'Изготовить Зорис в Кузнице' },
        { k: 'install', text: 'Сборка под тяжёлый бросок; катализатор заметно упрощает её', link: 'build:xoris-heavy' }
      ] }] },
  { id: 'nataruk', type: 'weapon', slot: 'primary', name: 'Натарук', en: 'Nataruk', stage: 5, wiki: 'Натарук', wikiEn: 'Nataruk', reco: true, mr: 0,
    summary: 'Сильный лук, не требующий сложной поддержки. Выдаётся с катализатором и слотом.', guide: 8, builds: ['nataruk-first'],
    ways: [
      { id: 'quest', title: 'Награда за «Новую Войну»', kind: 'quest', recommended: true, src: 'w:Nataruk',
        steps: [{ k: 'access', text: 'Пройдена «Новая Война»', req: [{ f: 'quest:new-war' }] }, { k: 'obtain', text: 'Выдаётся с бесплатным слотом и установленным катализатором Орокин' }, { k: 'install', text: 'Сборка «Натарук как первый серьёзный инструмент»', link: 'build:nataruk-first' }] },
      { id: 'simaris', title: 'Повторный чертёж у Симэриса', kind: 'vendor', src: 'w:Cephalon_Simaris',
        steps: [{ k: 'access', text: 'Пройдена «Новая Война»', req: [{ f: 'quest:new-war' }] }, { k: 'currency', text: '100 000 репутации Симэриса' }, { k: 'obtain', text: 'Чертёж Натарука в предложениях Симэриса', link: 'vendor:simaris' }, { k: 'craft', text: 'Изготовить в Кузнице' }] }
    ] },
  { id: 'laetum', type: 'weapon', slot: 'secondary', name: 'Летум', en: 'Laetum', stage: 6, wiki: 'Летум', wikiEn: 'Laetum', reco: true, mr: 14, spoilerVendor: true,
    summary: 'Инкарнон-оружие Заримана с эволюцией «Поглощающее Истощение».', guide: 8, builds: ['laetum-attrition'],
    ways: [{ id: 'holdfasts', title: 'Чертёж у Кавальеро (Неукротимые)', kind: 'vendor', recommended: true, src: 'w:Laetum',
      steps: [
        { k: 'access', text: 'Пройдены «Ангелы Заримана»; ранг мастерства 14 для использования', req: [{ f: 'quest:zariman' }, { f: 'mr', min: 14 }] },
        { k: 'currency', text: 'Чертёж: 3 000 репутации Неукротимых, ранг 0', link: 'vendor:cavalero', src: 'w:Cavalero' },
        { k: 'resources', text: '30 000 кредитов, 4 000 Феррита и ресурсы Заримана (названия по англоязычной Wiki): 1 Voidplume Pinion, 5 Voidplume Quill, 20 Voidgel Orb', items: ['voidplume', 'ferrite'] },
        { k: 'craft', text: 'Изготовление — 1 день' },
        { k: 'install', text: 'Испытания эволюций; для пятой — одиночная миссия с Инкарнон-оружием в каждом оружейном слоте', link: 'build:laetum-attrition' }
      ] }] },
  { id: 'phenmor', type: 'weapon', slot: 'primary', name: 'Фенмор', stage: 6, wiki: 'Фенмор', summary: 'Оригинальное Инкарнон-оружие Заримана (винтовка).', guide: 14,
    ways: [{ id: 'holdfasts', title: 'Чертёж у Кавальеро', kind: 'vendor', src: 'w:Cavalero', steps: [{ k: 'access', text: 'Неукротимые, ранг 2', req: [{ f: 'rank:holdfasts', min: 2 }] }, { k: 'currency', text: '6 000 репутации', link: 'vendor:cavalero' }, { k: 'craft', text: 'Изготовить в Кузнице' }] }] },
  { id: 'praedos', type: 'weapon', slot: 'melee', name: 'Прадос', stage: 6, wiki: 'Прадос', summary: 'Оригинальное Инкарнон-оружие ближнего боя Заримана.', guide: 14,
    ways: [{ id: 'holdfasts', title: 'Чертёж у Кавальеро', kind: 'vendor', src: 'w:Cavalero', steps: [{ k: 'access', text: 'Неукротимые, ранг 4', req: [{ f: 'rank:holdfasts', min: 4 }] }, { k: 'currency', text: '9 000 репутации', link: 'vendor:cavalero' }, { k: 'craft', text: 'Изготовить в Кузнице' }] }] },
  { id: 'felarx', type: 'weapon', slot: 'primary', name: 'Феларкс', stage: 6, wiki: 'Феларкс', summary: 'Оригинальное Инкарнон-оружие Заримана (дробовик).', guide: 14,
    ways: [{ id: 'holdfasts', title: 'Чертёж у Кавальеро', kind: 'vendor', src: 'w:Cavalero', steps: [{ k: 'access', text: 'Неукротимые, ранг 3', req: [{ f: 'rank:holdfasts', min: 3 }] }, { k: 'currency', text: '8 000 репутации', link: 'vendor:cavalero' }, { k: 'craft', text: 'Изготовить в Кузнице' }] }] },
  { id: 'innodem', type: 'weapon', slot: 'melee', name: 'Иннодем', stage: 6, wiki: 'Иннодем', summary: 'Оригинальное Инкарнон-оружие ближнего боя Заримана.', guide: 14,
    ways: [{ id: 'holdfasts', title: 'Чертёж у Кавальеро', kind: 'vendor', src: 'w:Cavalero', steps: [{ k: 'access', text: 'Неукротимые, ранг 1', req: [{ f: 'rank:holdfasts', min: 1 }] }, { k: 'currency', text: '5 500 репутации', link: 'vendor:cavalero' }, { k: 'craft', text: 'Изготовить в Кузнице' }] }] },
  { id: 'incarnon-adapter', type: 'misc', name: 'Адаптер Инкарнон', stage: 6, wiki: 'Инкарнон', summary: 'Преобразует существующее оружие в Инкарнон-версию.', guide: 14,
    ways: [
      { id: 'steel-circuit', title: 'Стальная Цепь Дувири', kind: 'reward', recommended: true,
        steps: [
          { k: 'access', text: 'Открыт обычный Стальной путь', req: [{ f: 'flag:steel-path' }] },
          { k: 'access', text: 'Пройден «Парадокс Дувири» и обычные «Опыт Дувири», «Одинокая История» и «Цепь» — по гайду', req: [{ f: 'quest:duviri' }] },
          { k: 'source', text: 'Выбрать две награды недели из пяти — их выдают на ступенях 5 и 10', src: 'w:The_Circuit', loc: 'duviri' },
          { k: 'resources', text: 'Для установки обычно 20 Струбцин Пафоса и ещё два ресурса Дувири', items: ['pathos-clamp', 'runic-essence'] },
          { k: 'obtain', text: 'Базовое оружие совместимой версии' },
          { k: 'install', text: 'Принести всё Кавальеро на Зариман и установить адаптер', link: 'vendor:cavalero' },
          { k: 'install', text: 'Пройти испытания эволюций и выбрать бонусы под сборку' }
        ] },
      { id: 'market', title: 'Набор недели за платину у Кавальеро', kind: 'vendor', src: 'w:Cavalero',
        steps: [{ k: 'access', text: 'Открыт Стальной путь', req: [{ f: 'flag:steel-path' }] }, { k: 'currency', text: 'Адаптеры текущей недели с ресурсами установки — набором за 120 платины, один раз на набор' }, { k: 'install', text: 'Установка у Кавальеро' }] }
    ] },

  // ══ Ресурсы обычной карты (раздел 17) ═════════════════
  { id: 'ferrite', type: 'resource', name: 'Феррит', stage: 1, rarity: 'common', wiki: 'Феррит', where: [{ loc: 'earth', text: 'Земля и подходящие планеты; короткие миссии с большим числом врагов, контейнеры, Выживание' }] },
  { id: 'rubedo', type: 'resource', name: 'Рубедо', stage: 1, wiki: 'Рубедо', where: [{ loc: 'earth', text: 'Земля и подходящие планеты' }] },
  { id: 'polymer', type: 'resource', name: 'Полимеры', stage: 1, wiki: 'Полимеры', where: [{ loc: 'mercury', text: 'Меркурий' }, { loc: 'venus', text: 'Венера' }, { loc: 'uranus', text: 'Уран — Ophelia часто удобна для долгого сбора' }] },
  { id: 'plastids', type: 'resource', name: 'Пластиды', stage: 2, wiki: 'Пластиды', where: [{ loc: 'phobos', text: 'Фобос' }, { loc: 'saturn', text: 'Сатурн — Piscinas или подходящее Выживание' }] },
  { id: 'nano-spores', type: 'resource', name: 'Наноспоры', stage: 2, wiki: 'Наноспоры', where: [{ loc: 'saturn', text: 'Сатурн' }, { loc: 'deimos', text: 'Деймос' }, { loc: 'neptune', text: 'Нептун' }, { loc: 'eris', text: 'Эрида' }], note: 'Собирать вместе с Элементами Питания Орокин, Эндо или другими нужными наградами.' },
  { id: 'salvage', type: 'resource', name: 'Вторсырьё', stage: 2, rarity: 'common', wiki: 'Вторсырьё', where: [{ loc: 'mars', text: 'Марс' }, { loc: 'jupiter', text: 'Юпитер' }, { loc: 'sedna', text: 'Седна' }] },
  { id: 'alloy', type: 'resource', name: 'Сплавы', stage: 1, wiki: 'Сплавы', where: [{ loc: 'venus', text: 'Венера' }, { loc: 'jupiter', text: 'Юпитер' }, { loc: 'ceres', text: 'Церера' }], note: 'Не собирайте большой запас, пока он не нужен для конкретного чертежа.' },
  { id: 'circuits', type: 'resource', name: 'Схемы', stage: 1, wiki: 'Схемы', where: [], note: 'Гайд не называет места сбора Схем; проверьте страницу ресурса в Wiki.' },
  { id: 'neurodes', type: 'resource', name: 'Нейроды', stage: 1, rarity: 'rare', wiki: 'Нейроды', where: [{ loc: 'earth', text: 'Земля — контейнеры и противники' }, { loc: 'deimos', text: 'Деймос' }, { loc: 'lua', text: 'Подходящие миссии Луа' }] },
  { id: 'orokin-cell', type: 'resource', name: 'Элементы Питания Орокин', stage: 2, rarity: 'rare', wiki: 'Элемент_Питания_Орокин', where: [{ loc: 'saturn', text: 'Helene на Сатурне' }, { loc: 'ceres', text: 'Gabii на Церере' }], note: 'Совмещать с получением синтеза и кредитов.' },
  { id: 'neural-sensors', type: 'resource', name: 'Нейронные Датчики', stage: 2, rarity: 'rare', wiki: 'Нейронные_Датчики', where: [{ loc: 'jupiter', text: 'Юпитер: быстрые миссии и контейнеры полезнее очень долгого Выживания без цели' }] },
  { id: 'argon', type: 'resource', name: 'Кристалл Аргона', stage: 3, wiki: 'Кристалл_Аргона', where: [{ loc: 'void', text: 'Бездна: Hepit, Teshub и другие быстрые миссии; контейнеры и аргоновые пегматиты' }], note: 'Постепенно распадается — собирайте непосредственно перед изготовлением.' },
  { id: 'oxium', type: 'resource', name: 'Оксиум', stage: 2, wiki: 'Оксиум', where: [{ loc: 'jupiter', text: 'Io: оксиумные дроны Корпуса — убивайте до самоуничтожения' }] },
  { id: 'cryotic', type: 'resource', name: 'Криотик', stage: 2, wiki: 'Криотик', where: [{ text: 'Раскопки — выбирайте уровень, где можете надёжно защищать несколько раскопщиков' }] },
  { id: 'tellurium', type: 'resource', name: 'Теллуриум', stage: 3, rarity: 'rare', wiki: 'Теллуриум', where: [{ loc: 'uranus', text: 'Подводные миссии Урана (Ophelia) и подходящие Арчвинг-миссии; выпадение редкое' }] },
  { id: 'nitain', type: 'resource', name: 'Экстракт Нитаина', stage: 2, wiki: 'Экстракт_Нитаина', where: [{ text: 'Магазин Ночной Волны за креды Ночной Волны' }], note: 'Не планируйте основной фарм через редчайшие тайники.' },
  { id: 'mutagen', type: 'resource', name: 'Образец Мутагена', stage: 2, wiki: 'Образец_Мутагена', where: [{ loc: 'deimos', text: 'Деймос' }, { loc: 'eris', text: 'Эрида' }] },

  // ══ Поздние ресурсы и валюты ══════════════════════════
  { id: 'endo', type: 'currency', name: 'Эндо', stage: 1, wiki: 'Эндо', summary: 'Валюта улучшения модов. Полное улучшение редкого 10-рангового мода — 30 690 Эндо, легендарного — 40 920.', guide: 17 },
  { id: 'credits', type: 'currency', name: 'Кредиты', stage: 1, wiki: 'Кредиты', guide: 17 },
  { id: 'vitus', type: 'currency', name: 'Эссенция Витус', stage: 4, wiki: 'Эссенция_Витус', summary: 'Валюта магазина Наград Арбитража: гальванизированные моды — по 20.', src: 'w:Arbitrations',
    where: [{ text: 'Арбитражи: награда за каждую пройденную ротацию и выпадение с дронов Арбитража' }] },
  { id: 'steel-essence', type: 'currency', name: 'Эссенция Стали', stage: 4, wiki: 'Эссенция_Стали', summary: 'Валюта предложений Тешина на Стальном пути.',
    where: [{ text: 'Наземный Стальной путь и вторжения Стального пути; у Стального Рейлджека свои источники' }] },
  { id: 'kuva-res', type: 'currency', name: 'Кува', stage: 3, wiki: 'Кува', summary: 'Перепрокрутка модов разлома.', where: [{ loc: 'kuva', text: 'Кува-миссии, покупки за Эссенцию, Палладино и другие источники' }] },
  { id: 'voidplume', type: 'resource', name: 'Перья Бездны', stage: 6, wiki: 'Перья_Бездны', spoiler: false, where: [{ loc: 'zariman', text: 'Зариман: Ангелы Бездны, заказы и поиск на карте' }], note: 'Сохраняйте перья тех видов, что нужны для повышения ранга и покупок.' },
  { id: 'voca', type: 'resource', name: 'Вока', stage: 6, wiki: 'Вока', where: [{ loc: 'sanctum', text: 'Лаборатории, заказы Кавии, поиск на карте' }] },
  { id: 'pathos-clamp', type: 'resource', name: 'Струбцина Пафоса', stage: 6, wiki: 'Струбцина_Пафоса', where: [{ loc: 'duviri', text: 'Победа над Оровирмом при завершении соответствующих режимов Дувири' }], note: 'Цепь сама по себе этот ресурс не заменяет. Не тратьте весь запас у Акритис до установки нужного адаптера.' },
  { id: 'runic-essence', type: 'resource', name: 'Руническая Сущность', stage: 6, wiki: 'Руническая_Сущность', where: [{ loc: 'duviri', text: 'Подземелье в Дувири и Цепи — разбивать соответствующие контейнеры' }] },
  { id: 'toroids', type: 'resource', name: 'Тороиды', stage: 3, wiki: 'Тороиды', where: [{ loc: 'venus', text: 'Определённые зоны Долины Сфер и профильные боссы' }], note: 'Обычные тороиды, Крисма и Лазулит не заменяют друг друга.' },
  { id: 'stock', type: 'currency', name: 'Запас', stage: 6, wiki: 'Запас', summary: 'Валюта Гарнизона Кахла: архонтовые моды — по 40.', where: [{ text: 'Недельные задания Кахла и их дополнительные условия' }], src: 'w:Kahls_Garrison' },
  { id: 'riven-sliver', type: 'currency', name: 'Осколки Разлома', stage: 3, wiki: 'Осколок_Разлома', summary: 'Валюта Палладино: закрытый мод разлома — 10 осколков, до двух в неделю.', src: 'w:Palladino' },
  { id: 'ducats', type: 'currency', name: 'Дукаты', stage: 3, wiki: 'Дукаты', summary: 'Получаются за сдачу Прайм-частей в киоске Реле; нужны у Баро Ки\'Тиира вместе с кредитами.', note: 'Перед обменом проверьте рыночную цену части.' },
  { id: 'vosfor', type: 'currency', name: 'Восфор', stage: 4, wiki: 'Восфор', summary: 'Разбор ненужных мистификаторов у Лойда; тратится на случайные наборы мистификаторов.' },
  { id: 'entropic-kuva', type: 'currency', name: 'Энтропийная Кува', stage: 8, wiki: 'Энтропийная_Кува', where: [{ loc: 'zariman', text: 'Энтропийные эксимусы на Заримане' }], note: 'Отдельная валюта Мелики, не обычная Кува для перепрокрутки.' },
  { id: 'ignia', type: 'resource', name: 'Игния и Мафика', stage: 7, wiki: 'Спуск', where: [{ loc: 'cathedrale', text: 'Спуск' }], note: 'Покупки у Роута и связанные чертежи.' },
  { id: 'servoris', type: 'resource', name: 'Серворис и ресурсы боссов Периты', stage: 7, wikiEn: 'The_Perita_Rebellion', where: [{ loc: 'cathedrale', text: 'Восстание Периты — разные боссы дают разные материалы артефактов' }] },
  { id: 'riven-splicer', type: 'misc', name: 'Предмет для объединения параметров', en: 'Riven Splicer', stage: 8, wikiEn: 'The_Icebind',
    summary: 'Гарантированная награда успешного The Icebind: объединяет совместимую пару параметров одного мода разлома.', src: 'w:The_Icebind' },
  { id: 'archon-shard', type: 'misc', name: 'Архонтовый осколок', stage: 6, wiki: 'Осколок_Архонта',
    summary: 'Улучшение варфрейма через отдельный сегмент Гельминта; не занимает слот мода.', guide: 13,
    ways: [
      { id: 'hunt', title: 'Охота На Архонта — раз в неделю', kind: 'reward', recommended: true, src: 'w:Archon_Hunt',
        steps: [{ k: 'access', text: 'Пройден «Срывающий Вуаль»; варфрейм 30-го ранга', req: [{ f: 'quest:veilbreaker' }, { f: 'flag:warframe-30' }] }, { k: 'obtain', text: 'Гарантированный осколок Архонта; 20% — таукованый' }, { k: 'install', text: 'Установка в сегменте осколков Гельминта' }] },
      { id: 'bird3', title: 'Покупка у Птички-3 — раз в неделю', kind: 'vendor', src: 'w:Bird_3',
        steps: [{ k: 'access', text: 'Кавия, ранг 5', req: [{ f: 'rank:cavia', min: 5 }] }, { k: 'currency', text: '30 000 репутации Кавии', link: 'vendor:bird3' }, { k: 'obtain', text: 'Цвет меняется по неделям: лазурный, янтарный или багровый' }] },
      { id: 'netracells', title: 'Ячейки Нетры и Архимедия', kind: 'drop', src: 'w:Netracells',
        steps: [{ k: 'access', text: 'Пройден «Шёпот в Стенах»; есть недельный поисковый импульс', req: [{ f: 'quest:whispers' }] }, { k: 'obtain', text: 'Осколки — среди наград главного тайника (17,5% для каждого обычного цвета по Wiki)', link: 'activity:netracells' }] }
    ] },

  // ══ Мистификаторы ═════════════════════════════════════
  { id: 'arc-merciless', type: 'arcane', name: 'Основная Безжалостность', stage: 4, wiki: 'Основная_Безжалостность', summary: 'Оружейный мистификатор: бонус к урону за убийства.', guide: 13,
    ways: [{ id: 'acolytes', title: 'Послушники Сталкера на Стальном пути', kind: 'drop', steps: [{ k: 'access', text: 'Открыт Стальной путь', req: [{ f: 'flag:steel-path' }] }, { k: 'source', text: 'Выбрать миссию, где можно безопасно дождаться Послушников' }, { k: 'install', text: 'Нужен адаптер мистификатора основного оружия — у Тешина за Эссенцию Стали', link: 'vendor:teshin' }] }] },
  { id: 'arc-deadhead', type: 'arcane', name: 'Основной Выстрел В Голову', stage: 4, wiki: 'Основной_Выстрел_В_Голову', guide: 13, ways: [{ id: 'acolytes', title: 'Послушники Сталкера на Стальном пути', kind: 'drop', steps: [{ k: 'access', text: 'Открыт Стальной путь', req: [{ f: 'flag:steel-path' }] }] }] },
  { id: 'arc-dexterity', type: 'arcane', name: 'Основная Ловкость', stage: 4, wiki: 'Основная_Ловкость', guide: 13, ways: [{ id: 'acolytes', title: 'Послушники Сталкера на Стальном пути', kind: 'drop', steps: [{ k: 'access', text: 'Открыт Стальной путь', req: [{ f: 'flag:steel-path' }] }] }] },
  { id: 'arc-molt', type: 'arcane', name: 'Линька: Улучшение', stage: 6, wiki: 'Линька:_Улучшение', summary: 'Увеличивает силу способностей по мере убийств; полный 5-й ранг — 21 копия.', guide: 13,
    ways: [{ id: 'cavalero', title: 'Покупка у Кавальеро', kind: 'vendor', src: 'w:Cavalero', steps: [{ k: 'access', text: 'Неукротимые, ранг 5', req: [{ f: 'rank:holdfasts', min: 5 }] }, { k: 'currency', text: '10 000 репутации за копию; 21 копия — 210 000', link: 'vendor:cavalero' }] }] },
  { id: 'arc-energize', type: 'arcane', name: 'Мистическая Зарядка', stage: 4, wiki: 'Мистическая_Зарядка', summary: 'Полезна, но её не нужно покупать раньше базовых модов и слотов.', guide: 5, ways: [] },
  { id: 'arc-melee-influence', type: 'arcane', name: 'Влияние Ближнего Боя', stage: 6, wiki: 'Влияние_Ближнего_Боя', summary: 'Активируется отдельным Электро-статусом, а не только составным элементом.', guide: 13,
    ways: [{ id: 'bird3', title: 'Покупка у Птички-3', kind: 'vendor', src: 'w:Bird_3', steps: [{ k: 'access', text: 'Кавия, ранг 4', req: [{ f: 'rank:cavia', min: 4 }] }, { k: 'currency', text: '7 500 репутации за копию; 21 копия — 157 500', link: 'vendor:bird3' }, { k: 'install', text: 'Нужен адаптер мистификатора ближнего боя' }] }] },
  { id: 'arc-eternal-eradicate', type: 'arcane', name: 'Вечное Искоренение', stage: 6, wiki: 'Вечное_Искоренение', guide: 11,
    ways: [{ id: 'cavalero', title: 'Покупка у Кавальеро', kind: 'vendor', src: 'w:Cavalero', steps: [{ k: 'access', text: 'Неукротимые, ранг 1', req: [{ f: 'rank:holdfasts', min: 1 }] }, { k: 'currency', text: '5 000 репутации', link: 'vendor:cavalero' }] }] },
  { id: 'arc-melee-crescendo', type: 'arcane', name: 'Крещендо Ближнего Боя', stage: 7, wiki: 'Крещендо_Ближнего_Боя', summary: 'Не продаётся у Птички-3 напрямую: Ячейки Нетры, Архимедия, наборы или торговля.', guide: 11, ways: [] },
  { id: 'arc-melee-duplicate', type: 'arcane', name: 'Двойной Удар', stage: 7, wiki: 'Двойной_Удар', summary: 'Не продаётся у Птички-3 напрямую: Ячейки Нетры, Архимедия, наборы или торговля.', guide: 11, ways: [] },

  // ══ Улучшения снаряжения ══════════════════════════════
  { id: 'catalyst', type: 'misc', name: 'Катализатор Орокин', stage: 1, wiki: 'Катализатор_Орокин', summary: 'Удваивает вместимость оружия.', guide: 4,
    ways: [{ id: 'free', title: 'Ночная Волна и доступные награды', kind: 'reward', steps: [{ k: 'source', text: 'Ночная Волна и другие доступные награды' }, { k: 'install', text: 'Ставить на оружие, которым будете играть долго' }] }] },
  { id: 'reactor', type: 'misc', name: 'Реактор Орокин', stage: 1, wiki: 'Реактор_Орокин', summary: 'Удваивает вместимость варфрейма и ряда других предметов.', guide: 4,
    ways: [{ id: 'free', title: 'Ночная Волна и доступные награды', kind: 'reward', steps: [{ k: 'source', text: 'Ночная Волна и другие доступные награды' }, { k: 'install', text: 'Ставить на варфрейм, которым будете играть долго' }] }] },
  { id: 'forma', type: 'misc', name: 'Форма', stage: 2, wiki: 'Форма', summary: 'Меняет полярность слота и обычно сбрасывает ранг предмета.', guide: 4,
    ways: [{ id: 'relics', title: 'Чертежи из реликвий', kind: 'craft', steps: [{ k: 'source', text: 'Чертежи Формы — из реликвий' }, { k: 'craft', text: 'Строить заранее' }] }] },
  { id: 'helminth-segment', type: 'misc', name: 'Сегмент Гельминта', stage: 4, wiki: 'Гельминт', summary: 'Позволяет поглощать обычные варфреймы и переносить их способность.', guide: 13,
    ways: [{ id: 'son', title: 'Чертёж у Сына (Энтрати)', kind: 'vendor', recommended: true, src: 'w:Helminth',
      steps: [
        { k: 'access', text: 'Ранг мастерства 8 и 3-й ранг Энтрати', req: [{ f: 'mr', min: 8 }, { f: 'rank:entrati', min: 3 }, { f: 'quest:heart-of-deimos' }] },
        { k: 'currency', text: 'Чертёж — 15 000 репутации Энтрати', link: 'vendor:son' },
        { k: 'craft', text: 'Изготовить сегмент и установить его на Орбитере' },
        { k: 'install', text: 'Поглощение расходует варфрейм: сначала доведите его до 30-го ранга и снимите моды. Прайм-версии не поглощаются.' }
      ] },
      { id: 'market', title: 'Набор сегментов в Магазине', kind: 'vendor', src: 'w:Helminth', steps: [{ k: 'currency', text: 'Готовый сегмент в наборе сегментов Гельминта — 300 платины' }] }] }
];
