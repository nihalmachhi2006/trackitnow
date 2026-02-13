// ===========================
// AUTH & USER TYPES
// ===========================

export interface User {
  id: number;
  email: string;
  username: string;
  display_name: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  created_at: string;
}

export interface UserProfile extends User {
  total_points: number;
  streak: number;
  rank: number;
  friends_count: number;
  total_tasks: number;
  completed_tasks: number;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface SignUpData {
  email: string;
  username: string;
  display_name: string;
  password: string;
}

export interface ProfileUpdateData {
  username?: string;
  display_name?: string;
  bio?: string;
  location?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
}

// ===========================
// TASK TYPES
// ===========================

export type TaskLevel = 'beginner' | 'intermediate' | 'expert';
export type TaskStatus = 'pending' | 'progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string;
  level: TaskLevel;
  type: string;
  icon: string;
  user_id?: number;
  created_at: string;
  status: TaskStatus;
}

export interface TaskCreate {
  title: string;
  description: string;
  level: TaskLevel;
  type: string;
  icon?: string;
}

export interface TaskStatusUpdate {
  status: TaskStatus;
}

// ===========================
// FRIEND TYPES
// ===========================

export interface Friend {
  id: number;
  username: string;
  display_name: string;
  avatar_url?: string;
}

export interface FriendRequest {
  id: number;
  user_id: number;
  friend_id: number;
  status: string;
  created_at: string;
  user?: Friend;
}

// ===========================
// CHAT TYPES
// ===========================

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Chat {
  id: number;
  friend: Friend;
  last_message?: Message;
  unread_count: number;
}

// ===========================
// PROGRESS TYPES
// ===========================

export interface Badge {
  type: string;
  name: string;
  description: string;
  is_earned: boolean;
}

export interface ActivityData {
  activity: Record<string, number>;
}

export interface WeeklyGoal {
  id: number;
  title: string;
  current: number;
  total: number;
  unit?: string;
  color: string;
}

// ===========================
// API RESPONSE TYPES
// ===========================

export interface ApiError {
  detail: string;
}
