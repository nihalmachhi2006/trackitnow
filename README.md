# 🎯 Trackitnow v2.0

<div align="center">

![Trackitnow Logo](https://img.shields.io/badge/Trackitnow-v2.0-blue?style=for-the-badge)
[![Open Source](https://img.shields.io/badge/Open%20Source-❤️-green?style=for-the-badge)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)

**A complete task tracking and habit building platform with Kaggle-style design**

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

---

</div>

## 📖 About

Trackitnow is a **free and open source** full-stack task tracking and habit building platform designed to help you build consistent habits and track your progress over time. With a beautiful Kaggle-inspired interface, comprehensive analytics, and social features, Trackitnow makes productivity engaging and rewarding.

### Built With

<div align="center">

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)

</div>

## ✨ Features

### 🎨 Beautiful UI/UX
- **Kaggle-Style Profile** - Long profile cards with avatar, bio, social links, and stats
- **Permanent Sidebar Navigation** - Clean, persistent sidebar with all features accessible
- **Micro-animations** - Smooth, delightful interactions throughout the app
- **Mobile Responsive** - Perfect experience on all devices and screen sizes
- **Dark/Light Theme** - Coming soon!

### 📊 Tracking & Analytics
- **12-Month Contribution Grid** - GitHub-style activity heatmap
- **Session Tracking** - Every task completion recorded and visualized
- **Chart.js Integration** - Professional charts for progress visualization
- **Custom Goals** - Set and track your personal weekly goals
- **Badge System** - Earn badges for achievements and milestones

### ✅ Task Management
- **Pre-built Tasks** - Curated fitness, learning, and productivity tasks
- **Custom Tasks** - Create your own tasks with custom icons and descriptions
- **Difficulty Levels** - Beginner, intermediate, and advanced challenges
- **Task Categories** - Organize by fitness, learning, mindfulness, and more
- **Progress Streaks** - Build and maintain daily streaks

### 👥 Social Features
- **Friend System** - Connect with friends and see their progress
- **Real-time Chat** - Message your friends directly in the app
- **Profile Sharing** - Share your achievements on social media
- **Public Profiles** - Showcase your stats, bio, and social links

### 🔒 Security & Privacy
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt encryption for password storage
- **CORS Protection** - Configured for security
- **Input Sanitization** - Protection against XSS and SQL injection

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.9+**
- **Node.js 18+**
- **PostgreSQL** (or a Supabase account)
- **Cloudinary account** (free tier works great)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/trackitnow.git
cd trackitnow
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials
```

**Backend .env configuration:**
```env
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

```bash
# Start the backend server
python main.py
```

Backend runs at `http://localhost:8000` 🎉

#### 3. Frontend Setup

```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API URL
```

**Frontend .env configuration:**
```env
VITE_API_URL=http://localhost:8000/api
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

```bash
# Start the development server
npm run dev
```

Frontend runs at `http://localhost:5173` 🚀

## 📁 Project Structure

```
trackitnow/
├── backend/                    # FastAPI Python backend
│   ├── main.py                # Main API file with all routes
│   ├── models.py              # SQLAlchemy database models
│   ├── schemas.py             # Pydantic validation schemas
│   ├── database.py            # Database configuration
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Environment template
│
└── frontend/                  # React + Vite frontend
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/            # Page components
    │   ├── services/         # API service layer
    │   ├── types/            # TypeScript definitions
    │   └── utils/            # Helper functions
    ├── package.json
    └── .env.example
```

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the database URL from Settings → Database
4. Add it to your backend `.env` file
5. Tables will be created automatically on first run!

### Option 2: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb trackitnow`
3. Update `DATABASE_URL` in `.env`
4. Tables will be created automatically

## 📚 API Documentation

Once your backend is running, explore the interactive API docs:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

```
Authentication
POST   /api/auth/signup          Create new account
POST   /api/auth/signin          User login
POST   /api/auth/signout         User logout

User Profile
GET    /api/user/profile         Get profile with stats
PUT    /api/user/profile         Update profile info
POST   /api/user/profile/photo   Upload profile photo
DELETE /api/user/account         Delete account

Tasks
GET    /api/tasks                Get all available tasks
POST   /api/tasks                Create custom task
PUT    /api/tasks/:id/status     Update task status

Friends
GET    /api/friends              Get friends list
POST   /api/friends/request      Send friend request
GET    /api/friends/requests     Get pending requests
PUT    /api/friends/requests/:id/accept    Accept request
PUT    /api/friends/requests/:id/decline   Decline request

Chat
GET    /api/chats                Get all conversations
GET    /api/chats/:id/messages   Get chat messages
POST   /api/chats/:id/messages   Send message
PUT    /api/chats/:id/read       Mark chat as read

Progress
GET    /api/progress/activity    Get 12-month activity data
GET    /api/progress/badges      Get earned badges
GET    /api/progress/goals       Get weekly goals
```

## 🌐 Deployment

### Backend Deployment

#### Railway (Recommended)
1. Push your code to GitHub
2. Create new project on [Railway](https://railway.app)
3. Connect your repository
4. Add environment variables from `.env`
5. Deploy! 🚀

#### Render
1. Create a new Web Service on [Render](https://render.com)
2. Connect your repository
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

### Frontend Deployment

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Drag and drop the dist/ folder to Netlify
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test
```

## 🤝 Contributing

We love contributions! Trackitnow is **open source** and welcomes improvements from the community.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Ideas

- 🐛 Fix bugs
- ✨ Add new features
- 📝 Improve documentation
- 🎨 Enhance UI/UX
- 🧪 Add tests
- 🌍 Add translations

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📋 Roadmap

- [ ] Dark mode support
- [ ] Mobile apps (React Native)
- [ ] Team workspaces
- [ ] Advanced analytics dashboard
- [ ] Integration with fitness trackers
- [ ] AI-powered habit suggestions
- [ ] Gamification enhancements
- [ ] Export data feature

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/yourusername/trackitnow/issues) with:
- Clear bug description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment details

## 💬 Community & Support

- **Discord**: [Join our community](https://discord.gg/trackitnow)
- **Twitter**: [@trackitnow](https://twitter.com/trackitnow)
- **Email**: support@trackitnow.com

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

This means you can:
- ✅ Use it commercially
- ✅ Modify it
- ✅ Distribute it
- ✅ Use it privately

## 🙏 Acknowledgments

- Design inspiration from [Kaggle](https://www.kaggle.com)
- Icons by [Lucide React](https://lucide.dev)
- Charts by [Chart.js](https://www.chartjs.org)
- Image storage by [Cloudinary](https://cloudinary.com)
- Authentication guidance from [FastAPI docs](https://fastapi.tiangolo.com)

## ⭐ Show Your Support

If you find Trackitnow useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🤝 Contributing code
- 📢 Sharing with friends

---

<div align="center">

**Built with ❤️ by the open source community**

[Report Bug](https://github.com/yourusername/trackitnow/issues) • [Request Feature](https://github.com/yourusername/trackitnow/issues) • [Documentation](https://docs.trackitnow.com)

**Made with ❤️ using React • FastAPI • PostgreSQL • Cloudinary**

</div>