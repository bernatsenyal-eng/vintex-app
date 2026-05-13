const express = require('express');
const User = require('../models/User');
const Group = require('../models/Group');
const auth = require('../middleware/auth');

const router = express.Router();

// Get users in group
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ groupId: req.user.groupId }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update permissions (admin only)
router.put('/:id/permissions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.groupId.toString() !== req.user.groupId) return res.status(404).json({ message: 'User not found' });

    const admin = await User.findById(req.user.id);
    if (admin.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

    user.permissions = req.body.permissions;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove user from group (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.groupId.toString() !== req.user.groupId) return res.status(404).json({ message: 'User not found' });

    const admin = await User.findById(req.user.id);
    if (admin.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

    user.groupId = null;
    await user.save();
    res.json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;