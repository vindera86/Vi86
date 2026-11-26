import React from 'react';
import { Flame, Settings, Wind, Snowflake, ChevronRight, MessageSquare } from 'lucide-react';

export default function QuickResultBanner({ car, winterMode, onOpenModal, onCopyClient }) {
  if (!car) return null;

  const cleanOem = car.oem ? car.oem.replace(/\[ВАЖНО:[^\]]*\]?/g, '').trim() : '—';
  const firstOem = cleanOem ? cleanOem.split('/')[0].trim() : 'По VIN';
  const firstNgk = car.ngk ? car.ngk.split('/')[0].trim() : '—';
  const timingShort = car.timing ? car.timing.split('|')[0].trim() : '—';
  const wipersShort = car.wipers ? car.wipers.split('|')[0].trim() : '—';

  const handleCopy = () => {
    const msg = [
      `🚗 *${car.brand} ${car.model}* (${car.years})`,
      `Двигатель: ${car.engine}`,
      `• Свечи OEM: ${cleanOem || 'по VIN'} | NGK: ${firstNgk}`,
      `• ГРМ: ${timingShort}`,
      `• Дворники: ${wipersShort}`,
      winterMode && car.intervalWinter ? `• Зима ХМАО (-40°C): ${car.intervalWinter}` : null,
      `— NV86 AuToMix`
    ].filter(Boolean).join('\n');
    onCopyClient(msg, 'Сводка для клиента скопирована!');
  };

  return (
    <section className="glass-panel rounded-2xl p-4 sm:p-5 mb-6 border border-amberGold-500/40 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3.5 border-b border-slate-200 dark:border-white/10">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amberGold-700 dark:text-amberGold-400">
            Точное совпадение · Что подойдёт на авто
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {car.brand} {car.family && car.family !== car.model ? `${car.family} — ${car.model}` : car.model}
            <span className="text-sm font-mono font-normal text-slate-500 dark:text-slate-400 ml-2">
              ({car.years})
            </span>
          </h3>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-300 mt-0.5">{car.engine}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 dark:bg-frost-500/15 dark:hover:bg-frost-500/25 text-sky-800 dark:text-frost-200 border border-sky-200 dark:border-frost-400/30 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Для клиента</span>
          </button>
          <button
            onClick={() => onOpenModal(car)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amberGold-500 hover:bg-amberGold-400 text-slate-950 shadow-glow-amber transition-all cursor-pointer"
          >
            <span>Полная техкарта</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-1.5 text-amberGold-700 dark:text-amberGold-400 font-bold mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Свечи зажигания</span>
          </div>
          <div className="font-mono font-bold text-slate-900 dark:text-white">OEM: {firstOem}</div>
          <div className="font-mono text-slate-600 dark:text-slate-300 mt-0.5">NGK: {firstNgk}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-1.5 text-sky-700 dark:text-frost-300 font-bold mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Привод ГРМ</span>
          </div>
          <div className="font-mono text-slate-900 dark:text-white leading-snug">{timingShort}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold mb-1">
            <Wind className="w-3.5 h-3.5" />
            <span>Щётки дворников</span>
          </div>
          <div className="font-mono text-slate-900 dark:text-white leading-snug">{wipersShort}</div>
        </div>

        <div className="p-3 rounded-xl bg-sky-50 dark:bg-frost-500/10 border border-sky-200 dark:border-frost-400/30">
          <div className="flex items-center gap-1.5 text-sky-800 dark:text-frost-300 font-bold mb-1">
            <Snowflake className="w-3.5 h-3.5" />
            <span>{winterMode ? 'Зима ХМАО (-40 °C)' : 'Штатная замена'}</span>
          </div>
          <div className="font-mono text-slate-900 dark:text-frost-200 leading-snug">
            {winterMode ? (car.intervalWinter || car.intervalNormal) : (car.intervalNormal || car.intervalWinter)}
          </div>
        </div>
      </div>
    </section>
  );
}
