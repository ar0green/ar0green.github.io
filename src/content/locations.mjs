// Звёздная карта: где находится содержание. Координаты — в системе карты 1000×600 (HANDOFF → Карта).
// stages — этапы маршрута, на которых место становится актуальным (одна планета — несколько этапов = возвращение).
// Порядок массива = порядок маршрута (DOM-порядок кнопок и порядок Tab).
// spoiler: true — название раскрывает сюжет поздних квестов.
export const map = { width: 1280, height: 720, sun: [640, 360], tilt: 0.52 };

export const locations = [
  { id: 'earth', name: 'Земля', orb: 'earth', x: 808, y: 360, size: 'lg', stages: [1, 4, 8], wiki: 'Земля',
    lead: 'Начало пути: первые квесты, ресурсы для первых чертежей; позже — Цетус и Перья, а в поздней игре — пик Юван.',
    nodes: [
      { name: 'Цетус и Равнины Эйдолона', text: 'Острон, Перья (Онкко — первый модульный усилитель), заказы; ночью — охота на Эйдолонов.', stage: 3 },
      { name: 'Железная Цитадель', text: 'Палладино: закрытые моды разлома за Осколки Разлома (после «Цепей Харроу»).', stage: 3 },
      { name: 'Пик Юван', text: 'Колокола для The Icebind у ледяного столба; Мелика.', stage: 8, spoiler: true }
    ], resources: ['ferrite', 'rubedo', 'neurodes'] },
  { id: 'venus', access: [{ f: 'junction:earth-venus' }], name: 'Венера', orb: 'venus', x: 697, y: 478, size: 'md', stages: [1], wiki: 'Венера',
    lead: 'Fossa — бой с Шакалом, источник частей Рино. Фортуна и Долина Сфер — Объединение Солярис и Глас Солярис.',
    nodes: [
      { name: 'Fossa', text: 'Убийство Шакала: выпадают чертежи частей Рино.' },
      { name: 'Фортуна и Долина Сфер', text: 'Объединение Солярис (моды Связи, Китганы), Глас Солярис (усилители), ограбления Сферы Извлечения Прибыли с 5-го ранга.', stage: 2 }
    ], resources: ['polymer', 'alloy'] },
  { id: 'mercury', name: 'Меркурий', orb: 'mercury', x: 565, y: 425, size: 'sm', stages: [1], wiki: 'Меркурий',
    lead: 'Ранние миссии и Полимеры.', resources: ['polymer'] },
  { id: 'mars', access: [{ f: 'junction:earth-mars' }], name: 'Марс', orb: 'mars', x: 772, y: 242, size: 'md', stages: [2], wiki: 'Марс',
    lead: 'Начало середины карты: Вторсырьё, переходы к Церере и Деймосу.', resources: ['salvage'] },
  { id: 'phobos', name: 'Фобос', orb: 'mercury', x: 838, y: 172, size: 'xs', stages: [2], wiki: 'Фобос',
    lead: 'Пластиды на ранней карте.', resources: ['plastids'] },
  { id: 'deimos', access: [{ f: 'junction:earth-mars' }, { f: 'quest:heart-of-deimos', gate: false, label: 'Для Некралиска и Камбионского Дрейфа — «Сердце Деймоса»' }], name: 'Деймос', orb: 'mars', x: 690, y: 272, size: 'sm', stages: [2, 4, 5], wiki: 'Деймос',
    lead: '«Сердце Деймоса», Некралиск и Энтрати, хранилища Орокин; позже — сегмент Гельминта и некрамех.',
    nodes: [
      { name: 'Некралиск и Камбионский Дрейф', text: 'Энтрати (Сын — сегмент Гельминта и моды Связи), Некралоид (части некрамеха), заказы Матери, Изолированные хранилища.' },
      { name: 'Horend, Захват', text: 'Удобная миссия заброшенных кораблей для хранилищ Орокин (нужны ключи Дракона).' },
      { name: 'Armatus, Сбой', text: 'Источник частей Данте.' }
    ], resources: ['nano-spores', 'neurodes', 'mutagen'] },
  { id: 'ceres', name: 'Церера', orb: 'ceres', x: 548, y: 228, size: 'sm', stages: [2], wiki: 'Церера',
    lead: 'Тёмные секторы Gabii и Seimeni для кредитов; Элементы Питания Орокин.',
    nodes: [{ name: 'Gabii, Seimeni', text: 'Тёмные секторы: короткие заходы ради кредитов; Gabii — Элементы Питания Орокин.' }],
    resources: ['orokin-cell', 'alloy'] },
  { id: 'jupiter', name: 'Юпитер', orb: 'jupiter', x: 387, y: 356, size: 'xl', stages: [2], wiki: 'Юпитер',
    lead: 'Нейронные Датчики, Оксиум на Io, бой с Ропалолистом (Висп).',
    nodes: [
      { name: 'Io', text: 'Оксиумные дроны Корпуса — убивайте до самоуничтожения.' },
      { name: 'Ропалолист', text: 'Части Висп; доступ после «Химеры: Пролога».', stage: 3 }
    ], resources: ['neural-sensors', 'oxium', 'alloy', 'salvage'] },
  { id: 'europa', name: 'Европа', orb: 'europa', x: 284, y: 360, size: 'sm', stages: [2], wiki: 'Европа',
    lead: 'Часть основной карты; обязательные узлы нужны для Стального пути.' },
  { id: 'saturn', access: [{ f: 'junction:jupiter-saturn' }], name: 'Сатурн', orb: 'saturn', x: 461, y: 535, size: 'lg', stages: [2], wiki: 'Сатурн',
    lead: 'Helene и Piscinas для ресурсов; переход на Уран открывает «Парадокс Дувири».',
    nodes: [{ name: 'Helene', text: 'Элементы Питания Орокин — совмещайте с синтезом и кредитами.' }, { name: 'Piscinas', text: 'Пластиды.' }],
    resources: ['orokin-cell', 'plastids', 'nano-spores'] },
  { id: 'uranus', access: [{ f: 'junction:saturn-uranus' }], name: 'Уран', orb: 'uranus', x: 637, y: 612, size: 'lg', stages: [3], wiki: 'Уран',
    lead: 'Ophelia — Полимеры и редкий Теллуриум; отсюда дальше по сюжету.',
    nodes: [{ name: 'Ophelia', text: 'Удобна для долгого сбора Полимеров; подводные миссии дают Теллуриум.' }],
    resources: ['polymer', 'tellurium'] },
  { id: 'duviri', access: [{ f: 'quest:duviri' }], name: 'Дувири', orb: 'void', x: 196, y: 510, size: 'sm', stages: [3, 6], wiki: 'Дувири',
    lead: 'Цепь с чертежами варфреймов и Куллерво; позже — Стальная Цепь с адаптерами Инкарнон.',
    nodes: [{ name: 'Цепь и Стальная Цепь', text: 'Две награды недели на ступенях 5 и 10.' }, { name: 'Подземелье', text: 'Руническая Сущность.' }],
    resources: ['pathos-clamp', 'runic-essence'] },
  { id: 'neptune', access: [{ f: 'junction:uranus-neptune' }], name: 'Нептун', orb: 'neptune', x: 931, y: 560, size: 'lg', stages: [3], wiki: 'Нептун',
    lead: 'Индекс — целевой источник кредитов; переход на Плутон.',
    nodes: [{ name: 'Индекс', text: 'Ставка кредитами; выбирайте ставку, потерю которой можете позволить.' }], resources: ['nano-spores'] },
  { id: 'pluto', access: [{ f: 'junction:neptune-pluto' }], name: 'Плутон', orb: 'pluto', x: 1072, y: 356, size: 'sm', stages: [3], wiki: 'Плутон',
    lead: 'Задача перехода Плутон → Эрида: «установить линзу Фокуса» открывает Арбитражи.' },
  { id: 'eris', access: [{ f: 'junction:pluto-eris' }], name: 'Эрида', orb: 'pluto', x: 1002, y: 244, size: 'sm', stages: [3, 4], wiki: 'Эрида',
    lead: 'Naeglar — тайники Диверсии Улья (60/60 Электро); Образец Мутагена.',
    nodes: [{ name: 'Naeglar, Диверсия Улья', text: 'Три тайника — нужная последняя таблица наград.' }], resources: ['nano-spores', 'mutagen'] },
  { id: 'sedna', name: 'Седна', orb: 'mars', x: 640, y: 64, size: 'sm', stages: [3], wiki: 'Седна',
    lead: 'Арена (в том числе Vodyanoi) — групповой фарм Эндо; Вторсырьё.', resources: ['salvage'] },
  { id: 'lua', access: [{ f: 'quest:second-dream' }], name: 'Луа', orb: 'mercury', x: 885, y: 318, size: 'xs', stages: [3], wiki: 'Луа',
    lead: 'Открывается после «Второго Сна». Apollo — Сбой для реликвий Акси.', resources: ['neurodes'] },
  { id: 'kuva', access: [{ f: 'quest:war-within' }], name: 'Крепость Кувы', orb: 'mars', x: 985, y: 138, size: 'sm', stages: [3], wiki: 'Крепость_Кувы',
    lead: 'После «Войны Внутри»: Шпионаж уровня 3 для модов 60/60 Холода и Огня, миссии Кувы.' },
  { id: 'void', name: 'Бездна', orb: 'void', x: 165, y: 366, size: 'md', stages: [3], wiki: 'Бездна',
    lead: 'Hepit (реликвии Лит), Ukko (Мезо и Нео), Кристалл Аргона; Порабощённый Вор на высоких уровнях.',
    resources: ['argon'] },
  { id: 'proxima', access: [{ f: 'flag:railjack' }], name: 'Проксимы', orb: 'neptune', x: 1176, y: 476, size: 'sm', stages: [5, 7], wiki: 'Рэйлджек',
    lead: 'Миссии Рейлджека; позже — Стальной Рейлджек и Созвездия.' },
  { id: 'zariman', access: [{ f: 'quest:zariman' }], name: 'Зариман', orb: 'void', x: 168, y: 250, size: 'sm', stages: [6], wiki: 'Зариман', spoiler: true,
    lead: 'Хризалит и Неукротимые (Кавальеро): Инкарнон-оружие, мистификаторы, Каскад Бездны.', resources: ['voidplume'] },
  { id: 'sanctum', access: [{ f: 'quest:whispers' }], name: 'Санктум Анатомика', orb: 'mars', x: 588, y: 142, size: 'sm', stages: [6, 7, 8], wiki: 'Санктум_Анатомика', spoiler: true,
    lead: 'Кавия (Птичка-3), Ячейки Нетры, Глубинная Архимедия.', resources: ['voca'] },
  { id: 'hollvania', access: [{ f: 'quest:hex' }], name: 'Хёльвания', orb: 'ceres', x: 1170, y: 236, size: 'sm', stages: [7, 8], wiki: 'Хёльвания', spoiler: true,
    lead: 'Синдикат Гекс (Элеонора), Временная Архимедия (Кая), Техноцит Кода.' },
  { id: 'cathedrale', access: [{ f: 'quest:old-peace' }], name: 'La Cathédrale', orb: 'europa', x: 1066, y: 458, size: 'sm', stages: [7], wiki: 'La_Cathédrale', spoiler: true,
    lead: 'Мари: артефакты Фокуса; через Тёмный Рефракторий — Спуск и Восстание Периты.' }
];

