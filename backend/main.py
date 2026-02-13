from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
import cloudinary
import cloudinary.uploader
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

# Import models and schemas (these will be in separate files)
from database import get_db, engine
import models
import schemas

# Load environment variables
load_dotenv()

# Create tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI
app = FastAPI(
    title="Trackitnow API",
    description="Complete task tracking and habit building API",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Security Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
# this line give us error while hasing the user password 
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# ===========================
# UTILITY FUNCTIONS
# ===========================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

# ===========================
# AUTHENTICATION ROUTES
# ===========================

@app.post("/api/auth/signup", response_model=schemas.UserResponse)
async def signup(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new user account"""
    # Check if user already exists
    existing_user = db.query(models.User).filter(
        (models.User.email == user_data.email) | (models.User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = models.User(
        email=user_data.email,
        username=user_data.username,
        display_name=user_data.display_name or user_data.username,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@app.post("/api/auth/signin", response_model=schemas.Token)
async def signin(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Sign in and get access token"""
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/signout")
async def signout(current_user: models.User = Depends(get_current_user)):
    """Sign out user (client should remove token)"""
    return {"message": "Successfully signed out"}

# ===========================
# USER/PROFILE ROUTES
# ===========================

@app.get("/api/user/profile", response_model=schemas.ProfileResponse)
async def get_profile(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user profile with stats"""
    # Calculate stats
    total_tasks = db.query(models.UserTask).filter(models.UserTask.user_id == current_user.id).count()
    completed_tasks = db.query(models.UserTask).filter(
        models.UserTask.user_id == current_user.id,
        models.UserTask.status == "done"
    ).count()
    
    # Calculate streak
    sessions = db.query(models.Session).filter(
        models.Session.user_id == current_user.id
    ).order_by(models.Session.date.desc()).all()
    
    current_streak = 0
    if sessions:
        current_date = datetime.now().date()
        for session in sessions:
            if session.date == current_date:
                current_streak += 1
                current_date -= timedelta(days=1)
            else:
                break
    
    # Get friends count
    friends_count = db.query(models.Friendship).filter(
        ((models.Friendship.user_id == current_user.id) | (models.Friendship.friend_id == current_user.id)) &
        (models.Friendship.status == "accepted")
    ).count()
    
    return {
        **current_user.__dict__,
        "total_points": completed_tasks * 10,  # 10 points per completed task
        "streak": current_streak,
        "rank": 156,  # This would be calculated based on all users
        "friends_count": friends_count,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks
    }

@app.put("/api/user/profile", response_model=schemas.UserResponse)
async def update_profile(
    profile_data: schemas.ProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    if profile_data.username:
        # Check if username is already taken
        existing = db.query(models.User).filter(
            models.User.username == profile_data.username,
            models.User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = profile_data.username
    
    if profile_data.display_name:
        current_user.display_name = profile_data.display_name
    
    if profile_data.bio:
        current_user.bio = profile_data.bio
    
    if profile_data.location:
        current_user.location = profile_data.location
    
    if profile_data.github_url:
        current_user.github_url = profile_data.github_url
    
    if profile_data.linkedin_url:
        current_user.linkedin_url = profile_data.linkedin_url
    
    if profile_data.twitter_url:
        current_user.twitter_url = profile_data.twitter_url
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@app.post("/api/user/profile/photo")
async def upload_profile_photo(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload profile photo to Cloudinary"""
    try:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file.file,
            folder="trackitnow/profiles",
            public_id=f"user_{current_user.id}",
            overwrite=True,
            resource_type="image"
        )
        
        # Update user's avatar URL
        current_user.avatar_url = result['secure_url']
        db.commit()
        
        return {"avatar_url": result['secure_url']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/user/account")
async def delete_account(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user account"""
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted successfully"}

# ===========================
# TASK ROUTES
# ===========================

@app.get("/api/tasks", response_model=List[schemas.TaskResponse])
async def get_tasks(
    level: Optional[str] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all tasks (default + custom user tasks)"""
    query = db.query(models.Task).filter(
        (models.Task.user_id == None) | (models.Task.user_id == current_user.id)
    )
    
    if level:
        query = query.filter(models.Task.level == level)
    
    tasks = query.all()
    
    # Get user task statuses
    user_tasks = db.query(models.UserTask).filter(
        models.UserTask.user_id == current_user.id
    ).all()
    
    user_task_map = {ut.task_id: ut.status for ut in user_tasks}
    
    result = []
    for task in tasks:
        result.append({
            **task.__dict__,
            "status": user_task_map.get(task.id, "pending")
        })
    
    return result

@app.post("/api/tasks", response_model=schemas.TaskResponse)
async def create_custom_task(
    task_data: schemas.TaskCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a custom task"""
    new_task = models.Task(
        title=task_data.title,
        description=task_data.description,
        level=task_data.level,
        type=task_data.type,
        icon=task_data.icon or "📝",
        user_id=current_user.id  # Custom task belongs to user
    )
    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    
    return new_task

@app.put("/api/tasks/{task_id}/status")
async def update_task_status(
    task_id: int,
    status_data: schemas.TaskStatusUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update task status for user"""
    # Check if user_task exists
    user_task = db.query(models.UserTask).filter(
        models.UserTask.user_id == current_user.id,
        models.UserTask.task_id == task_id
    ).first()
    
    if user_task:
        user_task.status = status_data.status
        user_task.updated_at = datetime.utcnow()
    else:
        user_task = models.UserTask(
            user_id=current_user.id,
            task_id=task_id,
            status=status_data.status
        )
        db.add(user_task)
    
    # If task is completed, create a session entry
    if status_data.status == "done":
        today = datetime.now().date()
        session = db.query(models.Session).filter(
            models.Session.user_id == current_user.id,
            models.Session.date == today
        ).first()
        
        if session:
            session.task_count += 1
        else:
            session = models.Session(
                user_id=current_user.id,
                date=today,
                task_count=1
            )
            db.add(session)
    
    db.commit()
    
    return {"message": "Task status updated successfully"}

# ===========================
# FRIEND ROUTES
# ===========================

@app.get("/api/friends", response_model=List[schemas.FriendResponse])
async def get_friends(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all friends"""
    friendships = db.query(models.Friendship).filter(
        ((models.Friendship.user_id == current_user.id) | (models.Friendship.friend_id == current_user.id)) &
        (models.Friendship.status == "accepted")
    ).all()
    
    friends = []
    for friendship in friendships:
        friend = friendship.friend if friendship.user_id == current_user.id else friendship.user
        friends.append(friend)
    
    return friends

@app.get("/api/friends/search")
async def search_users(
    q: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search for users"""
    users = db.query(models.User).filter(
        (models.User.username.ilike(f"%{q}%") | models.User.display_name.ilike(f"%{q}%")) &
        (models.User.id != current_user.id)
    ).limit(20).all()
    
    return users

@app.post("/api/friends/request")
async def send_friend_request(
    request_data: schemas.FriendRequestCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send friend request"""
    # Check if request already exists
    existing = db.query(models.Friendship).filter(
        ((models.Friendship.user_id == current_user.id) & (models.Friendship.friend_id == request_data.user_id)) |
        ((models.Friendship.user_id == request_data.user_id) & (models.Friendship.friend_id == current_user.id))
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Friend request already exists")
    
    friendship = models.Friendship(
        user_id=current_user.id,
        friend_id=request_data.user_id,
        status="pending"
    )
    
    db.add(friendship)
    db.commit()
    
    return {"message": "Friend request sent"}

@app.get("/api/friends/requests", response_model=List[schemas.FriendRequestResponse])
async def get_friend_requests(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get pending friend requests"""
    requests = db.query(models.Friendship).filter(
        models.Friendship.friend_id == current_user.id,
        models.Friendship.status == "pending"
    ).all()
    
    return requests

@app.put("/api/friends/requests/{request_id}/accept")
async def accept_friend_request(
    request_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Accept friend request"""
    friendship = db.query(models.Friendship).filter(
        models.Friendship.id == request_id,
        models.Friendship.friend_id == current_user.id
    ).first()
    
    if not friendship:
        raise HTTPException(status_code=404, detail="Friend request not found")
    
    friendship.status = "accepted"
    db.commit()
    
    return {"message": "Friend request accepted"}

@app.put("/api/friends/requests/{request_id}/decline")
async def decline_friend_request(
    request_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Decline friend request"""
    friendship = db.query(models.Friendship).filter(
        models.Friendship.id == request_id,
        models.Friendship.friend_id == current_user.id
    ).first()
    
    if not friendship:
        raise HTTPException(status_code=404, detail="Friend request not found")
    
    db.delete(friendship)
    db.commit()
    
    return {"message": "Friend request declined"}

# ===========================
# CHAT ROUTES
# ===========================

@app.get("/api/chats", response_model=List[schemas.ChatResponse])
async def get_chats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all chat conversations"""
    # Get all friendships
    friendships = db.query(models.Friendship).filter(
        ((models.Friendship.user_id == current_user.id) | (models.Friendship.friend_id == current_user.id)) &
        (models.Friendship.status == "accepted")
    ).all()
    
    chats = []
    for friendship in friendships:
        friend = friendship.friend if friendship.user_id == current_user.id else friendship.user
        
        # Get last message
        last_message = db.query(models.Message).filter(
            ((models.Message.sender_id == current_user.id) & (models.Message.receiver_id == friend.id)) |
            ((models.Message.sender_id == friend.id) & (models.Message.receiver_id == current_user.id))
        ).order_by(models.Message.created_at.desc()).first()
        
        # Get unread count
        unread_count = db.query(models.Message).filter(
            models.Message.sender_id == friend.id,
            models.Message.receiver_id == current_user.id,
            models.Message.is_read == False
        ).count()
        
        chats.append({
            "id": friendship.id,
            "friend": friend,
            "last_message": last_message,
            "unread_count": unread_count
        })
    
    return chats

@app.get("/api/chats/{chat_id}/messages", response_model=List[schemas.MessageResponse])
async def get_messages(
    chat_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get messages for a chat"""
    friendship = db.query(models.Friendship).filter(models.Friendship.id == chat_id).first()
    
    if not friendship:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    friend_id = friendship.friend_id if friendship.user_id == current_user.id else friendship.user_id
    
    messages = db.query(models.Message).filter(
        ((models.Message.sender_id == current_user.id) & (models.Message.receiver_id == friend_id)) |
        ((models.Message.sender_id == friend_id) & (models.Message.receiver_id == current_user.id))
    ).order_by(models.Message.created_at).all()
    
    return messages

@app.post("/api/chats/{chat_id}/messages", response_model=schemas.MessageResponse)
async def send_message(
    chat_id: int,
    message_data: schemas.MessageCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message"""
    friendship = db.query(models.Friendship).filter(models.Friendship.id == chat_id).first()
    
    if not friendship:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    friend_id = friendship.friend_id if friendship.user_id == current_user.id else friendship.user_id
    
    message = models.Message(
        sender_id=current_user.id,
        receiver_id=friend_id,
        content=message_data.content
    )
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return message

@app.put("/api/chats/{chat_id}/read")
async def mark_as_read(
    chat_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark messages as read"""
    friendship = db.query(models.Friendship).filter(models.Friendship.id == chat_id).first()
    
    if not friendship:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    friend_id = friendship.friend_id if friendship.user_id == current_user.id else friendship.user_id
    
    db.query(models.Message).filter(
        models.Message.sender_id == friend_id,
        models.Message.receiver_id == current_user.id,
        models.Message.is_read == False
    ).update({"is_read": True})
    
    db.commit()
    
    return {"message": "Messages marked as read"}

# ===========================
# PROGRESS/STATS ROUTES
# ===========================

@app.get("/api/progress/activity")
async def get_activity_data(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get 12-month activity data"""
    # Get sessions for last 12 months
    twelve_months_ago = datetime.now() - timedelta(days=365)
    sessions = db.query(models.Session).filter(
        models.Session.user_id == current_user.id,
        models.Session.date >= twelve_months_ago.date()
    ).all()
    
    # Convert to format for frontend
    activity_map = {session.date.isoformat(): session.task_count for session in sessions}
    
    return {"activity": activity_map}

@app.get("/api/progress/badges", response_model=List[schemas.BadgeResponse])
async def get_badges(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user badges"""
    user_badges = db.query(models.UserBadge).filter(
        models.UserBadge.user_id == current_user.id
    ).all()
    
    earned_badge_types = {ub.badge_type for ub in user_badges}
    
    # Define all badge types
    all_badges = [
        {"type": "bronze", "name": "First Steps", "description": "Complete your first task"},
        {"type": "silver", "name": "Week Warrior", "description": "7-day streak"},
        {"type": "gold", "name": "Gold Standard", "description": "Earn 1000 points"},
        {"type": "platinum", "name": "Platinum Pro", "description": "30-day streak"},
        {"type": "diamond", "name": "Diamond Elite", "description": "100-day streak"},
    ]
    
    result = []
    for badge in all_badges:
        result.append({
            **badge,
            "is_earned": badge["type"] in earned_badge_types
        })
    
    return result

@app.get("/api/progress/goals")
async def get_weekly_goals(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get weekly goals"""
    # This is a placeholder - implement based on your goal tracking logic
    return [
        {"id": 1, "title": "10km run", "current": 6, "total": 10, "unit": "km", "color": "emerald"},
        {"id": 2, "title": "1000 pushups", "current": 340, "total": 1000, "color": "amber"}
    ]

# ===========================
# HEALTH CHECK
# ===========================

@app.get("/")
async def root():
    return {"message": "Trackitnow API v2.0", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
