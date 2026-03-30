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
// Page routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// // API routes
app.use('/api', require('./routes/productRoutes'));
app.use('/api', require('./routes/loginRoutes'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
