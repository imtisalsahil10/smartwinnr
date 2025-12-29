const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('creator', 'username')
      .populate('members', 'username');
    res.json(rooms);
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ message: 'Room name already exists' });
    }
    res.status(500).json({ message: error.message || 'Failed to create room' });
  }
});

// Get single room
router.get('/:roomId', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
      .populate('creator', 'username')
      .populate('members', 'username');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create room
router.post('/', async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;

    const room = new Room({
      name,
      description,
      creator: req.user.id,
      members: [req.user.id],
      isPrivate: isPrivate || false
    });

    await room.save();
    await room.populate('creator', 'username');
    // Broadcast room creation to all connected clients
    const io = req.app.get('io');
    if (io) {
      io.emit('room_created', room);
    }

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join room
router.post('/:roomId/join', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.members.includes(req.user.id)) {
      room.members.push(req.user.id);
      await room.save();
    }

    await room.populate('members', 'username');
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Leave room
router.post('/:roomId/leave', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.members = room.members.filter(memberId => !memberId.equals(req.user.id));
    await room.save();

    res.json({ message: 'Left room successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
