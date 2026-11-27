import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Snowflake,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Flame,
  CheckCircle2,
  Zap,
  ZoomIn,
  Wrench,
} from 'lucide-react';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

const SLIDES = [
  { id: 'types', label: '1. Виды', title: 'Виды свечей и материалы электрода' },
  { id: 'construction', label: '2. Разрез и электроды', title: 'Свеча в разрезе, резистор, керамика и реальные виды электродов' },
  { id: 'ngk', label: '3. NGK', title: 'Полная расшифровка маркировки NGK' },
  { id: 'denso', label: '4. Denso', title: 'Полная расшифровка маркировки Denso' },
  { id: 'diesel', label: '5. Дизель', title: 'Дизельные свечи накаливания NGK и Denso' },
  { id: 'cross', label: '6. Кроссы', title: 'Кросс-таблица NGK ↔ Denso и ошибки подбора' },
  { id: 'original', label: '7. Оригинал', title: 'Отличия оригинала от подделки (чек-лист)' },
  { id: 'diagnostics', label: '8. Монтаж и нагар', title: 'Моменты затяжки Denso, корона и диагностика по нагару' },
  { id: 'tools', label: '9. Инструмент и Ом', title: 'Инструменты для замены, как закручивать, Ом/напряжение и последствия ошибок' },
];

const TORQUE_TABLE = [
  { size: 'M10 (стандарт)', torque: '10–15 Н·м', newAngle: '1/3 оборота', usedAngle: '1/12 оборота' },
  { size: 'M10 (UFE / IUH / VUH)', torque: '10–15 Н·м', newAngle: '2/3–3/4 оборота', usedAngle: '1/12 оборота' },
  { size: 'M12 (все типы)', torque: '15–20 Н·м', newAngle: '1/3 оборота', usedAngle: '1/12 оборота' },
  { size: 'M14 (плоская шайба)', torque: '20–30 Н·м', newAngle: '1/2–2/3 оборота', usedAngle: '1/12 оборота' },
  { size: 'M14 (конус без шайбы)', torque: '10–20 Н·м', newAngle: '1/16 оборота', usedAngle: '1/16 оборота' },
  { size: 'M18 (все типы)', torque: '30–40 Н·м', newAngle: '1/4 оборота', usedAngle: '1/12 оборота' },
];

const DIAGNOSTICS_CARDS = [
  {
    title: 'Норма (светло-серый / песочный)',
    badge: 'НОРМА',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    desc: 'Тонкий светло-серый или бежевый налёт без оплавлений. Смесь, зажигание и калильное число подобраны идеально.',
  },
  {
    title: 'Коронное пятно (Corona Stain)',
    badge: 'НЕ БРАК!',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    desc: 'Рыже-коричневый ореол на белой керамике прямо над гайкой. Возникает из-за притяжения пыли высоким напряжением (электростатика) — герметичность не нарушена.',
  },
  {
    title: 'Сухой бархатный чёрный нагар',
    badge: 'БОГАТАЯ СМЕСЬ',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    desc: 'Переобогащение смеси, забитый воздушный фильтр, частые короткие поездки с автозапуском в -35 °C или слишком «холодная» свеча (не успевает самоочиститься).',
  },
  {
    title: 'Влажный масляный нагар',
    badge: 'МАСЛО В КС',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    desc: 'Износ маслосъёмных колпачков, залегание поршневых колец или пропуски зажигания (неисправная катушка/провод).',
  },
  {
    title: 'Белый изолятор, оплавление / пузыри',
    badge: 'ПЕРЕГРЕВ',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    desc: 'Бедная смесь, детонация, слишком раннее зажигание, подсос воздуха или слишком «горячая» свеча (калильное число ниже нормы).',
  },
  {
    title: 'Рыже-красный кирпичный налёт',
    badge: 'ПЛОХОЙ БЕНЗИН',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    desc: 'Металлосодержащие присадки (ферроцен) в топливе. Красный налёт проводит ток — искра уходит по изолятору вместо зазора, начинаются пропуски под нагрузкой.',
  },
];

const CERAMIC_TYPES = [
  {
    name: 'Гладкая керамика (Smooth Insulator)',
    badge: 'СОВРЕМЕННЫЕ ДВС / ИКЗ',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    image: 'assets/plugs/ceramic-smooth.webp',
    pros: 'Плотно обжимается резиновым наконечником индивидуальной катушки (COP), меньше скапливается пыль и масло на поверхности.',
    note: 'Используется на большинстве современных 16V и турбомоторов (VAG TSI, Hyundai/Kia G4FG, Renault H4M, LADA Vesta). При трещине или дубении резинки катушки возникает пробой по поверхности («чёрная полоса» вдоль изолятора).',
  },
  {
    name: 'Рифлёная керамика (Рёбра от пробоя)',
    badge: 'ЗАЩИТА ОТ ПЕРЕКРЫТИЯ',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    image: 'assets/plugs/ceramic-ribbed.webp',
    pros: 'Волнистые рёбра (4–5 канавок) удлиняют путь поверхностного разряда между наконечником и металлическим корпусом во влагу и мороз.',
    note: 'Классика для моторов с высоковольтными проводами (LADA 8V, Niva, УАЗ, старые иномарки). Рёбра спасают от утечки искры по сырому или запылённому изолятору при холодном пуске в слякоть и -40 °C.',
  },
];

const ELECTRODE_TYPES = [
  {
    name: 'Классический 1 электрод + V-канавка / U-паз',
    code: 'NGK «Y» (V-Line) • Denso «-U» (U-Groove)',
    image: 'assets/plugs/elec-vgroove.webp',
    desc: 'На центральном электроде (NGK) сделана V-образная прорезь, а у Denso на боковом электроде — U-образный паз. Искра бьёт с острых краёв, где ниже напряжение пробоя, а фронт пламени быстрее раскрывается в камеру сгорания.',
    usage: 'Атмосферные моторы, базовый тюнинг зажигания без удорожания.',
  },
  {
    name: 'Twin Tip (встречные тонкие электроды)',
    code: 'Denso «TT» (K20TT / IK20TT) • Laser Iridium',
    image: 'assets/plugs/elec-twintip.webp',
    desc: 'Тонкий центральный стержень (0.4–1.5 мм) направлен точно на ответный тонкий штифт на боковом электроде. Массивный металл не «гасит» ядро пламени, позволяя искре уверенно поджигать бедную смесь на морозе.',
    usage: 'ХМАО (-40 °C), автозапуск, ГБО и изношенные катушки.',
  },
  {
    name: 'Многоэлектродные (2, 3, 4 боковых электрода)',
    code: 'NGK «K» (2) / «T» (3) / «Q» (4) — BKUR6ET-10',
    image: 'assets/plugs/elec-multi.webp',
    desc: 'Искра всегда выбирает путь с наименьшим сопротивлением и поочерёдно перескакивает между боковыми электродами по мере их износа. Главное преимущество — увеличенный ресурс и стабильный зазор без регулировки.',
    usage: 'VAG, BMW, Opel, Mercedes прошлых поколений (важно: зазор не гнут!).',
  },
  {
    name: 'Полуповерхностный / скользящий разряд',
    code: 'NGK «R» (BMW) / BKR6EQUP • VAG / Porsche',
    image: 'assets/plugs/elec-surface.webp',
    desc: 'Боковые электроды расположены сбоку от выдвинутого конуса изолятора. Искра сначала скользит по поверхности керамики, выжигая сажу и нагар, а затем перепрыгивает на массу — идеальное самоочищение при коротких поездках.',
    usage: 'Двигатели с частыми прогревами, короткими городскими пробегами, прямой впрыск.',
  },
];

