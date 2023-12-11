// Script untuk membuat form seleksi lokasi Provinsi, Kabupaten, dan Kecamatan dinamis

$(document).ready(function () {
    // A | Deklarasi variable-variable lokasi dari data_lokasi.js
    $.getScript("/javascript/data_lokasi.js")
    // B | select `pvs` => setelah provinsi diselect maka dropdown kabupaten diisi sesuai data provinsi
    $("#pvs").change(function () {
        // 1 | Ambil item yang dipilih dari select pvs
        let pvs = $("#pvs").val();
        // Deaktivasi select `kcmt`
        $("#kcmt").prop('disabled', true);
        // Jika item yang dipilih merupakan "--Pilih--", maka nonaktifkan select
        if (pvs == "-") {
            $("#kbpt").prop('disabled', true);
            return;
        }
        // 2 | Kembalikan semua item kabupaten yang berada dalam provinsi `pvs` kedalam array `arrayKbpt`
        // 2.1 | Ambil iso_code korespondensi provinsi yang dipilih dari array provinsi
        var { iso_code } = array_provinsi.find(i => {
            return i.name === pvs
        })
        // 2.2 kembalikan semua kabupaten yang berkaitan dengan provinsi 
        var arrayKbpt = array_kabupaten[iso_code];
        // 3 | Masukkan data kabupaten ke HTML select `kbpt`.
        var stringKbpt = `<option value="-">--Pilih--</option>`;
        for (let k of arrayKbpt) {
            stringKbpt = stringKbpt.concat(`<option value="${k}">${k}</option>`);
        }
        // 4 | Aktifkan #kbpt select dan masukkan data options
        $("#kbpt").prop('disabled', false);
        $("#kbpt").html(stringKbpt); //TODO: Buat program yang mengenerate string untuk dimasukkan ke .html()
    })
    // C | select `kbpt` => setelah kabupaten diselect maka dropdown kecamatan diisi sesuai data kabupaten
    $("#kbpt").change(function () {
        // 1 | Ambil item yang dipilih pada dropdown
        let kbpt = $("#kbpt").val();
        // Jika item yang dipilih merupakan --Pilih--, disable select kecamatan
        if (kbpt == "-") {
            $("#kcmt").prop('disabled', true);
            return;
        }
        kbpt = kbpt.trim().toLowerCase().replace(/\s+/g, '-');
        // 2 | Kembalikan semua kecamatan yang berkaitan dengan item kabupaten (kecamatan dalam kabupaten)
        var arrayKcmt = array_kecamatan[kbpt];
        // 3 | Konversi data kedalam string HTML
        let stringKcmt = `<option value="-">--Pilih--</option>`;
        for (let k of arrayKcmt) {
            stringKcmt = stringKcmt.concat(`<option value="${k}">${k}</option>`);
        }
        // 4 | Masukkan string HTML kedalam dropdown kecamatan
        $("#kcmt").prop('disabled', false);
        $("#kcmt").html(stringKcmt);
    })
});
