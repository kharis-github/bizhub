// Controller untuk requests yang berkaitan dengan model Business

// I | REQUIREMENTS
const Business = require('../models/business');
// Data ekstra - Data Lokasi (provinsi, kabupaten, kecamatan), untuk new.ejs
const pvs = require('../seeds/lokasi/provinsi');
// Cloudinary - khusus untuk proses mendelte gambar dari database Cloudinary.
const { cloudinary } = require('../cloudinary/index');

// Mapbox Geocoding -> menggunakan layanan Geocoding oleh Mapbox untuk menampilkan peta berdasarkan lokasi yang diinput oleh user.
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

// II | CONTROLLERS

module.exports.index = (req, res) => {
    res.render('home.ejs');
}

module.exports.all = async (req, res) => {
    const businesses = await Business.find({}); // retrieve semua data
    // render page
    res.render('index.ejs', { businesses });
}

module.exports.filter = async (req, res) => {
    // ambil data kategori dari req.body
    const { filter } = req.body;
    // Kondisi khusus jikalau user memilih `all`
    if (filter === '-') {
        return res.redirect('/');
    }
    // Ambil semua business yg termasuk kategori pilihan user
    const businesses = await Business.find({ category: filter });
    // Render index page menggunakan kategori
    res.render('index.ejs', { businesses })
}

// mengembalikan data `coordinates` untuk keperluan mapbox
module.exports.coordinates = async (req, res) => {
    // Ambil data dari DB
    const biz = await Business.findById(req.params.id);
    res.send(biz.geometry.coordinates);
}

module.exports.render_new = (req, res) => {
    // Jikalau terautentikasi
    res.render('new.ejs', { pvs });
}
// POST || mengupload item Business baru
module.exports.create_business = async (req, res, next) => {
    // 1 | Ambil data form dari request body
    const { general, lokasi, kontak } = req.body;
    const { name, description, category } = general;
    const { provinsi, kabupaten, kecamatan, postal_code, address } = lokasi;
    const { phone, website } = kontak;
    // 2 | Instansiasi business baru
    const biz = Business({
        name, category, description, provinsi, kabupaten, kecamatan, address, postal_code, phone, website
    });
    // 3 | Ambil data geografi menggunakan geocoding
    const geoData = await geocodingClient.forwardGeocode({
        query: biz.addressString,
        limit: 1
    }).send();
    // 4 | Simpan data geoJSON sebagai property `geometry`
    biz.geometry = geoData.body.features[0].geometry;
    // 5 | Simpan ID user
    biz.author = req.user._id;
    // 6 | Simpan data gambar, yang terdiri dari path dan filename
    biz.images = req.files.map(f => ({ path: f.path, filename: f.filename })); // mengembalikan array terdiri dari object.
    // 7 | save, flash message, dan redirect
    await biz.save();
    // buat flash message
    req.flash('success', 'Selamat! Business baru anda berhasil dibuat!');
    // reroute user ke page usaha yang baru saja dibuat.
    res.redirect(`/business/${biz._id}`);
}

module.exports.single = async (req, res) => {
    // return document dari DB berdasarkan ID
    const b = await Business.findById(req.params.id).populate([{
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }, 'author']);
    res.render('single.ejs', { b });
}

module.exports.update_page = async (req, res) => {
    // 1 | mengambil data business yang diupdate
    const b = await Business.findById(req.params.id);
    // 2 | render page dan kirim data business
    res.render('edit.ejs', { b, pvs });
}
// PUT | Update business
module.exports.crud_update = async (req, res) => {
    // TESTING: MENGIMPLEMENTASI IMAGE DELETION
    const { id } = req.params;
    // 1 | ambil data form dari request body
    const { general, lokasi, kontak } = req.body;
    const { name, description, category } = general;
    const { provinsi, kabupaten, kecamatan, postal_code, address } = lokasi;
    const { phone, website } = kontak;
    // 2 | update database
    const biz = await Business.findByIdAndUpdate(id, { name, category, description, provinsi, kabupaten, kecamatan, address, postal_code, phone, website });
    // 3 | untuk penambahan gambar; ambil array gambar, dan letakkan kedalam property Business
    const images = req.files.map(f => ({ path: f.path, filename: f.filename })); // return array of Objects `path` dan `filename`
    // masukkan gambar kedalam property array `images`, lalu simpan perubahan
    biz.images.push(...images); // sama dengan .push({},{});
    await biz.save();
    // 4 | delete gambar dari MongoDB dan Cloudinary jikalau user memilih gambar untuk didelete
    if (req.body.deleteImages) {
        // 4.1 | delete gambar dari Cloudinary
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        // 4.2 | delete gambar dari MongoDB 
        await biz.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    // reroute user ke laman yang sudah diupdate
    req.flash('success', 'Data berhasil diupdate!');
    res.redirect(`/business/${id}`);
}

module.exports.crud_delete = async (req, res) => {
    // Delete data dari database. Data diidentifikasi berdasarkan id
    await Business.findByIdAndDelete(req.params.id);
    // redirect user ke laman index
    res.redirect('/');
}