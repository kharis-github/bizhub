// Model untuk user. User integral untuk mengimplementasi authentication dan authorization pada aplikasi kita

// mongoose - Schema dan model design
const mongoose = require('mongoose');
// passport-local-mongoose - tool tambahan yang mempermudah integrasi prograp passport-local dengan mongoose
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// mengintegrasi field-field username dan password menggunakan tool passport-local-mongoose
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);