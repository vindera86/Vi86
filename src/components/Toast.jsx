import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/90 text-slate-100 border border-amberGold-500/40 shadow-2xl shadow-amberGold-500/10"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amberGold-500/20 text-amberGold-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium tracking-wide">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
