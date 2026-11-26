/**
 * Hybrid VIN Decoder for NV86 AuToMix:
 * 1) Local ISO 3779 year + RF/China/Global WMI & VDS lookup (instant, offline)
 * 2) Free NHTSA vPIC API fallback/enrichment for global VINs
 */

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;
// Japanese / RHD Frame (Chassis) numbers: e.g. ACV40-0123456, NZE141-1234567, SH5-012345, NT31 123456
const FRAME_REGEX = /^([A-Z0-9]{2,7})[-\s]?(\d{5,8})$/;

// Frame prefix -> { brands, modelHint, plant }
const FRAME_PREFIX_MAP = [
  // Toyota Camry / Avensis / Corolla / RAV4 / Prado / LC / Prius / Alphard / Hiace / JDM
  { re: /^(SXV20|MCV20|ACV30|MCV30)$/, brands: ['Toyota'], modelHint: 'XV20', plant: 'Кузов Toyota Camry XV20/XV30' },
  { re: /^(ACV40|GSV40|ASV50|AVV50|GSV50|AXVA70|AXVH70|ASV70)$/, brands: ['Toyota'], modelHint: 'XV40', plant: 'Кузов Toyota Camry' },
  { re: /^(ZZT250|AZT250|AZT251|ZRT270|ZRT271|ZRT272|ADT270)$/, brands: ['Toyota'], modelHint: 'Avensis', plant: 'Кузов Toyota Avensis' },
  { re: /^(AE110|EE111|NZE120|NZE121|ZZE120|ZZE121|ZZE122|NZE141|NZE144|ZRE142|ZRE151|ZRE152|NRE150|NZE161|NRE160|ZRE181|ZRE182)$/, brands: ['Toyota'], modelHint: 'Corolla', plant: 'Кузов Toyota Corolla' },
  { re: /^(ACA20|ACA21|ZCA25|ACA30|ACA31|ACA33|ACA38|ZSA30)$/, brands: ['Toyota'], modelHint: 'XA30', plant: 'Кузов Toyota RAV4 II/III' },
  { re: /^(ZSA42|ZSA44|AVA42|AVA44|MXAA52|MXAA54|AXAH54)$/, brands: ['Toyota'], modelHint: 'XA40', plant: 'Кузов Toyota RAV4 IV/V' },
  { re: /^(RZJ120|TRJ120|GRJ120|KDJ120|TRJ150|GRJ150|KDJ150|GDJ150)$/, brands: ['Toyota'], modelHint: 'Prado', plant: 'Кузов Land Cruiser Prado' },
  { re: /^(FZJ100|UZJ100|HDJ100|HZJ105|URJ202|UZJ200|VDJ200|FJA300|VJA300)$/, brands: ['Toyota'], modelHint: 'Land Cruiser', plant: 'Кузов Land Cruiser' },
  { re: /^(GSU40|GSU45|ASU40|AGV10|AGV15|GGV10|GGV15|GYL15)$/, brands: ['Toyota'], modelHint: 'Highlander', plant: 'Кузов Highlander / Venza' },
  { re: /^(KUN25|KUN26|TGN16|TGN126|GUN125|GUN126|TGN156|GUN156)$/, brands: ['Toyota'], modelHint: 'Hilux', plant: 'Кузов Hilux / Fortuner' },
  { re: /^(ANH10|ANH15|MNH10|MNH15|ANH20|ANH25|GGH20|GGH25|AGH30|GGH30|ACR30|ACR50|GSR50)$/, brands: ['Toyota'], modelHint: 'Alphard', plant: 'Кузов Alphard / Estima' },
  { re: /^(NHW20|ZVW30|ZVW35|ZVW40|ZVW41|ZVW50|ZVW55)$/, brands: ['Toyota'], modelHint: 'Prius', plant: 'Кузов Toyota Prius' },
  { re: /^(AT190|ST190|AT210|AT211|CT210|ST210|ST215|AZT241|AZT246|GX90|JZX90|GX100|JZX100|GX110|JZX110)$/, brands: ['Toyota'], modelHint: 'Mark II', plant: 'Кузов Carina / Caldina / Mark II' },
  { re: /^(NCP20|NCP21|NCP25|NCP30|NCP31|NCP35|SCP10|NCP10|NCP91|KGC10|KGC30|M300|NCP60|NCP110|ZNE10|ZGE20)$/, brands: ['Toyota'], modelHint: 'Funcargo', plant: 'Кузов Funcargo / bB / Passo / Wish' },
  { re: /^(TRH200|TRH214|TRH224|KDH200|KDH201|RZH100|KZH100)$/, brands: ['Toyota'], modelHint: 'Hiace', plant: 'Кузов Toyota Hiace' },
  // Lexus
  { re: /^(MCU35|GSU30|GSU35|GGL10|GGL15|AGL20|AGL25|GYL20|GYL25)$/, brands: ['Lexus'], modelHint: 'RX', plant: 'Кузов Lexus RX' },
  // Nissan
  { re: /^(N16|QG15|QG16|QG18|B10|G15)$/, brands: ['Nissan'], modelHint: 'Almera', plant: 'Кузов Nissan Almera' },
  { re: /^(E11|NE11|C11|SC11|NC11|C13|F15|YF15|NF15|B17)$/, brands: ['Nissan'], modelHint: 'Note', plant: 'Кузов Note / Tiida / Juke' },
  { re: /^(J10|NJ10)$/, brands: ['Nissan'], modelHint: 'J10', plant: 'Кузов Nissan Qashqai I' },
  { re: /^(J11)$/, brands: ['Nissan'], modelHint: 'J11', plant: 'Кузов Nissan Qashqai II' },
  { re: /^(T30|NT30|PNT30)$/, brands: ['Nissan'], modelHint: 'T30', plant: 'Кузов Nissan X-Trail I' },
  { re: /^(T31|NT31|TNT31)$/, brands: ['Nissan'], modelHint: 'T31', plant: 'Кузов Nissan X-Trail II' },
  { re: /^(T32|NT32|HT32)$/, brands: ['Nissan'], modelHint: 'T32', plant: 'Кузов Nissan X-Trail III' },
  { re: /^(J31|PJ31|TNJ31)$/, brands: ['Nissan'], modelHint: 'J31', plant: 'Кузов Nissan Teana I' },
  { re: /^(J32|PJ32|TNJ32|L33)$/, brands: ['Nissan'], modelHint: 'J32', plant: 'Кузов Nissan Teana II/III' },
  { re: /^(Z50|PNZ50|TZ50|Z51|PNZ51|TNZ51|Z52)$/, brands: ['Nissan'], modelHint: 'Murano', plant: 'Кузов Nissan Murano' },
  { re: /^(R51|R52|D40|Y61|Y62)$/, brands: ['Nissan'], modelHint: 'Pathfinder', plant: 'Кузов Pathfinder / Patrol' },
  // Mitsubishi
  { re: /^(CS3A|CS9A|CS3W)$/, brands: ['Mitsubishi'], modelHint: 'Lancer IX', plant: 'Кузов Lancer IX' },
  { re: /^(CY2A|CY3A|CY4A|CX4A|GA1W|GA2W|GA3W)$/, brands: ['Mitsubishi'], modelHint: 'Lancer X', plant: 'Кузов Lancer X / ASX' },
  { re: /^(CU2W|CU4W|CU5W)$/, brands: ['Mitsubishi'], modelHint: 'Outlander I', plant: 'Кузов Mitsubishi Outlander I' },
  { re: /^(CW4W|CW5W|CW6W|GF2W|GF3W|GF7W|GF8W)$/, brands: ['Mitsubishi'], modelHint: 'Outlander XL', plant: 'Кузов Mitsubishi Outlander XL/III' },
  { re: /^(V65W|V75W|V83W|V93W|V97W|V98W|KH4W|KH8W|KS1W|KB4T|KK1T|KL1T)$/, brands: ['Mitsubishi'], modelHint: 'Pajero', plant: 'Кузов Pajero / L200' },
  { re: /^(EA1A|EA2A|EA3A|EA5A|EA7A|EC5A|DJ1A|DJ3A|GK1W)$/, brands: ['Mitsubishi'], modelHint: 'Galant', plant: 'Кузов Galant / Eclipse Cross' },
  // Mazda
  { re: /^(BK3P|BK5P|BKEP)$/, brands: ['Mazda'], modelHint: '(BK)', plant: 'Кузов Mazda3 I (BK)' },
  { re: /^(BL5FP|BL3FW|BLEFW)$/, brands: ['Mazda'], modelHint: '(BL)', plant: 'Кузов Mazda3 II (BL)' },
  { re: /^(BM5FP|BM5AS|BMLFS|BP5P)$/, brands: ['Mazda'], modelHint: '(BM', plant: 'Кузов Mazda3 III/IV' },
  { re: /^(GG3P|GGES|GY3W|GHEFP|GH5FP|GH5AW|GJ2FP|GJ5FP|GJEFP)$/, brands: ['Mazda'], modelHint: 'Mazda6', plant: 'Кузов Mazda6 / Atenza' },
  { re: /^(KEEFW|KE5FW|KE2FW|KE2AW|KFEP|KF5P|KF2P|ER3P|TB17|TC2W)$/, brands: ['Mazda'], modelHint: 'CX-5', plant: 'Кузов Mazda CX-5 / CX-7 / CX-9' },
  // Subaru
  { re: /^(SG5|SG9|SH5|SH9|SHJ|SJ5|SJG|SK5|SK9|SKE)$/, brands: ['Subaru'], modelHint: 'Forester', plant: 'Кузов Subaru Forester' },
  { re: /^(BP5|BP9|BPE|BL5|BR9|BRF|BM9|BS9|BT9|BN9)$/, brands: ['Subaru'], modelHint: 'Outback', plant: 'Кузов Outback / Legacy' },
  { re: /^(GP2|GP3|GP6|GP7|GPE|GT3|GT7|GTE|GJ2|GJ7)$/, brands: ['Subaru'], modelHint: 'XV', plant: 'Кузов Subaru XV / Impreza' },
];

