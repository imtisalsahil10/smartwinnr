import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import '../styles/ChatWindow.css';

const ChatWindow = ({ room, user, socket }) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    localStorage.setItem('currentRoomId', room._id);
  }, [room]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      // Only add if not already in state (avoid duplicates from optimistic updates)
      setMessages(prev => {
        const messageExists = prev.some(msg => 
          msg.sender?._id === data.senderId && 
          msg.content === data.message &&
          Math.abs(new Date(msg.createdAt).getTime() - new Date(data.timestamp).getTime()) < 1000
        );
        
        if (messageExists) {
          return prev; // Message already in state, don't add duplicate
        }
        
        return [...prev, {
          _id: new Date().getTime(),
          sender: { _id: data.senderId, username: data.senderName },
          content: data.message,
          createdAt: data.timestamp,
          messageType: data.messageType || 'text',
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileSize: data.fileSize
        }];
      });
    };

    const handleUserTyping = (data) => {
      setTyping(data.userName);
    };

    const handleUserStopTyping = () => {
      setTyping(null);
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 0);
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/room/${room._id}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = (messageContent) => {
    if (messageContent.trim()) {
      const messageData = {
        _id: new Date().getTime(),
        sender: { _id: user.id, username: user.username },
        content: messageContent,
        createdAt: new Date(),
        messageType: 'text'
      };

      // Add message to local state immediately (optimistic update)
      setMessages(prev => [...prev, messageData]);

      // Save to database
      axios.post('http://localhost:5000/api/messages', {
        content: messageContent,
        roomId: room._id,
        messageType: 'text'
      }).catch(error => {
        console.error('Error saving message:', error);
        // Remove message from state if save fails
        setMessages(prev => prev.filter(msg => msg._id !== messageData._id));
      });

      // Emit via socket to broadcast to other users
      socket.emit('send_message', {
        roomId: room._id,
        message: messageContent,
        senderId: user.id,
        senderName: user.username,
        timestamp: new Date(),
        messageType: 'text'
      });
    }
  };

  const handleTyping = () => {
    socket.emit('typing', {
      roomId: room._id,
      userName: user.username
    });
  };

  const handleStopTyping = () => {
    socket.emit('stop_typing', {
      roomId: room._id
    });
  };

  const handleFileUpload = (fileData) => {
    // Add file message to local state immediately (optimistic update)
    const messageData = {
      _id: new Date().getTime(),
      sender: { _id: user.id, username: user.username },
      content: fileData.message,
      createdAt: new Date(),
      messageType: fileData.messageType,
      fileUrl: fileData.fileUrl,
      fileName: fileData.fileName,
      fileSize: fileData.fileSize
    };
    
    setMessages(prev => [...prev, messageData]);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>{room.name}</h2>
        <p className="room-description">{room.description}</p>
      </div>
      <div className="messages-container">
        <MessageList messages={messages} currentUser={user} />
        <div ref={messagesEndRef} />
      </div>
      {typing && <div className="typing-indicator">{typing} is typing...</div>}
      <MessageInput 
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
        onFileUpload={handleFileUpload}
        room={room}
        user={user}
        socket={socket}
        onScroll={scrollToBottom}
      />
    </div>
  );
};

export default ChatWindow;
