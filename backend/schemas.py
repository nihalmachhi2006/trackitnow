from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date

# ===========================
# USER/AUTH SCHEMAS
# ===========================

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    display_name: Optional[str] = None
    password: str

class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    display_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    display_name: str
    bio: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProfileResponse(UserResponse):
    total_points: int
    streak: int
    rank: int
    friends_count: int
    total_tasks: int
    completed_tasks: int

class Token(BaseModel):
    access_token: str
    token_type: str

# ===========================
# TASK SCHEMAS
# ===========================

class TaskCreate(BaseModel):
    title: str
    description: str
    level: str  # beginner, intermediate, expert
    type: str
    icon: Optional[str] = "📝"

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    level: str
    type: str
    icon: str
    user_id: Optional[int] = None
    created_at: datetime
    status: Optional[str] = "pending"
    
    class Config:
        from_attributes = True

class TaskStatusUpdate(BaseModel):
    status: str  # pending, progress, done

# ===========================
# FRIEND SCHEMAS
# ===========================

class FriendRequestCreate(BaseModel):
    user_id: int

class FriendResponse(BaseModel):
    id: int
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class FriendRequestResponse(BaseModel):
    id: int
    user_id: int
    friend_id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# ===========================
# CHAT/MESSAGE SCHEMAS
# ===========================

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    id: int
    friend: FriendResponse
    last_message: Optional[MessageResponse] = None
    unread_count: int

# ===========================
# PROGRESS/BADGE SCHEMAS
# ===========================

class BadgeResponse(BaseModel):
    type: str
    name: str
    description: str
    is_earned: bool

class SessionResponse(BaseModel):
    date: date
    task_count: int
    
    class Config:
        from_attributes = True