// ISO 3779 10th-char year table
const YEAR_CODES_2010 = {
  A: 2010, B: 2011, C: 2012, D: 2013, E: 2014,
  F: 2015, G: 2016, H: 2017, J: 2018, K: 2019,
  L: 2020, M: 2021, N: 2022, P: 2023, R: 2024,
  S: 2025, T: 2026, V: 2027, W: 2028, X: 2029,
  Y: 2030, '1': 2001, '2': 2002, '3': 2003, '4': 2004,
  '5': 2005, '6': 2006, '7': 2007, '8': 2008, '9': 2009,
};

const YEAR_CODES_1980 = {
  A: 1980, B: 1981, C: 1982, D: 1983, E: 1984,
  F: 1985, G: 1986, H: 1987, J: 1988, K: 1989,
  L: 1990, M: 1991, N: 1992, P: 1993, R: 1994,
  S: 1995, T: 1996, V: 1997, W: 1998, X: 1999,
  Y: 2000, '1': 2001, '2': 2002, '3': 2003, '4': 2004,
  '5': 2005, '6': 2006, '7': 2007, '8': 2008, '9': 2009,
};

// WMI (1-3 chars) -> catalog brand(s) & plant info
const WMI_MAP = {
  XTA: { brands: ['LADA'], label: 'АВТОВАЗ (Тольятти / Ижевск)' },
  XTT: { brands: ['УАЗ'], label: 'УАЗ (Ульяновск)' },
  X96: { brands: ['ГАЗ'], label: 'ГАЗ (Нижний Новгород)' },
  X7L: { brands: ['Renault'], label: 'Renault Россия (Москва)' },
  VF1: { brands: ['Renault'], label: 'Renault (Франция)' },
  Z94: { brands: ['Hyundai', 'KIA', 'Solaris'], label: 'ХММР (Санкт-Петербург)' },
  XWE: { brands: ['KIA'], label: 'KIA / Автотор (Калининград)' },
  X7M: { brands: ['Hyundai / ТагАЗ'], label: 'ТагАЗ (Таганрог)' },
  KMH: { brands: ['Hyundai'], label: 'Hyundai (Корея)' },
  TMA: { brands: ['Hyundai'], label: 'Hyundai (Чехия)' },
  KNA: { brands: ['KIA'], label: 'KIA (Корея)' },
  KNC: { brands: ['KIA'], label: 'KIA (Корея)' },
  KND: { brands: ['KIA'], label: 'KIA (Корея)' },
  U5Y: { brands: ['KIA'], label: 'KIA (Словакия)' },
  U6Y: { brands: ['KIA'], label: 'KIA (Словакия)' },
  XW8: { brands: ['Volkswagen', 'Skoda'], label: 'VAG Калуга (VW / Skoda)' },
  WVW: { brands: ['Volkswagen'], label: 'Volkswagen (Германия)' },
  WV1: { brands: ['Volkswagen'], label: 'Volkswagen Commercial' },
  WV2: { brands: ['Volkswagen'], label: 'Volkswagen Commercial' },
  TMB: { brands: ['Skoda'], label: 'Skoda (Чехия)' },
  WAU: { brands: ['Audi'], label: 'Audi (Германия)' },
  WUA: { brands: ['Audi'], label: 'Audi Sport' },
  WBA: { brands: ['BMW'], label: 'BMW (Германия)' },
  WBS: { brands: ['BMW'], label: 'BMW M' },
  X4X: { brands: ['BMW'], label: 'BMW / Автотор (Калининград)' },
  W0L: { brands: ['Opel'], label: 'Opel (Германия)' },
  W0V: { brands: ['Opel'], label: 'Opel (Германия)' },
  XUF: { brands: ['Chevrolet'], label: 'GM / Chevrolet (СПб)' },
  XU1: { brands: ['Chevrolet'], label: 'Chevrolet (Россия)' },
  KL1: { brands: ['Chevrolet'], label: 'GM Daewoo / Chevrolet (Корея)' },
  Z8N: { brands: ['Nissan'], label: 'Nissan (Санкт-Петербург)' },
  SJN: { brands: ['Nissan'], label: 'Nissan (Великобритания)' },
  JN1: { brands: ['Nissan'], label: 'Nissan (Япония)' },
  JN8: { brands: ['Nissan'], label: 'Nissan (Япония)' },
  JNK: { brands: ['Infiniti'], label: 'Infiniti (Япония)' },
  '5N1': { brands: ['Nissan', 'Infiniti'], label: 'Nissan / Infiniti (США)' },
  XW7: { brands: ['Toyota'], label: 'Toyota (Санкт-Петербург)' },
  JTD: { brands: ['Toyota'], label: 'Toyota (Япония)' },
  JTE: { brands: ['Toyota'], label: 'Toyota (Япония)' },
  JTM: { brands: ['Toyota'], label: 'Toyota (Япония)' },
  JTN: { brands: ['Toyota'], label: 'Toyota (Япония)' },
  SB1: { brands: ['Toyota'], label: 'Toyota (Великобритания)' },
  NMT: { brands: ['Toyota'], label: 'Toyota (Турция)' },
  JTH: { brands: ['Lexus'], label: 'Lexus (Япония)' },
  JTJ: { brands: ['Lexus'], label: 'Lexus (Япония)' },
  JMB: { brands: ['Mitsubishi'], label: 'Mitsubishi (Япония)' },
  Z8T: { brands: ['Mitsubishi'], label: 'ПСМА Рус (Калуга)' },
  JMZ: { brands: ['Mazda'], label: 'Mazda (Япония)' },
  JM1: { brands: ['Mazda'], label: 'Mazda (Япония)' },
  JF1: { brands: ['Subaru'], label: 'Subaru (Япония)' },
  JF2: { brands: ['Subaru'], label: 'Subaru (Япония)' },
  YV1: { brands: ['Volvo'], label: 'Volvo (Швеция)' },
  YV4: { brands: ['Volvo'], label: 'Volvo (Швеция)' },
  WF0: { brands: ['Ford'], label: 'Ford (Европа)' },
  Z6F: { brands: ['Ford'], label: 'Ford (Всеволожск / Елабуга)' },
  '1FA': { brands: ['Ford'], label: 'Ford (США)' },
  '1FM': { brands: ['Ford'], label: 'Ford (США)' },
  '1FT': { brands: ['Ford'], label: 'Ford (США)' },
  LGW: { brands: ['Haval'], label: 'Great Wall / Haval (Китай)' },
  XZG: { brands: ['Haval'], label: 'Haval (Тула)' },
  Z8U: { brands: ['Haval'], label: 'Haval (Тула)' },
  LVV: { brands: ['Chery / Tenet'], label: 'Chery (Китай)' },
  LS4: { brands: ['Changan'], label: 'Changan (Китай)' },
  LS5: { brands: ['Changan'], label: 'Changan (Китай)' },
  LS6: { brands: ['Changan'], label: 'Changan (Китай)' },
  L6T: { brands: ['Belgee / Geely'], label: 'Geely (Китай)' },
  Y3W: { brands: ['Belgee / Geely'], label: 'БелДжи (Беларусь)' },
  X7W: { brands: ['Москвич'], label: 'Москвич (Москва)' },
};

