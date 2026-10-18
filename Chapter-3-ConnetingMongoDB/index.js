
// const mongoose = require('mongoose');
// const Student = require('./student');

// async function main() {
//     try {
//         await mongoose.connect('mongodb://127.0.0.1:27017/schoolDB');

//         console.log('MongoDB connected successfully!');

//         const student = await Student.create({
//             name: 'Karamveer Singh',
//             age: 22,
//             email: 'karamveer@example.com',
//             course: 'Data Science'
//         });

//         console.log('Student saved:', student);

//     } catch (error) {
//         console.error('Error:', error.message);
//     } finally {
//         await mongoose.disconnect();
//     }
// }

// main();
// // myServer.listen(4012, () => {
// //     console.log("Server is running on port 8000");
// // });


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Student = require('./student');

const app = express();
const PORT = 4011;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection status logs
mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connection established');
});

mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/schoolDB')
    .then(() => {
        console.log('✅ MongoDB connected successfully!');

        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
            console.log('📚 Student CRUD API is ready');
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection failed:', error.message);
    });

// READ: Get all students
app.get('/api/students', async (req, res) => {
    console.log('📥 GET /api/students - Fetching all students');

    try {
        const students = await Student.find();

        console.log(`✅ Retrieved ${students.length} student(s)`);
        res.json(students);
    } catch (error) {
        console.error('❌ Error fetching students:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// READ: Get one student by ID
app.get('/api/students/:id', async (req, res) => {
    console.log(`📥 GET /api/students/${req.params.id}`);

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            console.log('⚠️ Student not found');
            return res.status(404).json({ error: 'Student not found' });
        }

        console.log(`✅ Retrieved student: ${student.name}`);
        res.json(student);
    } catch (error) {
        console.error('❌ Error fetching student:', error.message);
        res.status(400).json({ error: 'Invalid student ID' });
    }
});

// CREATE: Add a student
app.post('/api/students', async (req, res) => {
    console.log('📥 POST /api/students - Creating student');

    try {
        const student = await Student.create(req.body);

        console.log('✅ Student created successfully:', student.name);
        console.log('🆔 Student ID:', student._id);

        res.status(201).json(student);
    } catch (error) {
        console.error('❌ Error creating student:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// UPDATE: Edit a student by ID
app.put('/api/students/:id', async (req, res) => {
    console.log(`📥 PUT /api/students/${req.params.id} - Updating student`);

    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            console.log('⚠️ Student not found for update');
            return res.status(404).json({ error: 'Student not found' });
        }

        console.log('✅ Student updated successfully:', student.name);
        res.json(student);
    } catch (error) {
        console.error('❌ Error updating student:', error.message);
        res.status(400).json({ error: 'Invalid student ID or data' });
    }
});

// DELETE: Remove a student by ID
app.delete('/api/students/:id', async (req, res) => {
    console.log(`📥 DELETE /api/students/${req.params.id} - Deleting student`);

    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            console.log('⚠️ Student not found for deletion');
            return res.status(404).json({ error: 'Student not found' });
        }

        console.log('🗑️ Student deleted successfully:', student.name);

        res.json({
            message: 'Student deleted successfully',
            student
        });
    } catch (error) {
        console.error('❌ Error deleting student:', error.message);
        res.status(400).json({ error: 'Invalid student ID' });
    }
});
