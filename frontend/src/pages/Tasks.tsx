import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play, Check, Clock, Sparkles, X, Plus } from 'lucide-react';
import { tasksApi } from '../services/api';
import type { Task, TaskLevel, TaskStatus } from '../types';

const LEVELS: { key: TaskLevel; label: string; color: string; bg: string }[] = [
  { key: 'beginner', label: 'Beginner', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  { key: 'intermediate', label: 'Intermediate', color: 'text-amber-700', bg: 'bg-amber-100' },
  { key: 'expert', label: 'Expert', color: 'text-red-700', bg: 'bg-red-100' },
];

const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: 'Pending', icon: Clock, className: 'bg-slate-100 text-slate-600' },
  progress: { label: 'In Progress', icon: Play, className: 'bg-amber-100 text-amber-700' },
  done: { label: 'Done', icon: Check, className: 'bg-emerald-100 text-emerald-700' },
};

const DUMMY_TASKS: Task[] = [
  { id: 1, title: 'Run 2km', description: 'Complete a 2km run at your own pace.', level: 'beginner', type: 'Fitness', icon: '🏃', created_at: '', status: 'pending' },
  { id: 2, title: '10 Pushups', description: 'Do 10 pushups in one set.', level: 'beginner', type: 'Fitness', icon: '💪', created_at: '', status: 'pending' },
  { id: 3, title: 'Read 10 minutes', description: 'Read a book or article for 10 minutes.', level: 'beginner', type: 'Learning', icon: '📖', created_at: '', status: 'pending' },
  { id: 4, title: 'Drink 8 glasses of water', description: 'Stay hydrated throughout the day.', level: 'beginner', type: 'Health', icon: '💧', created_at: '', status: 'pending' },
  { id: 5, title: 'Solve 3 DSA problems', description: 'Solve 3 data structure or algorithm problems.', level: 'beginner', type: 'Coding', icon: '🧩', created_at: '', status: 'pending' },
  { id: 6, title: 'Run 5km', description: 'Complete a 5km run.', level: 'intermediate', type: 'Fitness', icon: '🏃', created_at: '', status: 'pending' },
  { id: 7, title: '50 Pushups', description: 'Complete 50 pushups in sets.', level: 'intermediate', type: 'Fitness', icon: '💪', created_at: '', status: 'pending' },
  { id: 8, title: '30 min study session', description: 'Focused study or practice for 30 minutes.', level: 'intermediate', type: 'Learning', icon: '📚', created_at: '', status: 'pending' },
  { id: 9, title: 'Solve 5 medium problems', description: 'Solve 5 LeetCode-style medium problems.', level: 'intermediate', type: 'Coding', icon: '⚡', created_at: '', status: 'pending' },
  { id: 10, title: '10km run', description: 'Complete a 10km run.', level: 'expert', type: 'Fitness', icon: '🏃', created_at: '', status: 'pending' },
  { id: 11, title: '100 pushups', description: 'Complete 100 pushups in a day.', level: 'expert', type: 'Fitness', icon: '💪', created_at: '', status: 'pending' },
  { id: 12, title: 'Solve 1 hard problem', description: 'Solve one hard DSA/LeetCode problem.', level: 'expert', type: 'Coding', icon: '🔥', created_at: '', status: 'pending' },
];

