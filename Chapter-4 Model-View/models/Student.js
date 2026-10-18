const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 1
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    course: {
        type: String,
        default: 'Computer Science',
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
