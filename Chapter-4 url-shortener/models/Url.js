const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
        trim: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match:  /^[a-zA-Z0-9_-]{3,30}$/
    },
    clicks: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Url', urlSchema);
