import React from 'react';

export const WIPER_MOUNTS_CATALOG = [
  {
    id: 'hook',
    name: 'Крючок (Hook 9×3, 9×4, 8×3)',
    alias: ['крючок', 'hook', '9x3', '9×3', 'крюк'],
    iconSrc: 'assets/mounts/hook_icon.png',
    cardSrc: 'assets/mounts/hook_card.png',
    desc: 'Классический и самый надежный стандарт крепления в мире. Используется на большинстве азиатских, отечественных и европейских авто.'
  },
  {
    id: 'vatl',
    name: 'VATL 5.1',
    alias: ['vatl', 'vatl 5.1', 'vatl5.1'],
    iconSrc: 'assets/mounts/vatl-5-1_icon.png',
    cardSrc: 'assets/mounts/vatl-5-1_card.png',
    desc: 'Оригинальное крепление Renault/Nissan и Lada Vesta/XRay (с конца 2019 года). Тонкий адаптер защелкивается сверху.'
  },
  {
    id: 'push-button-19',
    name: 'Push Button (19 мм / 16 мм)',
    alias: ['push button', 'кнопка', '19 мм', '16 мм'],
    iconSrc: 'assets/mounts/push-button-19_icon.png',
    cardSrc: 'assets/mounts/push-button-19_card.png',
    desc: 'Кнопочное крепление. Замена производится нажатием на квадратную кнопку поводка (VAG, Ford, Lada Vesta 2015–2019).'
  },
  {
    id: 'side-pin',
    name: 'Side Pin (Боковой штырь 22 мм / 17 мм / 5 мм)',
    alias: ['side pin', 'штырь', 'боковой штырь', 'pin'],
    iconSrc: 'assets/mounts/side-pin-22_icon.png',
    cardSrc: 'assets/mounts/side-pin-22_card.png',
    desc: 'Поводок с цилиндрическим штырем сбоку (BMW, Mercedes-Benz, Нива 2121 / 2131 / 21214).'
  },
  {
    id: 'bayonet',
    name: 'Bayonet arm (Байонет)',
    alias: ['bayonet', 'байонет'],
    iconSrc: 'assets/mounts/bayonet_icon.png',
    cardSrc: 'assets/mounts/bayonet_card.png',
    desc: 'Штыковой фиксатор. Прямой плоский поводок с направляющими фиксаторами (Renault Laguna/Megane, Citroen).'
  },
  {
    id: 'pinch-tab',
    name: 'Pinch Tab (Боковой зажим)',
    alias: ['pinch tab', 'боковой зажим', 'pinch'],
    iconSrc: 'assets/mounts/pinch-tab_icon.png',
    cardSrc: 'assets/mounts/pinch-tab_card.png',
    desc: 'Крепление со сжимаемыми боковыми усиками (Audi, Saab, Jaguar, некоторые китайские бренды).'
  },
  {
    id: 'pin-lock',
    name: 'Pin Lock',
    alias: ['pin lock', 'пин лок'],
    iconSrc: 'assets/mounts/pin-lock_icon.png',
    cardSrc: 'assets/mounts/pin-lock_card.png',
    desc: 'Компактный фиксатор с замком (Audi A6, Seat, Mercedes).'
  },
  {
    id: 'top-lock',
    name: 'Top lock',
    alias: ['top lock', 'топ лок'],
    iconSrc: 'assets/mounts/top-lock_icon.png',
    cardSrc: 'assets/mounts/top-lock_card.png',
    desc: 'Верхний замок фиксации (Chevrolet, Opel, Skoda).'
  },
  {
    id: 'claw',
    name: 'Claw (Клешня)',
    alias: ['claw', 'клешня'],
    iconSrc: 'assets/mounts/claw_icon.png',
    cardSrc: 'assets/mounts/claw_card.png',
    desc: 'Крепление типа "клешня" с боковым зацепом (Audi A8, Seat).'
  },
  {
    id: 'aeroclip',
    name: 'AeroClip',
    alias: ['aeroclip', 'аэроклип'],
    iconSrc: 'assets/mounts/aeroclip_icon.png',
    cardSrc: 'assets/mounts/aeroclip_card.png',
    desc: 'Аэродинамический плоский клипс крепления щеток премиум-авто.'
  },
  {
    id: 'dntl',
    name: 'DNTL 1.1 / DYTL 1.1',
    alias: ['dntl', 'dytl', 'dntl1.1', 'dytl1.1'],
    iconSrc: 'assets/mounts/dntl_icon.png',
    cardSrc: 'assets/mounts/dntl_card.png',
    desc: 'Специальные крепления для современных автомобилей Toyota, Lexus и китайских марок.'
  }
];

export function detectMountType(wipersString) {
  if (!wipersString) return null;
  const lower = wipersString.toLowerCase();
  for (const mount of WIPER_MOUNTS_CATALOG) {
    if (mount.alias.some(a => lower.includes(a))) {
      return mount;
    }
  }
  return null;
}

/**
 * Crisp vector technical schematic for each wiper arm mount type
 * (replaces raster screenshot cutouts with clean scalable blueprint geometry).
 */
