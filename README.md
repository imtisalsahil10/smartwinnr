# SmartWinnr - Real-Time Chat Application

A full-stack real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring WebSockets for real-time communication.

## 🚀 Features

- **Real-time Chat**: Instant message delivery using WebSockets (Socket.io)
- **Chat Rooms**: Create and join multiple chat rooms for group discussions
- **Private Conversations**: Direct messaging between users
- **User Management**: User authentication with JWT tokens
- **Online Status**: See who's online in real-time
- **Typing Indicators**: See when other users are typing
- **Message History**: All messages are persisted in MongoDB
- **Media Support**: (Framework ready for images/file sharing)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Authentication**: Secure login and registration system

## 📋 Tech Stack

### Backend
- **Node.js** v16.0.0 or higher
- **Express.js** v4.18.2 - Web framework
- **Socket.io** v4.6.1 - Real-time communication
- **MongoDB** v5.0+ - Database
- **Mongoose** v7.0.0 - MongoDB ODM
- **JWT** (jsonwebtoken) v9.0.0 - Authentication
- **bcryptjs** v2.4.3 - Password hashing
- **CORS** v2.8.5 - Cross-origin requests
- **Multer** v1.4.5 - File uploads
- **Express Validator** v7.0.0 - Input validation

### Frontend
- **React** v18.2.0 - UI library
- **React Router** v6.8.0 - Client-side routing
- **Axios** v1.3.0 - HTTP client
- **Socket.io Client** v4.6.1 - WebSocket client
- **React Icons** v4.7.1 - Icon library

## 📦 Project Structure

```
smartwinnr/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Room.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── messages.js
│   │   ├── rooms.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── client/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── ChatApp.js
    │   ├── components/
    │   │   ├── RoomList.js
    │   │   ├── UserList.js
    │   │   ├── ChatWindow.js
    │   │   ├── MessageList.js
    │   │   └── MessageInput.js
    │   ├── styles/
    │   │   ├── App.css
    │   │   ├── Auth.css
    │   │   ├── Components.css
    │   │   ├── ChatWindow.css
    │   │   ├── MessageList.css
    │   │   └── MessageInput.css
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** v16.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v7.0.0 or higher (comes with Node.js)
- **MongoDB** v5.0 or higher ([Download](https://www.mongodb.com/try/download/community))
- **Git** for cloning the repository

### Backend Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create or update the `.env` file in the server directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smartwinnr_chat
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   NODE_ENV=development
   ```

4. **Ensure MongoDB is running:**
   - On Windows: Start MongoDB service or run `mongod` from command line
   - On Mac: `brew services start mongodb-community`
   - On Linux: `sudo systemctl start mongod`

5. **Start the server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The application will open in your browser at `http://localhost:3000`

## 🎯 Usage Guide

### Getting Started

1. **Register a new account:**
   - Go to the registration page
   - Enter a username, email, and password
   - Click "Register"

2. **Login:**
   - Enter your email and password
   - Click "Login"

3. **Create a chat room:**
   - Click the "+" button in the sidebar
   - Enter room name and description
   - Click "Create"

4. **Join existing rooms:**
   - Click on any room from the room list
   - Start chatting!

5. **Send messages:**
   - Type your message in the input field
   - Press Enter or click the send button
   - Messages appear in real-time to all room members

### Features Walkthrough

- **Online Users**: See all currently online users in the right sidebar
- **Typing Indicator**: When someone types, you'll see "[username] is typing..."
- **Room Management**: Create rooms, invite users, manage members
- **Message History**: All previous messages are loaded when you enter a room
- **Real-time Updates**: Users joining/leaving rooms show up instantly

## 🔐 Authentication Details

- Uses JWT (JSON Web Tokens) for secure authentication
- Passwords are hashed using bcryptjs
- Tokens expire after 7 days
- Store tokens in browser localStorage for persistent login

## 📡 WebSocket Events

### Client → Server

- `user_join`: User joins the application
- `join_room`: User joins a specific room
- `leave_room`: User leaves a room
- `send_message`: User sends a message
- `typing`: User starts typing
- `stop_typing`: User stops typing
- `private_message`: User sends a private message

### Server → Client

- `users_list`: List of online users
- `receive_message`: New message received
- `receive_private_message`: Private message received
- `user_typing`: User is typing notification
- `user_stop_typing`: User stopped typing notification

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Messages
- `GET /api/messages/room/:roomId` - Get room messages
- `GET /api/messages/private/:userId` - Get private messages
- `POST /api/messages` - Save a message

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:roomId` - Get room details
- `POST /api/rooms` - Create new room
- `POST /api/rooms/:roomId/join` - Join room
- `POST /api/rooms/:roomId/leave` - Leave room

### Users
- `GET /api/users` - Get all users
- `GET /api/users/me` - Get current user
- `PUT /api/users/:userId/status` - Update user status

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running: `mongod` (on Windows) or `brew services start mongodb-community` (on Mac)
- Check the MONGODB_URI in `.env` matches your MongoDB instance
- Verify port 27017 is not blocked by firewall

### WebSocket Connection Issues
- Ensure both frontend and backend are running
- Check the Socket.io URL in the frontend matches the backend address
- Clear browser cache and localStorage if experiencing issues

### Port Already in Use
- Change the PORT in `.env` file (default 5000 for backend)
- Change the proxy in `client/package.json` if needed
- Use `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows) to check

## 📱 Responsive Design

The application is optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout
- **Mobile**: Stacked interface with touch-friendly buttons

## 🔄 Development

### Running in Development Mode

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm start
```

### Building for Production

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
```

## 📄 Version Details

| Technology | Version |
|-----------|---------|
| Node.js | 16.0.0+ |
| npm | 7.0.0+ |
| MongoDB | 5.0+ |
| React | 18.2.0 |
| Express.js | 4.18.2 |
| Socket.io | 4.6.1 |

## 🎓 Learning Resources

- [Socket.io Documentation](https://socket.io/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

Feel free to fork this project, make improvements, and submit pull requests.

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the API endpoints documentation
3. Check console logs for error messages

## 📝 License

This project is provided as-is for educational purposes.

---

**Created**: December 2025  
**Last Updated**: December 2025

