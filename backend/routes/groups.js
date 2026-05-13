const express = require('express');
const Group = require('../models/Group');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create group (first user becomes admin)
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.groupId) return res.status(400).json({ message: 'User already in a group' });

    const inviteCode = Math.random().toString(36).substring(2, 15);
    const group = new Group({ name, adminId: req.user.id, inviteCode });
    await group.save();

    user.groupId = group._id;
    user.role = 'admin';
    await user.save();

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get group info
router.get('/', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.user.groupId);
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate new invite code (admin only)
router.put('/invite', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

    const group = await Group.findById(user.groupId);
    group.inviteCode = Math.random().toString(36).substring(2, 15);
    await group.save();
    res.json({ inviteCode: group.inviteCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;