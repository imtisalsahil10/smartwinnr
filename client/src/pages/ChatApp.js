import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../App';
import RoomList from '../components/RoomList';
import ChatWindow from '../components/ChatWindow';
import UserList from '../components/UserList';
import { FaSignOutAlt, FaPlus } from 'react-icons/fa';
import '../styles/ChatApp.css';

const ChatApp = ({ user, socket, onLogout }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [newRoomData, setNewRoomData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('users_list', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('users_list');
    };
  }, [socket]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/rooms`);
      setRooms(response.data);
      if (response.data.length > 0) {
        setSelectedRoom(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/rooms`, newRoomData);
      setRooms([...rooms, response.data]);
      setNewRoomData({ name: '', description: '' });
      setShowNewRoom(false);
      setSelectedRoom(response.data);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      const response = await axios.post(`${API_URL}/rooms/${roomId}/join`);
      setSelectedRoom(response.data);
      socket.emit('join_room', roomId);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const handleSelectRoom = (room) => {
    if (selectedRoom?.id !== room._id) {
      if (selectedRoom) {
        socket.emit('leave_room', selectedRoom._id);
      }
      setSelectedRoom(room);
      socket.emit('join_room', room._id);
    }
  };

  return (
    <div className="chat-app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>SmartWinnr Chat</h1>
          <div className="header-actions">
            <button className="btn-icon" onClick={() => setShowNewRoom(!showNewRoom)} title="Create Room">
              <FaPlus />
            </button>
            <button className="btn-icon logout" onClick={onLogout} title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        {showNewRoom && (
          <form className="new-room-form" onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Room name"
              value={newRoomData.name}
              onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newRoomData.description}
              onChange={(e) => setNewRoomData({ ...newRoomData, description: e.target.value })}
            />
            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowNewRoom(false)}>Cancel</button>
          </form>
        )}

        <div className="sidebar-section">
          <h3>Chat Rooms</h3>
          <RoomList 
            rooms={rooms} 
            selectedRoom={selectedRoom}
            onSelectRoom={handleSelectRoom}
          />
        </div>

        <div className="sidebar-section">
          <h3>Online Users ({onlineUsers.length})</h3>
          <UserList users={onlineUsers} currentUser={user} />
        </div>
      </div>

      <div className="main-content">
        {selectedRoom ? (
          <ChatWindow 
            room={selectedRoom} 
            user={user} 
            socket={socket}
          />
        ) : (
          <div className="no-room-selected">
            <p>Select a room to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
