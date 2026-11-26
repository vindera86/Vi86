import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  X, 
  ShieldCheck, 
  Gauge, 
  Snowflake, 
  Sparkles,
  Zap,
  CheckCircle,
  Compass
} from 'lucide-react';

export default function Hero({ 
  searchQuery, 
  setSearchQuery, 
  selectedBrand, 
  setSelectedBrand, 
  brands,
  totalCars,
  filteredCount
}) {
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
    <section className="relative w-full overflow-hidden pt-4 pb-5">
      
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

        {/* Global Instant Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
          className="max-w-3xl mx-auto mb-3.5"
        >
          <div className="relative glass-panel rounded-2xl p-2 sm:p-2.5 flex items-center gap-2 border border-white/15 shadow-2xl">
            <div className="pl-3 text-slate-400 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-amberGold-400" />
            </div>
            
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Марка, модель, ДВС, артикул, VIN или кузов..."
              className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-base px-1.5 sm:px-2 py-2 focus:outline-none"
            />

            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
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
        </motion.div>

        {/* Quick Brand Filter Chips */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-1.5"
        >
          {popularBrands.map((b) => {
            const isActive = selectedBrand === b || (b === 'Все марки' && !selectedBrand);
            return (
              <motion.button
                key={b}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedBrand(b === 'Все марки' ? '' : b)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-amberGold-500 text-slate-950 font-semibold shadow-glow-amber border border-amberGold-400' 
                    : 'glass-card text-slate-300 hover:text-white border-white/10 hover:border-white/20'
                }`}
              >
                {b}
              </motion.button>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
