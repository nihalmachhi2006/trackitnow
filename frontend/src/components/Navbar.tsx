import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#testimonials', label: 'Testimonials' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 right-0 top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-slate-900 hover:text-amber-600">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.5 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white"
            >
              <Zap className="h-4 w-4" />
            </motion.div>
            <span className="font-display text-xl">Trackitnow</span>
          </Link>
        </motion.div>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors"
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/signin"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors shadow-sm"
          >
            Sign Up Free
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-slate-200 bg-white md:hidden"
          >
            <div className="flex flex-col gap-3 px-6 py-4">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  className="text-slate-600 hover:text-amber-600 font-medium">
                  {link.label}
                </a>
              ))}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <Link to="/signin" onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700">
                  Sign In
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-white">
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
