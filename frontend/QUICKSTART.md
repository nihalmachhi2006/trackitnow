# Trackitnow Frontend - Quick Start

## Setup (2 minutes)

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend URL

# Start dev server
npm run dev
# Opens at http://localhost:5173
```

## Connect to Backend

Your FastAPI backend runs on `http://localhost:8000`.
Make sure it's started before using the app.

```bash
# In your backend directory:
python main.py
# API docs at http://localhost:8000/docs
```

## Project Structure

```
src/
├── App.tsx                    # Routes (public + protected)
├── context/
│   └── AuthContext.tsx         # JWT auth state
├── services/
│   └── api.ts                 # ALL API routes (axios)
├── types/
│   └── index.ts               # TypeScript types
├── components/
│   ├── Navbar.tsx              # Landing page navbar (hidden after login)
│   ├── Sidebar.tsx             # Dashboard sidebar navigation
│   ├── DashboardLayout.tsx     # Layout wrapper
│   └── dashboard/
│       ├── ProfileCard.tsx     # Kaggle-style profile card
│       ├── Badges.tsx          # Badge grid
│       ├── ActivityGrid.tsx    # 12-month contribution grid
│       ├── Charts.tsx          # PointsChart + MonthlyProgressChart
│       ├── ProgressBar.tsx     # Progress bar component
│       └── StreakRate.tsx      # Streak statistics
└── pages/
    ├── Home.tsx               # Landing page (dark - preserved)
    ├── Auth.tsx               # SignIn + SignUp
    ├── Dashboard.tsx          # Profile dashboard
    ├── Tasks.tsx              # Task tracking + create custom
    ├── Chats.tsx              # Messaging + friend requests
    ├── Search.tsx             # Find friends
    └── Settings.tsx           # Account settings

```

## API Routes (all connected)

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/signup | Create account |
| POST | /api/auth/signin | Login (returns JWT) |
| POST | /api/auth/signout | Logout |
| GET | /api/user/profile | Get profile + stats |
| PUT | /api/user/profile | Update profile |
| POST | /api/user/profile/photo | Upload photo (Cloudinary) |
| DELETE | /api/user/account | Delete account |
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create custom task |
| PUT | /api/tasks/:id/status | Update task status |
| GET | /api/friends | Get friends |
| GET | /api/friends/search | Search users |
| POST | /api/friends/request | Send friend request |
| GET | /api/friends/requests | Get pending requests |
| PUT | /api/friends/requests/:id/accept | Accept request |
| PUT | /api/friends/requests/:id/decline | Decline request |
| GET | /api/chats | Get conversations |
| GET | /api/chats/:id/messages | Get messages |
| POST | /api/chats/:id/messages | Send message |
| PUT | /api/chats/:id/read | Mark as read |
| GET | /api/progress/activity | 12-month activity |
| GET | /api/progress/badges | Get badges |
| GET | /api/progress/goals | Weekly goals |

## Build for Production

```bash
npm run build
# Output in /dist - deploy to Vercel, Netlify, etc.
```
