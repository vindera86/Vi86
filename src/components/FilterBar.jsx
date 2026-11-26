import React from 'react';
import { 
  RotateCcw, 
  ChevronDown, 
  Car, 
  Cpu, 
  Calendar,
  SlidersHorizontal,
  Link2,
  Sparkles,
  FileSearch,
  Check,
  Snowflake
} from 'lucide-react';

export default function FilterBar({
  brands,
  families,
  engines,
  selectedBrand,
  setSelectedBrand,
  selectedFamily,
  setSelectedFamily,
  selectedEngine,
  setSelectedEngine,
  activeQuickFilter,
  setActiveQuickFilter,
  resetFilters,
  filteredCount,
  totalCars,
  hasActiveFilters
}) {
  const quickFilters = [
    { id: 'all', label: 'Все', icon: Car },
    { id: 'chain', label: 'Цепь ГРМ', icon: Link2 },
    { id: 'iridium', label: 'Иридий / Платина', icon: Sparkles },
    { id: 'vin', label: 'По VIN', icon: FileSearch },
  ];

  return (
    <div className="w-full glass-panel rounded-2xl p-3.5 sm:p-4 mb-5 border border-white/10 shadow-xl">
      <div className="flex flex-col gap-3">
        
        {/* Filter Title & Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amberGold-500/20 text-amberGold-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              Подбор по авто
            </h2>
            <span className="whitespace-nowrap text-xs font-mono text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-300 dark:border-white/5">
              Найдено: <strong className="text-amberGold-700 dark:text-amberGold-400 font-semibold">{filteredCount}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Сбросить всё</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Step Selectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          
          {/* Step 1: Brand */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-amberGold-400" />
              <span>1. Марка автомобиля</span>
            </label>
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedFamily('');
                  setSelectedEngine('');
                }}
                className="w-full glass-input text-slate-200 text-sm rounded-xl px-3.5 py-2.5 pr-9 appearance-none focus:outline-none transition-colors cursor-pointer"
              >
                <option value="" className="bg-carbon-900 text-slate-300">Все марки ({brands.length})</option>
                {brands.map((b) => (
                  <option key={b} value={b} className="bg-carbon-900 text-slate-200">
                    {b}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Step 2: Family / Model */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amberGold-400" />
              <span>2. Семейство / Модель</span>
            </label>
            <div className="relative">
              <select
                value={selectedFamily}
                onChange={(e) => {
                  setSelectedFamily(e.target.value);
                  setSelectedEngine('');
                }}
                disabled={families.length === 0}
                className="w-full glass-input text-slate-200 text-sm rounded-xl px-3.5 py-2.5 pr-9 appearance-none focus:outline-none transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-carbon-900 text-slate-300">
                  {selectedBrand ? `Все модели ${selectedBrand}` : 'Все модели'}
                </option>
                {families.map((f) => (
                  <option key={f} value={f} className="bg-carbon-900 text-slate-200">
                    {f}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Step 3: Engine */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amberGold-400" />
              <span>3. Двигатель / Модификация</span>
            </label>
            <div className="relative">
              <select
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value)}
                disabled={engines.length === 0}
                className="w-full glass-input text-slate-200 text-sm rounded-xl px-3.5 py-2.5 pr-9 appearance-none focus:outline-none transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-carbon-900 text-slate-300">Все двигатели</option>
                {engines.map((e) => (
                  <option key={e} value={e} className="bg-carbon-900 text-slate-200">
                    {e}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Practical Quick Technical Filters */}
        <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <span className="hidden md:inline text-xs font-mono text-slate-400 font-semibold mr-1">
              Фильтр:
            </span>

            {quickFilters.map((qf) => {
              const Icon = qf.icon;
              const isActive = activeQuickFilter === qf.id;
              return (
                <button
                  key={qf.id}
                  onClick={() => setActiveQuickFilter(isActive && qf.id !== 'all' ? 'all' : qf.id)}
                  className={`flex items-center justify-center sm:justify-start gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all border cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'bg-amberGold-500 text-slate-950 border-amberGold-400 shadow-glow-amber font-semibold' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{qf.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex text-xs text-slate-400 font-mono items-center gap-2 shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Онлайн-подбор без задержек</span>
          </div>

        </div>

      </div>
    </div>
  );
}
