# SmartWinnr - Quick Start

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- Node.js 16.0.0+ ([Download](https://nodejs.org/))
- MongoDB 5.0+ ([Download](https://www.mongodb.com/try/download/community))

### Step 1: Start MongoDB
```bash
# Windows: Start from Services or run:
mongod
```

### Step 2: Start Backend (Terminal 1)
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Step 3: Start Frontend (Terminal 2)
```bash
cd client
npm install
npm start
# App opens on http://localhost:3000
```

### Step 4: Create Account
- Go to Register page
- Create your account
- Login and start chatting!

## 📝 Environment Variables

**server/.env:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartwinnr_chat
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## 🎯 Key Features Demonstrated

✅ Real-time messaging with WebSockets
✅ User authentication (register/login)
✅ Multiple chat rooms
✅ Online user list
✅ Typing indicators
✅ Persistent message storage
✅ Responsive UI

## 🔧 Troubleshooting

### Port 5000 already in use?
- Change PORT in server/.env
- Or kill process: `lsof -i :5000` (Mac) / `netstat -ano | findstr :5000` (Windows)

### MongoDB connection error?
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Default: `mongodb://localhost:27017/smartwinnr_chat`

### Frontend won't load?
- Clear browser cache
- Check that backend is running on port 5000
- Check console for errors (F12)

## 📚 Full Documentation
See README.md for complete documentation, API endpoints, and features.

