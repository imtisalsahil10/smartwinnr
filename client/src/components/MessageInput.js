import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../App';
import { FaPaperclip, FaSmile, FaPaperPlane } from 'react-icons/fa';
import '../styles/MessageInput.css';

const MessageInput = ({ onSendMessage, onTyping, onStopTyping, room, user, socket, onScroll, onFileUpload }) => {
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [uploading, setUploading] = useState(false);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const emojis = ['😀', '😂', '❤️', '👍', '🎉', '👏', '🔥', '💯', '😍', '😎', '🤔', '😢'];

  const handleChange = (e) => {
    setMessage(e.target.value);
    
    // Scroll to bottom as user types
    onScroll?.();
    
    onTyping();
    
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      onStopTyping();
      setShowEmojis(false);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage(message + emoji);
    setShowEmojis(false);
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
          // Let axios set Content-Type automatically for FormData
        }
      });

      if (response.data && response.data.fileUrl) {
        const data = response.data;
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(data.fileName);
        const messageText = isImage ? `📷 ${data.fileName}` : `📎 ${data.fileName}`;
        
        const messageData = {
          roomId: room._id,
          message: messageText,
          senderId: user.id,
          senderName: user.username,
          timestamp: new Date(),
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileSize: data.fileSize,
          messageType: isImage ? 'image' : 'file'
        };

        // Add to UI immediately (optimistic update)
        onFileUpload?.({
          message: messageText,
          messageType: isImage ? 'image' : 'file',
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileSize: data.fileSize
        });

        // Save to database
        await axios.post(`${API_URL}/messages`, {
          content: messageText,
          roomId: room._id,
          messageType: isImage ? 'image' : 'file',
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileSize: data.fileSize
        }).catch(error => console.error('Error saving file message:', error));

        // Emit via socket for real-time (this will trigger receive_message in ChatWindow)
        if (socket) {
          socket.emit('send_message', messageData);
        }

        setMessage('');
        alert('✅ File uploaded successfully!');
      } else {
        throw new Error('Invalid upload response');
      }
    } catch (error) {
      console.error('File upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload file';
      alert(`❌ Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="message-input">
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          title="Select file"
        />
        <button 
          type="button" 
          className="btn-action" 
          title="Attach file"
          onClick={handleAttachmentClick}
        >
          <FaPaperclip />
        </button>
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Type a message..."
          className="input-field"
        />
        <div className="emoji-container">
          <button 
            type="button" 
            className="btn-action" 
            title="Emoji"
            onClick={() => setShowEmojis(!showEmojis)}
          >
            <FaSmile />
          </button>
          {showEmojis && (
            <div className="emoji-picker">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  className="emoji-btn"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="btn-send" title="Send message">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
