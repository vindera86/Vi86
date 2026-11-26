import React from 'react';

function SpecBanner({ value, fallback, colorClass }) {
  return (
    <div className="mt-2 rounded-lg bg-[#060912] border border-slate-700 px-3 py-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[11px] font-mono">
      <span className="text-slate-400 uppercase shrink-0">УСТАНОВЛЕНО НА АВТО:</span>
      <span className={`font-bold break-words min-w-0 ${colorClass}`}>
        {value || fallback}
      </span>
    </div>
  );
}

// Precision technical automotive blueprints for the specific vehicle's mechanism

export function TimingBeltDiagram({ timingText = '' }) {
  return (
    <div className="tech-schematic-screen w-full bg-[#0a0f1d] rounded-xl p-4 sm:p-5 border border-amber-500/40 shadow-lg text-slate-100 my-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">
            Спецификация зубчатого ремня ГРМ (Timing Belt)
          </span>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold">
          Синхронный привод клапанов
        </span>
      </div>

      <svg viewBox="0 0 540 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-[120px]">
        <defs>
          <linearGradient id="beltBackingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="teethFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#090d16" />
          </linearGradient>
        </defs>

        {/* EPDM Rubber Backing */}
        <rect x="20" y="20" width="500" height="18" rx="4" fill="url(#beltBackingGrad)" stroke="#64748b" strokeWidth="1.5" />

        {/* High-strength Glass Fiber Tensile Cord */}
        <line x1="25" y1="29" x2="515" y2="29" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="6 3" />

        {/* Curvilinear HTD Teeth */}
        {[...Array(20)].map((_, i) => {
          const x = 32 + i * 24;
          return (
            <g key={i}>
              <path
                d={`M${x} 38 L${x + 3} 60 C${x + 4} 64 ${x + 16} 64 ${x + 17} 60 L${x + 20} 38 Z`}
                fill="url(#teethFillGrad)"
                stroke="#f59e0b"
                strokeWidth="1.2"
              />
              <path
                d={`M${x + 2} 44 C${x + 5} 60 ${x + 15} 60 ${x + 18} 44`}
                stroke="#fbbf24"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.8"
              />
            </g>
          );
        })}

        {/* Tooth Pitch Callout */}
        <line x1="128" y1="74" x2="152" y2="74" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="128" y1="68" x2="128" y2="80" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="152" y1="68" x2="152" y2="80" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="140" y="89" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          Шаг зуба (Pitch)
        </text>

        {/* Cord annotation */}
        <circle cx="85" cy="29" r="4" fill="#fbbf24" stroke="#fff" strokeWidth="1" />
        <line x1="85" y1="29" x2="55" y2="10" stroke="#fbbf24" strokeWidth="1" />
        <text x="50" y="9" fill="#fbbf24" fontSize="10" fontFamily="monospace" textAnchor="end" fontWeight="bold">
          Стеклокорд (усиленный)
        </text>

        {/* Teeth profile annotation */}
        <circle cx="440" cy="50" r="4" fill="#38bdf8" stroke="#fff" strokeWidth="1" />
        <line x1="440" y1="50" x2="475" y2="90" stroke="#38bdf8" strokeWidth="1" />
        <text x="468" y="94" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="end">
          Зубчатый профиль
        </text>

      </svg>

      <SpecBanner
        value={timingText}
        fallback="Зубчатый ремень ГРМ"
        colorClass="text-amber-400"
      />

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
          <span className="text-amber-400 font-bold block mb-0.5">⚙️ Принцип зацепления:</span>
          <span className="text-slate-300">Синхронная передача крутящего момента без малейшего проскальзывания.</span>
        </div>
        <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
          <span className="text-amber-400 font-bold block mb-0.5">❄️ Морозы ХМАО (-40°C):</span>
          <span className="text-slate-300">Холодная резина теряет эластичность. Категорически запрещен пуск буксиром!</span>
        </div>
        <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
          <span className="text-amber-400 font-bold block mb-0.5">🔧 Комплектность:</span>
          <span className="text-slate-300">Замена строго с обводными роликами, натяжителем и водяным насосом (помпой).</span>
        </div>
      </div>
    </div>
  );
}

