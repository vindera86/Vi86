import React from 'react';
import { X, HelpCircle } from 'lucide-react';
import { WIPER_MOUNTS_CATALOG } from './WiperMountIcons';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

export default function WiperMountsCatalogModal({ isOpen, onClose }) {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel w-full max-w-4xl max-h-[88vh] rounded-2xl flex flex-col border border-slate-300 dark:border-white/20 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 dark:bg-frost-500/20 text-sky-600 dark:text-frost-300 border border-sky-200 dark:border-frost-400/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Справочник типов креплений дворников
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Оригинальные профили адаптеров и поводков щеток стеклоочистителя (mirdvornikov.ru)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mounts Grid with Real MirDvornikov Images */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {WIPER_MOUNTS_CATALOG.map((m) => {
            return (
              <div 
                key={m.id}
                className="glass-card rounded-xl p-4 border border-slate-200 dark:border-white/10 flex flex-col justify-between hover:border-sky-400 dark:hover:border-frost-400/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300/90 p-2.5 rounded-xl border border-slate-300 dark:border-white/20 shadow-sm">
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {m.name.split('(')[0].trim()}
                    </span>
                    <img 
                      src={m.iconSrc} 
                      alt={m.name} 
                      className="h-9 max-w-[90px] object-contain drop-shadow-sm"
                      loading="lazy"
                    />
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                    {m.name}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-100 dark:bg-black/20 text-xs text-slate-600 dark:text-slate-400">
          <span>Сверка профилей поводков и адаптеров по базе Мир Дворников</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amberGold-500 text-slate-950 font-bold hover:bg-amberGold-400 transition-colors cursor-pointer"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}
