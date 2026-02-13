import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Filler, Title, Tooltip, Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3 } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Filler, Title, Tooltip, Legend
);

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

const lightScales = {
  x: {
    grid: { color: 'rgba(0,0,0,0.04)' },
    ticks: { color: '#94a3b8', font: { size: 10 } },
    border: { display: false },
  },
  y: {
    grid: { color: 'rgba(0,0,0,0.04)' },
    ticks: { color: '#94a3b8', font: { size: 10 } },
    border: { display: false },
  },
};

const DEFAULT_POINTS = [
  { contest: 'Week 1', points: 120 }, { contest: 'Week 2', points: 280 },
  { contest: 'Week 3', points: 195 }, { contest: 'Week 4', points: 420 },
  { contest: 'Week 5', points: 380 }, { contest: 'Week 6', points: 540 },
  { contest: 'Week 7', points: 620 }, { contest: 'Week 8', points: 485 },
  { contest: 'Week 9', points: 720 }, { contest: 'Week 10', points: 815 },
  { contest: 'Week 11', points: 690 }, { contest: 'Week 12', points: 920 },
];

const DEFAULT_MONTHLY = [
  { month: 'Mar', solved: 18 }, { month: 'Apr', solved: 22 },
  { month: 'May', solved: 15 }, { month: 'Jun', solved: 28 },
  { month: 'Jul', solved: 24 }, { month: 'Aug', solved: 31 },
  { month: 'Sep', solved: 26 }, { month: 'Oct', solved: 34 },
  { month: 'Nov', solved: 29 }, { month: 'Dec', solved: 42 },
];

interface PointsChartProps {
  data?: { contest: string; points: number }[];
  title?: string;
}

export function PointsChart({ data = DEFAULT_POINTS, title = 'Contest Points' }: PointsChartProps) {
  const chartData = useMemo(() => ({
    labels: data.map(d => d.contest),
    datasets: [{
      label: 'Points',
      data: data.map(d => d.points),
      fill: true,
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245,158,11,0.1)',
      tension: 0.4,
      pointBackgroundColor: '#f59e0b',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
    }],
  }), [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-amber-500" />
        <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="h-56">
        <Line data={chartData} options={{ ...baseOptions, scales: lightScales }} />
      </div>
    </motion.div>
  );
}

interface MonthlyProgressChartProps {
  data?: { month: string; solved: number }[];
  title?: string;
}

export function MonthlyProgressChart({ data = DEFAULT_MONTHLY, title = 'Monthly Progress' }: MonthlyProgressChartProps) {
  const chartData = useMemo(() => ({
    labels: data.map(d => d.month),
    datasets: [{
      label: 'Tasks Solved',
      data: data.map(d => d.solved),
      backgroundColor: 'rgba(16,185,129,0.7)',
      borderColor: 'rgb(16,185,129)',
      borderWidth: 1,
      borderRadius: 6,
    }],
  }), [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-emerald-500" />
        <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="h-52">
        <Bar data={chartData} options={{ ...baseOptions, scales: lightScales }} />
      </div>
    </motion.div>
  );
}
