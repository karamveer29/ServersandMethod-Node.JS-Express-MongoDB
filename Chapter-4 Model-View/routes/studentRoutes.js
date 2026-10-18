
const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');

// READ
router.get('/', studentController.getStudents);
router.get('/:id/edit', studentController.getEditStudent);

// CREATE
router.post('/', studentController.createStudent);

// UPDATE
router.post('/:id/update', studentController.updateStudent);

// DELETE
router.post('/:id/delete', studentController.deleteStudent);

module.exports = router;
