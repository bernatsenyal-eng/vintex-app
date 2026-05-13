const express = require('express');
const Sale = require('../models/Sale');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get sales for group
router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.find({ groupId: req.user.groupId }).populate('userId', 'name');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add sale
router.post('/', auth, async (req, res) => {
  const { item, buyPrice, salePrice, date } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin' && !user.permissions.canEditSales) return res.status(403).json({ message: 'Not authorized' });

    const sale = new Sale({ userId: req.user.id, groupId: req.user.groupId, item, buyPrice, salePrice, date });
    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete sale
router.delete('/:id', auth, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale || sale.groupId.toString() !== req.user.groupId) return res.status(404).json({ message: 'Sale not found' });

    const user = await User.findById(req.user.id);
    if (user.role !== 'admin' && !user.permissions.canEditSales) return res.status(403).json({ message: 'Not authorized' });

    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sale deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;