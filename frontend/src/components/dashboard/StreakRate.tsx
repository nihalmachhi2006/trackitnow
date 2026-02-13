import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakRateProps {
  currentStreak: number;
  longestStreak: number;
  consistencyRate: number;
  totalActiveDays: number;
}

export default function StreakRate({ currentStreak, longestStreak, consistencyRate, totalActiveDays }: StreakRateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-2">
        <Flame className="h-5 w-5 text-orange-500" />
        <h3 className="font-display text-lg font-semibold text-slate-900">Streak Rate</h3>
      </div>

      <div className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-600">Consistency Rate</span>
            <span className="font-bold text-amber-600">{consistencyRate}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${consistencyRate}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500"
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">{totalActiveDays} active days in the last year</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3">
            <p className="text-2xl font-bold font-display text-orange-500">{currentStreak}</p>
            <p className="text-xs text-slate-500 mt-0.5">Current Streak 🔥</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-2xl font-bold font-display text-amber-600">{longestStreak}</p>
            <p className="text-xs text-slate-500 mt-0.5">Longest Streak ⚡</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
