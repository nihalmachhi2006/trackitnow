import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Flame, Trophy, TrendingUp, Users, MapPin,
  Github, Linkedin, Twitter, Share2, Pencil, Camera
} from 'lucide-react';
import type { UserProfile } from '../../types';
import { userApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface ProfileCardProps {
  profile: UserProfile;
  onEditClick: () => void;
}

export default function ProfileCard({ profile, onEditClick }: ProfileCardProps) {
  const { refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const stats = [
    { value: profile.streak, label: 'Day Streak', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { value: profile.total_points, label: 'Points', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
    { value: `#${profile.rank}`, label: 'Rank', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { value: profile.friends_count, label: 'Friends', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const socialLinks = [
    { url: profile.github_url, icon: Github, label: 'GitHub' },
    { url: profile.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { url: profile.twitter_url, icon: Twitter, label: 'Twitter' },
  ].filter((s) => s.url);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      await userApi.uploadProfilePhoto(file);
      await refreshUser();
    } catch (err) {
      console.error('Photo upload failed', err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: profile.display_name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header gradient banner */}
      <div className="h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500" />

      {/* Avatar + actions row */}
      <div className="relative px-5 pb-2">
        {/* Avatar */}
        <div className="absolute -top-10 left-5">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="relative group"
          >
            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-amber-100 to-amber-200 shadow-md">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.display_name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-amber-700">
                  {profile.display_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* Photo edit overlay */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {uploadingPhoto ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Camera className="h-4 w-4 text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </motion.div>
        </div>

        {/* Share + Edit buttons */}
        <div className="flex justify-end gap-2 pt-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onEditClick}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 shadow-sm"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </motion.button>
        </div>
      </div>

      {/* Profile info */}
      <div className="px-5 pb-5">
        <div className="mt-1">
          <h2 className="font-display text-xl font-bold text-slate-900">{profile.display_name}</h2>
          <p className="text-sm font-medium text-amber-600">@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{profile.bio}</p>
        )}

        {profile.location && (
          <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {profile.location}
          </div>
        )}

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div className="mt-3 flex items-center gap-3">
            {socialLinks.map(({ url, icon: Icon, label }) => (
              <a
                key={label}
                href={url!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                title={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="my-4 border-t border-slate-100" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {stats.map(({ value, label, icon: Icon, color, bg }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.02, y: -1 }}
              className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 leading-none">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Task completion */}
        <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Tasks Completed</span>
            <span className="font-bold text-slate-900">{profile.completed_tasks} / {profile.total_tasks}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${profile.total_tasks > 0 ? (profile.completed_tasks / profile.total_tasks) * 100 : 0}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
