import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatApp from './pages/ChatApp';
import './styles/App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && !socket) {
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        withCredentials: true,
        path: '/socket.io'
      });
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
      });
      newSocket.on('connect_error', (err) => {
        console.error('Socket connect_error:', err);
      });
      newSocket.on('error', (err) => {
        console.error('Socket error:', err);
      });
      newSocket.emit('user_join', {
        userId: user.id,
        userName: user.username
      });
      setSocket(newSocket);
    }
  }, [user, socket]);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register onRegister={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <ChatApp user={user} socket={socket} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
export { API_URL, SOCKET_URL };
