// ProgressBar.tsx
import { motion } from 'framer-motion';

interface ProgressBarProps {
  label: string;
  current: number;
  total: number;
  unit?: string;
  color?: 'amber' | 'emerald' | 'blue';
}

export function ProgressBar({ label, current, total, unit = '', color = 'amber' }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  const barColors = {
    amber: 'from-amber-400 to-amber-500',
    emerald: 'from-emerald-400 to-emerald-500',
    blue: 'from-blue-400 to-blue-500',
  };
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{current} / {total}{unit && ` ${unit}`}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${barColors[color]}`}
        />
      </div>
      <p className="mt-1 text-right text-xs text-slate-400">{pct}%</p>
    </div>
  );
}
