// File untuk memisahkan middleware
// I | REQUIREMENTS
const Business = require('../models/business');
const Review = require('../models/review');
const { businessJoiSchema } = require('../models/joi-schemas');
const AppError = require('../utils/AppError');
// II | MIDDLEWARES
// Memvalidasi data business
module.exports.validateBusiness = (req, res, next) => {
    // 1 | ekstraksi nilai2 dari req.body
    const { general, lokasi, kontak } = req.body;
    const { name, description, category } = general;
    let { provinsi, kabupaten, kecamatan, postal_code, address } = lokasi;
    const { phone, website } = kontak;
    // cek untuk data kosong pada field kabupaten dan kecamatan (provinsi harus diisi)
    if(kabupaten === '-'){
        kabupaten = ""; // data kabupaten blank
        kecamatan = ""; // data provinsu blank
    }
    if(kecamatan === '-'){
        kecamatan = "";
    }
    // 2 | Validasi data
    const { error } = businessJoiSchema.validate(
        { name, category, description, provinsi, kabupaten, kecamatan, address, postal_code, phone, website });
    // 4 | cek hasil validasi Joi
    if (error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    }
    else {
        next();
    }
}
// Mengecek jikalau user sudah login untuk mengakses sesuatu
module.exports.isLoggedIn = (req, res, next) => {
    // menggunakan function passport `.isAuthenticated()` 
    if (!req.isAuthenticated()) {
        // 1 | untuk keperluan redirection, simpan URL original pada session storage
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Anda harus login terlebih dahulu!');
        // 2 | redirect user ke laman login
        return res.redirect('/login');
    }
    // Jikalau sudah login: lanjutkan proses seperti biasanya
    next();
}
// Menyimpan URL untuk proses mengembalikan user setelah proses redirection, ke storage res.locals
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
// isAuthor -> mengautorisasi user yang berkeinginan untuk mengubah data business
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    // ambil data business dari database untuk mereferensi author
    const biz = await Business.findById(id);
    // proses authorization
    if (!biz.author.equals(req.user._id)) {
        // hasil authorization negatif => larang user dari mengubah data
        req.flash('error', 'Siapa lo?! Nggak boleh sembarangan ngubah postingan yang bukan milikmu!');
        return res.redirect(`/business/${id}`);
    }
    // hasil authorization positif => jalankan program seperti biasanya
    next();
}
// isReviewAuthor -> mengautorisasi user yang ingin menghapus sebuah komen
module.exports.isReviewAuthor = async (req, res, next) => {
    // ID business dan ID review, diambil dari params
    const { id, revId } = req.params;
    // ambil review
    const rev = await Review.findById(revId);
    // proses authorization
    if (!rev.author.equals(req.user._id)) {
        // hasil authorization negatif -> larang user
        req.flash('error', 'Anda tidak memiliki izin untuk melakukan itu!');
        // redirect kembali
        return res.redirect(`/business/${id}`);
    }
    // hasil authorization positif => jalankan program seperti biasanya
    next();
}