export function PolyVRibDiagram({ beltsText = '' }) {
  return (
    <div className="tech-schematic-screen w-full bg-[#0a0f1d] rounded-xl p-4 sm:p-5 border border-sky-500/40 shadow-lg text-slate-100 my-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="font-mono text-xs sm:text-sm font-bold text-sky-400 uppercase tracking-wider">
            Спецификация поликлинового ручейкового ремня (Poly-V / Micro-V)
          </span>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 font-semibold">
          Привод навесных агрегатов
        </span>
      </div>

      <svg viewBox="0 0 540 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-[120px]">
        {/* Belt Backing */}
        <rect x="20" y="20" width="310" height="14" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <line x1="25" y1="27" x2="325" y2="27" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 3" />

        {/* 6 Longitudinal PK Ribs */}
        {[...Array(6)].map((_, i) => {
          const y = 39 + i * 4.5;
          return (
            <g key={i}>
              <line x1="20" y1={y} x2="330" y2={y} stroke="#0ea5e9" strokeWidth="2.5" />
              <line x1="20" y1={y + 1.5} x2="330" y2={y + 1.5} stroke="#0284c7" strokeWidth="1" />
            </g>
          );
        })}

        {/* Cross Section 3D Cutout */}
        <rect x="350" y="14" width="170" height="78" rx="8" fill="#060912" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="435" y="29" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          СЕЧЕНИЕ РУЧЬЕВ (PK)
        </text>

        <rect x="365" y="37" width="140" height="8" rx="2" fill="#334155" stroke="#64748b" strokeWidth="1" />
        <line x1="368" y1="41" x2="502" y2="41" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />

        {/* 6 Triangular V-Ribs */}
        {[...Array(6)].map((_, i) => {
          const rx = 370 + i * 22;
          return (
            <polygon
              key={i}
              points={`${rx},45 ${rx + 11},69 ${rx + 22},45`}
              fill="#0284c7"
              stroke="#38bdf8"
              strokeWidth="1.2"
            />
          );
        })}

        <text x="435" y="82" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
          Продольные клиновые ручьи
        </text>

      </svg>

      <SpecBanner
        value={beltsText}
        fallback="Поликлиновой ремень навесного"
        colorClass="text-sky-400"
      />

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
          <span className="text-sky-400 font-bold block mb-0.5">🔄 Профиль PK:</span>
          <span className="text-slate-300">Высокая гибкость и большая площадь контакта ручьев для передачи мощности.</span>
        </div>
        <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
          <span className="text-sky-400 font-bold block mb-0.5">❄️ Свист на морозе:</span>
          <span className="text-slate-300">При -35°C свист свидетельствует о проскальзывании или износе натяжителя.</span>
        </div>
        <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
          <span className="text-sky-400 font-bold block mb-0.5">🛡️ Синтетический EPDM:</span>
          <span className="text-slate-300">Сохраняет упругость и не трескается в сибирские морозы ХМАО до -45°C.</span>
        </div>
      </div>
    </div>
  );
}

