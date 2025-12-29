import React from 'react';
import '../styles/MessageList.css';

const MessageList = ({ messages, currentUser }) => {
  const isImage = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="empty-messages">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={message._id || index}
            className={`message ${message.sender?._id === currentUser?.id ? 'sent' : 'received'}`}
          >
            <div className="message-sender">
              {message.sender?.username || 'Unknown'}
            </div>
            <div className="message-content">
              {message.messageType === 'image' && message.fileUrl ? (
                <img 
                  src={message.fileUrl} 
                  alt="shared" 
                  className="message-image"
                />
              ) : message.fileUrl && isImage(message.fileUrl) ? (
                <img 
                  src={message.fileUrl} 
                  alt="shared" 
                  className="message-image"
                />
              ) : message.fileUrl ? (
                <a 
                  href={message.fileUrl}
                  download
                  className="file-download"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📎 {message.fileName || 'Download File'}
                  {message.fileSize && <span> ({message.fileSize}KB)</span>}
                </a>
              ) : (
                message.content
              )}
            </div>
            <div className="message-time">
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
