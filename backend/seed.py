"""
Seed script to populate database with default tasks
Run this after setting up the database
"""

from database import SessionLocal, engine
import models

# Create tables
models.Base.metadata.create_all(bind=engine)

# Create session
db = SessionLocal()

# Default tasks
default_tasks = [
    # Beginner Tasks
    {"title": "Run 2km", "description": "Complete a 2km run at your own pace.", "level": "beginner", "type": "Fitness", "icon": "🏃"},
    {"title": "10 Pushups", "description": "Do 10 pushups in one set.", "level": "beginner", "type": "Fitness", "icon": "💪"},
    {"title": "Read 10 minutes", "description": "Read a book or article for 10 minutes.", "level": "beginner", "type": "Learning", "icon": "📖"},
    {"title": "Drink 8 glasses of water", "description": "Stay hydrated throughout the day.", "level": "beginner", "type": "Health", "icon": "💧"},
    {"title": "Solve 3 DSA problems", "description": "Solve 3 data structure or algorithm problems.", "level": "beginner", "type": "Coding", "icon": "🧩"},
    
    # Intermediate Tasks
    {"title": "Run 5km", "description": "Complete a 5km run.", "level": "intermediate", "type": "Fitness", "icon": "🏃"},
    {"title": "50 Pushups", "description": "Complete 50 pushups (can be in sets).", "level": "intermediate", "type": "Fitness", "icon": "💪"},
    {"title": "30 min study session", "description": "Focused study or practice for 30 minutes.", "level": "intermediate", "type": "Learning", "icon": "📚"},
    {"title": "Solve 5 medium problems", "description": "Solve 5 LeetCode-style medium problems.", "level": "intermediate", "type": "Coding", "icon": "⚡"},
    {"title": "Meditation 15 min", "description": "Practice mindfulness meditation.", "level": "intermediate", "type": "Health", "icon": "🧘"},
    
    # Expert Tasks
    {"title": "10km run", "description": "Complete a 10km run.", "level": "expert", "type": "Fitness", "icon": "🏃"},
    {"title": "100 pushups", "description": "Complete 100 pushups in a day.", "level": "expert", "type": "Fitness", "icon": "💪"},
    {"title": "Solve 1 hard problem", "description": "Solve one hard DSA/LeetCode problem.", "level": "expert", "type": "Coding", "icon": "🔥"},
    {"title": "Build a project", "description": "Work on a side project for 2 hours.", "level": "expert", "type": "Coding", "icon": "🚀"},
    {"title": "Write 1000 words", "description": "Write 1000 words (blog, journal, etc.).", "level": "expert", "type": "Learning", "icon": "✍️"},
]

# Check if tasks already exist
existing_tasks = db.query(models.Task).filter(models.Task.user_id == None).count()

if existing_tasks == 0:
    # Add default tasks
    for task_data in default_tasks:
        task = models.Task(**task_data, user_id=None)  # user_id=None means default task
        db.add(task)
    
    db.commit()
    print(f"✅ Successfully seeded {len(default_tasks)} default tasks!")
else:
    print(f"⚠️  Database already has {existing_tasks} default tasks. Skipping seed.")

db.close()
