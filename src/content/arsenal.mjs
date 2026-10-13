// Арсенал: варфреймы и оружие для вкладок «Варфреймы» и «Оружие».
// Числа (полярности, аура, эксилус, стойка, характеристики, MR, Прайм) берутся при сборке из ref/*-wiki.json
// (Module:Warframes/data, Module:Weapons/data — Warframe Wiki, выгрузка 13.10.2026). Здесь — то, что пишет сайт:
// id, этап маршрута, роль, краткое описание и способы получения по-русски (по разделам Acquisition на Wiki).
// Предметы, которые уже есть в items.mjs (из гайда), дополняются данными, их тексты сохраняются.

const RATES_BOSS = [['Нейрооптика', '38.72'], ['Каркас', '38.72'], ['Системы', '22.56']];

/** Основной чертёж в Магазине + части с босса */
const bossWay = (en, { price, boss, node, loc, planet, rates, req, note }) => ({
  id: 'boss', title: 'Части: ' + boss + ' (' + node + ', ' + planet + ')', kind: 'drop', recommended: true, src: 'w:' + en,
  steps: [
    ...(req ? [{ k: 'access', text: req.text, req: req.c }] : []),
    { k: 'currency', text: price ? 'Основной чертёж — в Магазине за ' + price + ' кредитов' : 'Основной чертёж — см. ниже' },
    { k: 'source', text: 'Чертежи частей выпадают с босса: ' + boss + ', узел ' + node + ', ' + planet + (note ? '. ' + note : ''), loc,
      table: { caption: 'Шанс чертежа части за одно убийство', rows: rates || RATES_BOSS, src: 'w:' + en } },
    { k: 'craft', text: 'Изготовить три части, затем сам варфрейм в Литейной (ресурсы — на странице Wiki)' }
  ] });

/** Обычная Цепь Дувири: варфрейм недели */
const circuitWay = () => ({
  id: 'circuit', title: 'Цепь Дувири, неделя этого варфрейма', kind: 'reward', src: 'w:The_Circuit',
  steps: [
    { k: 'access', text: 'Пройден «Парадокс Дувири»', req: [{ f: 'quest:duviri' }] },
    { k: 'source', text: 'Выбрать варфрейм в недельной ротации обычной Цепи: Нейрооптика — 2-й ярус наград, Каркас — 5-й, Системы — 8-й, основной чертёж — 10-й', loc: 'duviri' }
  ] });

const labWay = (en, labNom, labLoc, prereq) => ({
  id: 'lab', title: (labNom || 'Лаборатория Тэнно') + ' в клановом додзё', kind: 'craft', recommended: true, src: 'w:' + en,
  steps: [
    { k: 'access', text: 'Состоять в клане; исследование в ' + (labLoc || 'Лаборатории Тэнно') + (prereq ? ' (сначала нужно исследовать ' + prereq + ')' : '') },
    { k: 'currency', text: 'Чертёж покупается в лаборатории после завершения исследования кланом' },
    { k: 'craft', text: 'Изготовить в Литейной (ресурсы — на странице Wiki)' }
  ] });

const marketBp = (en, price, extra) => ({
  id: 'market', title: 'Чертёж в Магазине за кредиты', kind: 'craft', recommended: true, src: 'w:' + en,
  steps: [
    ...(extra && extra.req ? [{ k: 'access', text: extra.req.text, req: extra.req.c }] : []),
    { k: 'currency', text: 'Чертёж — в Магазине за ' + price + ' кредитов' },
    ...(extra && extra.parts ? [{ k: 'resources', text: extra.parts }] : []),
    { k: 'craft', text: 'Изготовить в Литейной (ресурсы — на странице Wiki)' }
  ] });

const marketBuilt = (en, price, extra) => ({
  id: 'market', title: 'Готовое оружие в Магазине за кредиты', kind: 'vendor', recommended: true, src: 'w:' + en,
  steps: [
    ...(extra && extra.req ? [{ k: 'access', text: extra.req.text, req: extra.req.c }] : []),
    { k: 'currency', text: 'Магазин: готовое оружие за ' + price + ' кредитов' }
  ] });

