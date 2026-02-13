import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, X, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileCard from '../components/dashboard/ProfileCard';
import { Badges } from '../components/dashboard/Badges';
import { PointsChart, MonthlyProgressChart } from '../components/dashboard/Charts';
import ActivityGrid from '../components/dashboard/ActivityGrid';
import { ProgressBar } from '../components/dashboard/ProgressBar';
import StreakRate from '../components/dashboard/StreakRate';
import { progressApi, userApi } from '../services/api';
import type { Badge, ActivityData, UserProfile } from '../types';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: '', username: '', bio: '', location: '',
    github_url: '', linkedin_url: '', twitter_url: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    progressApi.getBadges().then(setBadges).catch(() => {});
    progressApi.getActivityData().then(setActivity).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      setEditForm({
        display_name: user.display_name || '',
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        github_url: user.github_url || '',
        linkedin_url: user.linkedin_url || '',
        twitter_url: user.twitter_url || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userApi.updateProfile(editForm);
      await refreshUser();
      setEditOpen(false);
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
    </div>
  );

  // Create dummy profile for display with fallbacks
  const profile: UserProfile = {
    ...user,
    total_points: (user as any).total_points ?? 0,
    streak: (user as any).streak ?? 0,
    rank: (user as any).rank ?? 999,
    friends_count: (user as any).friends_count ?? 0,
    total_tasks: (user as any).total_tasks ?? 0,
    completed_tasks: (user as any).completed_tasks ?? 0,
  };

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold text-slate-900">Profile</h1>
          <p className="mt-1 text-slate-500">Track your progress and stay committed.</p>
        </motion.div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left: Profile + Badges */}
          <aside className="w-full shrink-0 space-y-5 lg:w-80 xl:w-96">
            <ProfileCard profile={profile} onEditClick={() => setEditOpen(true)} />
            <Badges badges={badges.length > 0 ? badges : undefined} />
          </aside>

          {/* Right: Content */}
          <div className="min-w-0 flex-1 space-y-6">
            {/* Weekly Goals */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                <h3 className="font-display text-lg font-semibold text-slate-900">Weekly Goals</h3>
              </div>
              <div className="space-y-5">
                <ProgressBar label="10km run" current={6} total={10} unit="km" color="emerald" />
                <ProgressBar label="1000 pushups" current={340} total={1000} color="amber" />
              </div>
            </motion.section>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <PointsChart title="Contest Points" />
              <MonthlyProgressChart title="Monthly Progress" />
            </div>

            {/* Activity Grid */}
            <ActivityGrid activityData={activity?.activity} title="12 Months Contribution" />

            {/* Streak Rate */}
            <StreakRate
              currentStreak={profile.streak}
              longestStreak={Math.max(profile.streak, 28)}
              consistencyRate={87}
              totalActiveDays={312}
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-display text-lg font-semibold text-slate-900">Edit Profile</h2>
              <button onClick={() => setEditOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
              {[
                { key: 'display_name', label: 'Display Name', placeholder: 'Alex Johnson' },
                { key: 'username', label: 'Username', placeholder: 'alexj' },
                { key: 'bio', label: 'Bio', placeholder: 'Tell something about yourself...' },
                { key: 'location', label: 'Location', placeholder: 'San Francisco, CA' },
                { key: 'github_url', label: 'GitHub URL', placeholder: 'https://github.com/username' },
                { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username' },
                { key: 'twitter_url', label: 'Twitter URL', placeholder: 'https://twitter.com/username' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={editForm[key as keyof typeof editForm]}
                    onChange={e => setEditForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 text-sm"
                  />
                </div>
              ))}
            </form>

            <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
              <button onClick={() => setEditOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleSaveProfile} disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60">
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
