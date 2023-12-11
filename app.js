if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
// FILE UTAMA

// I | SEGMENT REQUIRE
// a. Require Libraries & Packages
// Express - framework server webapp
const express = require('express');
const app = express();
// path - khusus konfigurasi reouting file utama
const path = require('path');
// body-parser - memparse data dari HTML form
var bodyParser = require('body-parser')
// mongoose - module integrasi ke MongoDB dengan syntaxing sederhana
const mongoose = require('mongoose');
// ejs - templating engine
const ejs = require('ejs');
// ejs-mate - tambahan ejs untuk menggunakan syntax khusus untuk mengimplementasi partials pada environment ejs
const ejsMate = require('ejs-mate');
// method-override - memapukan HTTP verb yang tidak didukung oleh client.
const methodOverride = require('method-override');
// express-session - implementasi session management pada aplikasi
const session = require('express-session');
// connect-flash - menggunakan flash messages sekitar web app
const flash = require('connect-flash');
// Passport - library yang mengimplementasi authentication pada aplikasi
// standard passport
const passport = require('passport');
// passport strategy local
const localStrategy = require('passport-local');
// SECURITY
// express-mongo-sanitize - mencegah serangan MongoDB injection sederhana
const mongoSanitize = require('express-mongo-sanitize');
// Mongo Session Store -> menggunakan MongoDB sebagai session storage.
const MongoStore = require('connect-mongo');

// b. Require File2 Local
// Utilities - AppError - class inheritance untuk error-handling logic
const AppError = require('./utils/AppError');
// Routing business.js
const businessRoutes = require('./routes/business');
// Routing review.js
const reviewRoutes = require('./routes/review');
// Routing users.js
const userRoutes = require('./routes/users');
// Model User
const User = require('./models/user');

// II | KONFIGURASI WEBAPP
// Aktivasi Server -> menggunakan port yang disediakan oleh hosting service, atau default (3000)
const port = process.env.PORT || "3000";
app.listen(port, () => {
    console.log(`Server berhasil diaktifkan pada port ${port}!`);
})
// Routing file utama - agar aplikasi dapat dijalankan oleh CLI dari direktori manapun.
app.set('views', path.join(__dirname, 'views'));
// Templating Engine - menggunakan EJS
app.set('view engine', 'ejs');
// Menambahkan fungsi ekstra dengan ejs-mate
app.engine('ejs', ejsMate);
// Memungkinkan Express untuk membaca data dari HTML form. Menggunakan library body-parser
app.use(bodyParser.urlencoded({ extended: true }));
// Menggunakan method-override
app.use(methodOverride('_method'));
// Menggunakan express-mongo-sanitize
app.use(mongoSanitize());
// Mongoose Instances - menggunakan DB mongoose untuk data persistence
// MongoDB Atlas URL -> menghubungkan application dengan database MongoDB Atlas. Untuk environment production
const dbUrl = process.env.DB_URL;
// MongoDB Local -> local database. Untuk environment development.
const localDB = 'mongodb://127.0.0.1:27017/bizhub'
// Secret - secret merupakan nilai yang digunakan untuk proses2 yang membutuhkan semacam encryption
const secret = process.env.SECRET || 'inimerupakansebuahrahasia'

// Konfigurasi Session Management
// Mempersiapkan konfigurasi untuk menggunakan MongoDB sebagai session storage
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});
// 1 | Session configuration
const sessionConfig = {
    store, // menggunakan MongoDB sebagai session storage
    name: 'tikusbermatajeli',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
// 2 | Session activation
app.use(session(sessionConfig));
// Mengaktivasi passport untuk user authentication, dan konfigurasi-konfigurasi yang berkaitan
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Mengimplementasi flash messages
app.use(flash());
// Jalin koneksi dengan database mongoDB, dan mengcatch error jikalau tidak berhasil
// cloud DB: dbUrl
async function main() {
    await mongoose.connect(dbUrl);
    console.log('Koneksi ke database berhasil!');
}
main().catch(err => console.log(err));

// III | MIDDLEWARE
// Penyimpanan data pada SESSION STORAGE, agar dapat diakses secara global
app.use((req, res, next) => {
    // flash message ber-key 'success', untuk pesan sukses
    res.locals.success = req.flash('success');
    // flash message ber-key 'error', untuk pesan error
    res.locals.error = req.flash('error');
    // data keberadaan user. id / email / username
    res.locals.currentUser = req.user;
    next();
})
// Static Files -> Express menggunakan file-file yang static, seperti stylesheets dan javascript
app.use(express.static('public'))

// IV | ROUTING
// Gunakan routing untuk mengurusi user authentication (Sign Up, Log In)
app.use('/', userRoutes);
// Gunakan routing /business
app.use('/business', businessRoutes);
// Gunakan routing /business/:id/review
app.use('/business/:id/review', reviewRoutes);
// Laman utama
app.get('/', (req, res) => {
    res.redirect('business/all');
})

// TESTING: MENGGUNAKAN COOKIES
app.get('/sendcookie', (req, res) => {
    res.cookie('cewek', 'Makima');
    res.cookie('laki', 'Denji');
    res.send("SILAHKAN MENIKMATI COOKIEMU!!!");
})

// Error-Handler Terminal - mengendalikan semua error yang disebabkan oleh halaman yang tidak valid (Bad Request Error)
app.all('*', (req, res, next) => {
    next(new AppError('Page Not Found', 404))
})
// Custom ErrorHandler - error-handler ini digunakan untuk menangani error yang diinstansiasi sebagai instance AppError
app.use((err, req, res, next) => {
    // 1 | Preprocessing - masukkan default values bagi error yang kekurangan antara message atau status code
    const { status = 400 } = err;
    if (!err.message) err.message = 'Ya, terjadi masalah yang tidak sedap bung!';
    res.status(status).render('error.ejs', { err });
})