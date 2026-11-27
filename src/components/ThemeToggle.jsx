import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

/**
 * Serene cold-blue glassmorphic Day / Night theme toggle.
 * Uses GPU-composited transforms & opacity only for 60fps smoothness.
 */
export default function ThemeToggle({ theme, onToggle, className = '' }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Переключить на дневную тему' : 'Переключить на ночную тему'}
      title={isDark ? 'Переключить на дневную тему' : 'Переключить на ночную тему'}
      onClick={onToggle}
      data-keep-dark={isDark ? 'true' : undefined}
      className={`group relative inline-flex items-center w-[62px] h-[32px] p-[3px] rounded-full cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 transition-colors duration-500 overflow-hidden ${
        isDark
          ? 'bg-gradient-to-r from-[#0b172e] via-[#122647] to-[#1b3660] border border-[#60a5fa]/25 shadow-[inset_0_1px_2px_rgba(147,197,253,0.14),0_4px_14px_-4px_rgba(2,6,23,0.65)]'
          : 'bg-gradient-to-r from-[#e0f2fe] via-[#bae6fd] to-[#93c5fd] border border-[#38bdf8]/45 shadow-[inset_0_1px_3px_rgba(255,255,255,0.85),0_4px_14px_-4px_rgba(14,165,233,0.28)]'
      } ${className}`}
    >
      {/* Subtle ambient glow inside track */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-500 ${
          isDark
            ? 'opacity-100 bg-[radial-gradient(circle_at_75%_50%,rgba(96,165,250,0.22),transparent_65%)]'
            : 'opacity-100 bg-[radial-gradient(circle_at_25%_50%,rgba(255,255,255,0.75),transparent_65%)]'
        }`}
      />

      {/* Serene micro-stars (night) / soft mist dots (day) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-2.5 top-2 w-1 h-1 rounded-full bg-sky-200/80 transition-opacity duration-500 ${
          isDark ? 'opacity-80' : 'opacity-0'
        }`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-4.5 bottom-2 w-0.5 h-0.5 rounded-full bg-sky-100/70 transition-opacity duration-500 ${
          isDark ? 'opacity-70' : 'opacity-0'
        }`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute right-2.5 top-2.5 w-1.5 h-1.5 rounded-full bg-white/75 transition-opacity duration-500 ${
          isDark ? 'opacity-0' : 'opacity-85'
        }`}
      />

      {/* Frosted Glass Sliding Thumb */}
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ x: isDark ? 30 : 0 }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 26,
          mass: 0.85,
        }}
        className={`relative z-10 flex items-center justify-center w-[24px] h-[24px] rounded-full backdrop-blur-md transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-b from-[#2a4a7f]/90 to-[#162a4d]/95 border border-[#93c5fd]/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_2px_8px_rgba(2,6,23,0.55)]'
            : 'bg-gradient-to-b from-white/95 to-[#f0f9ff]/90 border border-white shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_8px_rgba(14,116,144,0.22)]'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -35, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 35, scale: 0.7 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center"
            >
              <Moon className="w-3.5 h-3.5 text-[#bae6fd] drop-shadow-[0_0_6px_rgba(186,230,253,0.65)]" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: 45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center"
            >
              <Sun className="w-3.5 h-3.5 text-[#0284c7] drop-shadow-[0_0_5px_rgba(56,189,248,0.45)]" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
