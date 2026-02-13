import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, UserPlus, Check } from 'lucide-react';
import { friendsApi } from '../services/api';
import type { User } from '../types';

function Avatar({ name, url }: { name: string; url?: string }) {
  return (
    <div className="h-14 w-14 shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center font-bold text-xl text-amber-700 border-2 border-white shadow-sm">
      {url ? (
        <img src={url} alt={name} className="h-full w-full object-cover" />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </div>
  );
}

export default function SearchFriends() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState<Set<number>>(new Set());

  // 🔥 Load 3-4 users on page load
  useEffect(() => {
    const loadInitialUsers = async () => {
      try {
        const results = await friendsApi.searchUsers('');
        setUsers(results.slice(0, 4)); // show only 4 users
      } catch (error) {
        console.error('Initial load failed:', error);
      }
    };

    loadInitialUsers();
  }, []);

  // 🔥 Search logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        // reload initial 4 users
        try {
          const results = await friendsApi.searchUsers('');
          setUsers(results.slice(0, 4));
        } catch {
          setUsers([]);
        }
        return;
      }

      setLoading(true);
      try {
        const results = await friendsApi.searchUsers(query);
        setUsers(results);
      } catch (error) {
        console.error('Search error:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleAddFriend = async (userId: number) => {
    try {
      await friendsApi.sendFriendRequest(userId);
      setRequested(prev => new Set(prev).add(userId));
    } catch (error) {
      console.error('Friend request failed:', error);
    }
  };

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Search Friends
          </h1>
          <p className="mt-1 text-slate-500">
            Find and connect with other users.
          </p>
        </motion.div>

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-6"
        >
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by username..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            </div>
          )}
        </motion.div>

        {/* Users list */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-display font-semibold text-slate-900">
              {query ? `Results for "${query}"` : 'Suggested Users'}
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({users.length})
              </span>
            </h2>
          </div>

          {users.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <SearchIcon className="mx-auto h-8 w-8 mb-3 opacity-50" />
              <p>No users found</p>
            </div>
          ) : (
            <ul>
              {users.map((u, i) => (
                <motion.li
                  key={u.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i }}
                  className="flex items-center gap-4 border-b border-slate-50 px-5 py-4 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <Avatar name={u.display_name} url={u.avatar_url} />

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">
                      {u.display_name}
                    </p>
                    <p className="text-sm text-amber-600">@{u.username}</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddFriend(u.id)}
                    disabled={requested.has(u.id)}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all ${
                      requested.has(u.id)
                        ? 'bg-emerald-100 border-emerald-200 text-emerald-600'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600'
                    }`}
                  >
                    {requested.has(u.id) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.section>
      </div>
    </div>
  );
}
