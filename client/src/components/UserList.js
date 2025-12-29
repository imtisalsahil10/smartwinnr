import React from 'react';
import '../styles/Components.css';

const UserList = ({ users, currentUser }) => {
  const otherUsers = users.filter(u => u.userId !== currentUser?.id);

  return (
    <div className="user-list">
      {otherUsers.length === 0 ? (
        <p className="empty-message">No other users online</p>
      ) : (
        otherUsers.map(user => (
          <div key={user.socketId} className="user-item">
            <div className="user-avatar">{user.userName.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <h4>{user.userName}</h4>
              <span className="online-badge">● Online</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserList;