const REAL_ELECTRODE_LIST = [
  {
    title: '1. Широкий зазор (Wide Gap — 1.3 мм)',
    code: 'NGK BPR5ES-13',
    image: 'assets/plugs/ngk-wide-gap.webp',
    desc: 'Увеличенный искровой зазор (1.3 мм вместо 0.8 мм) даёт более длинную и мощную искру для поджига обеднённых смесей. Требует исправных высоковольтных катушек.',
  },
  {
    title: '2. Два боковых электрода (Twin Ground)',
    code: 'NGK BKR6EK',
    image: 'assets/plugs/ngk-twin-ground.webp',
    desc: 'Два боковых электрода увеличивают ресурс в 2 раза: искра поочерёдно бьёт в тот зазор, где меньше износ и сопротивление. Зазор не регулируется.',
  },
  {
    title: '3. Три боковых электрода (Three Ground)',
    code: 'NGK BCP6ET / Denso K22PB',
    image: 'assets/plugs/ngk-three-ground.webp',
    desc: 'Трёхэлектродная схема (классика VAG, Audi, BMW, Renault). Стабильное искрообразование на всём сроке службы без подгибания электродов.',
  },
  {
    title: '4. Четыре боковых электрода (Four Ground)',
    code: 'NGK BKR6EQUP',
    image: 'assets/plugs/ngk-four-ground.webp',
    desc: 'Четыре радиальных электрода вокруг платинового центра. Искра скользит по конусу изолятора, очищая его от нагара при коротких поездках (BMW Longlife).',
  },
  {
    title: '5. Глубокое выдвижение конуса (Extra Projected)',
    code: 'NGK ZFR6E-11',
    image: 'assets/plugs/ngk-extra-proj.webp',
    desc: 'Удлинённый тепловой конус выдвигает искровой зазор глубже в центр камеры сгорания для лучшей тяги на низах и экономии топлива (Honda, Mazda, Opel).',
  },
  {
    title: '6. Драгоценный металл (Precious Metal — Иридий)',
    code: 'NGK IZFR6B (Laser Iridium)',
    image: 'assets/plugs/ngk-precious.webp',
    desc: 'Ультратонкий иридиевый стержень 0.6 мм снижает напряжение пробоя и уверенно зажигает смесь на просевшем в -40 °C аккумуляторе.',
  },
  {
    title: '7. Полуповерхностный разряд + 3 электрода (Denso)',
    code: 'Denso W20ETR-S11 / K22PB',
    image: 'assets/plugs/denso-semi-surface.webp',
    desc: 'Дополнительный скользящий зазор вдоль изолятора выжигает сажу при прогревах на морозе (Toyota, Daihatsu).',
  },
  {
    title: '8. Конусный срез электрода (Taper-Cut)',
    code: 'Denso KJ20CR-L11',
    image: 'assets/plugs/denso-kj20-taper.webp',
    desc: 'Кончик бокового электрода срезан на конус, а центральный заужен — меньше экранирования пламени, лучше отклик двигателя (Honda, Mazda).',
  },
  {
    title: '9. Рифлёная керамика и ISO-корпус (Denso)',
    code: 'Denso Q16R-U11 (53 мм) vs K16R-U11 (50.5 мм)',
    image: 'assets/plugs/denso-ribbed-q16r.webp',
    desc: 'Рёбра (Corrugations) на изоляторе удлиняют путь утечки тока по поверхности и спасают от пробоя в сырость и мороз. Высота 50.5 мм — стандарт ISO.',
  },
  {
    title: '10. Гладкая керамика M12×26.5 и конусное седло',
    code: 'Denso XE20HR-U9 / T16EPR-U',
    image: 'assets/plugs/denso-long-xe20hr.webp',
    desc: 'Тонкие колодцы под ключ 14 мм с гладким изолятором под индивидуальную катушку (Renault H4M, Nissan, Vesta). В серии T16EPR-U уплотнение конусом без шайбы.',
  },
];

const PLUG_TYPES = [
  {
    name: 'Никелевые (Стандарт)',
    badge: 'БАЗОВЫЙ РЕСУРС',
    badgeClass: 'bg-slate-900/90 text-white border-slate-500/50',
    image: 'assets/plugs/denso-kj20-std.webp',
    electrode: '2.5 мм (никель-хромовый сплав, медный сердечник)',
    life: '20 000–30 000 км',
    khmaoLife: '15 000 км в ХМАО (-40 °C)',
    desc: 'Классический вариант для атмосферных моторов. Толстый электрод требует повышенного напряжения пробоя на холодном пуске, поэтому перед зимой критично проверять зазор и состояние катушек.',
    examples: 'NGK BPR6ES, BCPR6E-11, LZKAR7D-9D • Denso Q20PR-U11, K20PR-U',
  },
  {
    name: 'Платиновые / Twin Tip / Taper-Cut',
    badge: 'РЕСУРС И СТАБИЛЬНОСТЬ',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    image: 'assets/plugs/denso-kj20-taper.webp',
    electrode: '1.0–1.5 мм (платиновая напайка или зауженный TT/Taper)',
    life: '60 000 км (TT ~40 000 км)',
    khmaoLife: '30 000–45 000 км в ХМАО',
    desc: 'Платина устойчива к электроискровой эрозии. В серии Denso TT (Twin Tip) и Taper-Cut зауженные электроды фокусируют разряд без драгметаллов, улучшая воспламенение на морозе.',
    examples: 'NGK PLZKAR6A-11, PFR7S8EG • Denso K20TT, Q20TT, KJ20CR-L11',
  },
  {
    name: 'Иридиевые (Iridium IX / Laser)',
    badge: 'ЛУЧШЕЕ ДЛЯ -40 °C',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    image: 'assets/plugs/ngk-precious.webp',
    electrode: '0.4–0.6 мм (сверхтонкий иридий + платина на массе)',
    life: '90 000–120 000 км',
    khmaoLife: '45 000–60 000 км в ХМАО',
    desc: 'Тонкий иридиевый стержень концентрирует электрическое поле и снижает напряжение пробоя. Свеча уверенно даёт искру даже на просевшем в мороз аккумуляторе и меньше склонна к заливанию при автозапусках.',
    examples: 'NGK IZFR6B, SILZKR7B11, IFR7X7G • Denso IK20TT, IXEH20TT, VK20',
  },
];

const NGK_THREAD_TABLE = [
  { code: 'A', thread: 'Ø 18 мм', hex: '25.4 мм (1")', note: 'Старые моторы, спецтехника' },
  { code: 'AB', thread: 'Ø 18 мм', hex: '20.6 мм (13/16")', note: 'Компактный шестигранник' },
  { code: 'B', thread: 'Ø 14 мм', hex: '20.6–20.8 мм', note: 'Классика ВАЗ 8 кл., УАЗ' },
  { code: 'BC / BK', thread: 'Ø 14 мм', hex: '16.0 мм (5/8")', note: 'ISO-стандарт (ВАЗ 16 кл., Kia/Hyundai)' },
  { code: 'C', thread: 'Ø 10 мм', hex: '16.0 мм (5/8")', note: 'Мототехника, малые ДВС' },
  { code: 'D / DC', thread: 'Ø 12 мм', hex: '18.0 / 16.0 мм', note: 'Тонкая резьба (DC = 16 мм)' },
  { code: 'E', thread: 'Ø 8 мм', hex: '13.0 мм', note: 'Микро-свечи (мото / спорт)' },
  { code: 'L + Z / K', thread: 'Ø 12 мм', hex: '14.0 / 16.0 мм', note: 'Длинная резьба 26.5 мм (Renault, Vesta H4M)' },
];

const NGK_SUFFIX_TABLE = [
  { group: 'Длина резьбы и седло', items: 'E = 19.0 мм • H = 12.7 мм • L = 11.2 мм • нет буквы = 9.5 мм • F = конусное седло (без кольца)' },
  { group: 'Конструкция (после калильного)', items: 'P = выдвинутый изолятор • R = резистор (5 кОм) • L = удлинённая резьба 26.5 мм • Z = зазор/удлинённый корпус' },
  { group: 'Материал электрода', items: 'S = стандарт 2.6 мм (медный сердечник) • P = платина • V = золото-палладий • VX = платина high-perf • IX = иридий 0.6 мм' },
  { group: 'Массовые электроды и фишки', items: 'K = 2 боковых электрода • T = 3 боковых • Q = 4 боковых • R = дельта-форма (BMW) • Y = V-образная канавка • X = booster gap' },
  { group: 'Заводской зазор (через дефис)', items: '-8 = 0.8 мм • -9 = 0.9 мм • -10 = 1.0 мм • -11 = 1.1 мм • -13 = 1.3 мм • без индекса = обычно 0.7–0.8 мм' },
];