export function WiperMountSvg({ mountId, className = 'h-16 w-36' }) {
  const strokeMain = 'currentColor';
  const accent = '#38bdf8';
  const gold = '#fbbf24';

  const renderShape = () => {
    switch (mountId) {
      case 'hook':
        return (
          <g>
            {/* J-Hook arm */}
            <path d="M18 32 H92 C110 32 114 48 96 48 H74" stroke={strokeMain} strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M18 32 H92 C110 32 114 48 96 48 H74" stroke={accent} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
            <circle cx="96" cy="40" r="3" fill={gold} />
            <text x="20" y="20" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">HOOK 9×3 / 9×4</text>
          </g>
        );
      case 'vatl':
        return (
          <g>
            <rect x="20" y="34" width="68" height="12" rx="2" stroke={strokeMain} strokeWidth="3" fill="none" />
            <path d="M88 34 L106 34 L112 40 L106 46 L88 46" stroke={accent} strokeWidth="3" fill="none" />
            <rect x="74" y="29" width="16" height="5" rx="1.5" fill={gold} />
            <text x="20" y="20" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">VATL 5.1</text>
          </g>
        );
      case 'push-button-19':
        return (
          <g>
            <path d="M18 34 H96 V46 H18" stroke={strokeMain} strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <rect x="70" y="28" width="14" height="6" rx="1.5" fill={gold} />
            <line x1="77" y1="22" x2="77" y2="27" stroke={gold} strokeWidth="1.5" />
            <polygon points="74,25 80,25 77,28" fill={gold} />
            <text x="20" y="20" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">PUSH BUTTON 19/16</text>
          </g>
        );
      case 'side-pin':
        return (
          <g>
            <rect x="18" y="35" width="76" height="10" rx="2" stroke={strokeMain} strokeWidth="3.5" fill="none" />
            <line x1="88" y1="40" x2="112" y2="40" stroke={gold} strokeWidth="5" strokeLinecap="round" />
            <circle cx="112" cy="40" r="3" fill={accent} />
            <text x="20" y="20" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">SIDE PIN 22/17/5</text>
          </g>
        );
      case 'bayonet':
        return (
          <g>
            <rect x="18" y="36" width="92" height="8" rx="1.5" stroke={strokeMain} strokeWidth="3" fill="none" />
            <rect x="80" y="31" width="10" height="5" rx="1" fill={gold} />
            <circle cx="64" cy="40" r="2.5" fill={accent} />
            <text x="20" y="20" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">BAYONET ARM</text>
          </g>
        );
      case 'pinch-tab':
        return (
          <g>
            <path d="M18 35 H86 L98 29 M18 45 H86 L98 51" stroke={strokeMain} strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <circle cx="100" cy="30" r="3" fill={gold} />
            <circle cx="100" cy="50" r="3" fill={gold} />
            <line x1="88" y1="40" x2="112" y2="40" stroke={accent} strokeWidth="2.5" strokeDasharray="3 2" />
            <text x="20" y="20" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">PINCH TAB</text>
          </g>
        );
      case 'pin-lock':
        return (
          <g>
            <rect x="18" y="35" width="84" height="10" rx="2" stroke={strokeMain} strokeWidth="3" fill="none" />
            <circle cx="88" cy="40" r="4.5" fill={gold} />
            <path d="M98 32 V48" stroke={accent} strokeWidth="3" strokeLinecap="round" />
            <text x="20" y="20" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">PIN LOCK</text>
          </g>
        );
      case 'top-lock':
        return (
          <g>
            <path d="M18 35 H102 V45 H18" stroke={strokeMain} strokeWidth="3.5" fill="none" />
            <path d="M68 35 V28 H90 V35" stroke={gold} strokeWidth="3" fill="none" />
            <text x="20" y="20" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">TOP LOCK</text>
          </g>
        );
      case 'claw':
        return (
          <g>
            <rect x="18" y="35" width="76" height="10" rx="2" stroke={strokeMain} strokeWidth="3" fill="none" />
            <path d="M94 33 C108 33 110 47 94 47" stroke={gold} strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <text x="20" y="20" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">CLAW</text>
          </g>
        );
      case 'aeroclip':
        return (
          <g>
            <path d="M18 39 L96 33 L114 39 L96 45 L18 41 Z" stroke={strokeMain} strokeWidth="3" fill="none" />
            <rect x="78" y="36" width="18" height="6" rx="2" fill={gold} />
            <text x="20" y="20" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">AEROCLIP</text>
          </g>
        );
      case 'dntl':
      default:
        return (
          <g>
            <rect x="18" y="35" width="80" height="10" rx="2" stroke={strokeMain} strokeWidth="3" fill="none" />
            <rect x="86" y="31" width="22" height="18" rx="3" stroke={accent} strokeWidth="2.5" fill="none" />
            <circle cx="97" cy="40" r="3" fill={gold} />
            <text x="20" y="20" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="bold">DNTL / DYTL</text>
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 132 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {renderShape()}
    </svg>
  );
}
