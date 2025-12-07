require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('Retail Sales Backend is running');
});

// Import Routes
const salesRoutes = require('./routes/salesRoutes');
app.use('/api/sales', salesRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