// NHTSA Make -> catalog brand name
const NHTSA_MAKE_MAP = {
  HYUNDAI: ['Hyundai'],
  KIA: ['KIA'],
  VOLKSWAGEN: ['Volkswagen'],
  SKODA: ['Skoda'],
  TOYOTA: ['Toyota'],
  NISSAN: ['Nissan'],
  MAZDA: ['Mazda'],
  MITSUBISHI: ['Mitsubishi'],
  FORD: ['Ford'],
  CHEVROLET: ['Chevrolet'],
  BMW: ['BMW'],
  AUDI: ['Audi'],
  VOLVO: ['Volvo'],
  SUBARU: ['Subaru'],
  LEXUS: ['Lexus'],
  INFINITI: ['Infiniti'],
  OPEL: ['Opel'],
  RENAULT: ['Renault'],
};

const nhtsaCache = new Map();

export function normalizeVin(input) {
  return String(input || '').replace(/[\s-]+/g, '').toUpperCase();
}

export function isValidVinFormat(input) {
  const clean = normalizeVin(input);
  return VIN_REGEX.test(clean);
}

export function decodeFrameNumber(input) {
  const raw = String(input || '').trim().toUpperCase();
  if (!raw || raw.length === 17) return null;
  const match = raw.match(FRAME_REGEX);
  if (!match) return null;

  const prefix = match[1];
  const entry = FRAME_PREFIX_MAP.find((item) => item.re.test(prefix));
  if (!entry) return null;

  return {
    vin: raw,
    isFrame: true,
    wmi: prefix,
    brands: entry.brands,
    plant: entry.plant,
    year: null,
    modelHint: entry.modelHint,
    displacement: '',
    source: 'Справочник номеров кузова (Frame)',
  };
}

