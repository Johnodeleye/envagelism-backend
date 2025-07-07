const express = require('express');
const router = express.Router();
const { register, getCurrentUser, login, logout } = require('../controllers/auth.controllers');
const auth = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');


// Register route
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, getCurrentUser);

module.exports = router;