// Связи маршрута (не переходы игры!): этап, на котором связь входит в маршрут, и её роль.
// kind: main — основной путь, branch — дополнительная ветка, return — возвращение к уже открытой планете.
export const edges = [
  { from: 'earth', to: 'venus', stage: 1, kind: 'main' },
  { from: 'venus', to: 'mercury', stage: 1, kind: 'branch', bend: -0.25 },
  { from: 'earth', to: 'mars', stage: 2, kind: 'main', bend: -0.1 },
  { from: 'mars', to: 'phobos', stage: 2, kind: 'branch', bend: 0.2 },
  { from: 'mars', to: 'deimos', stage: 2, kind: 'main' },
  { from: 'mars', to: 'ceres', stage: 2, kind: 'main' },
  { from: 'ceres', to: 'jupiter', stage: 2, kind: 'main' },
  { from: 'jupiter', to: 'europa', stage: 2, kind: 'branch', bend: 0.15 },
  { from: 'jupiter', to: 'saturn', stage: 2, kind: 'main' },
  { from: 'saturn', to: 'uranus', stage: 3, kind: 'main' },
  { from: 'uranus', to: 'duviri', stage: 3, kind: 'branch', bend: -0.2 },
  { from: 'uranus', to: 'neptune', stage: 3, kind: 'main' },
  { from: 'neptune', to: 'pluto', stage: 3, kind: 'main' },
  { from: 'neptune', to: 'lua', stage: 3, kind: 'return', bend: -0.12 },
  { from: 'pluto', to: 'eris', stage: 3, kind: 'main' },
  { from: 'pluto', to: 'sedna', stage: 3, kind: 'branch', bend: 0.15 },
  { from: 'pluto', to: 'kuva', stage: 3, kind: 'branch', bend: -0.1 },
  { from: 'eris', to: 'deimos', stage: 4, kind: 'return', bend: 0.18 },
  { from: 'eris', to: 'proxima', stage: 5, kind: 'main', bend: -0.1 },
  { from: 'proxima', to: 'zariman', stage: 6, kind: 'main', bend: -0.12 },
  { from: 'zariman', to: 'sanctum', stage: 6, kind: 'main', bend: 0.3 },
  { from: 'sanctum', to: 'duviri', stage: 6, kind: 'return', bend: 0.15 },
  { from: 'sanctum', to: 'hollvania', stage: 7, kind: 'main', bend: -0.08 },
  { from: 'sanctum', to: 'cathedrale', stage: 7, kind: 'branch', bend: -0.15 },
  { from: 'hollvania', to: 'earth', stage: 8, kind: 'return', bend: 0.12 }
];
