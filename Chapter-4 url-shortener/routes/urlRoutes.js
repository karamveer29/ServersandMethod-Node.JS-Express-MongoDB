const express = require('express');
const router = express.Router();

const urlController = require('../controllers/urlController');
// Homepage
router.get('/', urlController.getHome);

// create short URL
router.post('/shorten', urlController.createUrl);

// Delete saved URL
router.post('/delete/:id', urlController.deleteUrl);

// Redirect short codes
router.get('/:code', urlController.redirectUrl);

module.exports = router;