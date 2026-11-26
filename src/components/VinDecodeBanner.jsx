import React from 'react';
import { FileSearch, X, Calendar, Car, Cpu, Loader2 } from 'lucide-react';

export default function VinDecodeBanner({ vinInfo, loading, onClear }) {
  if (!vinInfo) return null;

  return (
    <div className="glass-panel rounded-2xl p-4 mb-5 border border-frost-400/40 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-frost-500/15 text-frost-300 border border-frost-400/30 shrink-0">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-frost-300">
                {vinInfo.isFrame ? 'Номер кузова (Frame)' : 'VIN-поиск'}
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10">
                {vinInfo.vin}
              </span>
              {loading && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  уточнение через NHTSA...
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-700 dark:text-slate-200">
              <span className="inline-flex items-center gap-1 font-semibold">
                <Car className="w-3.5 h-3.5 text-amberGold-500" />
                {vinInfo.brands.length > 0 ? vinInfo.brands.join(' / ') : 'Марка не определена'}
                {vinInfo.modelHint ? ` · ${vinInfo.modelHint}` : ''}
              </span>

              {vinInfo.year && (
                <span className="inline-flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-frost-400" />
                  {vinInfo.year} г.
                </span>
              )}

              {vinInfo.displacement && (
                <span className="inline-flex items-center gap-1 font-mono">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  {vinInfo.displacement}
                </span>
              )}

              {vinInfo.plant && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {vinInfo.plant}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onClear}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>{vinInfo.isFrame ? 'Сбросить кузов' : 'Сбросить VIN'}</span>
        </button>
      </div>
    </div>
  );
}