const NGK_EXAMPLES = [
  {
    code: 'BPR6ES',
    car: 'LADA Niva Legend / 2107 / УАЗ',
    parts: [
      { tok: 'B', desc: 'Резьба M14, шестигранник 20.8 мм' },
      { tok: 'P', desc: 'Выдвинутый тепловой конус изолятора' },
      { tok: 'R', desc: 'Встроенный помехоподавительный резистор' },
      { tok: '6', desc: 'Калильное число (средне-горячая)' },
      { tok: 'E', desc: 'Длина резьбы 19.0 мм' },
      { tok: 'S', desc: 'Стандартный никелевый электрод 2.6 мм' },
    ],
  },
  {
    code: 'BCPR6E-11',
    car: 'LADA Vesta 1.6/1.8, Priora, Granta 16 кл.',
    parts: [
      { tok: 'BC', desc: 'Резьба M14, тонкий шестигранник 16 мм' },
      { tok: 'P', desc: 'Выдвинутый изолятор' },
      { tok: 'R', desc: 'Резистор 5 кОм (защита ЭБУ и катушек)' },
      { tok: '6', desc: 'Калильное число 6 (норма для ДВС ВАЗ)' },
      { tok: 'E', desc: 'Длина резьбы 19.0 мм' },
      { tok: '-11', desc: 'Заводской искровой зазор 1.1 мм' },
    ],
  },
  {
    code: 'LZKAR7D-9D',
    car: 'Renault Logan/Duster/Kaptur, LADA Vesta H4M',
    parts: [
      { tok: 'L', desc: 'Удлинённая резьбовая часть 26.5 мм' },
      { tok: 'Z', desc: 'Спец. конструкция с увеличенным вылетом' },
      { tok: 'KA', desc: 'Резьба M12, ключ на 14 мм (тонкостенный!)' },
      { tok: 'R', desc: 'Встроенный резистор' },
      { tok: '7', desc: 'Калильное число 7 (холоднее стандартной 6)' },
      { tok: 'D-9D', desc: 'Конструкция электрода, зазор 0.9 мм' },
    ],
  },
  {
    code: 'SILZKR7B11',
    car: 'Hyundai Solaris / Creta, Kia Rio (G4FG/G4FC)',
    parts: [
      { tok: 'S', desc: 'Ультра-компактная геометрия (Laser Iridium)' },
      { tok: 'I', desc: 'Иридиевый центральный электрод' },
      { tok: 'L', desc: 'Удлинённая резьба 26.5 мм' },
      { tok: 'ZKR', desc: 'M12, ключ 16 мм, встроенный резистор' },
      { tok: '7B', desc: 'Калильное число 7, спец-серия' },
      { tok: '11', desc: 'Заводской зазор 1.1 мм' },
    ],
  },
  {
    code: 'PFR7S8EG',
    car: 'VAG TSI / TFSI (1.8 / 2.0 EA888) — турбо',
    parts: [
      { tok: 'P', desc: 'Двойная платина (Laser Platinum)' },
      { tok: 'F', desc: 'Спец. длина/посадка для прямого впрыска' },
      { tok: 'R', desc: 'Резистор для защиты индивидуальных катушек' },
      { tok: '7', desc: 'Холодная свеча (7) под высокий наддув' },
      { tok: 'S8', desc: 'Усиленный уплотнитель + зазор 0.8 мм' },
      { tok: 'EG', desc: 'Спец-серия для турбомоторов VAG' },
    ],
  },
];

const DENSO_PREFIX_TABLE = [
  { code: 'без префикса', series: 'Standard Nickel / Platinum', desc: 'Базовые никелевые и платиновые свечи OEM-качества' },
  { code: 'I / IK / IX', series: 'Iridium Power (0.4 мм)', desc: 'Тончайший в мире иридий 0.4 мм с U-образным пазом, фокус на отклик и пуск' },
  { code: 'V / VK', series: 'Iridium Tough (0.4 мм + Pt)', desc: 'Иридий 0.4 мм + платиновая напайка на массе — максимальный ресурс до 100 000 км' },
  { code: 'S / SK', series: 'Iridium Long Life', desc: 'OEM-серия (0.7 мм иридий + платина) для заводской конвейерной комплектации' },
  { code: '…TT', series: 'Twin Tip (Nickel TT / Iridium TT)', desc: 'Встречные тонкие электроды 1.5 мм (никель) или 0.4/0.7 мм (Iridium TT)' },
];

const DENSO_THREAD_TABLE = [
  { code: 'W', thread: 'Ø 14 мм', reach: '19.0 мм', hex: '20.6 мм', ex: 'W20EPR-U (аналог BPR6ES)' },
  { code: 'Q', thread: 'Ø 14 мм', reach: '19.0 мм', hex: '16.0 мм', ex: 'Q20PR-U11 (аналог BCPR6E-11)' },
  { code: 'K', thread: 'Ø 14 мм', reach: '19.0 мм', hex: '16.0 мм (ISO)', ex: 'K20TT, IK20TT, K16PR-U11' },
  { code: 'X', thread: 'Ø 12 мм', reach: '19.0 мм', hex: '18.0 мм', ex: 'Мото и спецтехника' },
  { code: 'XU', thread: 'Ø 12 мм', reach: '19.0 мм', hex: '16.0 мм', ex: 'XU22EPR-U (Kia/Hyundai, Suzuki)' },
  { code: 'XE / XEH / FXE', thread: 'Ø 12 мм', reach: '26.5 мм', hex: '14.0 мм', ex: 'IXEH20TT, FXE20HR11 (Renault, Toyota)' },
];

const HEAT_SCALE = [
  { denso: '14', ngk: '4', type: 'Очень горячая (зима / малые нагрузки)' },
  { denso: '16', ngk: '5', type: 'Горячая (спокойная езда, город)' },
  { denso: '20', ngk: '6', type: 'Универсальная средняя (норма большинства авто)' },
  { denso: '22', ngk: '7', type: 'Холодная (высокая степень сжатия, турбо)' },
  { denso: '24', ngk: '8', type: 'Очень холодная (форсированные ДВС, спорт)' },
  { denso: '27', ngk: '9', type: 'Сверххолодная (трек / высокий буст)' },
];

const DENSO_EXAMPLES = [
  {
    code: 'Q20PR-U11',
    car: 'LADA Vesta, Priora, Kia / Hyundai (атмосферные)',
    parts: [
      { tok: 'Q', desc: 'Резьба M14, шестигранник 16 мм' },
      { tok: '20', desc: 'Калильное число 20 (соответствует NGK 6)' },
      { tok: 'P', desc: 'Выдвинутый тепловой конус изолятора' },
      { tok: 'R', desc: 'Резистор 5 кОм' },
      { tok: '-U', desc: 'U-образный паз на боковом электроде' },
      { tok: '11', desc: 'Заводской зазор 1.1 мм' },
    ],
  },
  {
    code: 'K20TT',
    car: 'Универсальная Twin Tip (LADA 16V, Kia, Chevrolet)',
    parts: [
      { tok: 'K', desc: 'M14, шестигранник 16 мм, ISO-длина 50.5 мм' },
      { tok: '20', desc: 'Калильное число 20 (NGK 6)' },
      { tok: 'TT', desc: 'Twin Tip — оба электрода диаметром 1.5 мм' },
      { tok: 'Зазор', desc: 'По умолчанию ~1.0 мм (для ВАЗ/Рено проверяют 0.9–1.0)' },
    ],
  },
  {
    code: 'IK20TT',
    car: 'Iridium TT — замена Q20PR-U11 / BKR6E-11',
    parts: [
      { tok: 'I', desc: 'Серия Iridium (центр 0.4 мм)' },
      { tok: 'K', desc: 'M14, ключ 16 мм, длина резьбы 19 мм' },
      { tok: '20', desc: 'Калильное число 20 (NGK 6)' },
      { tok: 'TT', desc: 'Iridium TT: иридий 0.4 мм + платина 0.7 мм на массе' },
    ],
  },
  {
    code: 'IXEH20TT',
    car: 'Renault / Nissan H4M, LADA Vesta H4M, Toyota',
    parts: [
      { tok: 'I', desc: 'Иридиевый центральный электрод 0.4 мм' },
      { tok: 'XE', desc: 'Тонкая резьба M12, ключ 14 мм, длина 26.5 мм' },
      { tok: 'H', desc: 'Выдвинутая/спец. геометрия изолятора' },
      { tok: '20', desc: 'Калильное число 20 (близко к NGK 6–7)' },
      { tok: 'TT', desc: 'Встречный платиновый наконечник на массе' },
    ],
  },
  {
    code: 'VK22',
    car: 'Iridium Tough для турбо и ГБО (холодная)',
    parts: [
      { tok: 'V', desc: 'Iridium Tough (макс. ресурс 100 000 км)' },
      { tok: 'K', desc: 'M14, ключ 16 мм' },
      { tok: '22', desc: 'Холодное калильное число 22 (NGK 7)' },
    ],
  },
];

