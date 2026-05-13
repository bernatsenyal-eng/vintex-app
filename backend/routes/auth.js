const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Group = require('../models/Group');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, groupId: user.groupId } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Join group with invite code
router.post('/join', async (req, res) => {
  const { inviteCode } = req.body;
  const userId = req.user.id; // from auth middleware

  try {
    const group = await Group.findOne({ inviteCode });
    if (!group) return res.status(400).json({ message: 'Invalid invite code' });

    const user = await User.findById(userId);
    if (user.groupId) return res.status(400).json({ message: 'User already in a group' });

    user.groupId = group._id;
    await user.save();

    res.json({ message: 'Joined group', group });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;