# SmartWinnr - Real-Time Chat Application

A full-stack real-time chat application built with MERN stack (MongoDB, Express.js, React, Node.js) using WebSockets for instant messaging.

## Features

- Real-time messaging with WebSockets (Socket.io)
- Multiple chat rooms
- User authentication (JWT)
- File and image sharing
- Typing indicators
- Online user status
- Message persistence
- Responsive design

## Tech Stack

**Backend:** Node.js, Express.js, Socket.io, MongoDB, Mongoose  
**Frontend:** React, React Router, Axios, Socket.io Client

## Quick Start

### Prerequisites
- Node.js v16+
- MongoDB Atlas account

### Installation

1. **Setup Server**
   ```bash
   cd server
   npm install
   ```
   
   Create `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/smartwinnr_chat
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

2. **Setup Client**
   ```bash
   cd client
   npm install
   ```

3. **Start Server**
   ```bash
   cd server
   npm run dev
   ```

4. **Start Client** (new terminal)
   ```bash
   cd client
   npm start
   ```

App opens at `http://localhost:3001`

## Usage

1. Register or login
2. Create or join a chat room
3. Send messages in real-time
4. Upload files/images
5. See online users and typing status

## Project Structure

```
smartwinnr/
├── server/
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & utilities
│   ├── uploads/         # Uploaded files
│   └── server.js        # Main server
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── styles/      # CSS files
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room
- `GET /api/messages/room/:roomId` - Get messages
- `POST /api/messages` - Send message
- `POST /api/upload` - Upload file

## Database Schema

**User:** username, email, password (hashed), createdAt  
**Room:** name, description, creator, members, isPrivate  
**Message:** sender, room, content, messageType, fileUrl, createdAt

## Authentication

- JWT tokens (7-day expiration)
- Passwords hashed with bcryptjs
- Tokens stored in localStorage

## Socket.io Events

- `send_message` / `receive_message`
- `typing` / `user_typing` / `stop_typing`
- `user_join` / `users_list`

## Troubleshooting

**MongoDB connection error:**
- Check MongoDB URI in `.env`
- Verify MongoDB Atlas network access

**Port already in use:**
- Kill: `taskkill /F /IM node.exe` (Windows)
- Or change PORT in `.env`

**Modules not found:**
- Run `npm install` in server and client directories

## File Upload

- Max size: 10MB
- Stored in `/server/uploads`
- Accessible via `/uploads/filename` URL

## License

MIT
