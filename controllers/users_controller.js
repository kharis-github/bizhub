// Controller untuk requests yang berhubungan dengan model User.

// I | REQUIREMENTS
const User = require('../models/user');

// II | CONTROLLERS

module.exports.register_page = (req, res) => {
    res.render('users/register');
}

module.exports.register_user = async (req, res) => {
    try {
        // 1 | Ambil data dari form
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        // 2 | mengregister user (password di hash, data user disimpan ke database)
        const registeredUser = await User.register(user, password);
        // kalau fase registrasi berhasil:
        // Otomatis meloginkan user baru ke akun mereka menggunakan req.login()
        req.login(registeredUser, function (err) {
            if (err) { return next(err); }
            req.flash('success', "Selamat datang ke BizHub!");
            return res.redirect('/');
        });
    } catch (e) {
        // KALAU GAGAL: flash error dan redirect ke laman registrasi. Pesan error disediakan oleh Passport.js
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.login_page = (req, res) => {
    res.render('users/login');
}

module.exports.login_user = (req, res) => {
    // Jika authentication simsalabim success, flash message success redirect ke mainpage
    req.flash('success', 'Login Sukses!');
    // redirect user ke page sebelum login (jikalau user sblmnya diredirect kesini)
    const redirectUrl = res.locals.returnTo || '/';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Sampai jumpa!');
        res.redirect('/');
    });
}