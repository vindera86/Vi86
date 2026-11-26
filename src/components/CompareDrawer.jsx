import React from 'react';
import { 
  X, 
  Scale, 
  Trash2, 
  Flame, 
  Settings, 
  Wind, 
  Snowflake,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

export default function CompareDrawer({ 
  isOpen, 
  onClose, 
  compareList, 
  onRemoveFromCompare, 
  onClearCompare,
  onSelectCar 
}) {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  // Helper to determine if values in a row differ across compared cars
  const checkDiff = (key) => {
    if (compareList.length < 2) return false;
    const firstVal = (compareList[0][key] || '').trim().toLowerCase();
    return compareList.some(c => (c[key] || '').trim().toLowerCase() !== firstVal);
  };

  const rows = [
    { label: 'Годы выпуска', key: 'years' },
    { label: 'Оригинал OEM', key: 'oem', icon: Flame, isOem: true },
    { label: 'Аналог NGK', key: 'ngk' },
    { label: 'Аналог Denso', key: 'denso' },
    { label: 'Аналог Bosch / Brisk', key: 'bosch' },
    { label: 'Резьба / Ключ / Зазор', key: 'thread' },
    { label: 'Штатная замена', key: 'intervalNormal' },
    { label: 'Зима -40 °C (ХМАО)', key: 'intervalWinter', icon: Snowflake, isWinter: true },
    { label: 'ГРМ (ремень / цепь)', key: 'timing', icon: Settings, isTiming: true },
    { label: 'Приводные ремни', key: 'belts' },
    { label: 'Дворники и крепления', key: 'wipers', icon: Wind }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel w-full max-w-6xl max-h-[90vh] rounded-2xl flex flex-col border border-slate-300 dark:border-white/20 shadow-2xl overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amberGold-500/20 text-amberGold-500 dark:text-amberGold-400 border border-amberGold-400/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Сравнение модификаций ({compareList.length})
                </h2>
                <span className="hidden sm:inline-flex text-[11px] font-mono px-2 py-0.5 rounded-full bg-amberGold-500/15 text-amberGold-700 dark:text-amberGold-300 border border-amberGold-400/30 font-bold">
                  Подсветка различий активна
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Параметры с отличиями выделяются контрастной золотистой рамкой и тегом «Различается»
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareList.length > 0 && (
              <button
                onClick={onClearCompare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Очистить список</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
              title="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Body */}
        <div className="p-5 overflow-x-auto overflow-y-auto flex-1">
          {compareList.length === 0 ? (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center gap-3">
              <Scale className="w-12 h-12 text-slate-400 dark:text-slate-600" />
              <p className="text-base font-semibold text-slate-800 dark:text-slate-200">Список сравнения пуст</p>
              <p className="text-xs max-w-sm">
                Нажимайте на значок весов на карточках любых автомобилей в каталоге, чтобы сопоставить их артикулы и параметры бок о бок.
              </p>
            </div>
          ) : (
            <div className="min-w-[700px] space-y-4">
              
              {/* Header: Compared Cars */}
              <div className="grid grid-cols-12 gap-3 items-stretch pb-2 border-b border-slate-200 dark:border-white/10">
                <div className="col-span-3 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center">
                  Параметр / Спецификация
                </div>
                {compareList.map((c) => (
                  <div key={c.id} className="col-span-4 sm:col-span-4 glass-card rounded-xl p-3.5 border border-slate-200 dark:border-white/15 relative">
                    <button
                      onClick={() => onRemoveFromCompare(c.id)}
                      className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Удалить из сравнения"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-mono font-bold text-amberGold-600 dark:text-amberGold-400 uppercase">
                      {c.brand}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mt-0.5 mb-1 pr-6">
                      {c.model}
                    </h4>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-300 block truncate">
                      {c.engine}
                    </span>
                  </div>
                ))}
              </div>

              {/* Rows with Diff Highlight */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                {rows.map((row) => {
                  const hasDiff = checkDiff(row.key);
                  const Icon = row.icon;

                  return (
                    <div 
                      key={row.key}
                      className={`grid grid-cols-12 gap-3 p-3 rounded-xl items-center transition-colors border ${
                        hasDiff 
                          ? 'bg-amber-50 dark:bg-amberGold-500/10 border-amber-300 dark:border-amberGold-500/30' 
                          : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5'
                      }`}
                    >
                      {/* Row Label & Diff Status Tag */}
                      <div className="col-span-3 flex flex-col gap-1 pr-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                          {Icon && <Icon className="w-3.5 h-3.5 text-amberGold-500 dark:text-amberGold-400 shrink-0" />}
                          <span className={hasDiff ? 'text-amber-800 dark:text-amberGold-300 font-bold' : ''}>
                            {row.label}
                          </span>
                        </div>
                        {compareList.length > 1 && (
                          <div>
                            {hasDiff ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amberGold-400 bg-amber-100 dark:bg-amberGold-500/20 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amberGold-400/30">
                                <AlertCircle className="w-2.5 h-2.5" />
                                Различается
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20 font-medium">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Совпадает
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Values per car */}
                      {compareList.map((c) => {
                        const val = c[row.key] || '—';
                        return (
                          <div 
                            key={c.id} 
                            className={`col-span-4 font-mono leading-relaxed break-words p-2 rounded-lg text-xs sm:text-sm ${
                              hasDiff 
                                ? 'bg-white dark:bg-carbon-900/80 border border-amber-300 dark:border-amberGold-400/20 text-slate-900 dark:text-white font-semibold' 
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {val}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-100 dark:bg-black/20 text-xs text-slate-600 dark:text-slate-400">
          <span>Сравнение технических данных NV86 AuToMix</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-amberGold-500 hover:bg-amberGold-400 text-slate-950 transition-colors cursor-pointer"
          >
            Закрыть окно
          </button>
        </div>

      </div>
    </div>
  );
}