const CROSS_ROWS = [
  { ngk: 'BPR6ES', denso: 'W20EPR-U / W20TT', spec: 'M14×19, ключ 21, зазор 0.8', cars: 'Niva Legend, ВАЗ 2107, УАЗ' },
  { ngk: 'BCPR6E-11', denso: 'Q20PR-U11 / Q20TT', spec: 'M14×19, ключ 16, зазор 1.1', cars: 'Vesta 1.6/1.8, Granta 16V, Priora' },
  { ngk: 'BKR6E-11', denso: 'K20PR-U11 / K20TT', spec: 'M14×19, ключ 16 ISO, зазор 1.1', cars: 'Kia/Hyundai 1.4/1.6, Mazda, Nissan' },
  { ngk: 'LZKAR7D-9D', denso: 'XE20HR-U9 / IXEH20TT', spec: 'M12×26.5, ключ 14, зазор 0.9', cars: 'Renault K4M/H4M, Vesta H4M, Largus' },
  { ngk: 'SILZKR7B11', denso: 'VXUH22I / IXUH22FTT', spec: 'M12×26.5, ключ 16, иридий', cars: 'Solaris II, Rio IV, Creta (G4FG)' },
  { ngk: 'PFR7S8EG', denso: 'PK22PR8 / IK22FTT', spec: 'M14×19, ключ 16, зазор 0.8', cars: 'VW / Skoda / Audi 1.8 & 2.0 TSI' },
  { ngk: 'IZFR6K11', denso: 'SKJ20DR-M11 / IK20TT', spec: 'M14×19, ключ 16, иридий', cars: 'Honda Civic/CR-V, Acura' },
  { ngk: 'DF6H-11B', denso: 'FK20HR11 / VFXEH20', spec: 'M12×26.5, ключ 14, иридий', cars: 'Toyota Camry, RAV4, Corolla' },
];

