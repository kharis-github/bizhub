// DESCRIPTION - Model untuk collection business.

// 1 | Requirements
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// ImageSchema - khusus untuk menyimpan data gambar dengan virtual property
const ImageSchema = new Schema({
    path: String,
    filename: String
})
// Virtual Function `thumbnail` => mengembalikan versi gambar yg lebih kecil melalui API Cloudinary
ImageSchema.virtual('thumbnail').get(function () {
    return this.path.replace('/upload', '/upload/w_200')
})

// configuration khusus: mengubah JSON
const opts = {toJSON: {virtuals: true}};

// 2 | Definisikan Schema
const businessSchema = new Schema({
    name: String,
    category: String,
    description: String,
    provinsi: {
        type: String,
        required: true
    },
    kabupaten: String,
    kecamatan: String,
    address: String,
    postal_code: Number, // kode pos. kode pos hanya boleh mengandung karakter numerik
    phone: Number, // phone number. nomor telepon hanya boleh berupa data numerik
    website: String,
    // geoJSON: data lokasi yang dapet dicari di peta
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    // `image` mengandung sekumpulan object-structure yang terdiri dari URL dan nama image
    images: [ImageSchema],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Review'
    }]
    // TODO: Masukkan properties 'overall_rating' dan 'total_reviews'
}, opts)
// Mengembalikan string untuk geocoding
businessSchema.virtual('addressString').get(function () {
    return `${this.address}, ${this.kecamatan}, ${this.kabupaten}, ${this.provinsi}, Indonesia`;
})
// properties.popUpMarkup -> HTML string yang dapat ditampilkan pada mapbox cluster map di index.ejs
businessSchema.virtual('properties.popUpMarkup').get(function () {
    var text = `<a href="/business/${this._id}"><strong>${this.name}</strong></a>
    <p class="mb-auto">${this.category}</p><small>`;
    // kabupaten dan provinsi
    if(this.kabupaten){
        var kdp = `<p class="mb-auto">${this.kabupaten}, ${this.provinsi}</p></small>`;
    }else var kdp = `<p class="mb-auto">${this.provinsi}</p></small>`;
    return text.concat(kdp);
})

// mongoose Middleware | mendelete semua review yang teraosisasi sama business yang dihapus.
businessSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

// 3 | Definisikan Model dan Export
module.exports = mongoose.model('Business', businessSchema);