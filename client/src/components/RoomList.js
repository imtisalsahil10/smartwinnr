import React from 'react';
import '../styles/Components.css';

const RoomList = ({ rooms, selectedRoom, onSelectRoom }) => {
  return (
    <div className="room-list">
      {rooms.length === 0 ? (
        <p className="empty-message">No rooms available</p>
      ) : (
        rooms.map(room => (
          <div
            key={room._id}
            className={`room-item ${selectedRoom?._id === room._id ? 'active' : ''}`}
            onClick={() => onSelectRoom(room)}
          >
            <div className="room-info">
              <h4>{room.name}</h4>
              <p className="room-desc">{room.description}</p>
            </div>
            <span className="member-count">{room.members?.length || 0}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default RoomList;
