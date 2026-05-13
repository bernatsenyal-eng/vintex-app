const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const authRoutes = require('../backend/routes/auth');
const usersRoutes = require('../backend/routes/users');
const groupsRoutes = require('../backend/routes/groups');
const salesRoutes = require('../backend/routes/sales');
const expensesRoutes = require('../backend/routes/expenses');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'VINTEX backend funcionando',
    env: process.env.NODE_ENV,
    mongoUri: process.env.MONGO_URI ? 'configured' : 'NOT_SET',
    jwtSecret: process.env.JWT_SECRET ? 'configured' : 'NOT_SET',
    frontendUrl: process.env.FRONTEND_URL || 'not set'
  });
});

app.get('/debug', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    mongoUri: process.env.MONGO_URI ? 'SET' : 'NOT_SET',
    jwt: process.env.JWT_SECRET ? 'SET' : 'NOT_SET',
    frontend: process.env.FRONTEND_URL || 'not set',
    mongoose: mongoose.connection.readyState
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/expenses', expensesRoutes);

// Export for Vercel
module.exports = app;