export function ClassicVBeltDiagram({ beltsText = '' }) {
  return (
    <div className="tech-schematic-screen w-full bg-[#0a0f1d] rounded-xl p-4 sm:p-5 border border-amber-500/40 shadow-lg text-slate-100 my-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="font-mono text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">
            Спецификация классического клинового ремня (Моноклин)
          </span>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold">
          Одиночный клиновой профиль
        </span>
      </div>

      <svg viewBox="0 0 540 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-[120px]">
        {/* Belt Strip View */}
        <rect x="20" y="20" width="310" height="24" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
        <line x1="25" y1="32" x2="325" y2="32" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="6 3" />
        <rect x="20" y="40" width="310" height="4" fill="#1e293b" />

        {/* Cross Section in Pulley */}
        <rect x="350" y="12" width="170" height="84" rx="8" fill="#060912" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="435" y="26" fill="#fbbf24" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          СЕЧЕНИЕ В РУЧЬЕ ШКИВА
        </text>

        {/* Pulley V-Groove */}
        <polygon points="380,34 490,34 465,80 405,80" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
        {/* Trapezoid Belt inside Groove */}
        <polygon points="390,38 480,38 460,74 410,74" fill="#d97706" stroke="#f59e0b" strokeWidth="2" />
        <ellipse cx="435" cy="50" rx="20" ry="3" fill="#fef08a" />

      </svg>

      <SpecBanner
        value={beltsText}
        fallback="Клиновой ремень"
        colorClass="text-amber-400"
      />

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
          <span className="text-amber-400 font-bold block mb-0.5">📐 Расклинивание:</span>
          <span className="text-slate-300">Передает усилие трением за счет заклинивания боковых поверхностей в клине.</span>
        </div>
        <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
          <span className="text-amber-400 font-bold block mb-0.5">⚠️ Натяжение:</span>
          <span className="text-slate-300">Прогиб ветви ремня при усилии 10 кгс должен составлять строго 8–10 мм.</span>
        </div>
        <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
          <span className="text-amber-400 font-bold block mb-0.5">❄️ Зимняя проверка:</span>
          <span className="text-slate-300">При замасливании или остекленении граней ремень начинает буксовать.</span>
        </div>
      </div>
    </div>
  );
}

export function ChainDiagram({ timingText = '' }) {
  return (
    <div className="tech-schematic-screen w-full bg-[#0a0f1d] rounded-xl p-4 sm:p-5 border border-emerald-500/40 shadow-lg text-slate-100 my-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider">
            Спецификация цепного привода ГРМ (Timing Chain)
          </span>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
          Цепь в масляной ванне ДВС
        </span>
      </div>

      <svg viewBox="0 0 540 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-[120px]">
        {/* Chain Links Line */}
        {[...Array(14)].map((_, i) => {
          const x = 25 + i * 36;
          return (
            <g key={i}>
              <rect
                x={x}
                y="32"
                width="34"
                height="22"
                rx="11"
                fill="#1e293b"
                stroke="#10b981"
                strokeWidth="2"
              />
              <circle cx={x + 9} cy="43" r="4.5" fill="#34d399" stroke="#047857" strokeWidth="1.5" />
              <circle cx={x + 9} cy="43" r="1.5" fill="#064e3b" />
              <circle cx={x + 25} cy="43" r="4.5" fill="#34d399" stroke="#047857" strokeWidth="1.5" />
              <circle cx={x + 25} cy="43" r="1.5" fill="#064e3b" />
            </g>
          );
        })}

        {/* Sprocket Teeth Engagement Callout */}
        <circle cx="169" cy="43" r="8" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="169" y1="16" x2="169" y2="35" stroke="#f59e0b" strokeWidth="1" />
        <text x="175" y="20" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
          Звено цепи со штифтом
        </text>

        {/* Hydraulic Tensioner Callout */}
        <circle cx="385" cy="43" r="8" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="385" y1="43" x2="420" y2="80" stroke="#38bdf8" strokeWidth="1" />
        <text x="425" y="84" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
          Гидронатяжитель + башмак
        </text>

      </svg>

      <SpecBanner
        value={timingText}
        fallback="Цепной привод ГРМ"
        colorClass="text-emerald-400"
      />

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
          <span className="text-emerald-400 font-bold block mb-0.5">⛓️ Ресурс механизма:</span>
          <span className="text-slate-300">150 000–250 000 км. Полная стойкость к экстремальным морозам.</span>
        </div>
        <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
          <span className="text-emerald-400 font-bold block mb-0.5">🛢️ Давление масла:</span>
          <span className="text-slate-300">Натяжитель гидравлический. В -40°C необходимо синтетическое масло 0W-30 / 0W-40.</span>
        </div>
        <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
          <span className="text-emerald-400 font-bold block mb-0.5">🔍 Контроль фаз:</span>
          <span className="text-slate-300">При растяжении цепи возникает металлическое бряканье на холодном запуске.</span>
        </div>
      </div>
    </div>
  );
}
