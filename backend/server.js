const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const notesRouter = require('./routes/notes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/notes-app';

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' })); // Limit body size

// Routes
app.use('/api/notes', notesRouter);

app.get('/', (req, res) => {
  res.send('Notes App API is running');
});

// Database Connection
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = app; // Export for testing
