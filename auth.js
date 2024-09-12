const express = require('express');
const { login } = require('./authController');
const router = express.Router();

// POST route for login
router.post('/login', login);

module.exports = router;
