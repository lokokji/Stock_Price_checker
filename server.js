const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect('mongodb://localhost:27017/stock-price-checker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Route untuk root path (/)
app.get('/', (req, res) => {
  res.send('Hello, welcome to the Stock Price Checker API!');
});

// Routes
app.use('/api', apiRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
