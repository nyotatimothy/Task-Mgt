const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Task Management API is running!' });
});

// Basic task routes for initial scaffolding
app.get('/api/tasks', (req, res) => {
  res.json({ success: true, data: [] });
});

app.post('/api/tasks', (req, res) => {
  res.json({ success: true, message: 'Task endpoint ready' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
