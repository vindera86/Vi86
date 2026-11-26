import React from 'react';
import { 
  Copy, 
  ChevronRight, 
  Scale, 
  Check,
  ShieldCheck,
  Settings,
  Wind,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { highlightMatch, pickMatchingPart } from '../utils/highlightMatch';

export default function TableView({
  cars,
  onSelectCar,
  onToggleCompare,
  compareList,
  onCopyText,
  winterMode,
  searchQuery = '',
  sortConfig = { key: null, dir: 'asc' },
  onSort
}) {
  const renderSortIcon = (key) => {
    if (sortConfig?.key !== key) {
      return <ArrowUpDown className="w-3 h-3 opacity-45 group-hover/th:opacity-100 transition-opacity shrink-0" />;
    }
    return sortConfig.dir === 'asc'
      ? <ArrowUp className="w-3 h-3 text-amberGold-500 shrink-0" />
      : <ArrowDown className="w-3 h-3 text-amberGold-500 shrink-0" />;
  };
  return (
    <div 
      tabIndex={0} 
      role="region" 
      aria-labelledby="cars-table-caption"
      className="glass-panel rounded-2xl border border-slate-300 dark:border-white/10 shadow-2xl overflow-x-auto focus:outline-none transition-colors duration-500"
    >
      <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[960px] lg:min-w-0 lg:table-fixed">
        <caption id="cars-table-caption" className="sr-only">
          Технический каталог автомобилей NV86 AuToMix
        </caption>
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-carbon-900/95 text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider text-[11px]">
            <th className="py-3.5 px-3 w-[15%]">
              <button
                type="button"
                onClick={() => onSort?.('model')}
                className="group/th flex items-center gap-1.5 text-left uppercase tracking-wider hover:text-amberGold-600 dark:hover:text-amberGold-400 transition-colors cursor-pointer"
                title="Сортировать по марке и модели"
              >
                <span>№ / Марка и Модель</span>
                {renderSortIcon('model')}
              </button>
            </th>
            <th className="py-3.5 px-3 w-[14%]">
              <button
                type="button"
                onClick={() => onSort?.('years')}
                className="group/th flex items-center gap-1.5 text-left uppercase tracking-wider hover:text-amberGold-600 dark:hover:text-amberGold-400 transition-colors cursor-pointer"
                title="Сортировать по году выпуска"
              >
                <span>Двигатель / Годы</span>
                {renderSortIcon('years')}
              </button>
            </th>
            <th className="py-3.5 px-3 w-[12%]">Оригинал OEM</th>
            <th className="py-3.5 px-3 w-[12%]">Аналог NGK</th>
            <th className="py-3.5 px-3 w-[13%]">Резьба / Ключ / Зазор</th>
            <th className="py-3.5 px-3 w-[12%]">
              {winterMode ? 'Зима -40 °C (ХМАО)' : 'Штатная замена'}
            </th>
            <th className="py-3.5 px-3 w-[14%]">
              <button
                type="button"
                onClick={() => onSort?.('timing')}
                className="group/th flex items-center gap-1.5 text-left uppercase tracking-wider hover:text-amberGold-600 dark:hover:text-amberGold-400 transition-colors cursor-pointer"
                title="Сортировать по типу привода ГРМ"
              >
                <span>Ремень / цепь ГРМ</span>
                {renderSortIcon('timing')}
              </button>
            </th>
            <th className="py-3.5 px-3 w-[8%] text-right">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-900 dark:text-slate-100">
          {cars.map((car) => {
            const isCompared = compareList.some((c) => c.id === car.id);
            const isChain = car.timing.toLowerCase().includes('цепь');

            return (
              <tr 
                key={car.id}
                onClick={() => onSelectCar(car)}
                className="table-row-cv hover:bg-amberGold-500/[0.08] dark:hover:bg-amberGold-500/[0.05] transition-colors cursor-pointer group"
              >
                {/* Car */}
                <td className="py-3.5 px-3 align-top break-words">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-bold shrink-0 mt-0.5">
                      #{car.id}
                    </span>
                    <div className="min-w-0">
                      <span className="font-mono text-amberGold-600 dark:text-amberGold-400 font-bold text-[11px] uppercase block tracking-wider">
                        {highlightMatch(car.brand, searchQuery)}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white text-xs xl:text-sm group-hover:text-amberGold-600 dark:group-hover:text-amberGold-300 transition-colors block leading-snug">
                        {highlightMatch(car.model, searchQuery)}
                      </span>
                      {car.family && car.family !== car.model && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block mt-0.5">
                          {highlightMatch(car.family, searchQuery)}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Engine */}
                <td className="py-3.5 px-3 align-top break-words">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs leading-snug">
                    {highlightMatch(car.engine, searchQuery)}
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {car.years || 'Года не указ.'}
                  </div>
                </td>

                {/* OEM */}
                <td className="py-3.5 px-3 align-top font-mono">
                  {(() => {
                    const hasVin = car.oem?.includes('VIN');
                    const cleanOem = car.oem ? car.oem.replace(/\[ВАЖНО:[^\]]*\]?/g, '').trim() : '';
                    const displayedOem = pickMatchingPart(cleanOem, searchQuery);
                    return (
                      <div className="flex items-start gap-1.5 min-w-0">
                        <div className="min-w-0 flex-1">
                          {hasVin && (
                            <span className="inline-block px-1.5 py-0.5 mb-1 mr-1 rounded text-[10px] font-bold uppercase bg-amberGold-500/20 text-amberGold-700 dark:text-amberGold-300 border border-amberGold-500/30">
                              VIN
                            </span>
                          )}
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs break-words">
                            {displayedOem ? highlightMatch(displayedOem, searchQuery) : (hasVin ? 'Сверка по VIN' : '—')}
                          </span>
                        </div>
                        {displayedOem && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCopyText(displayedOem, 'OEM скопирован');
                            }}
                            className="p-1 text-slate-400 hover:text-amberGold-600 dark:hover:text-amberGold-400 transition-colors rounded bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 shrink-0 cursor-pointer"
                            title="Скопировать OEM"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </td>

                {/* NGK */}
                <td className="py-3.5 px-3 align-top font-mono">
                  {(() => {
                    const displayedNgk = pickMatchingPart(car.ngk, searchQuery);
                    return (
                      <div className="flex items-start gap-1.5 min-w-0">
                        <span className="text-slate-800 dark:text-slate-200 text-xs font-medium break-words min-w-0">
                          {displayedNgk ? highlightMatch(displayedNgk, searchQuery) : '—'}
                        </span>
                        {displayedNgk && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCopyText(displayedNgk, 'NGK скопирован');
                            }}
                            className="p-1 text-slate-400 hover:text-amberGold-600 dark:hover:text-amberGold-400 transition-colors rounded bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 shrink-0 cursor-pointer"
                            title="Скопировать NGK"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </td>

                {/* Thread */}
                <td className="py-3.5 px-3 align-top text-xs text-slate-700 dark:text-slate-300 font-mono break-words">
                  <div className="leading-snug">{car.thread || '—'}</div>
                </td>

                {/* Replacement Interval */}
                <td className="py-3.5 px-3 align-top break-words">
                  {winterMode ? (
                    <div>
                      <span className="text-sky-700 dark:text-frost-300 font-bold font-mono text-xs block leading-tight">
                        {car.intervalWinter || car.intervalNormal}
                      </span>
                      <span className="text-[10px] text-sky-800/80 dark:text-frost-400/80 font-mono block mt-0.5">
                        (-40°C ХМАО)
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-300 block">
                      {car.intervalNormal || '—'}
                    </span>
                  )}
                </td>

                {/* Timing */}
                <td className="py-3.5 px-3 align-top font-mono text-xs break-words">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap ${
                      isChain 
                        ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30'
                    }`}>
                      {isChain ? '⛓️ Цепь ГРМ' : '⚙️ Ремень ГРМ'}
                    </span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 leading-snug break-words">
                    {car.timing ? highlightMatch(car.timing, searchQuery) : '—'}
                  </div>
                </td>

                {/* Actions (Wide, spacious, NO overlap!) */}
                <td className="py-3.5 px-3 align-top text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompare(car);
                      }}
                      className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                        isCompared
                          ? 'bg-amberGold-500 text-slate-950 border-amberGold-400 shadow-md'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border-slate-300 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/20'
                      }`}
                      title={isCompared ? 'Убрать из сравнения' : 'Добавить к сравнению'}
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCar(car);
                      }}
                      className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amberGold-500 text-slate-950 hover:bg-amberGold-400 border border-amberGold-400 shadow-sm transition-all cursor-pointer"
                      title="Открыть подробную техкарту"
                    >
                      <span>Инфо</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
