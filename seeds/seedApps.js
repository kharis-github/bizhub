// Document operasional untuk fungsi seeding. Ini termasuk fungsi-fungsi menggenerate fields.

// 1 | Requirements
const kabupaten_dan_kecamatan = require('./lokasi/kabupaten-dan-kecamatan'); // object kabpt. dan kelrh.
const provinsi_dan_kabupaten = require('./lokasi/provinsi-dan-kabupaten'); // object provs. dan kabpt.
const provinsi_object = require('./lokasi/provinsi'); // array provinsi

const createBusiness = function () {
    // 2 | Struktur data 'businesses'

    // 1. business_id => Ditentukan oleh mongoose

    // 2. name
    const name = "Harjamukti's Shop";

    // 3. category - array String
    const categoryList = [
        "Kuliner",
        "Fashion dan Kecantikan",
        "Pendidikan dan Pelatihan",
        "Teknologi dan Kreativitas",
        "Pertanian dan Agribisnis",
        "Kerajinan Tangan",
        "Pariwisata",
        "Kesehatan dan Kesejahteraan",
        "Perdagangan",
        "Layanan Sosial"
    ]
    // 3.a ambil secara random salah satu category
    const category = categoryList[Math.floor(Math.random() * categoryList.length)];

    // 4. description - Placeholder Text
    const description = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla dicta excepturi cum ut beatae quibusdam porro! Placeat eaque iusto blanditiis hic delectus non doloribus repudiandae quia quisquam, eius esse magnam? Doloremque corrupti reprehenderit, facere adipisci architecto iste sint, inventore omnis ex voluptates neque laudantium, ea ipsum eum. Sint, eius quisquam.";

    // 5. provinsi - Dari folder lokasi. Menggunakan random number generator
    const rProvinsi = Math.floor(Math.random() * provinsi_object.length);
    const provinsi = provinsi_object[rProvinsi]["name"]; // ambil provinsi secara acak
    const iso_code = provinsi_object[rProvinsi]["iso_code"]; // iso_code hanya digunakan untuk mengidentifikasi properti `kabupaten`

    // 6. kabupaten - Dari folder lokasi. Berdasarkan data provinsi yang didapatkan dari attribute sblmnya
    const arrayKabupaten = provinsi_dan_kabupaten[iso_code]; // memgembalikan n item dari array yang diidentifikasi berdasaran iso_code
    const kabupaten = arrayKabupaten[Math.floor(Math.random() * arrayKabupaten.length)]; // ambil kabupaten secara acak

    // 7. kecamatan
    // 7.a karena format penamaan kabupaten dari Object provinsi_dan_kabupaten berbeda dgn pada kabupaten_dan_kecamatan, maka harus dikonversi menggunakan regular expression.
    const arrayKecamatan = kabupaten_dan_kecamatan[kabupaten.replace(/\s+/g, '-').toLowerCase()];
    // 7.b ambil secara random kecamatan dari arrayKecamatan.
    const kecamatan = arrayKecamatan[Math.floor(Math.random() * arrayKecamatan.length)];

    // 8. address - alamat
    // Struktur address: jalan, nomor, rt, rw, kelurahan, kecamatan/kota, kabupaten, provinsi, kode_pos
    const addressObject = {
        jalan: "",
        nomor: "",
        rt: "",
        rw: "",
        kode_pos: ""
    }
    // bentuk string array berdasarkan data yang disimpan pada Object 'addressObject' (untuk sekarang dikosongkan)
    const address = ``;

    // 9. postal_code
    const postal_code = "16515";

    // 10. phone
    const phone = "081274991740";

    // 11. website
    const website = "www.harjamuktisshop.com";

    // 3 | Penempatan File-File Kedalam Object, yang akan direturn
    return businessAttributes = {
        name: name,
        category: category,
        description: description,
        provinsi: provinsi,
        kabupaten: kabupaten,
        kecamatan: kecamatan,
        address: address,
        postal_code: postal_code,
        phone: phone,
        website: website
    }
}

// 4 | Export fungsi
module.exports = createBusiness;