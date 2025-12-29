const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const roomRoutes = require('./routes/rooms');
const userRoutes = require('./routes/users');

// Middleware
const authenticateToken = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: [
      "http://localhost:3000", 
      "http://localhost:3001",
      "https://smartwinnr-two.vercel.app",
      process.env.FRONTEND_URL || "https://smartwinnr-two.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://localhost:3001",
    "https://smartwinnr-two.vercel.app",
    process.env.FRONTEND_URL || "https://smartwinnr-two.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.static('uploads'));
app.use('/uploads', express.static('uploads'));

// Upload endpoint
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Use absolute URL for production (includes domain)
  const baseUrl = process.env.BACKEND_URL || 'https://smartwinnr-chat-api.onrender.com';
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
  
  res.json({
    success: true,
    fileName: req.file.originalname,
    fileSize: (req.file.size / 1024).toFixed(2),
    fileUrl: fileUrl,
    mimeType: req.file.mimetype
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', authenticateToken, messageRoutes);
app.use('/api/rooms', authenticateToken, roomRoutes);
app.use('/api/users', authenticateToken, userRoutes);

// Store connected users
const connectedUsers = {};

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User joins
  socket.on('user_join', (data) => {
    const { userId, userName } = data;
    connectedUsers[socket.id] = { userId, userName, socketId: socket.id };
    io.emit('users_list', Object.values(connectedUsers));
    console.log(`${userName} joined. Connected users: ${Object.keys(connectedUsers).length}`);
  });

  // Join room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Leave room
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });

  // Send message
  socket.on('send_message', (data) => {
    const { roomId, message, senderId, senderName, timestamp, messageType, fileUrl, fileName, fileSize } = data;
    
    // Broadcast to room
    io.to(roomId).emit('receive_message', {
      message,
      senderId,
      senderName,
      timestamp,
      messageType: messageType || 'text',
      fileUrl,
      fileName,
      fileSize
    });
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { roomId, userName } = data;
    socket.to(roomId).emit('user_typing', { userName });
  });

  // Stop typing
  socket.on('stop_typing', (data) => {
    const { roomId } = data;
    socket.to(roomId).emit('user_stop_typing', {});
  });

  // Private message
  socket.on('private_message', (data) => {
    const { recipientId, message, senderId, senderName, timestamp } = data;
    const recipientSocket = Object.values(connectedUsers)
      .find(user => user.userId === recipientId);
    
    if (recipientSocket) {
      io.to(recipientSocket.socketId).emit('receive_private_message', {
        message,
        senderId,
        senderName,
        timestamp
      });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = connectedUsers[socket.id];
    if (user) {
      console.log(`${user.userName} disconnected`);
      delete connectedUsers[socket.id];
      io.emit('users_list', Object.values(connectedUsers));
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
