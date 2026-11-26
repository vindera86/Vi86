import React from 'react';
import { Snowflake, ShieldCheck, Heart, MapPin, Gauge } from 'lucide-react';

export default function Footer({ totalCars = 280 }) {
  return (
    <footer className="w-full mt-20 border-t border-white/10 glass-panel bg-carbon-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="h-10 w-10 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-amberGold-400/30 to-frost-500/20 border border-white/10">
              <img src="assets/logo.png" alt="NV86 Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <div className="text-base font-bold text-white tracking-tight">
                NV86 <span className="text-amberGold-400">AuTo</span>Mix
              </div>
              <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1">
                <MapPin className="w-3 h-3 text-frost-400" />
                Нижневартовск · ХМАО-Югра · Регион 86 РФ
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5">
              <Gauge className="w-3.5 h-3.5 text-amberGold-400" />
              {totalCars} конфигураций авто
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-frost-500/10 border border-frost-500/20 text-frost-300">
              <Snowflake className="w-3.5 h-3.5" />
              Калибровка для -40 °C
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Локальный каталог
            </span>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right font-mono">
            © {new Date().getFullYear()} NV86 AuToMix. Мобильный автоподбор РФ
          </div>

        </div>
      </div>
    </footer>
  );
}
