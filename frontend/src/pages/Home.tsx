import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, MessageCircle, Sparkles, Flame, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';

const features = [
  { icon: '✅', title: 'Tasks by Level', description: 'Beginner, Intermediate, and Expert tasks — fitness, coding, learning, and health. Task of the day, start and track with Pending, In Progress, and Done.' },
  { icon: '👤', title: 'Profile & Badges', description: 'Kaggle-style profile with big avatar, username, and stats. LeetCode-style badges (bronze to diamond). Weekly goals: 10km run, 1000 pushups.' },
  { icon: '💬', title: 'Chats & Notifications', description: 'Message friends and get notifications. Accept or decline friend requests like Instagram. Open any chat to view thread and send messages.' },
  { icon: '🔍', title: 'Search Friends', description: 'Find and connect with everyone. Browse all profiles with avatar and points. Add friends with one click.' },
  { icon: '⚙️', title: 'Settings & Account', description: 'Change username, update display name, upload profile photo, logout, or delete account. Your profile stays in sync.' },
  { icon: '📊', title: 'Progress & Streaks', description: '12-month activity grid, contest points, monthly progress charts. Streak stats and consistency rate to keep you motivated.' },
];

const testimonials = [
  { quote: 'Trackitnow transformed how I track my habits. The 12-month view shows me how far I\'ve come—it\'s incredibly motivating.', author: 'Sarah M.', role: 'Productivity Enthusiast', avatar: '👩' },
  { quote: 'The friend profiles feature keeps me accountable. We push each other to maintain our streaks—it\'s like having a gym buddy for habits.', author: 'James K.', role: 'Fitness Coach', avatar: '👨' },
  { quote: 'I love earning badges! It gamifies the whole experience. The streak rewards kept me going when I wanted to quit.', author: 'Priya L.', role: 'Software Developer', avatar: '👩‍💻' },
];

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden border-b border-slate-100 px-6 pt-24 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Floating elements */}
        <motion.div className="absolute left-[8%] top-[18%] hidden lg:block"
          animate={{ y: [0, -18, 0], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium text-slate-700">Beginner</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Run 2km</p>
          </div>
        </motion.div>

        <motion.div className="absolute right-[10%] top-[25%] hidden lg:block"
          animate={{ y: [0, 14, -14, 0], rotate: [0, -3, 3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium text-slate-700">Intermediate</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">50 Pushups</p>
          </div>
        </motion.div>

        <motion.div className="absolute left-[6%] bottom-[22%] hidden lg:block"
          animate={{ y: [0, -10, 10, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-200 bg-amber-50 text-2xl shadow">🏆</div>
        </motion.div>

        <motion.div className="absolute right-[8%] bottom-[28%] hidden lg:block"
          animate={{ y: [0, -8, 8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}>
          <div className="relative">
            <MessageCircle className="h-10 w-10 text-amber-500" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">3</span>
          </div>
        </motion.div>

        <motion.div className="absolute left-[12%] top-[48%] hidden lg:block"
          animate={{ scale: [1, 1.12, 1], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-bold text-slate-800">12</span>
          </div>
        </motion.div>

        <motion.div className="absolute right-[18%] top-[55%] hidden lg:block"
          animate={{ y: [0, -12, 12, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">Task of day</span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-slate-800">10km Run</p>
          </div>
        </motion.div>

        {/* Center content */}
        <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Trackitnow
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 font-display text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl md:text-7xl"
          >
            Tasks, badges, and{' '}
            <span className="text-amber-500">progress</span>{' '}
            in one place
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5 text-lg text-slate-500 sm:text-xl"
          >
            Do daily tasks by level, earn badges, chat with friends, and see your progress over time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link to="/signup" className="flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 font-semibold text-white hover:bg-amber-600 shadow-lg shadow-amber-200 transition-all">
                <Zap className="h-5 w-5" />
                Get started free
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <a href="#features" className="flex items-center gap-2 rounded-xl border border-slate-200 px-8 py-4 font-medium text-slate-700 hover:bg-slate-50 transition-all">
                See features
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-slate-100 px-6 py-24 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">
              Everything you need to{' '}
              <span className="text-amber-500">stay on track</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
              Powerful features designed to keep you committed and motivated.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={item}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md hover:border-amber-200 transition-all"
              >
                <span className="text-4xl">{f.icon}</span>
                <h3 className="mt-4 font-display text-xl font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-slate-500 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-t border-slate-100 px-6 py-24 bg-white">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">
              Loved by <span className="text-amber-500">committed</span> people
            </h2>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.author}
                variants={item}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-8 hover:border-amber-200 hover:bg-amber-50/30 transition-all"
              >
                <p className="text-slate-600 leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-xl">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-slate-900">{t.author}</p>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100 bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-16 text-center shadow-sm"
          >
            <h2 className="font-display text-3xl font-bold text-slate-900">Ready to commit?</h2>
            <p className="mt-4 text-slate-500">Join thousands building better habits. Start free, no credit card.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/signup" className="rounded-xl bg-amber-500 px-8 py-4 font-semibold text-white hover:bg-amber-600 shadow-lg shadow-amber-200 transition-all">
                Sign Up Free
              </Link>
              <Link to="/signin" className="rounded-xl border border-slate-200 bg-white px-8 py-4 font-medium text-slate-700 hover:bg-slate-50 transition-all">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-500 text-white">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <span className="font-display font-semibold text-slate-700">Trackitnow</span>
        </div>
        <p>© {new Date().getFullYear()} Trackitnow. Build better habits.</p>
      </footer>
    </div>
  );
}
