const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages for a room
router.get('/room/:roomId', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get private messages between two users
router.get('/private/:userId', async (req, res) => {
  try {
    const messages = await Message.find({
      isPrivate: true,
      $or: [
        { sender: req.user.id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user.id }
      ]
    })
    .populate('sender', 'username avatar')
    .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save message
router.post('/', async (req, res) => {
  try {
    const { content, roomId, recipientId, fileUrl, fileName, messageType } = req.body;

    const message = new Message({
      sender: req.user.id,
      senderName: req.user.username,
      content,
      room: roomId || null,
      recipient: recipientId || null,
      fileUrl,
      fileName,
      messageType,
      isPrivate: !!recipientId
    });

    await message.save();
    await message.populate('sender', 'username avatar');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
