const express = require('express');
const Expense = require('../models/Expense');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get expenses for group
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ groupId: req.user.groupId }).populate('userId', 'name');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add expense
router.post('/', auth, async (req, res) => {
  const { category, desc, amount, date } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin' && !user.permissions.canEditExpenses) return res.status(403).json({ message: 'Not authorized' });

    const expense = new Expense({ userId: req.user.id, groupId: req.user.groupId, category, desc, amount, date });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense || expense.groupId.toString() !== req.user.groupId) return res.status(404).json({ message: 'Expense not found' });

    const user = await User.findById(req.user.id);
    if (user.role !== 'admin' && !user.permissions.canEditExpenses) return res.status(403).json({ message: 'Not authorized' });

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;