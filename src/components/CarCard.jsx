import React from 'react';
import { 
  Copy, 
  ChevronRight, 
  Snowflake, 
  Wrench, 
  Scale,
  Wind
} from 'lucide-react';
import { highlightMatch, pickMatchingPart } from '../utils/highlightMatch';

export default React.memo(function CarCard({ 
  car, 
  onSelectCar, 
  onToggleCompare, 
  isCompared, 
  winterMode, 
  searchQuery = '',
  onCopyText 
}) {
  const isChain = car.timing.toLowerCase().includes('цепь');

  return (
    <article 
      className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-slate-200 dark:border-white/10 hover:border-amberGold-500/50 dark:hover:border-amberGold-500/40 relative group overflow-hidden transition-[transform,border-color,box-shadow] duration-200 shadow-sm hover:shadow-md"
    >
      <div>
        {/* Header: Brand, Years, Compare Toggle */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-amberGold-500/15 text-amberGold-700 dark:text-amberGold-400 border border-amberGold-500/30 font-mono">
              {highlightMatch(car.brand, searchQuery)}
            </span>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/5">
              {car.years || 'Года не указ.'}
            </span>
            {isChain ? (
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20">
                Цепь ГРМ
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20">
                Ремень ГРМ
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(car);
            }}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isCompared 
                ? 'bg-amberGold-500 text-slate-950 border-amberGold-400 shadow-glow-amber' 
                : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
            title={isCompared ? 'Убрать из сравнения' : 'Добавить к сравнению'}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Model & Family */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-amberGold-600 dark:group-hover:text-amberGold-300 transition-colors">
          {highlightMatch(car.family && car.family !== car.model ? `${car.family} — ${car.model}` : car.model, searchQuery)}
        </h3>

        {/* Engine Spec */}
        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium mb-4 bg-slate-100 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-white/5">
          <Wrench className="w-3.5 h-3.5 text-amberGold-600 dark:text-amberGold-400 shrink-0" />
          <span className="truncate">{highlightMatch(car.engine, searchQuery)}</span>
        </div>

        {/* Quick Specs: OEM & NGK */}
        <div className="space-y-2 mb-4 text-xs">
          
          {/* OEM Spark Plug */}
          {(() => {
            const hasVin = car.oem?.includes('VIN');
            const cleanOem = car.oem ? car.oem.replace(/\[ВАЖНО:[^\]]*\]?/g, '').trim() : '';
            const displayedOem = pickMatchingPart(cleanOem, searchQuery);
            return (
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] shrink-0">Оригинал OEM:</span>
                <div className="flex items-center gap-1.5 max-w-[65%] min-w-0">
                  {hasVin && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amberGold-500/20 text-amberGold-700 dark:text-amberGold-300 border border-amberGold-500/30 shrink-0">
                      VIN
                    </span>
                  )}
                  <span className="font-mono text-slate-800 dark:text-slate-200 truncate font-bold">
                    {displayedOem ? highlightMatch(displayedOem, searchQuery) : (hasVin ? 'По VIN' : '—')}
                  </span>
                  {displayedOem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopyText(displayedOem, 'OEM артикул скопирован!');
                      }}
                      className="p-1 text-slate-400 hover:text-amberGold-600 dark:hover:text-amberGold-400 transition-colors cursor-pointer shrink-0"
                      title="Скопировать OEM"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* NGK Analogue */}
          {(() => {
            const displayedNgk = pickMatchingPart(car.ngk, searchQuery);
            return (
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] shrink-0">Аналог NGK:</span>
                <div className="flex items-center gap-1.5 max-w-[65%]">
                  <span className="font-mono text-slate-800 dark:text-slate-200 truncate font-medium">
                    {displayedNgk ? highlightMatch(displayedNgk, searchQuery) : '—'}
                  </span>
                  {displayedNgk && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopyText(displayedNgk, 'NGK артикул скопирован!');
                      }}
                      className="p-1 text-slate-400 hover:text-amberGold-600 dark:hover:text-amberGold-400 transition-colors cursor-pointer"
                      title="Скопировать NGK"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Wipers Quick Size */}
          {car.wipers && (
            <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] shrink-0 flex items-center gap-1">
                <Wind className="w-3 h-3 text-emerald-500" />
                Щётки:
              </span>
              <span className="font-mono text-slate-800 dark:text-slate-200 truncate text-right font-medium">
                {car.wipers.split('|')[0].replace(/^Передние:\s*/i, '').trim()}
              </span>
            </div>
          )}

        </div>

        {/* Compact Replacement Interval Pill */}
        {(winterMode ? car.intervalWinter : (car.intervalNormal || car.intervalWinter)) && (
          <div className={`px-2.5 py-2 rounded-xl text-[11px] mb-3.5 flex items-center gap-2 border transition-colors ${
            winterMode 
              ? 'bg-sky-50 dark:bg-frost-500/15 border-sky-200 dark:border-frost-400/40 text-sky-800 dark:text-frost-200' 
              : 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300'
          }`}>
            <Snowflake className={`w-3.5 h-3.5 shrink-0 ${winterMode ? 'text-sky-600 dark:text-frost-300' : 'text-slate-400'}`} />
            <div className="truncate leading-tight">
              <span className={`font-bold ${winterMode ? 'text-sky-700 dark:text-frost-300' : 'text-slate-700 dark:text-slate-200'}`}>
                {winterMode ? '-40°C: ' : 'Штат: '}
              </span>
              <span className="font-mono">
                {(winterMode ? car.intervalWinter : (car.intervalNormal || car.intervalWinter)).split('(')[0].trim()}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Card Action Button */}
      <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium">
          № {car.id}
        </span>

        <button
          onClick={() => onSelectCar(car)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-b from-amberGold-400 to-amberGold-500 text-slate-950 hover:from-amberGold-300 hover:to-amberGold-400 border border-amberGold-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_4px_12px_-3px_rgba(245,158,11,0.35)] active:scale-[0.97] transition-all cursor-pointer"
        >
          <span>Техкарта авто</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </article>
  );
});