export default function SparkPlugGuideModal({ isOpen, onClose }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [ngkExampleIdx, setNgkExampleIdx] = useState(0);
  const [densoExampleIdx, setDensoExampleIdx] = useState(0);
  const [zoomedImg, setZoomedImg] = useState(null);
  const contentRef = useRef(null);
  const tabRefs = useRef([]);

  const goToSlide = (nextIdx) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, nextIdx));
    if (clamped === activeSlide) return;
    setDirection(clamped > activeSlide ? 1 : -1);
    setActiveSlide(clamped);
  };

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    const activeTab = tabRefs.current[activeSlide];
    if (activeTab && typeof activeTab.scrollIntoView === 'function') {
      activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeSlide, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (zoomedImg) setZoomedImg(null);
        else onClose();
      }
      if (!zoomedImg && e.key === 'ArrowRight') {
        setActiveSlide((s) => {
          const next = Math.min(SLIDES.length - 1, s + 1);
          if (next !== s) setDirection(1);
          return next;
        });
      }
      if (!zoomedImg && e.key === 'ArrowLeft') {
        setActiveSlide((s) => {
          const prev = Math.max(0, s - 1);
          if (prev !== s) setDirection(-1);
          return prev;
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose, zoomedImg]);

  const currentNgk = NGK_EXAMPLES[ngkExampleIdx];
  const currentDenso = DENSO_EXAMPLES[densoExampleIdx];
  const progressRatio = (activeSlide + 1) / SLIDES.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#04070f]/85"
          />

          <motion.div
            data-keep-dark
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.9 }}
            className="relative w-[96vw] max-w-7xl h-[90vh] sm:h-[88vh] flex flex-col rounded-2xl bg-gradient-to-b from-[#0d192e] via-[#0b1322] to-[#080d17] border border-[#60a5fa]/25 shadow-[inset_0_1px_0_0_rgba(186,230,253,0.22),0_25px_65px_-15px_rgba(2,6,23,0.92)] overflow-hidden text-white"
          >
            {/* Subtle top atmospheric glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.14),transparent_70%)]"
            />

            {/* Header */}
            <div className="relative shrink-0 flex items-start justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-3.5 border-b border-[#60a5fa]/15">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a6d]/80 to-[#0f2242]/90 border border-[#7dd3fc]/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_14px_-4px_rgba(56,189,248,0.35)] flex items-center justify-center text-sky-300 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-sky-500/25 to-amber-500/25 border border-sky-400/35 text-sky-200 text-[10px] font-bold font-mono tracking-wider uppercase shrink-0">
                      МОДУЛЬ • {activeSlide + 1} / {SLIDES.length}
                    </span>
                    <span className="hidden sm:inline text-xs text-slate-400">
                      Интерактивный курс NGK &amp; Denso • ХМАО (-40 °C)
                    </span>
                  </div>
                  <div className="mt-1 overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.h2
                        key={SLIDES[activeSlide].id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                        className="text-sm sm:text-xl font-bold text-white leading-tight truncate"
                      >
                        {SLIDES[activeSlide].title}
                      </motion.h2>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                aria-label="Закрыть обучение"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Animated Progress Bar */}
            <div className="relative h-[2px] w-full bg-white/5 shrink-0 overflow-hidden">
              <motion.div
                className="h-full origin-left bg-gradient-to-r from-sky-400 via-cyan-300 to-amber-400"
                initial={false}
                animate={{ scaleX: progressRatio }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              />
            </div>

            {/* Slide Tabs (Liquid Glass Pills) */}
            <div className="shrink-0 px-4 sm:px-6 py-2.5 border-b border-[#60a5fa]/15 bg-[#070d18]/75 flex items-center gap-1.5 overflow-x-auto">
              {SLIDES.map((s, idx) => {
                const isActive = activeSlide === idx;
                return (
                  <button
                    key={s.id}
                    ref={(el) => {
                      tabRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`relative z-10 shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                      isActive ? 'text-[#e0f2fe]' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="guide-slide-pill"
                        transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.85 }}
                        className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-[#1e3a6d]/95 to-[#122647]/95 backdrop-blur-md border border-[#93c5fd]/45 shadow-[inset_0_1px_1px_rgba(186,230,253,0.35),0_4px_12px_-2px_rgba(2,6,23,0.6)]"
                      />
                    )}
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* Slide Content (Directional GPU Transition) */}
            <div ref={contentRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 sm:py-5">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={SLIDES[activeSlide].id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -24 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  {/* SLIDE 1: TYPES (REAL CATALOG PHOTOS) */}
                  {activeSlide === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {PLUG_TYPES.map((plug) => (
                        <div
                          key={plug.name}
                          className="rounded-xl bg-[#161b25]/90 border border-white/10 overflow-hidden flex flex-col shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
                        >
                          <button
                            type="button"
                            onClick={() => setZoomedImg({ src: plug.image, title: plug.name })}
                            className="group relative h-64 bg-white overflow-hidden border-b border-white/10 flex items-center justify-center p-3 cursor-zoom-in"
                          >
                            <img
                              src={plug.image}
                              alt={plug.name}
                              className="max-h-full w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                            />
                            <span
                              className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold border bg-[#0d1117]/85 backdrop-blur-md ${plug.badgeClass}`}
                            >
                              {plug.badge}
                            </span>
                            <span className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-[#0d1117]/80 text-white opacity-75 group-hover:opacity-100 transition-opacity">
                              <ZoomIn className="w-4 h-4" />
                            </span>
                          </button>
                          <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                            <div>
                              <h3 className="text-sm font-bold text-white">{plug.name}</h3>
                              <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">
                                {plug.desc}
                              </p>
                            </div>
                            <div className="space-y-1.5 pt-2.5 border-t border-white/10 text-xs">
                              <div className="text-slate-200">
                                <span className="text-slate-400">Электрод:</span>{' '}
                                <span className="font-mono text-white">{plug.electrode}</span>
                              </div>
                              <div className="text-slate-200">
                                <span className="text-slate-400">Ресурс:</span>{' '}
                                <span className="font-mono text-white">{plug.life}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sky-300 font-medium">
                                <Snowflake className="w-3.5 h-3.5 shrink-0" />
                                <span>{plug.khmaoLife}</span>
                              </div>
                              <div className="pt-1 text-[13px] font-mono text-amber-300/90">
                                {plug.examples}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SLIDE 2: REAL CUTAWAY, CERAMIC & ELECTRODES (LARGE LIST + ZOOM) */}
                  {activeSlide === 1 && (
                    <div className="space-y-5">
                      {/* Cutaway + Resistor + Core */}
                      <div className="rounded-xl bg-[#161b25]/90 border border-white/10 p-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                        <button
                          type="button"
                          onClick={() =>
                            setZoomedImg({
                              src: 'assets/plugs/real-cutaway.webp',
                              title: 'Свеча зажигания NGK в разрезе (кликните вне фото, чтобы закрыть)',
                            })
                          }
                          className="group relative lg:col-span-5 bg-white rounded-xl p-3 border border-white/20 flex items-center justify-center cursor-zoom-in"
                        >
                          <img
                            src="assets/plugs/real-cutaway.webp"
                            alt="Свеча зажигания NGK в разрезе"
                            className="max-h-[420px] w-auto object-contain"
                          />
                          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0d1117]/85 text-white text-[13px] font-medium">
                            <ZoomIn className="w-3.5 h-3.5" />
                            <span>Увеличить</span>
                          </span>
                        </button>
                        <div className="lg:col-span-7 space-y-3 text-xs">
                          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                            Свеча зажигания в разрезе (официальная схема NGK)
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10">
                              <span className="font-bold text-white">1. Терминал и рёбра (Corrugations):</span>{' '}
                              <span className="text-slate-200">
                                Контактный вывод под катушку. Рёбра на керамике удлиняют путь тока по поверхности и спасают от пробоя во влагу и -40 °C (гладкая керамика применяется под плотный колпачок ИКЗ).
                              </span>
                            </div>
                            <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10">
                              <span className="font-bold text-amber-300">2. Керамический резистор (5 кОм):</span>{' '}
                              <span className="text-slate-200">
                                Подавляет электромагнитные помехи от искры (буква «R» в коде). Без резистора возникают сбои ДПКВ, CAN-шины, ABS и радио.
                              </span>
                            </div>
                            <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10">
                              <span className="font-bold text-sky-300">3. Стекло-герметик (Special packing):</span>{' '}
                              <span className="text-slate-200">
                                Спечённый токопроводящий состав герметично держит давление до 60+ бар, не пуская газы через изолятор.
                              </span>
                            </div>
                            <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10">
                              <span className="font-bold text-emerald-300">4. Медный сердечник (Copper core):</span>{' '}
                              <span className="text-slate-200">
                                Отводит тепло от кончика электрода в корпус и ГБЦ, защищая от калильного зажигания и расширяя тепловой диапазон.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Long Vertical List of 10 Large Real Electrode / Insulator Cards */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                            Подробный каталог реальных электродов, керамики и корпусов (10 типов — нажмите для увеличения)
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {REAL_ELECTRODE_LIST.map((item) => (
                            <div
                              key={item.title}
                              className="rounded-xl bg-[#161b25]/90 border border-white/10 overflow-hidden flex flex-col sm:flex-row shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                            >
                              <button
                                type="button"
                                onClick={() => setZoomedImg({ src: item.image, title: `${item.title} — ${item.code}` })}
                                className="group relative w-full sm:w-56 h-56 sm:h-auto bg-white shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 flex items-center justify-center p-2 cursor-zoom-in"
                              >
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="max-h-52 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                                />
                                <span className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-[#0d1117]/80 text-white opacity-80 group-hover:opacity-100">
                                  <ZoomIn className="w-3.5 h-3.5" />
                                </span>
                              </button>
                              <div className="p-4 flex flex-col justify-center gap-2 text-xs">
                                <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
                                <div className="inline-flex w-fit px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 font-mono text-[13px] font-bold text-amber-300">
                                  {item.code}
                                </div>
                                <p className="text-xs text-slate-200 leading-relaxed">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 3: NGK DECODING */}
                  {activeSlide === 2 && (
                    <div className="space-y-4">
                      {/* Interactive Examples */}
                      <div className="rounded-xl bg-[#161b25]/90 border border-white/10 p-4 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                            Примеры расшифровки NGK (нажмите на артикул)
                          </span>
                          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#070d18]/70 border border-white/10">
                            {NGK_EXAMPLES.map((ex, idx) => {
                              const isActive = ngkExampleIdx === idx;
                              return (
                                <button
                                  key={ex.code}
                                  type="button"
                                  onClick={() => setNgkExampleIdx(idx)}
                                  className={`relative z-10 px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-colors cursor-pointer ${
                                    isActive ? 'text-[#fef3c7]' : 'text-slate-300 hover:text-white'
                                  }`}
                                >
                                  {isActive && (
                                    <motion.span
                                      layoutId="guide-ngk-pill"
                                      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                                      className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-b from-amber-500/35 to-amber-600/25 border border-amber-400/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                                    />
                                  )}
                                  {ex.code}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="text-xs text-slate-400">
                          Применение: <span className="text-white font-medium">{currentNgk.car}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {currentNgk.parts.map((p) => (
                            <div
                              key={p.tok}
                              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.04] border border-white/10"
                            >
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold shrink-0">
                                {p.tok}
                              </span>
                              <span className="text-xs text-slate-200 leading-snug">{p.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Two-column Reference Tables */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="rounded-xl bg-[#161b25]/90 border border-white/10 overflow-hidden">
                          <div className="px-3.5 py-2.5 border-b border-white/10 bg-white/[0.03] text-xs font-bold text-white">
                            1. Префикс NGK: диаметр резьбы и ключ
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-white/10 text-slate-400">
                                  <th className="py-2 px-3">Буква</th>
                                  <th className="py-2 px-3">Резьба</th>
                                  <th className="py-2 px-3">Ключ</th>
                                  <th className="py-2 px-3">Применение</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {NGK_THREAD_TABLE.map((row) => (
                                  <tr key={row.code} className="hover:bg-white/[0.02]">
                                    <td className="py-1.5 px-3 font-mono font-bold text-amber-300">{row.code}</td>
                                    <td className="py-1.5 px-3 font-mono text-slate-200">{row.thread}</td>
                                    <td className="py-1.5 px-3 font-mono text-slate-200">{row.hex}</td>
                                    <td className="py-1.5 px-3 text-slate-200">{row.note}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="rounded-xl bg-[#161b25]/90 border border-white/10 p-3.5 space-y-2.5">
                          <div className="text-xs font-bold text-white border-b border-white/10 pb-2">
                            2. Суффиксы NGK: длина, электрод, зазор
                          </div>
                          {NGK_SUFFIX_TABLE.map((row) => (
                            <div key={row.group} className="text-xs">
                              <div className="text-amber-300 font-semibold">{row.group}</div>
                              <div className="text-slate-200 leading-relaxed mt-0.5 font-mono text-[13px]">
                                {row.items}
                              </div>
                            </div>
                          ))}
                          <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/25 text-[13px] text-sky-200">
                            <span className="font-bold">Калильное число NGK (2…13):</span> чем{' '}
                            <span className="underline">меньше</span> цифра (4–5) — тем свеча{' '}
                            <b>горячее</b>; чем <span className="underline">больше</span> (7–9) — тем{' '}
                            <b>холоднее</b>. Для большинства авто РФ норма — <b>6</b>.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 4: DENSO DECODING */}
                  {activeSlide === 3 && (
                    <div className="space-y-4">
                      {/* Interactive Examples */}
                      <div className="rounded-xl bg-[#161b25]/90 border border-white/10 p-4 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                            Примеры расшифровки Denso (нажмите на артикул)
                          </span>
                          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#070d18]/70 border border-white/10">
                            {DENSO_EXAMPLES.map((ex, idx) => {
                              const isActive = densoExampleIdx === idx;
                              return (
                                <button
                                  key={ex.code}
                                  type="button"
                                  onClick={() => setDensoExampleIdx(idx)}
                                  className={`relative z-10 px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-colors cursor-pointer ${
                                    isActive ? 'text-[#e0f2fe]' : 'text-slate-300 hover:text-white'
                                  }`}
                                >
                                  {isActive && (
                                    <motion.span
                                      layoutId="guide-denso-pill"
                                      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                                      className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-b from-sky-500/35 to-sky-600/25 border border-sky-400/50 shadow-[inset_0_1px_1px_rgba(186,230,253,0.25)]"
                                    />
                                  )}
                                  {ex.code}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="text-xs text-slate-400">
                          Применение: <span className="text-white font-medium">{currentDenso.car}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {currentDenso.parts.map((p) => (
                            <div
                              key={p.tok}
                              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.04] border border-white/10"
                            >
                              <span className="px-2 py-0.5 rounded bg-sky-500/20 border border-sky-500/30 text-sky-300 font-mono text-xs font-bold shrink-0">
                                {p.tok}
                              </span>
                              <span className="text-xs text-slate-200 leading-snug">{p.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Series + Thread */}
                        <div className="space-y-3">
                          <div className="rounded-xl bg-[#161b25]/90 border border-white/10 p-3.5 space-y-2">
                            <div className="text-xs font-bold text-white border-b border-white/10 pb-1.5">
                              1. Серии Denso (префикс и суффикс TT)
                            </div>
                            {DENSO_PREFIX_TABLE.map((item) => (
                              <div key={item.code} className="text-xs flex items-start gap-2">
                                <span className="font-mono font-bold text-sky-300 min-w-[82px] shrink-0">
                                  {item.code}
                                </span>
                                <div>
                                  <span className="font-semibold text-white">{item.series}: </span>
                                  <span className="text-slate-200">{item.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="rounded-xl bg-[#161b25]/90 border border-white/10 overflow-hidden">
                            <div className="px-3.5 py-2 border-b border-white/10 bg-white/[0.03] text-xs font-bold text-white">
                              2. Резьба и шестигранник Denso
                            </div>
                            <table className="w-full text-left text-[13px]">
                              <thead>
                                <tr className="border-b border-white/10 text-slate-400">
                                  <th className="py-1.5 px-2.5">Код</th>
                                  <th className="py-1.5 px-2.5">Резьба×Длина</th>
                                  <th className="py-1.5 px-2.5">Ключ</th>
                                  <th className="py-1.5 px-2.5">Пример</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {DENSO_THREAD_TABLE.map((row) => (
                                  <tr key={row.code}>
                                    <td className="py-1.5 px-2.5 font-mono font-bold text-sky-300">{row.code}</td>
                                    <td className="py-1.5 px-2.5 font-mono text-slate-200">{row.thread}×{row.reach}</td>
                                    <td className="py-1.5 px-2.5 font-mono text-slate-200">{row.hex}</td>
                                    <td className="py-1.5 px-2.5 text-slate-200">{row.ex}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Heat scale */}
                        <div className="rounded-xl bg-[#161b25]/90 border border-white/10 overflow-hidden flex flex-col">
                          <div className="px-3.5 py-2.5 border-b border-white/10 bg-white/[0.03] text-xs font-bold text-white flex items-center gap-2">
                            <Flame className="w-3.5 h-3.5 text-amber-400" />
                            <span>3. Таблица калильных чисел: Denso ↔ NGK</span>
                          </div>
                          <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-white/10 text-slate-400">
                                  <th className="py-2 px-3">Denso</th>
                                  <th className="py-2 px-3">NGK</th>
                                  <th className="py-2 px-3">Тепловая характеристика</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {HEAT_SCALE.map((row) => (
                                  <tr key={row.denso}>
                                    <td className="py-2 px-3 font-mono font-bold text-sky-300">{row.denso}</td>
                                    <td className="py-2 px-3 font-mono font-bold text-amber-300">{row.ngk}</td>
                                    <td className="py-2 px-3 text-slate-200">{row.type}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="p-3 bg-white/[0.02] border-t border-white/10 text-[13px] text-slate-200">
                            <b>Суффиксы Denso:</b> <span className="font-mono text-sky-300">-U</span> (U-паз на массе),{' '}
                            <span className="font-mono text-sky-300">-L</span> (удлинённый корпус),{' '}
                            <span className="font-mono text-sky-300">N</span> (коническое седло),{' '}
                            <span className="font-mono text-sky-300">P / G</span> (платина). Цифра в конце (<span className="font-mono">8, 9, 11</span>) — зазор 0.8 / 0.9 / 1.1 мм.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 5: DIESEL GLOW PLUGS */}
                  {activeSlide === 4 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-xl bg-[#161b25]/90 border border-white/10 p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <h3 className="text-sm font-bold text-white">Свечи накаливания NGK (Glow Plugs)</h3>
                          </div>
                          <div className="space-y-2 text-xs text-slate-200">
                            <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/10">
                              <span className="font-mono font-bold text-amber-300">Y- / YS / YD</span> — металлический штифт (Metal Glow Plug):{' '}
                              <span className="font-mono">1, 3, 5</span> в коде часто означают резьбу M10;{' '}
                              <span className="font-mono">2, 9</span> — M12; <span className="font-mono">R</span> — система QGS (быстрый нагрев);{' '}
                              <span className="font-mono">AS / J</span> — AQGS/SRM (до 1000 °C за 2–3 сек).
                            </div>
                            <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/10">
                              <span className="font-mono font-bold text-sky-300">CZ / CY</span> — керамические свечи (Ceramic / NHTC): разогрев до{' '}
                              <b>1000–1300 °C за &lt; 2 сек</b>, долгий постнакал на холодном ХХ (Евро-5 / Евро-6).
                            </div>
                            <div className="text-[13px] font-mono text-slate-400">
                              Примеры: NGK Y1002AS (4.4V), Y-507J (11V), CZ303 (7V).
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl bg-[#161b25]/90 border border-white/10 p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-sky-400" />
                            <h3 className="text-sm font-bold text-white">Свечи накаливания Denso (серия DG)</h3>
                          </div>
                          <div className="space-y-2 text-xs text-slate-200">
                            <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/10">
                              <span className="font-mono font-bold text-sky-300">DG-001 … DG-670</span> — серийный каталожный код Denso.{' '}
                              <b>Важно:</b> по цифрам кода <span className="font-mono">DG-xxx</span> нельзя напрямую прочитать резьбу или вольтаж — подбор идёт строго по OEM-номеру или каталогу.
                            </div>
                            <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/10">
                              Типы Denso: <b>Double Coil</b> (двойная спираль — быстрый нагрев + защита от перегрева),{' '}
                              <b>Instant Heating</b> и <b>Ceramic</b> (керамика для современных дизелей Common Rail).
                            </div>
                            <div className="text-[13px] font-mono text-slate-400">
                              Примеры: Denso DG-193 (4.4V VAG TDI), DG-144 (11V), DG-624 (керамика 7V).
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Critical Diesel Warning */}
                      <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-xs">
                          <div className="font-bold text-rose-300">
                            Критичное правило для дизеля в ХМАО: не путайте напряжение (4.4V / 7V / 11V) и материал!
                          </div>
                          <p className="text-slate-200 leading-relaxed">
                            1) Установка свечи <b>4.4V или 7V</b> вместо <b>11V</b> приводит к мгновенному выгоранию штифта или ошибке блока накала (GPCM).{' '}
                            2) Нельзя менять керамическую свечу (<span className="font-mono">CZ</span>) на металлическую (<span className="font-mono">Y</span>) без проверки совместимости ЭБУ: отличается сопротивление и ток постнакала.{' '}
                            3) При пробеге более 100 000 км перед выкручиванием в морозы прогревайте ГБЦ до 80 °C, чтобы не обломить свечу.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 6: CROSS-REFERENCE & MISTAKES */}
                  {activeSlide === 5 && (
                    <div className="space-y-4">
                      <div className="rounded-xl bg-[#161b25]/90 border border-white/10 overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-white/10 bg-white/[0.03] text-xs font-bold text-white">
                          Кросс-таблица популярных свечей для РФ и ХМАО
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-white/10 text-slate-400">
                                <th className="py-2 px-3">NGK</th>
                                <th className="py-2 px-3">Denso</th>
                                <th className="py-2 px-3">Параметры</th>
                                <th className="py-2 px-3">Популярные модели</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {CROSS_ROWS.map((row) => (
                                <tr key={row.ngk} className="hover:bg-white/[0.02]">
                                  <td className="py-2 px-3 font-mono font-bold text-amber-300">{row.ngk}</td>
                                  <td className="py-2 px-3 font-mono font-bold text-sky-300">{row.denso}</td>
                                  <td className="py-2 px-3 text-slate-200">{row.spec}</td>
                                  <td className="py-2 px-3 text-slate-200">{row.cars}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-xl bg-rose-500/10 border border-rose-500/25 p-3.5 text-xs space-y-1">
                          <div className="font-bold text-rose-300">Ошибка №1: Перепутали длину резьбы (19 мм vs 26.5 мм)</div>
                          <p className="text-slate-200">
                            Слишком длинная свеча (<span className="font-mono">L / XE</span>) упрётся в поршень или закоксуется на выходе; короткая — не догорит смесь, появятся пропуски зажигания.
                          </p>
                        </div>
                        <div className="rounded-xl bg-rose-500/10 border border-rose-500/25 p-3.5 text-xs space-y-1">
                          <div className="font-bold text-rose-300">Ошибка №2: Свеча без резистора (нет «R»)</div>
                          <p className="text-slate-200">
                            Отсутствие резистора 5 кОм даёт помехи на ДПКВ, CAN-шину и индивидуальные катушки зажигания — ЭБУ уходит в ошибку.
                          </p>
                        </div>
                        <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3.5 text-xs space-y-1">
                          <div className="font-bold text-amber-300">Ошибка №3: Неверный зазор в мороз</div>
                          <p className="text-slate-200">
                            Увеличенный зазор (1.1 мм на изношенных катушках ВАЗ/Renault при -35 °C) пробивает катушку. Для щупа допустима корректировка только на никеле (на иридии гнуть электрод нельзя!).
                          </p>
                        </div>
                        <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3.5 text-xs space-y-1">
                          <div className="font-bold text-amber-300">Ошибка №4: Ключ 14 мм vs 16 мм</div>
                          <p className="text-slate-200">
                            Для <span className="font-mono">LZKAR7D-9D</span> и <span className="font-mono">IXEH20TT</span> нужен тонкостенный ключ на 14 мм (часто 12-гранный) — обычный 16 мм не пролезет в колодец ГБЦ.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 7: ORIGINAL VS FAKE */}
                  {activeSlide === 6 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          {
                            title: '1. Порошок на стыке (Тальк)',
                            text: 'На оригинале NGK вокруг гайки между керамикой и корпусом всегда виден ровный белый кристаллический порошок (герметик). На подделке стык чистый или залит серым клеем.',
                          },
                          {
                            title: '2. Лазерный штамп и шрифт',
                            text: 'У оригинального NGK на гранях шестигранника чёткий 4-значный код партии. У Denso краска на изоляторе нанесена точками (матричная печать), а не сплошной линией.',
                          },
                          {
                            title: '3. Уплотнительное кольцо',
                            text: 'Фирменное кольцо свёрнуто из тройного листа и НЕ скручивается с резьбы вручную. На контрафакте шайба свободно падает с резьбы и гремит.',
                          },
                          {
                            title: '4. Керамика и резьба',
                            text: 'Изолятор оригинала идеально гладкий, молочно-белый, без швов и заусенцев. Резьба накатана ровно, без острых задиров, которые портят алюминиевую ГБЦ.',
                          },
                          {
                            title: '5. Иридиевая напайка',
                            text: 'У настоящего Denso Iridium (0.4 мм) и NGK Laser Iridium наконечник приварен тонким лазерным швом и не магнитится. У подделки — толстый железный штырь 1+ мм.',
                          },
                          {
                            title: '6. Сопротивление (мультиметр)',
                            text: 'Проверяйте резистор («R» в коде): оригинал NGK и Denso показывает стабильные 3.5–7.5 кОм. В подделках сопротивление либо 0 Ом (гвоздь), либо разброс 15–50 кОм.',
                          },
                        ].map((item) => (
                          <div
                            key={item.title}
                            className="rounded-xl bg-[#161b25]/90 border border-white/10 p-3.5 space-y-1.5"
                          >
                            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>{item.title}</span>
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed">{item.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-xl bg-sky-500/10 border border-sky-500/30 p-4 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <div className="font-bold text-sky-200">
                            Совет мастера для Нижневартовска и ХМАО (-40 °C):
                          </div>
                          <p className="text-slate-200 leading-relaxed">
                            Момент затяжки критичен: для резьбы <b>M14</b> — 20–30 Н·м, для <b>M12</b> — 15–20 Н·м. Перетяжка срывает резьбу в алюминиевой ГБЦ или даёт микротрещину изолятора, а недотяжка ухудшает теплоотвод и вызывает калильное зажигание.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 8: TORQUE & DIAGNOSTICS (DENSO CATALOG) */}
                  {activeSlide === 7 && (
                    <div className="space-y-4">
                      {/* Torque Table */}
                      <div className="rounded-xl bg-[#161b25]/90 border border-white/10 overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-white/10 bg-white/[0.03] flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs font-bold text-white">
                            Моменты затяжки и углы доворота (стандарт каталога Denso)
                          </span>
                          <span className="text-[13px] text-amber-300 font-medium">
                            Закрутить от руки до касания → довернуть ключом
                          </span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-white/10 text-slate-400">
                                <th className="py-2 px-3">Резьба / седло</th>
                                <th className="py-2 px-3">Момент (динамометр)</th>
                                <th className="py-2 px-3">Новая свеча (угол)</th>
                                <th className="py-2 px-3">Повторный монтаж (б/у)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {TORQUE_TABLE.map((row) => (
                                <tr key={row.size} className="hover:bg-white/[0.02]">
                                  <td className="py-1.5 px-3 font-semibold text-white">{row.size}</td>
                                  <td className="py-1.5 px-3 font-mono font-bold text-sky-300">{row.torque}</td>
                                  <td className="py-1.5 px-3 font-mono text-amber-300">{row.newAngle}</td>
                                  <td className="py-1.5 px-3 font-mono text-slate-200">{row.usedAngle}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="px-4 py-2.5 bg-rose-500/10 border-t border-rose-500/25 text-[13px] text-rose-200 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>
                            <b>Запрет Denso на смазку резьбы:</b> не наносите графитную или медную смазку на резьбу — коэффициент трения падает и при том же усилии происходит перетяжка (~+30%) с обрывом резьбы в ГБЦ.
                          </span>
                        </div>
                      </div>

                      {/* Real NGK Fouling Photo Guide */}
                      <div className="rounded-xl bg-[#161b25]/90 border border-white/10 p-3.5 space-y-2">
                        <div className="text-xs font-bold text-white">
                          Реальные фото состояния теплового конуса (каталог NGK: перегрев &gt;870 °C • норма 450–870 °C • нагар &lt;450 °C)
                        </div>
                        <div className="bg-white rounded-xl p-2 flex justify-center">
                          <img
                            src="assets/plugs/real-fouling.webp"
                            alt="Реальные фото нагара и перегрева свечей NGK"
                            className="max-h-56 w-auto object-contain"
                          />
                        </div>
                      </div>

                      {/* Diagnostics Cards */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
                          Диагностика двигателя по состоянию свечи
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {DIAGNOSTICS_CARDS.map((card) => (
                            <div
                              key={card.title}
                              className="rounded-xl bg-[#161b25]/90 border border-white/10 p-3.5 space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-white leading-snug">
                                  {card.title}
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold border shrink-0 ${card.badgeClass}`}
                                >
                                  {card.badge}
                                </span>
                              </div>
                              <p className="text-[13px] text-slate-200 leading-relaxed">{card.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 9: TOOLS, INSTALL STEPS, OHM/VOLTAGE & CONSEQUENCES */}
                  {activeSlide === 8 && (
                    <div className="space-y-4">
                      {/* Section 1: Required Tools */}
                      <div className="rounded-xl bg-[#161b25]/90 border border-white/10 p-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                          <Wrench className="w-4 h-4" />
                          <span>1. Какие инструменты нужны для правильной замены свечей</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                          <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10 space-y-1">
                            <div className="font-bold text-white">Свечные головки (14 / 16 / 21 мм)</div>
                            <p className="text-slate-200 leading-relaxed">
                              Магнитные или с резиновым фиксатором (магнит надёжнее — резинка не слетит и не останется на свече). Для M12 (LZKAR7D-9D, IXEH20TT, BMW, Renault) нужна <b>тонкостенная 12-гранная головка 14 мм</b>.
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10 space-y-1">
                            <div className="font-bold text-white">Динамометрический ключ (5–50 Н·м)</div>
                            <p className="text-slate-200 leading-relaxed">
                              Ключ под квадрат 3/8&quot; или 1/4&quot; с трещоткой и длинным удлинителем (+ карданчик для дальних цилиндров). Гарантирует точный момент и целостность резьбы в алюминиевой ГБЦ.
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10 space-y-1">
                            <div className="font-bold text-white">Резиновый шланг / магнитная указка</div>
                            <p className="text-slate-200 leading-relaxed">
                              Одевается на изолятор новой свечи, чтобы <b>наживить её строго от руки</b> в глубоком колодце: при малейшем перекосе шланг провернётся и не даст запороть резьбу.
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10 space-y-1">
                            <div className="font-bold text-white">Продувка колодцев (воздух / пылесос)</div>
                            <p className="text-slate-200 leading-relaxed">
                              Перед выкручиванием старых свечей обязательно выдуйте песок и мусор из колодцев, иначе при снятии он посыплется прямо в цилиндр на зеркало гильзы.
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10 space-y-1">
                            <div className="font-bold text-white">Щуп для зазора (ТОЛЬКО для никеля!)</div>
                            <p className="text-slate-200 leading-relaxed">
                              Проволочный/пластинчатый щуп (0.7–1.1 мм). <b>На иридии, платине и многоэлектродных свечах гнуть боковой электрод щупом запрещено</b> — отколется тонкая напайка!
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10 space-y-1">
                            <div className="font-bold text-white">Мультиметр и диэлектрик</div>
                            <p className="text-slate-200 leading-relaxed">
                              Мультиметр проверяет сопротивление резистора (в кОм). Силиконовая диэлектрическая смазка наносится <b>только внутрь резинового колпачка катушки</b> (защита от пробоя), но не на резьбу!
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: How to tighten + Ohm & Voltage */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="rounded-xl bg-[#161b25]/90 border border-white/10 p-4 space-y-2.5 text-xs">
                          <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
                            2. Как правильно закручивать свечу (4 шага)
                          </div>
                          <ol className="space-y-2 text-slate-200 list-decimal list-inside leading-relaxed">
                            <li>
                              <b>Температура мотора ~20–40 °C:</b> меняйте свечи на остывшем или чуть тёплом двигателе. На горячем алюминии легко вытянуть резьбу, а в -30 °C алюминий сильно зажимает сталь.
                            </li>
                            <li>
                              <b>Очистка колодца и резьбы:</b> продуйте колодцы сжатым воздухом перед выкручиванием. Проверьте, чтобы на дне колодца не осталось старой шайбы или грязи.
                            </li>
                            <li>
                              <b>Наживление строго от руки:</b> опустите свечу на магните или резиновом шланге и закручивайте пальцами без ключа до лёгкого упора уплотнительного кольца/конуса в ГБЦ.
                            </li>
                            <li>
                              <b>Контрольная затяжка:</b> затяните динамометрическим ключом (M14: 20–30 Н·м, M12: 15–20 Н·м, M10: 10–15 Н·м) или по углу (новая с шайбой — 1/2 оборота, б/у — 1/12, конус — 1/16).
                            </li>
                          </ol>
                        </div>

                        <div className="rounded-xl bg-[#161b25]/90 border border-white/10 p-4 space-y-2.5 text-xs">
                          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                            3. Что такое Ом (Ω) и напряжение пробоя (кВ)
                          </div>
                          <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10 space-y-1">
                            <div className="font-bold text-white">Сопротивление резистора — Ом / кОм («R» в коде)</div>
                            <p className="text-slate-200 leading-relaxed">
                              Ом — единица электрического сопротивления. У оригинальной свечи NGK/Denso встроенный керамический резистор имеет сопротивление <b>3.5–7.5 кОм (обычно ~5 кОм)</b>. Он гасит радиопомехи при искре, защищая ЭБУ, датчики (ДПКВ/ДПРВ) и катушки. При 0 Ом (без резистора) «глючит» электроника; при &gt;15–20 кОм искра слабеет и горят катушки.
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10 space-y-1">
                            <div className="font-bold text-white">Напряжение пробоя — 15 000–35 000 Вольт (15–35 кВ)</div>
                            <p className="text-slate-200 leading-relaxed">
                              Чтобы пробить сжатую смесь (особенно в -40 °C), катушка подаёт десятки киловольт. Чем <b>толще</b> электрод (2.5 мм никель) и шире зазор (1.1–1.3 мм), тем выше нужно напряжение. Тонкий иридий (0.4–0.6 мм) снижает порог пробоя на <b>5–8 кВ</b>, спасая катушки и просевший АКБ зимой.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: What happens if mixed or wrongly installed */}
                      <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-300">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>4. Что будет, если поставить разные свечи или установить неправильно</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                          <div className="p-2.5 rounded-lg bg-[#0d1117]/60 border border-rose-500/20">
                            <div className="font-bold text-rose-200">Разные типы свечей в одном ДВС</div>
                            <p className="text-slate-200 mt-1 leading-snug">
                              Разное калильное число, зазор и сопротивление вызывают разную скорость сгорания по цилиндрам → вибрация («троение»), детонация в одном цилиндре, сбой топливных коррекций ЭБУ и риск прогара клапана.
                            </p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#0d1117]/60 border border-rose-500/20">
                            <div className="font-bold text-rose-200">Перетяжка / смазка резьбы</div>
                            <p className="text-slate-200 mt-1 leading-snug">
                              Срыв резьбы в алюминиевой ГБЦ (дорогой ремонт футоркой), микротрещина изолятора или разрыв корпуса свечи при следующем откручивании.
                            </p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#0d1117]/60 border border-rose-500/20">
                            <div className="font-bold text-rose-200">Недотяжка (слабый момент)</div>
                            <p className="text-slate-200 mt-1 leading-snug">
                              Кольцо не обжалось → газы прорываются наружу, нарушается отвод тепла в ГБЦ, возникает калильное зажигание, свеча перегревается и может выкрутиться сама.
                            </p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#0d1117]/60 border border-rose-500/20">
                            <div className="font-bold text-rose-200">Длинная резьба (26.5 вместо 19 мм)</div>
                            <p className="text-slate-200 mt-1 leading-snug">
                              Удар поршня/клапана о свечу либо закоксовка торчащих витков в камере сгорания — при выкручивании вырвет резьбу ГБЦ.
                            </p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#0d1117]/60 border border-rose-500/20">
                            <div className="font-bold text-rose-200">Короткая резьба (19 вместо 26.5 мм)</div>
                            <p className="text-slate-200 mt-1 leading-snug">
                              Искра утоплена в глубоком колодце, смесь плохо воспламеняется, а открытая резьба в ГБЦ быстро забивается нагаром.
                            </p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#0d1117]/60 border border-rose-500/20">
                            <div className="font-bold text-rose-200">Конус вместо шайбы (и наоборот)</div>
                            <p className="text-slate-200 mt-1 leading-snug">
                              Нет герметичной посадки в ГБЦ → потеря компрессии, свист, прогар посадочного седла и ошибка по пропускам воспламенения.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Navigation (Liquid Glass) */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-[#60a5fa]/15 bg-[#070d18]/85">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => goToSlide(activeSlide - 1)}
                disabled={activeSlide === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-35 disabled:pointer-events-none border border-white/15 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Назад</span>
              </motion.button>

              <div className="flex items-center gap-1.5">
                {SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={s.label}
                    onClick={() => goToSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeSlide === idx
                        ? 'w-6 bg-gradient-to-r from-sky-400 to-amber-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                        : 'w-2 bg-white/25 hover:bg-white/45'
                    }`}
                  />
                ))}
              </div>

              {activeSlide < SLIDES.length - 1 ? (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => goToSlide(activeSlide + 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-b from-[#1e3a6d] to-[#122647] hover:from-[#254784] hover:to-[#17305a] border border-[#93c5fd]/45 text-[#e0f2fe] text-xs font-bold shadow-[inset_0_1px_1px_rgba(186,230,253,0.35),0_4px_12px_-2px_rgba(2,6,23,0.55)] transition-colors cursor-pointer"
                >
                  <span>Далее</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0d1117] text-xs font-bold shadow-[0_4px_14px_-2px_rgba(16,185,129,0.45)] transition-colors cursor-pointer"
                >
                  <span>Готово</span>
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Image Lightbox */}
          <AnimatePresence>
            {zoomedImg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                onClick={() => setZoomedImg(null)}
                className="fixed inset-0 z-[60] bg-[#04070f]/92 flex flex-col items-center justify-center p-4 cursor-zoom-out"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  className="max-w-5xl max-h-[85vh] bg-white rounded-2xl p-3 shadow-2xl flex items-center justify-center"
                >
                  <img
                    src={zoomedImg.src}
                    alt={zoomedImg.title}
                    className="max-h-[80vh] w-auto object-contain"
                  />
                </motion.div>
                <div className="mt-3 text-sm font-medium text-white text-center">
                  {zoomedImg.title}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
