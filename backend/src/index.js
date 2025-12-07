require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const fs = require('fs');
const path = require('path');

// MongoDB Connection
// We set a flag to track connection status
global.isMongoConnected = false;
global.salesData = [];

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('Connected to MongoDB');
        global.isMongoConnected = true;
    })
    .catch(err => {
        console.error('MongoDB connection error. Falling back to file mode.');
        console.error('Error details:', err.message);
    });

// Load file data as backup
try {
    const dataPath = path.join(__dirname, '../data/sales_data.json');
    if (fs.existsSync(dataPath)) {
        global.salesData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log(`Loaded ${global.salesData.length} records from file (Backup).`);
    }
} catch (error) {
    console.error("Error loading backup data:", error);
}

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