export function isVinOrFrameFormat(input) {
  return isValidVinFormat(input) || Boolean(decodeFrameNumber(input));
}

function decodeYear(vin) {
  const code = vin[9];
  const pos7 = vin[6];
  // ISO 3779: if 7th char is a letter, year is 2010–2039; if digit, 1980–2009
  const isPost2010 = /[A-Z]/.test(pos7);
  if (isPost2010) {
    return YEAR_CODES_2010[code] || null;
  }
  // Many Russian/European VINs have digit at pos7 even for 2010+ (e.g. XTA, Z94),
  // so return 2010+ for letters >= A when ambiguous, unless clearly 1990s.
  return YEAR_CODES_2010[code] || YEAR_CODES_1980[code] || null;
}

function detectVdsDetails(vin) {
  const wmi = vin.slice(0, 3);
  const vds = vin.slice(3, 9);
  const year = decodeYear(vin);

  if (wmi === 'XTA') {
    if (vds.startsWith('GFL') || vds.startsWith('GFS')) return { brands: ['LADA'], modelHint: 'Vesta', excludeHint: 'CNG' };
    if (/^(2190|2191|2192|2194)/.test(vds)) return { brands: ['LADA'], modelHint: 'Granta', excludeHint: 'CNG' };
    if (/^(FS0|KS0|RS0)/.test(vds)) return { brands: ['LADA'], modelHint: 'Largus', excludeHint: 'CNG' };
    if (vds.startsWith('GAB')) return { brands: ['LADA'], modelHint: 'XRAY', excludeHint: 'CNG' };
    if (/^(2170|2171|2172)/.test(vds)) return { brands: ['LADA'], modelHint: 'Priora' };
    if (vds.startsWith('21214')) return { brands: ['LADA'], modelHint: 'Niva Legend', excludeHint: 'CNG' };
    if (vds.startsWith('2123')) return { brands: ['LADA'], modelHint: '2123' };
    if (/^(2121|2131)/.test(vds)) return { brands: ['LADA'], modelHint: '2121 / 21213' };
    return { brands: ['LADA'], modelHint: '' };
  }

  if (wmi === 'Z94') {
    const isSolarisBrand = year && year >= 2024;
    // Z94CT / Z94CU / Z94K2 / Z94K3 -> Hyundai Solaris (or Solaris HS from 2024)
    if (/^(CT|CU|K2|K3)/.test(vds)) {
      return isSolarisBrand
        ? { brands: ['Solaris'], modelHint: 'HS' }
        : { brands: ['Hyundai'], modelHint: 'Solaris' };
    }
    // Z94C2 / Z94C3 -> Hyundai Creta (or Solaris HC from 2024)
    if (/^(C2|C3)/.test(vds)) {
      return isSolarisBrand
        ? { brands: ['Solaris'], modelHint: 'HC' }
        : { brands: ['Hyundai'], modelHint: 'Creta' };
    }
    // Z94CC / Z94CB / Z94G2 / Z94G3 -> KIA Rio / Rio X-Line (or Solaris KRS/KRX from 2024)
    if (/^(CC|CB|G2|G3)/.test(vds)) {
      return isSolarisBrand
        ? { brands: ['Solaris'], modelHint: 'KRS' }
        : { brands: ['KIA'], modelHint: 'Rio' };
    }
    return { brands: [], modelHint: '' };
  }

  if (wmi === 'XW8') {
    const body = vin.slice(6, 8); // VAG platform/model code at chars 7-8
    if (/^(61|CK)/.test(body) || /^(ZZZ61|ZZZCK)/.test(vds)) return { brands: ['Volkswagen'], modelHint: 'Polo' };
    if (/^(5N|AD)/.test(body) || /^(ZZZ5N|ZZZAD)/.test(vds)) return { brands: ['Volkswagen'], modelHint: 'Tiguan' };
    if (/^(16|BU)/.test(body) || /^(ZZZ16|ZZZBU)/.test(vds)) return { brands: ['Volkswagen'], modelHint: 'Jetta' };
    if (/^(3C|3G)/.test(body) || /^(ZZZ3C|ZZZ3G)/.test(vds)) return { brands: ['Volkswagen'], modelHint: 'Passat' };
    if (/^(NH|NK)/.test(body) || vds.includes('NH') || vds.includes('NK')) return { brands: ['Skoda'], modelHint: 'Rapid' };
    if (/^(1Z|5E|NE|NX)/.test(body) || vds.includes('5E') || vds.includes('NE')) return { brands: ['Skoda'], modelHint: 'Octavia' };
    if (/^(NS)/.test(body) || vds.includes('NS')) return { brands: ['Skoda'], modelHint: 'Kodiaq' };
    if (/^(NU)/.test(body) || vds.includes('NU')) return { brands: ['Skoda'], modelHint: 'Karoq' };
    if (/^(5L)/.test(body) || vds.includes('5L')) return { brands: ['Skoda'], modelHint: 'Yeti' };
    if (/^(5J|6Y)/.test(body) || vds.includes('5J')) return { brands: ['Skoda'], modelHint: 'Fabia' };
    return { brands: [], modelHint: '' };
  }

  if (wmi === 'X7L') {
    if (vds.startsWith('SR')) return { brands: ['Renault'], modelHint: 'Logan' };
    if (vds.startsWith('5S')) return { brands: ['Renault'], modelHint: 'Sandero' };
    if (vds.startsWith('HS')) return { brands: ['Renault'], modelHint: 'Duster' };
    return { brands: ['Renault'], modelHint: '' };
  }

  return { brands: [], modelHint: '' };
}

