# SmartWinnr Server

Real-time Chat Application Backend - Node.js & Express.js

## Prerequisites
- Node.js v16.0.0 or higher
- npm v7.0.0 or higher  
- MongoDB v5.0 or higher

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smartwinnr_chat
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   NODE_ENV=development
   ```

3. Ensure MongoDB is running

4. Start server:
   ```bash
   npm run dev    # Development with auto-reload
   npm start      # Production
   ```

Server runs on `http://localhost:5000`

## API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room
- `GET /api/messages/room/:roomId` - Get messages

See main README for complete API documentation.
