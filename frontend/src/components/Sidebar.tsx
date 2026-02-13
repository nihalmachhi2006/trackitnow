import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckSquare, User, MessageCircle, Search, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

const topLinks = [
  { to: '/dashboard', label: 'Profile', icon: User, exact: true },
  { to: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare, exact: false },
  { to: '/dashboard/chats', label: 'Chats', icon: MessageCircle, exact: false },
  { to: '/dashboard/search', label: 'Search Friends', icon: Search, exact: false },
];

function NavItem({ to, label, icon: Icon, active, badge }: {
  to: string; label: string; icon: React.ComponentType<{ className?: string }>;
  active: boolean; badge?: number;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-100'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <span className="relative shrink-0">
        <Icon className={`h-5 w-5 ${active ? 'text-amber-600' : ''}`} />
        {badge && badge > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </span>
      <span>{label}</span>
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500"
        />
      )}
    </Link>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try { await authApi.signout(); } catch {}
    logout();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-slate-900 hover:text-amber-600">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
            <Zap className="h-4 w-4" />
          </div>
          <span className="font-display text-lg">Trackitnow</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {topLinks.map((link) => {
          const active = link.exact
            ? location.pathname === link.to
            : location.pathname.startsWith(link.to) && location.pathname !== '/dashboard';
          const isProfile = link.exact && location.pathname === '/dashboard';
          return (
            <NavItem
              key={link.to}
              to={link.to}
              label={link.label}
              icon={link.icon}
              active={isProfile ? location.pathname === '/dashboard' : active}
            />
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-100 px-3 py-4 space-y-1">
        <NavItem
          to="/dashboard/settings"
          label="Settings"
          icon={Settings}
          active={location.pathname === '/dashboard/settings'}
        />
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile: Hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md border border-slate-200 lg:hidden"
      >
        <Menu className="h-5 w-5 text-slate-700" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-screen w-72 bg-white shadow-xl lg:hidden"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
