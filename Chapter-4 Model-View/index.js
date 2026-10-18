
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = 4012;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Home page
app.get('/', (req, res) => {
    res.redirect('/students');
});

// Student routes
app.use('/students', studentRoutes);

// MongoDB connection
mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

mongoose.connect('mongodb://127.0.0.1:27017/schoolDB')
    .then(() => {
        console.log('✅ MongoDB connected successfully!');

        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
            console.log('📚 MVC Student Management System is ready');
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exitCode = 1;
    });
