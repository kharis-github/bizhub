// DESCRIPTION - Model untuk collection review. Review akan dihubungkan kepada model business dengan

// 1 | Requirements
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 2 | Definisikan Schema
const reviewSchema = new Schema({
    rating: Number,
    review: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

// 3 | Definisikan Model
const Review = mongoose.model('Review', reviewSchema);

// 4 | Export
module.exports = Review;