function getDayTaskId(tasks: Task[]) {
  const day = new Date().toDateString();
  const hash = day.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return tasks[Math.abs(hash) % tasks.length]?.id;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(DUMMY_TASKS);
  const [selectedLevel, setSelectedLevel] = useState<TaskLevel>('beginner');
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ 
    title: '', 
    description: '', 
    level: 'beginner' as TaskLevel, 
    type: 'Fitness', 
    icon: '📝' 
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    tasksApi.getTasks()
      .then(data => {
        // Only update if backend returns tasks, otherwise keep dummy data
        if (data && data.length > 0) {
          setTasks(data);
        }
      })
      .catch(() => {
        // Keep dummy data if backend fails
        console.log('Using dummy tasks - backend not available');
      });
  }, []);

  const updateStatus = async (taskId: number, status: TaskStatus) => {
    // Optimistically update UI immediately
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    
    try {
      await tasksApi.updateTaskStatus(taskId, { status });
      console.log('Task status updated in backend');
    } catch (error) {
      console.log('Backend not available - task status saved locally only');
      // Keep the UI update even if backend fails (offline mode)
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      const newTask = await tasksApi.createCustomTask(createForm);
      setTasks(prev => [...prev, newTask]);
      setShowCreateModal(false);
      setCreateForm({ title: '', description: '', level: 'beginner', type: 'Fitness', icon: '📝' });
      console.log('Task created in backend');
    } catch (error) {
      console.log('Backend not available - creating task locally');
      // Create task locally if backend fails
      const localTask: Task = {
        id: Date.now(),
        ...createForm,
        created_at: new Date().toISOString(),
        status: 'pending',
      };
      setTasks(prev => [...prev, localTask]);
      setShowCreateModal(false);
      setCreateForm({ title: '', description: '', level: 'beginner', type: 'Fitness', icon: '📝' });
    } finally {
      setCreating(false);
    }
  };

  const filteredTasks = tasks.filter(t => t.level === selectedLevel);
  const openTask = openTaskId ? tasks.find(t => t.id === openTaskId) : null;
  const dayTaskId = getDayTaskId(tasks);
  const dayTask = tasks.find(t => t.id === dayTaskId);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="mt-1 text-gray-600">Complete tasks by level. Track your progress.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-amber-600"
          >
            <Plus className="h-4 w-4" />
            New Task
          </motion.button>
        </motion.div>

        {/* Task of the day */}
        {dayTask && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="mb-8"
          >
            <motion.button
              type="button"
              onClick={() => setOpenTaskId(dayTask.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="group w-full overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 text-left shadow-md transition-all hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <motion.span
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
                >
                  {dayTask.icon}
                </motion.span>
                <div className="min-w-0 flex-1">
                  <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                    <Sparkles className="h-3 w-3" />
                    Task of the Day
                  </span>
                  <h2 className="text-lg font-bold text-gray-900">{dayTask.title}</h2>
                  <p className="text-sm text-gray-600">{dayTask.type} · {LEVELS.find(l => l.key === dayTask.level)?.label}</p>
                </div>
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${STATUS_CONFIG[dayTask.status].className}`}>
                  {(() => { 
                    const { icon: Icon, label } = STATUS_CONFIG[dayTask.status]; 
                    return <><Icon className="h-3.5 w-3.5" />{label}</>; 
                  })()}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 transition-colors group-hover:text-amber-500" />
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* Level tabs */}
        <div className="mb-6 flex gap-2">
          {LEVELS.map(level => (
            <button
              key={level.key}
              onClick={() => setSelectedLevel(level.key)}
              className={`relative rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                selectedLevel === level.key
                  ? `${level.bg} ${level.color}`
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        <motion.ul 
          key={selectedLevel} 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="space-y-2"
        >
          {filteredTasks.map((task, i) => {
            const cfg = STATUS_CONFIG[task.status];
            const Icon = cfg.icon;
            return (
              <motion.li 
                key={task.id} 
                initial={{ opacity: 0, x: -12 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.04 * i }}
              >
                <motion.button
                  type="button"
                  onClick={() => setOpenTaskId(task.id)}
                  whileHover={{ x: 3 }}
                  className="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-amber-200 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                    {task.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.type}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.className}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {cfg.label}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                </motion.button>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Task Detail Modal */}
        <AnimatePresence>
          {openTask && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setOpenTaskId(null)}
                className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-2xl">
                        {openTask.icon}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{openTask.title}</h3>
                        <p className="text-sm text-gray-600">
                          {openTask.type} · {LEVELS.find(l => l.key === openTask.level)?.label}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setOpenTaskId(null)}
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <p className="mb-5 leading-relaxed text-gray-700">{openTask.description}</p>

                  <div className="mb-5 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${STATUS_CONFIG[openTask.status].className}`}>
                      {(() => { 
                        const { icon: Icon, label } = STATUS_CONFIG[openTask.status]; 
                        return <><Icon className="h-4 w-4" />{label}</>; 
                      })()}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {openTask.status === 'pending' && (
                      <button 
                        onClick={() => { updateStatus(openTask.id, 'progress'); }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-semibold text-white shadow-md transition hover:bg-amber-600"
                      >
                        <Play className="h-5 w-5" /> Start
                      </button>
                    )}
                    {openTask.status === 'progress' && (
                      <>
                        <button 
                          onClick={() => updateStatus(openTask.id, 'done')}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-semibold text-white shadow-md transition hover:bg-emerald-600"
                        >
                          <Check className="h-5 w-5" /> Mark Done
                        </button>
                        <button 
                          onClick={() => updateStatus(openTask.id, 'pending')}
                          className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-600 transition hover:bg-gray-50"
                        >
                          Reset
                        </button>
                      </>
                    )}
                    {openTask.status === 'done' && (
                      <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 font-medium text-emerald-700">
                        <Check className="h-5 w-5" /> Completed!
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Create Task Modal - PROPERLY CENTERED */}
        <AnimatePresence>
          {showCreateModal && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setShowCreateModal(false)}
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Create Custom Task</h3>
                    <button 
                      onClick={() => setShowCreateModal(false)} 
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={createForm.title}
                        onChange={e => setCreateForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="Run 5km"
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={createForm.description}
                        onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="Complete a 5km run"
                        rows={3}
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Level
                        </label>
                        <select 
                          value={createForm.level} 
                          onChange={e => setCreateForm(p => ({ ...p, level: e.target.value as TaskLevel }))}
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Type
                        </label>
                        <select 
                          value={createForm.type} 
                          onChange={e => setCreateForm(p => ({ ...p, type: e.target.value }))}
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        >
                          {['Fitness', 'Coding', 'Learning', 'Health', 'Other'].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Icon (emoji)
                      </label>
                      <input 
                        type="text" 
                        value={createForm.icon}
                        onChange={e => setCreateForm(p => ({ ...p, icon: e.target.value }))}
                        placeholder="📝"
                        maxLength={2}
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setShowCreateModal(false)}
                        className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={creating}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-amber-600 disabled:opacity-60"
                      >
                        {creating ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            Create Task
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}