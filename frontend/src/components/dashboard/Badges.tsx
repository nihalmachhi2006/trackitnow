// Badges.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Trophy, Star, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import type { Badge } from '../../types';

const BADGE_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  bronze: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Award },
  silver: { color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-300', icon: Star },
  gold: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Trophy },
  platinum: { color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', icon: Star },
  diamond: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Trophy },
};

const DUMMY_BADGES: Badge[] = [
  { type: 'bronze', name: 'First Steps', description: 'Complete your first task', is_earned: true },
  { type: 'silver', name: 'Week Warrior', description: '7-day streak', is_earned: true },
  { type: 'gold', name: 'Gold Standard', description: 'Earn 1000 points', is_earned: false },
  { type: 'platinum', name: 'Platinum Pro', description: '30-day streak', is_earned: false },
  { type: 'diamond', name: 'Diamond Elite', description: '100-day streak', is_earned: false },
];

export function Badges({ badges = DUMMY_BADGES }: { badges?: Badge[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? badges : badges.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
          <Award className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold text-slate-900">Badges</h3>
          <p className="text-xs text-slate-500">{badges.filter(b => b.is_earned).length} earned</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <AnimatePresence>
          {displayed.map((badge, i) => {
            const cfg = BADGE_CONFIG[badge.type] ?? BADGE_CONFIG.bronze;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={badge.type}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.05 * i }}
                whileHover={badge.is_earned ? { scale: 1.03, y: -1 } : {}}
                className={`relative flex flex-col gap-1 rounded-xl border p-3 transition-all ${
                  badge.is_earned
                    ? `${cfg.bg} ${cfg.border}`
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
                title={badge.description}
              >
                {!badge.is_earned && (
                  <Lock className="absolute right-2 top-2 h-3 w-3 text-slate-400" />
                )}
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${badge.is_earned ? cfg.bg : 'bg-slate-200'}`}>
                  <Icon className={`h-4 w-4 ${badge.is_earned ? cfg.color : 'text-slate-400'}`} />
                </div>
                <p className={`text-xs font-semibold ${badge.is_earned ? 'text-slate-800' : 'text-slate-500'}`}>
                  {badge.name}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">{badge.description}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {badges.length > 4 && (
        <button
          onClick={() => setShowAll(v => !v)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-medium text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
        >
          {showAll ? <><ChevronUp className="h-3.5 w-3.5" /> Show less</> : <><ChevronDown className="h-3.5 w-3.5" /> View all {badges.length}</>}
        </button>
      )}
    </motion.div>
  );
}
