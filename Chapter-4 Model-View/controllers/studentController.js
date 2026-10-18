
const Student = require('../models/Student');

// READ: Display all students
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });

        console.log(`📥 READ: Retrieved ${students.length} student(s)`);

        res.render('students/index', {
            students,
            message: null
        });
    } catch (error) {
        console.error('❌ READ failed:', error.message);
        res.status(500).send('Could not load students.');
    }
};

// CREATE: Add a student
exports.createStudent = async (req, res) => {
    try {
        const { name, age, email, course } = req.body;

        const student = await Student.create({
            name,
            age: Number(age),
            email,
            course
        });

        console.log('✅ CREATE:', student.name, '| ID:', student._id);

        res.redirect('/students');
    } catch (error) {
        console.error('❌ CREATE failed:', error.message);
        res.status(400).send(
            `Could not create student: ${error.message}`
        );
    }
};

// READ: Display edit form
exports.getEditStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).send('Student not found.');
        }

        res.render('students/edit', { student });
    } catch (error) {
        console.error('❌ READ student failed:', error.message);
        res.status(400).send('Invalid student ID.');
    }
};

// UPDATE: Save changes
exports.updateStudent = async (req, res) => {
    try {
        const { name, age, email, course } = req.body;

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { name, age: Number(age), email, course },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).send('Student not found.');
        }

        console.log('✏️ UPDATE:', student.name, '| ID:', student._id);

        res.redirect('/students');
    } catch (error) {
        console.error('❌ UPDATE failed:', error.message);
        res.status(400).send(
            `Could not update student: ${error.message}`
        );
    }
};

// DELETE: Remove a student
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).send('Student not found.');
        }

        console.log('🗑️ DELETE:', student.name, '| ID:', student._id);

        res.redirect('/students');
    } catch (error) {
        console.error('❌ DELETE failed:', error.message);
        res.status(400).send('Could not delete student.');
    }
};