export function decodeVinLocal(input) {
  const vin = normalizeVin(input);
  if (!VIN_REGEX.test(vin)) return null;

  const wmi = vin.slice(0, 3);
  const wmiEntry = WMI_MAP[wmi] || null;
  const year = decodeYear(vin);
  const vdsDetails = detectVdsDetails(vin);
  const resolvedBrands = vdsDetails.brands.length > 0
    ? vdsDetails.brands
    : (wmiEntry ? wmiEntry.brands : []);

  return {
    vin,
    wmi,
    brands: resolvedBrands,
    plant: wmiEntry ? wmiEntry.label : '',
    year,
    modelHint: vdsDetails.modelHint,
    excludeHint: vdsDetails.excludeHint || '',
    displacement: '',
    source: wmiEntry ? 'Локальный справочник РФ/ISO' : 'ISO 3779',
  };
}

export async function decodeVinWithNhtsa(input, signal) {
  const local = decodeVinLocal(input);
  if (!local) return null;

  if (nhtsaCache.has(local.vin)) {
    return nhtsaCache.get(local.vin);
  }

  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${local.vin}?format=json`,
      { signal }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const row = json?.Results?.[0];
    if (!row) return local;

    const makeUpper = (row.Make || '').trim().toUpperCase();
    const nhtsaBrands = NHTSA_MAKE_MAP[makeUpper] || [];
    const nhtsaModel = (row.Model || '').trim();
    const nhtsaYear = parseInt(row.ModelYear, 10) || null;
    const disp = (row.DisplacementL || '').trim();

    // Narrow multi-brand WMI (e.g. XW8, Z94, 5N1) when NHTSA identifies exact single Make
    let resolvedBrands = local.brands;
    if (resolvedBrands.length === 0) {
      resolvedBrands = nhtsaBrands;
    } else if (resolvedBrands.length > 1 && nhtsaBrands.length > 0) {
      const intersection = resolvedBrands.filter((b) => nhtsaBrands.includes(b));
      resolvedBrands = intersection.length > 0 ? intersection : nhtsaBrands;
    }

    const merged = {
      ...local,
      brands: resolvedBrands,
      modelHint: local.modelHint || nhtsaModel,
      year: local.year || nhtsaYear,
      displacement: disp ? `${Number(disp).toFixed(1)} л` : '',
      nhtsaMake: (row.Make || '').trim(),
      source:
        local.brands.length > 0 && nhtsaModel
          ? 'Локальный РФ + NHTSA vPIC'
          : nhtsaModel || nhtsaBrands.length > 0
            ? 'NHTSA vPIC API'
            : local.source,
    };

    nhtsaCache.set(local.vin, merged);
    return merged;
  } catch {
    return local;
  }
}

export function carMatchesYear(carYears, targetYear) {
  if (!targetYear || !carYears) return true;
  const matches = carYears.match(/\d{4}/g);
  if (!matches || matches.length === 0) return true;
  const start = parseInt(matches[0], 10);
  const end = carYears.includes('н.в.')
    ? 2030
    : matches.length > 1
      ? parseInt(matches[1], 10)
      : start;
  return targetYear >= start && targetYear <= end;
}
