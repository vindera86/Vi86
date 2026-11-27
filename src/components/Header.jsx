import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  Table2,
  Scale,
  Snowflake,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import ThemeToggle from './ThemeToggle';

export default function Header({
  viewMode,
  setViewMode,
  compareList,
  setIsCompareOpen,
  onOpenGuide,
  theme,
  setTheme,
  winterMode,
  setWinterMode,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useBodyScrollLock(mobileMenuOpen);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 shadow-lg transition-shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand & Emblem */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="relative flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-amberGold-400/40 via-slate-800 to-frost-500/30 border border-white/20 shadow-lg cursor-pointer">
              <img
                src="assets/logo.png"
                alt="NV86 AuToMix Logo"
                className="h-full w-full object-cover rounded-[9px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-xl font-black tracking-tight text-white font-sans whitespace-nowrap">
                  NV86 <span className="text-amberGold-400">AuTo</span>Mix
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-frost-500/15 text-frost-300 border border-frost-400/20 whitespace-nowrap">
                  <Snowflake className="w-3 h-3 text-frost-400" />
                  ХМАО · 86
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Controls (md and above) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Winter -40°C / Standard Interval Toggle */}
            <button
              onClick={() => setWinterMode((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                winterMode
                  ? 'bg-frost-500/15 text-frost-300 border-frost-400/30 hover:bg-frost-500/25'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-slate-200'
              }`}
              title={
                winterMode
                  ? 'Режим ХМАО (-40 °C): показаны зимние интервалы замены'
                  : 'Штатный режим: показаны заводские интервалы замены'
              }
            >
              <Snowflake className={`w-3.5 h-3.5 ${winterMode ? 'text-frost-400' : 'text-slate-400'}`} />
              <span className="hidden xl:inline">{winterMode ? '-40°C' : 'Штат'}</span>
            </button>

            {/* Day / Night Glassmorphism Toggle */}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            {/* View Mode Toggle: Grid / Table (Liquid Glass Pill) */}
            <div className="relative flex items-center p-1 rounded-2xl bg-slate-200/70 dark:bg-[#0b162a]/75 backdrop-blur-md border border-slate-300/80 dark:border-[#60a5fa]/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.45)] dark:shadow-[inset_0_1px_2px_rgba(147,197,253,0.12)]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'text-slate-900 dark:text-[#e0f2fe]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Вид: Карточки"
              >
                {viewMode === 'grid' && (
                  <motion.span
                    layoutId="header-view-pill"
                    transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.85 }}
                    className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-white/95 to-[#dbeafe]/85 dark:from-[#1e3a6d]/90 dark:to-[#122647]/95 backdrop-blur-md border border-white dark:border-[#93c5fd]/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_12px_-2px_rgba(14,165,233,0.28)] dark:shadow-[inset_0_1px_1px_rgba(186,230,253,0.35),0_4px_12px_-2px_rgba(2,6,23,0.55)]"
                  />
                )}
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Карточки</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                  viewMode === 'table'
                    ? 'text-slate-900 dark:text-[#e0f2fe]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Вид: Таблица спецификаций"
              >
                {viewMode === 'table' && (
                  <motion.span
                    layoutId="header-view-pill"
                    transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.85 }}
                    className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-white/95 to-[#dbeafe]/85 dark:from-[#1e3a6d]/90 dark:to-[#122647]/95 backdrop-blur-md border border-white dark:border-[#93c5fd]/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_12px_-2px_rgba(14,165,233,0.28)] dark:shadow-[inset_0_1px_1px_rgba(186,230,253,0.35),0_4px_12px_-2px_rgba(2,6,23,0.55)]"
                  />
                )}
                <Table2 className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Таблица</span>
              </button>
            </div>

            {/* Spark Plug Training Presentation Trigger */}
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border cursor-pointer bg-white/5 text-slate-200 border-white/10 hover:bg-amberGold-500/15 hover:text-amberGold-300 hover:border-amberGold-400/30"
              title="Обучение по свечам NGK и Denso (презентация)"
            >
              <GraduationCap className="w-4 h-4 text-amberGold-400 shrink-0" />
              <span>Обучение</span>
            </button>

            {/* Comparison Drawer Trigger */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                compareList.length > 0
                  ? 'bg-amberGold-500 text-slate-950 border-amberGold-400 shadow-glow-amber'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
              title="Сравнение"
            >
              <Scale className="w-4 h-4" />
              <span>Сравнение</span>
              {compareList.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-amberGold-400 text-[11px] font-bold font-mono">
                  {compareList.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile App Menu Trigger (< md) */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Открыть меню"
              className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                theme === 'light'
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900'
                  : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
              }`}
            >
              <Menu className="w-4 h-4 text-amberGold-400" />
              <span>Меню</span>
              {compareList.length > 0 && (
                <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-amberGold-500 text-slate-950 text-[10px] font-bold font-mono">
                  {compareList.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Side App Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/75"
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className={`absolute right-0 top-0 bottom-0 w-[82vw] max-w-xs shadow-2xl flex flex-col border-l ${
                theme === 'light'
                  ? 'bg-white border-slate-200 text-slate-900'
                  : 'bg-[#11151d] border-white/15 text-white'
              }`}
            >
              {/* Drawer Header */}
              <div
                className={`flex items-center justify-between px-4 py-4 border-b ${
                  theme === 'light' ? 'border-slate-200' : 'border-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src="assets/logo.png"
                    alt="NV86 AuToMix"
                    className={`h-8 w-8 rounded-lg object-cover border ${
                      theme === 'light' ? 'border-slate-200' : 'border-white/20'
                    }`}
                  />
                  <div>
                    <div className="text-sm font-black tracking-tight">
                      NV86 <span className="text-amberGold-500">AuTo</span>Mix
                    </div>
                    <div
                      className={`text-[11px] flex items-center gap-1 ${
                        theme === 'light' ? 'text-sky-700' : 'text-frost-300'
                      }`}
                    >
                      <Snowflake className="w-3 h-3 text-frost-500" />
                      <span>ХМАО · 86 регион</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Закрыть меню"
                  className={`p-2 rounded-xl border ${
                    theme === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Actions */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Winter mode */}
                <button
                  type="button"
                  onClick={() => setWinterMode((prev) => !prev)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-colors ${
                    winterMode
                      ? theme === 'light'
                        ? 'bg-sky-50 border-sky-300 text-slate-900'
                        : 'bg-frost-500/15 border-frost-400/35 text-white'
                      : theme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-700'
                        : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Snowflake
                      className={`w-4 h-4 ${winterMode ? 'text-sky-500' : 'text-slate-400'}`}
                    />
                    <div>
                      <div className="text-xs font-bold">Режим ХМАО (-40 °C)</div>
                      <div className={`text-[11px] ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                        {winterMode ? 'Включены зимние интервалы' : 'Штатные интервалы РФ'}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      winterMode
                        ? theme === 'light'
                          ? 'bg-sky-200 text-sky-900'
                          : 'bg-frost-400/20 text-frost-300'
                        : theme === 'light'
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {winterMode ? 'ВКЛ' : 'ВЫКЛ'}
                  </span>
                </button>

                {/* Theme */}
                <div
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-white/5 border-white/10 text-white'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">Тема оформления</div>
                    <div className={`text-[11px] ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                      {theme === 'dark' ? 'Тёмная (ночная)' : 'Светлая (дневная)'}
                    </div>
                  </div>
                  <ThemeToggle theme={theme} onToggle={toggleTheme} />
                </div>

                {/* View Mode */}
                <div
                  className={`p-3.5 rounded-xl border space-y-2 ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className={`text-xs font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'}`}>
                    Вид каталога
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('grid');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border ${
                        viewMode === 'grid'
                          ? theme === 'light'
                            ? 'bg-amber-100 text-amber-900 border-amber-400'
                            : 'bg-amberGold-500/20 text-amberGold-300 border-amberGold-500/40'
                          : theme === 'light'
                            ? 'bg-white text-slate-600 border-slate-200'
                            : 'bg-black/20 text-slate-400 border-white/10'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Карточки</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('table');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border ${
                        viewMode === 'table'
                          ? theme === 'light'
                            ? 'bg-amber-100 text-amber-900 border-amber-400'
                            : 'bg-amberGold-500/20 text-amberGold-300 border-amberGold-500/40'
                          : theme === 'light'
                            ? 'bg-white text-slate-600 border-slate-200'
                            : 'bg-black/20 text-slate-400 border-white/10'
                      }`}
                    >
                      <Table2 className="w-3.5 h-3.5" />
                      <span>Таблица</span>
                    </button>
                  </div>
                </div>

                {/* Training Presentation */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenGuide();
                  }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left ${
                    theme === 'light'
                      ? 'bg-amber-50 border-amber-300 text-slate-900'
                      : 'bg-amberGold-500/15 border-amberGold-500/35 text-white'
                  }`}
                >
                  <GraduationCap className={`w-5 h-5 shrink-0 ${theme === 'light' ? 'text-amber-700' : 'text-amberGold-400'}`} />
                  <div>
                    <div className={`text-xs font-bold ${theme === 'light' ? 'text-amber-900' : 'text-amberGold-300'}`}>
                      Обучение по свечам
                    </div>
                    <div className={`text-[11px] ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                      NGK &amp; Denso: 9 слайдов, коды, фото
                    </div>
                  </div>
                </button>

                {/* Compare */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCompareOpen(true);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-white/5 border-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Scale className={`w-4 h-4 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`} />
                    <div>
                      <div className="text-xs font-bold">Сравнение авто</div>
                      <div className={`text-[11px] ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                        {compareList.length > 0
                          ? `Выбрано: ${compareList.length}`
                          : 'Пока ничего не выбрано'}
                      </div>
                    </div>
                  </div>
                  {compareList.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amberGold-500 text-slate-950 text-xs font-bold font-mono">
                      {compareList.length}
                    </span>
                  )}
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
