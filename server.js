require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const mailRoutes = require('./routes/mail');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS (allow all origins)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  optionsSuccessStatus: 204,
}));
app.options('*', cors()); // handle preflight
app.use(express.json());

// Serve frontend
// app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API routes
app.use('/api/mail', mailRoutes);

// Fallback to frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
