import React, { useEffect, useRef, useState } from 'react';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import { 
  X, 
  Copy, 
  Check, 
  Snowflake, 
  Wrench, 
  Settings, 
  Wind, 
  Layers, 
  Printer, 
  Clock,
  FileSearch,
  ThermometerSnowflake,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Info,
  MessageSquare
} from 'lucide-react';
import { detectMountType } from './WiperMountIcons';
import { 
  TimingBeltDiagram, 
  PolyVRibDiagram, 
  ClassicVBeltDiagram, 
  ChainDiagram 
} from './BeltDiagrams';

export default function CarDetailModal({ car, onClose, onCopyText, winterMode }) {
  const dialogRef = useRef(null);
  const tabBodyRef = useRef(null);
  const [activeTab, setActiveTab] = useState('plugs');
  const [copiedPill, setCopiedPill] = useState(null);

  useEffect(() => {
    if (tabBodyRef.current) {
      tabBodyRef.current.scrollTop = 0;
    }
  }, [activeTab, car?.id]);

  // keep the page behind the modal from scrolling
  useBodyScrollLock(Boolean(car));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (car) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [car]);

  const handleBackdropClick = (e) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      onClose();
    }
  };

  if (!car) return null;

  const handleCopyPill = (text, label) => {
    onCopyText(text, `${label}: скопировано!`);
    setCopiedPill(text);
    setTimeout(() => setCopiedPill(null), 1500);
  };

  const handleCopyAll = () => {
    const fullSpec = `
Автомобиль: ${car.brand} ${car.family} - ${car.model} (${car.years})
Двигатель: ${car.engine}
---
Свечи зажигания:
- OEM: ${car.oem}
- NGK: ${car.ngk}
- Denso: ${car.denso}
- Bosch/ЭЗ/Brisk: ${car.bosch}
- Резьба и ключ: ${car.thread}
- Штатный интервал: ${car.intervalNormal}
- Зима ХМАО (-40°C): ${car.intervalWinter}
---
ГРМ и навесное:
- Ремень/цепь ГРМ: ${car.timing}
- Приводные ремни: ${car.belts}
---
Дворники и крепления:
- Щетки: ${car.wipers}
[Источник: NV86 AuToMix - Подбор РФ]
    `.trim();

    onCopyText(fullSpec, 'Полная спецификация скопирована!');
  };

  const handleCopyForClient = () => {
    const cleanOemText = car.oem ? car.oem.replace(/\[ВАЖНО:[^\]]*\]?/g, '').trim() : '—';
    const ngkShort = car.ngk ? car.ngk.split('/')[0].trim() : '—';
    const timingShort = car.timing ? car.timing.split('|')[0].trim() : '—';
    const wipersShort = car.wipers ? car.wipers.split('|')[0].trim() : '—';
    const msg = [
      `🚗 *${car.brand} ${car.model}* (${car.years})`,
      `Двигатель: ${car.engine}`,
      `• Свечи OEM: ${cleanOemText || 'по VIN'} | NGK: ${ngkShort}`,
      `• ГРМ: ${timingShort}`,
      `• Дворники: ${wipersShort}`,
      winterMode && car.intervalWinter ? `• Зима ХМАО (-40°C): ${car.intervalWinter}` : null,
      `— NV86 AuToMix`
    ].filter(Boolean).join('\n');

    onCopyText(msg, 'Сводка для клиента скопирована!');
  };

  const hasVinAlert = car.oem.includes('ВАЖНО: проверять по VIN') || car.oem.includes('по VIN');
  const cleanOem = car.oem.replace(/\[ВАЖНО:[^\]]+\]/g, '').trim();

  const splitToPills = (text) => {
    if (!text) return [];
    return text.split(/\s*[\/|]\s*/).map(s => s.trim()).filter(Boolean);
  };

  const ngkPills = splitToPills(car.ngk);
  const densoPills = splitToPills(car.denso);
  const boschPills = splitToPills(car.bosch);
  const detectedMount = detectMountType(car.wipers);
  const isChain = car.timing.toLowerCase().includes('цепь');
  const isClassicV = car.belts.toLowerCase().includes('клиновой') || car.belts.toLowerCase().includes('10×') || car.belts.toLowerCase().includes('10x');

  return (
    <dialog
      ref={dialogRef}
      id="car-detail-dialog"
      aria-labelledby="car-dialog-title"
      onClick={handleBackdropClick}
      onClose={onClose}
      className="m-auto p-0 rounded-2xl bg-transparent max-w-4xl w-[96vw] sm:w-[90vw] text-slate-900 dark:text-slate-100 backdrop:bg-slate-950/80 border-0 shadow-2xl overflow-hidden focus:outline-none"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel rounded-2xl p-3.5 sm:p-7 flex flex-col h-[92vh] sm:h-[88vh] max-h-[820px] overflow-hidden border border-slate-300 dark:border-white/20 relative"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-amberGold-500/20 text-amberGold-700 dark:text-amberGold-400 border border-amberGold-500/30 font-mono">
                {car.brand}
              </span>
              <span className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10">
                {car.years || 'Года выпуска'}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                № {car.id} в каталоге
              </span>
            </div>

            <h2 id="car-dialog-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {car.family} — {car.model}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-mono mt-1 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amberGold-600 dark:text-amberGold-400" />
              <span>{car.engine}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
            title="Закрыть (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation - 2x2 grid on mobile, single row on desktop */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 my-3 sm:my-4 pb-2 shrink-0 border-b border-slate-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab('plugs')}
            className={`h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-xl text-[11px] sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer leading-normal ${
              activeTab === 'plugs'
                ? 'bg-amberGold-500 text-slate-950 shadow-glow-amber border border-amberGold-400 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-white/5 border border-transparent'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'plugs' ? 'text-slate-950' : 'text-amber-500'}`} />
            <span className="truncate">Свечи зажигания</span>
          </button>

          <button
            onClick={() => setActiveTab('timing')}
            className={`h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-xl text-[11px] sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer leading-normal ${
              activeTab === 'timing'
                ? 'bg-amberGold-500 text-slate-950 shadow-glow-amber border border-amberGold-400 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-white/5 border border-transparent'
            }`}
          >
            <Settings className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'timing' ? 'text-slate-950' : 'text-sky-500'}`} />
            <span className="sm:hidden truncate">ГРМ и ремни</span>
            <span className="hidden sm:inline">ГРМ и навесные ремни</span>
          </button>

          <button
            onClick={() => setActiveTab('wipers')}
            className={`h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-xl text-[11px] sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer leading-normal ${
              activeTab === 'wipers'
                ? 'bg-amberGold-500 text-slate-950 shadow-glow-amber border border-amberGold-400 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-white/5 border border-transparent'
            }`}
          >
            <Wind className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'wipers' ? 'text-slate-950' : 'text-emerald-500'}`} />
            <span className="sm:hidden truncate">Дворники</span>
            <span className="hidden sm:inline">Дворники & Крепление</span>
          </button>

          <button
            onClick={() => setActiveTab('winter')}
            className={`h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-xl text-[11px] sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer leading-normal ${
              activeTab === 'winter'
                ? 'bg-frost-500 text-slate-950 shadow-glow-frost border border-frost-400 font-bold'
                : 'text-sky-700 dark:text-frost-300 hover:text-sky-900 dark:hover:text-frost-200 bg-sky-100 dark:bg-frost-500/10 border border-sky-200 dark:border-frost-500/20'
            }`}
          >
            <Snowflake className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === 'winter' ? 'text-slate-950' : 'text-sky-500'}`} />
            <span className="sm:hidden truncate">Зима -40 °C</span>
            <span className="hidden sm:inline">Зима -40 °C (ХМАО)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div ref={tabBodyRef} className="space-y-4 flex-1 min-h-0 overflow-y-auto pr-1">
          
          {/* TAB 1: SPARK PLUGS */}
          {activeTab === 'plugs' && (
            <div className="space-y-4">
              
              {/* VIN Warning Banner */}
              {hasVinAlert && (
                <div className="rounded-xl p-4 bg-amber-50 dark:bg-amberGold-500/15 border border-amber-300 dark:border-amberGold-400/60 shadow-lg text-amber-900 dark:text-amber-100 flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amberGold-500/25 text-amber-700 dark:text-amberGold-300 shrink-0 border border-amber-300 dark:border-amberGold-400/40">
                    <FileSearch className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amberGold-500 text-slate-950 font-mono">
                        VIN-ПРОВЕРКА
                      </span>
                      <h4 className="text-sm font-bold text-amber-900 dark:text-amberGold-300">
                        Внимание: Требуется сверка по VIN-номеру авто
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      На этой серии двигателей и кузовов завод устанавливал разные свечи в зависимости от фазы выпуска. Перед покупкой обязательно сверьте артикул по VIN в дилерском каталоге!
                    </p>
                  </div>
                </div>
              )}

              {/* Original Factory OEM */}
              <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-amberGold-700 dark:text-amberGold-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Оригинальный артикул OEM (Завод)
                  </span>
                  <button
                    onClick={() => handleCopyPill(cleanOem, 'OEM')}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-amberGold-600 dark:hover:text-amberGold-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    Копировать OEM
                  </button>
                </div>
                
                {/* OEM Pills */}
                <div className="flex flex-wrap gap-2">
                  {splitToPills(cleanOem).map((part, i) => (
                    <button
                      key={i}
                      onClick={() => handleCopyPill(part, 'OEM')}
                      className={`px-3 py-1.5 rounded-lg font-mono text-sm font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                        copiedPill === part
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-100 dark:bg-black/40 hover:bg-amberGold-500/20 text-slate-900 dark:text-white border-slate-300 dark:border-white/10 hover:border-amberGold-400'
                      }`}
                      title="Нажмите, чтобы скопировать артикул"
                    >
                      <span>{part}</span>
                      {copiedPill === part ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analogues Row with Brand Lighting */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Сертифицированные аналоги для этого двигателя:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  
                  {/* NGK Japan */}
                  <div className="glass-card rounded-xl p-3.5 border border-red-300 dark:border-red-500/30 bg-red-50/70 dark:bg-red-950/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold font-mono text-red-700 dark:text-red-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          NGK (Япония 🇯🇵)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ngkPills.length > 0 ? (
                          ngkPills.map((p, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleCopyPill(p, 'NGK')}
                              className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all border text-left cursor-pointer ${
                                copiedPill === p 
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                                  : 'bg-white dark:bg-black/40 hover:bg-red-500/20 text-slate-900 dark:text-slate-100 border-red-300 dark:border-red-500/30 hover:border-red-400'
                              }`}
                              title="Скопировать"
                            >
                              {p}
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">Нет данных</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Denso Japan */}
                  <div className="glass-card rounded-xl p-3.5 border border-sky-300 dark:border-sky-500/30 bg-sky-50/70 dark:bg-sky-950/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold font-mono text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-sky-500" />
                          Denso (Япония 🇯🇵)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {densoPills.length > 0 ? (
                          densoPills.map((p, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleCopyPill(p, 'Denso')}
                              className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all border text-left cursor-pointer ${
                                copiedPill === p 
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                                  : 'bg-white dark:bg-black/40 hover:bg-sky-500/20 text-slate-900 dark:text-slate-100 border-sky-300 dark:border-sky-500/30 hover:border-sky-400'
                              }`}
                              title="Скопировать"
                            >
                              {p}
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">Нет данных</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bosch / Brisk */}
                  <div className="glass-card rounded-xl p-3.5 border border-amber-300 dark:border-amber-500/30 bg-amber-50/70 dark:bg-amber-950/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Bosch / ЭЗ / Brisk
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {boschPills.length > 0 ? (
                          boschPills.map((p, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleCopyPill(p, 'Bosch')}
                              className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all border text-left cursor-pointer ${
                                copiedPill === p 
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                                  : 'bg-white dark:bg-black/40 hover:bg-amber-500/20 text-slate-900 dark:text-slate-100 border-amber-300 dark:border-amber-500/30 hover:border-amber-400'
                              }`}
                              title="Скопировать"
                            >
                              {p}
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">Нет данных</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Combined Replacement Intervals */}
              <div className="glass-card rounded-xl p-4 border border-slate-200 dark:border-white/10">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3 font-semibold">
                  Регламент замены свечей: Заводской стандарт vs Морозы -40 °C (ХМАО)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amberGold-500/15 text-amberGold-700 dark:text-amberGold-400 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">
                        Штатная замена (завод / лето)
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono">
                        {car.intervalNormal || '30 000 – 60 000 км'}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Трассовый и смешанный цикл в теплый сезон
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-frost-500/15 border border-sky-200 dark:border-frost-400/40 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-sky-100 dark:bg-frost-500/25 text-sky-700 dark:text-frost-300 shrink-0">
                      <ThermometerSnowflake className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-sky-800 dark:text-frost-300 uppercase block font-semibold">
                        Зима в ХМАО (-40 °C)
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono">
                        {car.intervalWinter || 'Сокращение в 2 раза'}
                      </span>
                      <p className="text-[11px] text-sky-800/80 dark:text-frost-200/80 mt-0.5">
                        С учетом ночных автозапусков и богатой смеси
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Thread & Key Specs */}
              <div className="glass-card rounded-xl p-3.5 border border-slate-200 dark:border-white/10 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-mono block mb-1">
                  Геометрия: резьба, шестигранник ключа, зазор:
                </span>
                <span className="font-mono text-slate-900 dark:text-slate-100 font-semibold text-sm">
                  {car.thread || '—'}
                </span>
              </div>

            </div>
          )}

          {/* TAB 2: TIMING & AUX BELTS - ONLY THIS CAR'S INSTALLED MECHANISMS! */}
          {activeTab === 'timing' && (
            <div className="space-y-4">
              
              {/* 1. Timing Mechanism (Chain or Timing Belt installed on this car) */}
              <div className="glass-card rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-amberGold-700 dark:text-amberGold-400 font-bold flex items-center gap-1.5">
                    <Settings className="w-4 h-4" />
                    {isChain ? 'Установлен цепной привод ГРМ' : 'Установлен зубчатый ремень ГРМ'}
                  </span>
                  {car.timing && (
                    <button
                      onClick={() => handleCopyPill(car.timing, 'ГРМ')}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-amberGold-600 dark:hover:text-amberGold-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      Копировать
                    </button>
                  )}
                </div>

                {/* Specific Diagram for this car */}
                <div className="my-2">
                  {isChain ? (
                    <ChainDiagram timingText={car.timing} />
                  ) : (
                    <TimingBeltDiagram timingText={car.timing} />
                  )}
                </div>

                <div className="p-3.5 rounded-lg bg-slate-100 dark:bg-carbon-900 border border-slate-200 dark:border-white/5 font-mono text-sm font-semibold text-slate-900 dark:text-white break-words mt-3">
                  {car.timing || '—'}
                </div>
              </div>

              {/* 2. Auxiliary Belts (Serpentine Poly-V or V-Belt installed on this car) */}
              <div className="glass-card rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-sky-600 dark:text-frost-400" />
                    Приводные ремни навесных агрегатов (Генератор / ГУР / Компрессор)
                  </span>
                  {car.belts && (
                    <button
                      onClick={() => handleCopyPill(car.belts, 'Приводные ремни')}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-amberGold-600 dark:hover:text-amberGold-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      Копировать
                    </button>
                  )}
                </div>

                {/* Specific Diagram for this car */}
                <div className="my-2">
                  {isClassicV ? (
                    <ClassicVBeltDiagram beltsText={car.belts} />
                  ) : (
                    <PolyVRibDiagram beltsText={car.belts} />
                  )}
                </div>

                <div className="p-3.5 rounded-lg bg-slate-100 dark:bg-carbon-900 border border-slate-200 dark:border-white/5 font-mono text-sm text-slate-900 dark:text-slate-200 break-words mt-3">
                  {car.belts || '—'}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: WIPERS - ONLY THIS CAR'S INSTALLED MOUNT & SIZES! */}
          {activeTab === 'wipers' && (
            <div className="space-y-4">
              
              {/* Detected Mount Installed on This Specific Car */}
              {detectedMount ? (
                <div className="glass-card rounded-xl p-3.5 sm:p-5 border border-sky-300 dark:border-frost-400/40 bg-sky-50/70 dark:bg-frost-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full min-w-0">
                    {/* 3D Metallic Wiper Mount Render on Frosted Pad */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300/90 border border-slate-300 dark:border-white/25 shadow-md shrink-0 flex items-center justify-center">
                      <img 
                        src={detectedMount.cardSrc || detectedMount.iconSrc} 
                        alt={detectedMount.name} 
                        className="h-14 w-28 sm:h-20 sm:w-44 object-contain drop-shadow-sm"
                      />
                    </div>
                    <div className="min-w-0 flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500 text-slate-950">
                          mirdvornikov.ru
                        </span>
                        <span className="text-[11px] sm:text-xs text-sky-800 dark:text-frost-300 font-semibold font-mono">
                          Штатный тип крепления
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white break-words">
                        {detectedMount.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed break-words">
                        {detectedMount.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Wiper Sizes Specification Box */}
              <div className="glass-card rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-sky-700 dark:text-frost-300 font-bold flex items-center gap-1.5">
                    <Wind className="w-4 h-4" />
                    Размеры щеток стеклоочистителя и тип крепления
                  </span>
                  {car.wipers && (
                    <button
                      onClick={() => handleCopyPill(car.wipers, 'Дворники')}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-frost-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      Копировать
                    </button>
                  )}
                </div>
                <p className="text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed break-words font-semibold font-mono">
                  {car.wipers || '—'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-400 leading-relaxed">
                💡 <strong className="text-slate-900 dark:text-slate-200">Совет для зимы ХМАО:</strong> Каркасные щетки в сильные морозы обмерзают в шарнирах. Рекомендуются закрытые зимние щетки в герметичном резиновом чехле (Alca Winter / Osawa) с адаптером под указанное выше крепление.
              </div>
            </div>
          )}

          {/* TAB 4: WINTER -40 SPEC */}
          {activeTab === 'winter' && (
            <div className="space-y-3.5">
              <div className="glass-card rounded-xl p-5 border border-sky-300 dark:border-frost-400/40 bg-sky-50 dark:bg-frost-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <Snowflake className="w-5 h-5 text-sky-700 dark:text-frost-300" />
                  <h3 className="text-base font-bold text-sky-900 dark:text-frost-200">
                    Эксплуатация в ХМАО-Югра и Сибири (-40 °C)
                  </h3>
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-2 leading-relaxed">
                  {car.intervalWinter || 'Сокращение штатного пробега свечей в 2 раза из-за частых холодных пусков'}
                </p>
                <div className="text-xs text-slate-700 dark:text-frost-200/80 space-y-1.5 border-t border-sky-200 dark:border-frost-400/20 pt-2 mt-3">
                  <p>• При автозапуске и длительных холостых прогревах богатая смесь быстрее образует нагар на электродах.</p>
                  <p>• Для надежного пуска в -35...-40 °C рекомендуются тонкоэлектродные <strong>иридиевые свечи</strong> (диаметр 0.4–0.6 мм).</p>
                  <p>• Ремень ГРМ требует проверки натяжения перед устойчивыми морозами.</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="pt-3 sm:pt-5 mt-3 sm:mt-5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-1.5 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Copy className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Копия</span>
              <span className="hidden sm:inline">Копировать всё</span>
            </button>
            <button
              onClick={handleCopyForClient}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 dark:bg-frost-500/15 dark:hover:bg-frost-500/25 text-sky-800 dark:text-frost-200 border border-sky-200 dark:border-frost-400/30 transition-colors cursor-pointer whitespace-nowrap"
              title="Скопировать краткую сводку для WhatsApp / Telegram"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Клиенту</span>
              <span className="hidden sm:inline">Для клиента</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 transition-colors cursor-pointer"
              title="Распечатать техкарту"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Печать</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 sm:px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-amberGold-500 hover:bg-amberGold-400 text-slate-950 shadow-glow-amber transition-all cursor-pointer shrink-0"
          >
            Закрыть
          </button>
        </div>

      </div>
    </dialog>
  );
}
