const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST-запросы для регистрации и входа
router.post('/register', register);
router.post('/login', login);

module.exports = router;