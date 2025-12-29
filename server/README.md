# SmartWinnr Server

Backend for SmartWinnr chat application built with Node.js, Express.js, and Socket.io.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/smartwinnr_chat
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

3. Start server:
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:5000`

## API Routes

- `/api/auth` - User authentication
- `/api/messages` - Message operations
- `/api/rooms` - Room management
- `/api/users` - User information
- `/api/upload` - File uploads

## Socket.io Events

- `send_message` - Send message to room
- `typing` / `stop_typing` - Typing indicators
- `user_join` - User connects
- `receive_message` - Receive message from server

## Database

Uses MongoDB with Mongoose ODM. Models:
- User
- Room
- Message

## File Structure

```
server/
├── models/          # Database schemas
├── routes/          # API endpoints
├── middleware/      # Authentication
├── uploads/         # Uploaded files
├── server.js        # Main server file
└── .env             # Environment variables
```
