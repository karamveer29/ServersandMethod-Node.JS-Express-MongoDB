
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const urlRoutes = require('./routes/urlRoutes');

const app = express();
const PORT = process.env.PORT || 4011;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Register homepage, creation, deletion and redirect routes
app.use('/', urlRoutes);

mongoose.connection.on('error', error => {
    console.error('❌ MongoDB error:', error.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

async function startServer() {
    try {
        await mongoose.connect(
            'mongodb://127.0.0.1:27017/urlShortenerDB'
        );

        console.log('✅ MongoDB connected successfully!');
        console.log('📦 Database: urlShortenerDB');

        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
            console.log('🔗 URL Shortener is ready!');
        });
    } catch (error) {
        console.error('❌ Startup failed:', error.message);
        process.exitCode = 1;
    }
}

startServer();