const mr = n => ({ text: 'Ранг мастерства ' + n, c: [{ f: 'mr', min: n }] });

const cavalero = (en, rank, cost) => ({
  id: 'holdfasts', title: 'Чертёж у Кавальеро (Неукротимые)', kind: 'vendor', recommended: true, src: 'w:' + en,
  steps: [
    { k: 'access', text: 'Неукротимые, ранг ' + rank, req: [{ f: 'rank:holdfasts', min: rank }] },
    { k: 'currency', text: fmtN(cost) + ' репутации Неукротимых' },
    { k: 'obtain', text: 'Кавальеро в Хроминой Обсерватории', vendors: ['cavalero'] },
    { k: 'craft', text: 'Изготовить в Литейной (ресурсы Заримана — на странице Wiki)' }
  ] });
function fmtN(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

// ─────────────────────────── Варфреймы ───────────────────────────
// role — коротко, для фильтра и карточки: защита, урон, контроль, поддержка, скрытность
export const frames = [
  { en: 'Excalibur', id: 'excalibur', stage: 1, role: ['урон', 'ближний бой'],
    summary: 'Стартовый мечник: Величественный Клинок даёт сильный ближний бой без вложений в оружие.',
    ways: [
      { id: 'start', title: 'Стартовый выбор в «Пробуждении»', kind: 'quest', src: 'w:Excalibur', steps: [{ k: 'source', text: 'Один из трёх стартовых варфреймов (вместе с Мэг и Вольтом)', req: [{ f: 'quest:awakening' }] }] },
      bossWay('Excalibur', { price: '35 000', boss: 'Лейтенант Лех Крил', node: 'War', loc: 'mars', planet: 'Марс' }), circuitWay()] },
  { en: 'Mag', id: 'mag', stage: 1, role: ['контроль', 'щиты'],
    summary: 'Магнитный контроль и снятие брони/щитов; хорош на Корпусе.',
    ways: [
      { id: 'start', title: 'Стартовый выбор в «Пробуждении»', kind: 'quest', src: 'w:Mag', steps: [{ k: 'source', text: 'Один из трёх стартовых варфреймов', req: [{ f: 'quest:awakening' }] }] },
      bossWay('Mag', { price: '25 000', boss: 'Сержант', node: 'Iliad', loc: 'phobos', planet: 'Фобос' }), circuitWay()] },
  { en: 'Volt', id: 'volt', stage: 1, role: ['урон', 'скорость'],
    summary: 'Электрический урон, ускорение отряда и Электрический щит, усиливающий выстрелы сквозь него.',
    ways: [
      { id: 'start', title: 'Стартовый выбор в «Пробуждении»', kind: 'quest', src: 'w:Volt', steps: [{ k: 'source', text: 'Один из трёх стартовых варфреймов', req: [{ f: 'quest:awakening' }] }] },
      labWay('Volt')] },
  { en: 'Rhino', id: 'rhino' },
  { en: 'Loki', id: 'loki', stage: 3, role: ['скрытность', 'контроль'],
    summary: 'Невидимость и разоружение толпы — спокойное соло-прохождение Шпионажа и Захвата.',
    ways: [bossWay('Loki', { price: '35 000', boss: 'Стая Гиен', node: 'Psamathe', loc: 'neptune', planet: 'Нептун' }), circuitWay()] },
  { en: 'Frost', id: 'frost', stage: 2, role: ['защита', 'контроль'],
    summary: 'Снежная Сфера защищает цель обороны, Лавина и Ледяная Волна замедляют и замораживают.',
    ways: [bossWay('Frost', { price: '25 000', boss: 'Капитан Вор и Лейтенант Лех Крил', node: 'Exta', loc: 'ceres', planet: 'Церера' }), circuitWay()] },
  { en: 'Nekros', id: 'nekros', replaceWays: true,
    ways: [bossWay('Nekros', { price: '100 000', boss: 'Лефантис', node: 'Magnacidium', loc: 'deimos', planet: 'Деймос', rates: [['Нейрооптика', '33.33'], ['Каркас', '33.33'], ['Системы', '33.33']] }), circuitWay()] },
  { en: 'Nezha', id: 'nezha', role: ['защита', 'скорость'], replaceWays: true, ways: [labWay('Nezha')] },
  { en: 'Inaros', id: 'inaros', stage: 3, role: ['защита', 'выживание'],
    summary: 'Огромный запас здоровья без щитов и лечение способностью «Суховей» — очень прощает ошибки в соло.',
    ways: [
      { id: 'quest', title: 'Квест «Пески Инароса»', kind: 'quest', recommended: true, src: 'w:Inaros', steps: [
        { k: 'source', text: 'Чертёж квеста — у Баро Ки\'Тиира (100 дукатов + 25 000 кредитов) или обменом', link: 'vendor:baro' },
        { k: 'obtain', text: 'Квест «Пески Инароса» выдаёт основной чертёж и чертежи частей' },
        { k: 'craft', text: 'Изготовить части и варфрейм; дополнительные чертежи — у Цефалона Симэриса' }] },
      circuitWay()] },
  { en: 'Nidus', id: 'nidus', stage: 3, role: ['урон', 'контроль', 'выживание'],
    summary: 'Копит стаки мутации и становится очень живучим; стягивает врагов «Личинкой».',
    ways: [{ id: 'quest', title: 'Квест «Гамбит Гласта» и Инфестированная Утилизация', kind: 'quest', recommended: true, src: 'w:Nidus', steps: [
      { k: 'obtain', text: 'Основной чертёж — награда за квест «Гамбит Гласта»; дополнительные — у Цефалона Симэриса за 50 000 репутации' },
      { k: 'source', text: 'Чертежи частей — ротации A/B/C Инфестированной Утилизации на Oestrus, Эрида', loc: 'eris',
        table: { caption: 'Шанс чертежа части за ротацию', rows: [['Ротация A или B', '7.69'], ['Ротация C', '14.29']], src: 'w:Nidus' } },
      { k: 'craft', text: 'Изготовить части и варфрейм' }] }] },
  { en: 'Mesa', id: 'mesa', stage: 4, role: ['урон'],
    summary: 'Миротворец уничтожает всё в секторе обзора — простой и сильный урон для соло.',
    ways: [bossWay('Mesa', { price: '30 000', boss: 'Мутировавший Алад V', node: 'Mutalist Alad V Assassinate', loc: 'eris', planet: 'Эрида',
      note: 'Для входа нужен ключ: его чертёж даёт квест «Нулевой Пациент», а Навигационные координаты — Инфестированные Вторжения' })] },
  { en: 'Saryn', id: 'saryn', stage: 3, role: ['урон'],
    summary: 'Споры распространяют Токсин по всей комнате — один из сильнейших зачистщиков для соло.',
    ways: [bossWay('Saryn', { price: '35 000', boss: 'Кела Де Тейм', node: 'Merrow', loc: 'sedna', planet: 'Седна' }), circuitWay()] },
  { en: 'Nova', id: 'nova', stage: 2, role: ['контроль', 'урон'],
    summary: 'Молекулярный Заряд замедляет врагов и усиливает урон по ним; Червоточина — быстрые перемещения.',
    ways: [bossWay('Nova', { price: '35 000', boss: 'Рапторы', node: 'Naamah', loc: 'europa', planet: 'Европа' }), circuitWay()] },
  { en: 'Hildryn', id: 'hildryn', stage: 4, role: ['защита', 'урон'],
    summary: 'Тратит щиты вместо энергии: огромные щиты и Защитный Шторм для контроля сверху.',
    ways: [
      { id: 'solaris', title: 'Чертёж у Маленькой Утки, части с Сферы Эксплуатации', kind: 'vendor', recommended: true, src: 'w:Hildryn', steps: [
        { k: 'access', text: 'Глас Солярис, ранг 2', req: [{ f: 'rank:vox-solaris', min: 2 }] },
        { k: 'currency', text: 'Основной чертёж — у Маленькой Утки за 5 000 репутации' },
        { k: 'source', text: 'Чертежи частей — с Сферы Эксплуатации (Долина Сфер, Венера)', loc: 'venus',
          table: { caption: 'Шанс чертежа части за победу', rows: [['Нейрооптика', '38.72'], ['Каркас', '38.72'], ['Системы', '22.56']], src: 'w:Hildryn' } }] },
      circuitWay()] },
  { en: 'Mirage', id: 'mirage', stage: 2, role: ['урон'],
    summary: 'Копии повторяют выстрелы: множит урон любого оружия. Затмение даёт урон или защиту в зависимости от освещения.',
    ways: [
      { id: 'quest', title: 'Квест «Скрытые Послания» и чертёж в Магазине', kind: 'quest', recommended: true, src: 'w:Mirage', steps: [
        { k: 'currency', text: 'Основной чертёж — в Магазине за 35 000 кредитов' },
        { k: 'obtain', text: 'Чертежи частей — награды за миссии квеста «Скрытые Послания»; дополнительные — у Цефалона Симэриса за 25 000' }] },
      circuitWay()] },
  { en: 'Octavia', id: 'octavia', stage: 3, role: ['поддержка', 'контроль'],
    summary: 'Мелодии усиливают урон и маскируют; Молот стягивает урон врагов на себя.',
    ways: [{ id: 'quest', title: 'Квест «Гимн Октавии» и Луа', kind: 'quest', recommended: true, src: 'w:Octavia', steps: [
      { k: 'access', text: 'Пройден «Второй Сон» — Луа открыта', req: [{ f: 'quest:second-dream' }] },
      { k: 'obtain', text: 'Основной чертёж и Мандахорд — квест «Гимн Октавии»' },
      { k: 'source', text: 'Каркас — музыкальная головоломка на Луа; Системы — тайники ротации A на Plato (Луа, Истребление)', loc: 'lua' },
      { k: 'source', text: 'Нейрооптика — ротация C Выживания Terrorem, Деймос', loc: 'deimos' }] }] },
  { en: 'Gara', id: 'gara', stage: 3, role: ['защита', 'урон', 'контроль'],
    summary: 'Стеклянная Броня снижает урон, Массовая Витрификация удерживает врагов — уверенный старт в соло.',
    ways: [{ id: 'quest', title: 'Квест «Бдение Сайи» и заказы Цетуса', kind: 'quest', recommended: true, src: 'w:Gara', steps: [
      { k: 'obtain', text: 'Основной чертёж — квест «Бдение Сайи»; дополнительные — у Цефалона Симэриса за 50 000' },
      { k: 'source', text: 'Чертежи частей — награды заказов Цетуса (Равнины Эйдолона, Земля)', loc: 'earth' }] }] },
  { en: 'Khora', id: 'khora', stage: 3, role: ['контроль', 'урон'],
    summary: 'Удушающий Купол обездвиживает толпу, Хлыст бьёт по пойманным врагам.',
    ways: [{ id: 'onslaught', title: 'Атака Святилища (обычная) и чертёж в Магазине', kind: 'drop', recommended: true, src: 'w:Khora', steps: [
      { k: 'currency', text: 'Основной чертёж — в Магазине за 35 000 кредитов' },
      { k: 'source', text: 'Чертежи частей — ротации обычной Атаки Святилища (не Элитной), каждые две стадии — ротация A-A-B-C',
        table: { caption: 'Шанс чертежа каждой части за ротацию', rows: [['Ротации A и B', '7.14'], ['Ротация C', '9.09']], src: 'w:Khora' } }] }] },
  { en: 'Protea', id: 'protea', stage: 3, role: ['урон', 'поддержка'],
    summary: 'Раздатчик энергии и здоровья, Артиллерия и Якорь времени — самодостаточна в соло.',
    ways: [{ id: 'quest', title: 'Квест «Протокол «Мёртвая Точка»» и Гранум-Бездна', kind: 'quest', recommended: true, src: 'w:Protea', steps: [
      { k: 'access', text: 'Квест «Протокол «Мёртвая Точка»»: нужен переход на Сатурн и ранг мастерства 4', req: [{ f: 'quest:deadlock' }] },
      { k: 'obtain', text: 'Основной чертёж — награда за квест; дополнительные — у Цефалона Симэриса за 50 000' },
      { k: 'source', text: 'Части — ротация C Гранум-Бездны на кораблях Корпуса: Нейрооптика — обычная (Венец Гранума), Каркас — расширенная (Венец Образца), Системы — Кошмарная (Венец Зенита)' }] }] },
  { en: 'Revenant', id: 'revenant' },
  { en: 'Wisp', id: 'wisp' },
  { en: 'Wukong', id: 'wukong', role: ['урон', 'выживание'], replaceWays: true, ways: [labWay('Wukong')] },
  { en: 'Ivara', id: 'ivara', replaceWays: true,
    ways: [{ id: 'spy', title: 'Ротация C Шпионажа и чертёж в Магазине', kind: 'drop', recommended: true, src: 'w:Ivara', steps: [
      { k: 'currency', text: 'Основной чертёж — в Магазине за 35 000 кредитов' },
      { k: 'source', text: 'Чертежи частей — ротация C Шпионажа (три успешно вскрытых хранилища) нужного уровня, включая Кошмар',
        table: { caption: 'Пример: шанс за ротацию C', rows: [['Шпионаж 1-го уровня — Системы', '22.56'], ['Шпионаж Проксимы Венеры — Системы', '36'], ['Шпионаж Проксимы Нептуна — Каркас', '36']], src: 'w:Ivara' } }] }] },
  { en: 'Dante', id: 'dante', replaceWays: true,
    ways: [{ id: 'armatus', title: 'Сбой на Armatus (Деймос) или у Лойда', kind: 'drop', recommended: true, src: 'w:Dante', steps: [
      { k: 'access', text: 'Пройдены «Протокол «Мёртвая Точка»» и «Шёпот в Стенах»', req: [{ f: 'quest:deadlock' }, { f: 'quest:whispers' }] },
      { k: 'source', text: 'Ротация C Сбоя на Armatus, Деймос: каждый чертёж — 5%', loc: 'deimos' },
      { k: 'currency', text: 'Или у Лойда в Санктуме Анатомике за Капилляры Сосуда: 90 за чертёж части, 270 за основной (всего 540)' }] }] },
  { en: 'Kullervo', id: 'kullervo' }
];

// ─────────────────────────── Оружие ───────────────────────────
export const weapons = [
  // Основное
  { en: 'Braton', id: 'braton', slot: 'primary', stage: 1, summary: 'Стартовая автоматическая винтовка. С Инкарнон-адаптером становится сильной на всю игру.',
    ways: [marketBuilt('Braton', '25 000')] },
  { en: 'Boltor', id: 'boltor', slot: 'primary', stage: 1, summary: 'Болтомёт с уроном Проникновением; с Инкарнон-адаптером — отличный выбор середины игры.',
    ways: [{ id: 'junction', title: 'Награда за переход Венера → Меркурий', kind: 'reward', src: 'w:Boltor', steps: [{ k: 'obtain', text: 'Готовый Болтор с катализатором и слотом — за задачу перехода Венера → Меркурий' }] }, marketBp('Boltor', '15 000', { req: mr(2) })] },
  { en: 'Tigris', id: 'tigris', slot: 'shotgun', stage: 2, summary: 'Двуствольный дробовик с огромным уроном Разрезом за выстрел.', ways: [marketBp('Tigris', '40 000', { req: mr(7) })] },
  { en: 'Hek', id: 'hek' },
  { en: 'Ignis', id: 'ignis', slot: 'primary', stage: 2, summary: 'Огнемёт: луч Огня проходит сквозь врагов, удобен против толпы.', ways: [labWay('Ignis', 'Химическая Лаборатория', 'Химической Лаборатории')] },
  { en: 'Rubico', id: 'rubico', slot: 'primary', stage: 2, summary: 'Снайперская винтовка с высоким шансом крита — сильный дальний урон.', ways: [marketBp('Rubico', '20 000', { req: mr(6) })] },
  { en: 'Acceltra', id: 'acceltra', slot: 'primary', stage: 3, summary: 'Ракетница со взрывом по площади и высоким критом.',
    ways: [{ id: 'demolisher', title: 'Тёмный Сектор Ur, Уран', kind: 'drop', recommended: true, src: 'w:Acceltra', steps: [
      { k: 'source', text: 'Чертёж выпадает с Инфестированных Разрушителей на миссии Тёмного Сектора Ur (Уран)', loc: 'uranus',
        table: { caption: 'Шанс чертежа с каждого вида Разрушителя', rows: [['Разрушитель (каждый из 4 видов)', '2.5']], src: 'w:Acceltra' } },
      { k: 'access', text: 'Ранг мастерства 8', req: [{ f: 'mr', min: 8 }] }] }] },
  { en: 'Nataruk', id: 'nataruk' },
  { en: 'Phenmor', id: 'phenmor', replaceWays: true, ways: [cavalero('Phenmor', 2, 6000)] },
  { en: 'Felarx', id: 'felarx', replaceWays: true, ways: [cavalero('Felarx', 3, 8000)] },
  // Вторичное
  { en: 'Lato', id: 'lato', slot: 'secondary', stage: 1, summary: 'Стартовый пистолет; с Инкарнон-адаптером — рабочий вариант на долгое время.',
    ways: [{ id: 'start', title: 'Стартовый выбор или Магазин', kind: 'vendor', src: 'w:Lato', steps: [{ k: 'obtain', text: 'Выбор в «Пробуждении» (или Кунаи)' }, { k: 'currency', text: 'Магазин: готовый за 10 000 кредитов' }] }] },
  { en: 'Lex', id: 'lex', slot: 'secondary', stage: 1, summary: 'Мощный полуавтоматический пистолет для точных попаданий в голову.', ways: [marketBuilt('Lex', '50 000', { req: mr(3) })] },
  { en: 'Akbolto', id: 'akbolto', slot: 'secondary', stage: 2, summary: 'Парные болтомёты: высокий урон Проникновением и скорострельность.',
    ways: [marketBp('Akbolto', '15 000', { req: mr(8), parts: 'Нужны два готовых Болто и Клетка Орокин' })] },
  { en: 'Akstiletto', id: 'akstiletto', slot: 'secondary', stage: 2, summary: 'Парные пистолеты-пулемёты со сбалансированным критом и статусом.', ways: [labWay('Akstiletto')] },
  { en: 'Atomos', id: 'atomos', replaceWays: true, summary: 'Лучевой пистолет: Огонь перескакивает между врагами — удобная зачистка толпы.', ways: [marketBp('Atomos', '30 000', { req: mr(5) })] },
  { en: 'Pyrana', id: 'pyrana', slot: 'secondary', stage: 3, summary: 'Автоматический пистолет-дробовик с сильным уроном Разрезом вблизи.', ways: [labWay('Pyrana', null, null, 'Акстилетто')] },
  { en: 'Kuva Nukor', id: 'kuva-nukor', slot: 'secondary', stage: 4, summary: 'Лучевой пистолет Кувы с огромным крит. множителем и цепным лучом.',
    ways: [{ id: 'lich', title: 'Победа над Личем Кувы с этим оружием', kind: 'reward', recommended: true, src: 'w:Kuva Nukor', steps: [
      { k: 'access', text: 'Пройдена «Война Внутри» — открыта система Личей Кувы', req: [{ f: 'quest:war-within' }] },
      { k: 'obtain', text: 'Лич появляется со случайным оружием Кувы: нужен Лич именно с Нюкором; после победы оружие ждёт в Литейной' },
      { k: 'obtain', text: 'Можно получить обменом обращённого Лича с этим оружием (в додзё)' }] }] },
  { en: 'Epitaph', id: 'epitaph', slot: 'secondary', stage: 5, summary: 'Пистолет с зарядным выстрелом и очень высоким шансом крита.',
    ways: [{ id: 'voidstorm', title: 'Штормы Бездны в Проксимах', kind: 'drop', recommended: true, src: 'w:Epitaph', steps: [
      { k: 'access', text: 'Есть Рейлджек', req: [{ f: 'flag:railjack' }] },
      { k: 'source', text: 'Чертёж и части — ротация A Шторма Бездны в Проксимах Земли, Венеры и Сатурна (около 10% за ротацию)', loc: 'proxima' }] }] },
  { en: 'Laetum', id: 'laetum' },
  { en: 'Kunai', id: 'kunai', slot: 'secondary', stage: 1, summary: 'Метательные ножи — стартовый выбор; с Инкарнон-адаптером заметно сильнее.',
    ways: [{ id: 'start', title: 'Стартовый выбор или Магазин', kind: 'vendor', src: 'w:Kunai', steps: [{ k: 'obtain', text: 'Выбор в «Пробуждении» (или Лато)' }, { k: 'currency', text: 'Чертёж — в Магазине за 15 000 кредитов' }] }] },
  // Ближний бой
  { en: 'Skana', id: 'skana', slot: 'melee', stage: 1, summary: 'Стартовый меч; с Инкарнон-адаптером годится надолго.',
    ways: [{ id: 'start', title: 'Стартовый выбор или Магазин', kind: 'vendor', src: 'w:Skana', steps: [{ k: 'obtain', text: 'Выбор в «Пробуждении» (или Бо)' }, { k: 'currency', text: 'Чертёж — в Магазине за 15 000 кредитов' }] }] },
  { en: 'Nikana', id: 'nikana', slot: 'melee', stage: 2, summary: 'Катана с высоким уроном Разрезом и хорошим критом.', ways: [labWay('Nikana', null, null, 'Акстилетто')] },
  { en: 'Orthos', id: 'orthos', slot: 'melee', stage: 1, summary: 'Глефа с большой дальностью атаки — удобна против толпы.', ways: [marketBp('Orthos', '20 000', { req: mr(2) })] },
  { en: 'Galatine', id: 'galatine', slot: 'melee', stage: 2, summary: 'Тяжёлый клинок с сильным Разрезом и широкими ударами.', ways: [marketBp('Galatine', '25 000', { req: mr(3) })] },
  { en: 'Fragor', id: 'fragor', slot: 'melee', stage: 1, summary: 'Молот с высоким шансом крита и мощными тяжёлыми ударами.',
    ways: [{ id: 'junction', title: 'Награда за переход Земля → Марс', kind: 'reward', src: 'w:Fragor', steps: [{ k: 'obtain', text: 'Готовый Фрагор с катализатором и слотом — за задачу перехода Земля → Марс', req: [{ f: 'junction:earth-mars' }] }] }, marketBp('Fragor', '15 000', { req: mr(2) })] },
  { en: 'Xoris', id: 'xoris' },
  { en: 'Kronen', id: 'kronen', slot: 'melee', stage: 2, summary: 'Тонфы с быстрыми атаками и хорошим статусом.', ways: [marketBp('Kronen', '65 000', { req: mr(3) })] },
  { en: 'Dual Kamas', id: 'dual-kamas', slot: 'melee', stage: 1, summary: 'Парные серпы с упором на Разрез — простой ранний вариант.',
    ways: [marketBp('Dual Kamas', '40 000', { req: mr(1), parts: 'Нужны два готовых Камы и Клетка Орокин' })] },
  { en: 'Praedos', id: 'praedos', replaceWays: true, ways: [cavalero('Praedos', 4, 9000)] },
  { en: 'Innodem', id: 'innodem', replaceWays: true, ways: [cavalero('Innodem', 1, 5500)] }
];

// Русские названия способностей, которых нет в межъязыковых ссылках Wiki, — оставляем английские (честно), без перевода от себя.
// Классы оружия
export const WEAPON_CLASS = {
  'Rifle': 'Винтовка', 'Shotgun': 'Дробовик', 'Bow': 'Лук', 'Sniper Rifle': 'Снайперская винтовка',
  'Pistol': 'Пистолет', 'Dual Pistols': 'Парные пистолеты', 'Thrown': 'Метательное', 'Shotgun Sidearm': 'Пистолет-дробовик',
  'Sword': 'Меч', 'Nikana': 'Никана', 'Polearm': 'Глефа', 'Heavy Blade': 'Тяжёлый клинок', 'Hammer': 'Молот', 'Glaive': 'Глефа-бумеранг',
  'Tonfa': 'Тонфы', 'Dual Swords': 'Парные мечи', 'Dagger': 'Кинжал'
};
export const FRAME_PLAY = { 'Damage': 'урон', 'Crowd Control': 'контроль', 'Survival': 'выживание', 'Support': 'поддержка', 'Stealth': 'скрытность' };
