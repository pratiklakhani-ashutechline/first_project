require('dotenv').config();

const express = require('express');
const path = require('path');
const connectDB = require('./config/db');


const app = express();
const PORT = process.env.PORT || 3000;

// connect database
connectDB();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Page routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
}); 

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// API routes
app.use('/api', require('./routes/productRoutes'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});