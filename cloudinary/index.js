const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1 | CLOUDINARY CREDENTIALS CONFIG: Configuration object untuk informasi layanan Cloudinary program
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// 2 | STORAGE CONFIG: Configuration object untuk konfigurasi storage Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'BizHub',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});
// EXPORT
module.exports = {
    cloudinary,
    storage
}