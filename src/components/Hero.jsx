import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  ChevronRight,
  Wrench,
  CornerDownLeft
} from 'lucide-react';
import { highlightMatch } from '../utils/highlightMatch';

export default function Hero({ 
  searchQuery, 
  setSearchQuery, 
  selectedBrand, 
  setSelectedBrand, 
  brands,
  carsData = [],
  onSelectCar,
  totalCars,
  filteredCount
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchQuery]);

  // Fast word & model suggestions when user types >= 2 chars
  const { wordChips, carMatches } = useMemo(() => {
    const raw = searchQuery.trim();
    if (raw.length < 2) return { wordChips: [], carMatches: [] };
    const q = raw.toLowerCase();

    // 1) Matching brand / family keywords
    const wordSet = new Set();
    for (const b of brands) {
      if (b.toLowerCase().includes(q)) wordSet.add(b);
      if (wordSet.size >= 4) break;
    }
    if (wordSet.size < 5) {
      for (const car of carsData) {
        if (car.family && car.family.toLowerCase().includes(q)) {
          wordSet.add(car.family);
          if (wordSet.size >= 5) break;
        }
      }
    }

    // 2) Scored matching car entries (top 7)
    const scored = [];
    for (const car of carsData) {
      const brandL = (car.brand || '').toLowerCase();
      const familyL = (car.family || '').toLowerCase();
      const modelL = (car.model || '').toLowerCase();
      const engineL = (car.engine || '').toLowerCase();
      const partsL = `${car.oem || ''} ${car.ngk || ''} ${car.denso || ''} ${car.bosch || ''}`.toLowerCase();

      let score = 0;
      if (brandL.startsWith(q) || modelL.startsWith(q) || familyL.startsWith(q)) score = 4;
      else if (brandL.includes(q) || familyL.includes(q) || modelL.includes(q)) score = 3;
      else if (engineL.includes(q)) score = 2;
      else if (partsL.includes(q)) score = 1;

      if (score > 0) {
        scored.push({ car, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return {
      wordChips: Array.from(wordSet),
      carMatches: scored.slice(0, 7).map((item) => item.car),
    };
  }, [searchQuery, brands, carsData]);

  const showSuggestions = isDropdownOpen && searchQuery.trim().length >= 2 && (wordChips.length > 0 || carMatches.length > 0);

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 < carMatches.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : carMatches.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && carMatches[activeIndex]) {
      e.preventDefault();
      setIsDropdownOpen(false);
      onSelectCar?.(carMatches[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const popularBrands = [
    'Все марки',
    'LADA',
    'Haval',
    'Belgee / Geely',
    'Chery / Tenet',
    'Hyundai',
    'KIA',
    'Toyota',
    'Renault',
    'Volkswagen',
    'УАЗ'
  ];

  return (
    <section className="relative z-30 w-full pt-4 pb-5">
      
      {/* Background Graphic & Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <img 
          src="assets/hero-car.png" 
          alt="Automotive research garage" 
          className="w-full h-full object-cover object-center"
        />
        <div className="hero-fade absolute inset-0 bg-gradient-to-b from-carbon-950 via-carbon-950/85 to-carbon-950" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Top Content - Compact & Focused */}
        <div className="max-w-3xl mx-auto text-center mb-4">
          <motion.h1 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5 leading-tight font-sans"
          >
            Подбор запчастей для{' '}
            <span className="hero-accent bg-gradient-to-r from-amberGold-400 via-amber-200 to-frost-400 bg-clip-text text-transparent">
              РФ и ХМАО (-40 °C)
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.05 }}
            className="text-xs sm:text-sm text-slate-300 font-normal"
          >
            Свечи, ремни ГРМ и дворники с OEM-номерами и аналогами NGK, Denso, Gates
          </motion.p>
        </div>

        {/* Global Instant Search Bar with Animated Suggestions */}
        <motion.div 
          ref={searchBoxRef}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
          className="relative max-w-3xl mx-auto mb-3.5 z-30"
        >
          <div className="relative glass-panel rounded-2xl p-2 sm:p-2.5 flex items-center gap-2 border border-white/15 shadow-2xl">
            <div className="pl-3 text-slate-400 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-amberGold-400" />
            </div>
            
            <input 
              type="text"
              value={searchQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Марка, модель, ДВС, артикул, VIN или кузов..."
              aria-label="Поиск по маркам, моделям, двигателям, артикулам и VIN"
              aria-expanded={showSuggestions}
              aria-autocomplete="list"
              className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-base px-1.5 sm:px-2 py-2 focus:outline-none"
            />

            {searchQuery && (
              <button 
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsDropdownOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Очистить"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="hidden sm:flex items-center pr-2 shrink-0">
              <span className="whitespace-nowrap text-xs font-mono font-medium text-slate-800 dark:text-slate-400 bg-slate-200 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-white/10">
                {filteredCount} из {totalCars}
              </span>
            </div>
          </div>

          {/* Animated Suggestions Dropdown (GPU-composited opacity + transform only) */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'top center' }}
                className="absolute left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-carbon-900 border border-slate-300 dark:border-white/15 shadow-2xl overflow-hidden z-50"
              >
                {/* Quick word/brand chips */}
                {wordChips.length > 0 && (
                  <div className="px-3.5 py-2.5 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-1.5 bg-slate-50 dark:bg-black/25">
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mr-1">
                      Совпадения:
                    </span>
                    {wordChips.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setSearchQuery(chip);
                          setIsDropdownOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amberGold-500/15 hover:bg-amberGold-500 text-amberGold-700 dark:text-amberGold-300 hover:text-slate-950 border border-amberGold-500/30 transition-colors cursor-pointer"
                      >
                        {highlightMatch(chip, searchQuery)}
                      </button>
                    ))}
                  </div>
                )}

                {/* Matching vehicle cards */}
                {carMatches.length > 0 && (
                  <ul role="listbox" className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                    {carMatches.map((car, idx) => {
                      const isActive = idx === activeIndex;
                      return (
                        <li key={car.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() => {
                              setIsDropdownOpen(false);
                              onSelectCar?.(car);
                            }}
                            className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-amberGold-500/15 dark:bg-amberGold-500/20'
                                : 'hover:bg-slate-100 dark:hover:bg-white/5'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amberGold-500/15 text-amberGold-700 dark:text-amberGold-400 border border-amberGold-500/30 shrink-0">
                                  {highlightMatch(car.brand, searchQuery)}
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                  {highlightMatch(car.model, searchQuery)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 truncate">
                                <Wrench className="w-3 h-3 text-amberGold-500 shrink-0" />
                                <span className="truncate">{highlightMatch(car.engine, searchQuery)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                              <span className="hidden sm:inline text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                {car.years}
                              </span>
                              {isActive ? (
                                <CornerDownLeft className="w-4 h-4 text-amberGold-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="px-3.5 py-1.5 bg-slate-50 dark:bg-black/30 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>Найдено: {filteredCount} из {totalCars}</span>
                  <span className="hidden sm:inline">↑↓ выбор · Enter — открыть техкарту · Esc</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Brand Filter Chips (Liquid Glass) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-[#0b162a]/65 backdrop-blur-md border border-slate-300/75 dark:border-[#60a5fa]/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.45)] dark:shadow-[inset_0_1px_2px_rgba(147,197,253,0.12)]"
        >
          {popularBrands.map((b) => {
            const isActive = selectedBrand === b || (b === 'Все марки' && !selectedBrand);
            return (
              <motion.button
                key={b}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedBrand(b === 'Все марки' ? '' : b)}
                className={`relative z-10 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                  isActive 
                    ? 'text-slate-900 dark:text-[#e0f2fe]' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="hero-brand-pill"
                    transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.85 }}
                    className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-white/95 to-[#dbeafe]/85 dark:from-[#1e3a6d]/90 dark:to-[#122647]/95 backdrop-blur-md border border-white dark:border-[#93c5fd]/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_12px_-2px_rgba(14,165,233,0.28)] dark:shadow-[inset_0_1px_1px_rgba(186,230,253,0.35),0_4px_12px_-2px_rgba(2,6,23,0.55)]"
                  />
                )}
                {b}
              </motion.button>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
