import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitCommit } from 'lucide-react';

type ActivityLevel = 0 | 1 | 2 | 3 | 4;

const colors: Record<ActivityLevel, string> = {
  0: 'bg-slate-100',
  1: 'bg-emerald-200',
  2: 'bg-emerald-400',
  3: 'bg-emerald-500',
  4: 'bg-emerald-600',
};

interface ActivityGridProps {
  activityData?: Record<string, number>;
  weeks?: number;
  title?: string;
}

function getLevel(count: number): ActivityLevel {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

function generateDummyGrid(weeks: number): { date: string; count: number }[][] {
  const grid: { date: string; count: number }[][] = [];
  const now = new Date();
  for (let row = 0; row < 7; row++) {
    const weekRow: { date: string; count: number }[] = [];
    for (let col = 0; col < weeks; col++) {
      const rand = Math.random();
      const count = rand < 0.4 ? 0 : rand < 0.6 ? 1 : rand < 0.75 ? 2 : rand < 0.88 ? 3 : 4;
      const date = new Date(now);
      date.setDate(date.getDate() - ((weeks - col - 1) * 7 + (6 - row)));
      weekRow.push({ date: date.toISOString().split('T')[0], count });
    }
    grid.push(weekRow);
  }
  return grid;
}

export default function ActivityGrid({ activityData, weeks = 52, title = '12 Months Contribution' }: ActivityGridProps) {
  const grid = useMemo(() => {
    if (activityData) {
      const g: { date: string; count: number }[][] = Array.from({ length: 7 }, () => []);
      const now = new Date();
      for (let col = 0; col < weeks; col++) {
        for (let row = 0; row < 7; row++) {
          const date = new Date(now);
          date.setDate(date.getDate() - ((weeks - col - 1) * 7 + (6 - row)));
          const key = date.toISOString().split('T')[0];
          g[row].push({ date: key, count: activityData[key] ?? 0 });
        }
      }
      return g;
    }
    return generateDummyGrid(weeks);
  }, [activityData, weeks]);

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <GitCommit className="h-5 w-5 text-emerald-600" />
          <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Less</span>
          <div className="flex gap-0.5">
            {([0, 1, 2, 3, 4] as ActivityLevel[]).map((l) => (
              <div key={l} className={`h-3 w-3 rounded-sm ${colors[l]}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1 min-w-max">
          <div className="flex flex-col justify-between py-0.5 pr-2 text-[9px] text-slate-400">
            {dayLabels.map((lbl, i) => (
              <span key={i} className="h-[11px] leading-none">{lbl}</span>
            ))}
          </div>
          <div className="flex gap-0.5">
            {grid[0].map((_, col) => (
              <div key={col} className="flex flex-col gap-0.5">
                {grid.map((row, rowIdx) => {
                  const cell = row[col];
                  const level = getLevel(cell.count);
                  return (
                    <motion.div
                      key={`${rowIdx}-${col}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min((col * 7 + rowIdx) * 0.0004, 0.4) }}
                      className={`h-[11px] w-[11px] rounded-sm ${colors[level]} hover:ring-2 hover:ring-amber-400 hover:ring-offset-1 cursor-default`}
                      title={`${cell.date}: ${cell.count} tasks`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400">{weeks} weeks of activity · Starts at 0 for new accounts</p>
    </motion.div>
  );
}
