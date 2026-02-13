import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, AtSign, LogOut, Trash2, Save, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userApi, authApi } from '../services/api';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [form, setForm] = useState({ username: '', display_name: '' });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ username: user.username, display_name: user.display_name });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await userApi.updateProfile({ username: form.username, display_name: form.display_name });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try { await authApi.signout(); } catch {}
    logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (deleteText.toLowerCase() !== 'delete') return;
    try {
      await userApi.deleteAccount();
      logout();
      navigate('/');
    } catch {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-slate-500">Manage your account and preferences.</p>
        </motion.div>

        {/* Profile Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
          className="mb-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
              <User className="h-4 w-4 text-amber-600" />
            </div>
            <h2 className="font-display font-semibold text-slate-900">Profile</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <AtSign className="h-3.5 w-3.5" /> Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                placeholder="username"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Display Name
              </label>
              <input
                type="text"
                value={form.display_name}
                onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))}
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
            )}

            <motion.button type="submit" disabled={saving}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 font-semibold text-white hover:bg-amber-600 disabled:opacity-60 transition-colors shadow-sm">
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
            </motion.button>
          </form>
        </motion.section>

        {/* Logout Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="mb-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <LogOut className="h-4 w-4 text-slate-600" />
            </div>
            <h2 className="font-display font-semibold text-slate-900">Session</h2>
          </div>
          <p className="mb-4 text-sm text-slate-500">Sign out of your account on this device.</p>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </motion.button>
        </motion.section>

        {/* Danger Zone */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
              <Trash2 className="h-4 w-4 text-red-600" />
            </div>
            <h2 className="font-display font-semibold text-red-900">Danger Zone</h2>
          </div>
          <p className="mb-4 text-sm text-red-700">Permanently delete your account and all data. This cannot be undone.</p>
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 rounded-xl border border-red-300 bg-white px-5 py-2.5 font-medium text-red-700 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
        </motion.section>
      </div>

      {/* Delete Confirm Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-slate-900">Delete account?</h3>
                <p className="text-sm text-slate-500">This action cannot be undone.</p>
              </div>
              <button onClick={() => { setShowDelete(false); setDeleteText(''); }} className="ml-auto rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-3 text-sm text-slate-600">Type <strong className="text-slate-900">delete</strong> to confirm.</p>
            <input
              type="text"
              value={deleteText}
              onChange={e => setDeleteText(e.target.value)}
              placeholder="delete"
              className="mb-4 w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-900 placeholder-slate-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20"
            />
            <div className="flex gap-3">
              <button onClick={() => { setShowDelete(false); setDeleteText(''); }}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleDeleteAccount} disabled={deleteText.toLowerCase() !== 'delete'}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors">
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
