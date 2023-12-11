// Modularisasi Routing menggunakan Express .Router() untuk route '/business'

// I | REQUIREMENTS
const express = require('express');
const router = express.Router();
// Utilities - catchAsync() - fungsi error-handling yang menjaga proses-proses asynchronous
const catchAsync = require('../utils/catchAsync');
// Utilities - AppError - class inheritance untuk error-handling logic
const AppError = require('../utils/AppError');
// Joi Schema - Joi schemas untuk model-model yang membutuhkan data validation
const { businessJoiSchema } = require('../models/joi-schemas');
// Models
const Business = require('../models/business'); // Business Model
// MIDDLEWARE
// isLoggedIn -> mengecek jikalau user sudah login
// isAuthor -> mengecek jikalau user sudah terautentikasi
const { validateBusiness, isLoggedIn, isAuthor } = require('../utils/middleware');
// Data ekstra - Data Lokasi (provinsi, kabupaten, kecamatan), untuk new.ejs
const pvs = require('../seeds/lokasi/provinsi');
// multer - multer memungkinkan HTML form mengirim data berbentuk file, seperti gambar.
const multer = require('multer');
// SETTING CLOUDINARY
const { storage } = require('../cloudinary/index');
// Destinasi upload data file dengan bantuan package multer
const upload = multer({ storage })

// CONTROLLER
const business = require('../controllers/business_controller');

// II | ROUTES
router.get('/', business.index)
// Businesses -> menampilkan semua document business dari DB. (catchAsync-ed)
router.get('/all', catchAsync(business.all))
// Businesses Filtered by Category -> hanya menampilkan business-business berdasarkan kategori
router.post('/filter', catchAsync(business.filter))
// Mengembalikan data coordinates untuk peta Mapbox
router.get('/coordinates/:id', business.coordinates)
// ROUTING - CRUD BUSINESS 

router.route('/new')
    .get(isLoggedIn, business.render_new) // Add New Business (GET) -> membuat item business baru
    .post(isLoggedIn, upload.array('image'), validateBusiness, catchAsync(business.create_business)) // Add New Business (POST) -> membuat item business baru (catchAsync-ed)
router.route('/:id')
    .get(catchAsync(business.single)) // Single Business -> menampilkan satu business sendiri (catchAsync-ed)
    .put(isLoggedIn, isAuthor, upload.array('image'), validateBusiness, catchAsync(business.crud_update)) // Update Existing Business (PUT) -> jalankan CRUD update
    .delete(isLoggedIn, isAuthor, catchAsync(business.crud_delete)) // Delete Existing Businesses -> menghapus business dari database (catchAsync-ed)

// Update Existing Business (GET) -> render laman update
router.get('/:id/update', isLoggedIn, isAuthor, catchAsync(business.update_page))

module.exports = router;