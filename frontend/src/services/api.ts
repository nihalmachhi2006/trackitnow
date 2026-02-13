import axios from 'axios';
import type {
  User, UserProfile, Token, SignUpData, ProfileUpdateData,
  Task, TaskCreate, TaskStatusUpdate,
  Friend, FriendRequest,
  Chat, Message,
  Badge, ActivityData, WeeklyGoal,
} from '../types';

// ===========================
// AXIOS INSTANCE
// ===========================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// ===========================
// AUTH ROUTES
// POST /api/auth/signup
// POST /api/auth/signin  (OAuth2PasswordRequestForm)
// POST /api/auth/signout
// ===========================

export const authApi = {
  signup: async (data: SignUpData): Promise<User> => {
    const res = await api.post<User>('/api/auth/signup', data);
    return res.data;
  },

  signin: async (email: string, password: string): Promise<Token> => {
    // FastAPI OAuth2 expects form data
    const formData = new URLSearchParams();
    formData.append('username', email); // FastAPI OAuth2 uses 'username' for email
    formData.append('password', password);
    const res = await api.post<Token>('/api/auth/signin', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res.data;
  },

  signout: async (): Promise<void> => {
    await api.post('/api/auth/signout');
    localStorage.removeItem('access_token');
  },
};

// ===========================
// USER / PROFILE ROUTES
// GET    /api/user/profile
// PUT    /api/user/profile
// POST   /api/user/profile/photo
// DELETE /api/user/account
// ===========================

export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const res = await api.get<UserProfile>('/api/user/profile');
    return res.data;
  },

  updateProfile: async (data: ProfileUpdateData): Promise<User> => {
    const res = await api.put<User>('/api/user/profile', data);
    return res.data;
  },

  uploadProfilePhoto: async (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<{ avatar_url: string }>('/api/user/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteAccount: async (): Promise<void> => {
    await api.delete('/api/user/account');
    localStorage.removeItem('access_token');
  },
};

// ===========================
// TASK ROUTES
// GET  /api/tasks?level=beginner
// POST /api/tasks
// PUT  /api/tasks/{task_id}/status
// ===========================

export const tasksApi = {
  getTasks: async (level?: string): Promise<Task[]> => {
    const params = level ? { level } : {};
    const res = await api.get<Task[]>('/api/tasks', { params });
    return res.data;
  },

  createCustomTask: async (data: TaskCreate): Promise<Task> => {
    const res = await api.post<Task>('/api/tasks', data);
    return res.data;
  },

  updateTaskStatus: async (taskId: number, data: TaskStatusUpdate): Promise<{ message: string }> => {
    const res = await api.put<{ message: string }>(`/api/tasks/${taskId}/status`, data);
    return res.data;
  },
};

// ===========================
// FRIEND ROUTES
// GET  /api/friends
// GET  /api/friends/search?q=query
// POST /api/friends/request
// GET  /api/friends/requests
// PUT  /api/friends/requests/{id}/accept
// PUT  /api/friends/requests/{id}/decline
// ===========================

export const friendsApi = {
  getFriends: async (): Promise<Friend[]> => {
    const res = await api.get<Friend[]>('/api/friends');
    return res.data;
  },

  searchUsers: async (q: string): Promise<User[]> => {
    const res = await api.get<User[]>('/api/friends/search', { params: { q } });
    return res.data;
  },

  sendFriendRequest: async (userId: number): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>('/api/friends/request', { user_id: userId });
    return res.data;
  },

  getFriendRequests: async (): Promise<FriendRequest[]> => {
    const res = await api.get<FriendRequest[]>('/api/friends/requests');
    return res.data;
  },

  acceptFriendRequest: async (requestId: number): Promise<{ message: string }> => {
    const res = await api.put<{ message: string }>(`/api/friends/requests/${requestId}/accept`);
    return res.data;
  },

  declineFriendRequest: async (requestId: number): Promise<{ message: string }> => {
    const res = await api.put<{ message: string }>(`/api/friends/requests/${requestId}/decline`);
    return res.data;
  },
};

// ===========================
// CHAT ROUTES
// GET  /api/chats
// GET  /api/chats/{chat_id}/messages
// POST /api/chats/{chat_id}/messages
// PUT  /api/chats/{chat_id}/read
// ===========================

export const chatsApi = {
  getChats: async (): Promise<Chat[]> => {
    const res = await api.get<Chat[]>('/api/chats');
    return res.data;
  },

  getMessages: async (chatId: number): Promise<Message[]> => {
    const res = await api.get<Message[]>(`/api/chats/${chatId}/messages`);
    return res.data;
  },

  sendMessage: async (chatId: number, content: string): Promise<Message> => {
    const res = await api.post<Message>(`/api/chats/${chatId}/messages`, { content });
    return res.data;
  },

  markAsRead: async (chatId: number): Promise<{ message: string }> => {
    const res = await api.put<{ message: string }>(`/api/chats/${chatId}/read`);
    return res.data;
  },
};

// ===========================
// PROGRESS ROUTES
// GET /api/progress/activity
// GET /api/progress/badges
// GET /api/progress/goals
// ===========================

export const progressApi = {
  getActivityData: async (): Promise<ActivityData> => {
    const res = await api.get<ActivityData>('/api/progress/activity');
    return res.data;
  },

  getBadges: async (): Promise<Badge[]> => {
    const res = await api.get<Badge[]>('/api/progress/badges');
    return res.data;
  },

  getWeeklyGoals: async (): Promise<WeeklyGoal[]> => {
    const res = await api.get<WeeklyGoal[]>('/api/progress/goals');
    return res.data;
  },
};

export default api;
