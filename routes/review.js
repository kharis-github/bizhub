// Modularisasi Routing menggunakan Express .Router() untuk route '/business/:id/review'

// I | REQUIREMENTS
const express = require('express');
const router = express.Router({ mergeParams: true });
// Utilities - catchAsync() - fungsi error-handling yang menjaga proses-proses asynchronous
const catchAsync = require('../utils/catchAsync');
// Utilities - AppError - class inheritance untuk error-handling logic
const AppError = require('../utils/AppError');
// Joi Schema - Joi schemas untuk model-model yang membutuhkan data validation
const { reviewJoiSchema } = require('../models/joi-schemas');
// Models
const Business = require('../models/business'); // Business Model
const Review = require('../models/review'); // Review Model
// Authentication - isLoggedIn -> middleware untuk mencegah user mengakses suatu fitur kecuali sudah login
const { isLoggedIn, isReviewAuthor } = require('../utils/middleware');
// CONTROLLER
const review = require('../controllers/review_controller');

// II | MIDDLEWARE
// validateReview -> memvalidasi data review
const validateReview = (req, res, next) => {
    // 1 | Validasi Data menggunakan schema Joi review
    const { error } = reviewJoiSchema.validate(req.body);
    // 2 | Control Flow - control program berdasarkan hasil validation
    if (error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    }
    else {
        next();
    }
}
// isReviewAuthor -> mengautorisasi user yang ingin menghapus sebuah komen


// III | ROUTING
// Menambahkan Review Kepada Suatu Business
router.post('/', isLoggedIn, validateReview, catchAsync(review.add_review))
// Delete Review dari Suatu Laman Business
router.delete('/:revId', isLoggedIn, isReviewAuthor, catchAsync(review.delete_review))

module.exports = router;