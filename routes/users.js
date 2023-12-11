// I | REQUIREMENTS
// Standard requirements
const express = require('express');
const router = express.Router();
const User = require('../models/user');
// wrapper function untuk menangkap error dari proses asynchronous
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
// Fungsi untuk mengembalikan user ke laman setelah redirect
const { storeReturnTo } = require('../utils/middleware');
// CONTROLLER
const user = require('../controllers/users_controller');

// II | ROUTING

// Halaman registrasi (GET)
router.get('/register', user.register_page)
// Proses Registrasi (POST)
router.post('/register', catchAsync(user.register_user))
// Buka Laman Login
router.get('/login', user.login_page)
// Proses Login (menggunakan simsalabim Passport)
// Login khusus mengembalikan user ke page sebelumnya karena ada kemungkinan user diredirect ke sini 
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: true }), user.login_user)
// Proses Logout (menggunakan simsalabim passport)
router.get('/logout', user.logout)

module.exports = router;