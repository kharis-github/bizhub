// Seeding merupakan fitur tambahan yang hanya berguna pada masa App Development untuk mengenerate filler data.

// a | REQUIRE
// Membutuhkan .env untuk menggunakan MAPBOX_TOKEN
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
// mongoose - module integrasi ke MongoDB dengan syntaxing sederhana
const mongoose = require('mongoose');
// Model Business - jenis data yang ingin kita generate
const Business = require('../models/business');
// Model Review
const Review = require('../models/review');
// seedApps - program khusus untuk mengenerate document Business baru
const createBusiness = require('./seedApps');
// Mapbox Geocoding -> menggunakan layanan Geocoding oleh Mapbox untuk menampilkan peta berdasarkan lokasi yang diinput oleh user.
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

// b | PREREQ
// Jalin koneksi dengan database mongoDB
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/bizhub');
}
main();

// Membuat document (row MongoDB) baru, dan menyimpannya kedalam database
const seed50 = async () => {
    // 1 | Kosongkan database. Kita akan memperbarui collection setiap kali melakukan proses seeding
    await Business.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 50; i++) {
        // 2 | Define attributes yang disimpan di object menggunakan fungsi createBusiness
        const bizAtt = createBusiness();
        // 3 | Instantiate Business baru menggunakan attribute-attribute yang didefine oleh createBusiness()
        // 4 | Generate data geometry berdasarkan property-property lokasi
        const geoData = await geocodingClient.forwardGeocode({
            query: `${bizAtt.address}, ${bizAtt.kecamatan}, ${bizAtt.kabupaten}, ${bizAtt.provinsi}, Indonesia`,
            limit: 1
        }).send();
        // 5 | dengan secara selang-seling set author antara 2 user
        const author = i % 2 != 0 ? '656e82f9a785c22d29ff825f' : '656eaac9320f5e165658a5da';
        // 5.b | konstruksi data
        const biz = new Business({
            name: bizAtt.name,
            category: bizAtt.category,
            description: bizAtt.description,
            provinsi: bizAtt.provinsi,
            kabupaten: bizAtt.kabupaten,
            kecamatan: bizAtt.kecamatan,
            address: bizAtt.address,
            postal_code: bizAtt.postal_code,
            phone: bizAtt.phone,
            website: bizAtt.website,
            geometry: geoData.body.features[0].geometry,
            // gambar setiap seed sama, dan bernama 'picture'
            images: [{
                path: 'https://images.unsplash.com/photo-1485612416944-3da3e5fd3c3e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                filename: 'picture'
            }],
            author
        })
        // 4 | Simpan data kedalam database. (async func)
        await biz.save();
    }
}

seed50();