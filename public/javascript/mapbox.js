// Request data coordinates dari server-side
// kirim get request ke server
var coordinates; // kordinat untuk peta
// 1 | Request kordinat data dari database
$.get(`/business/coordinates/${bizId}`, function (data) {
    // Jika belum ada data:
    if (data.length == 0) {
        coordinates = [-74.5, 40];
    }
    else {
        coordinates = data;
    }
    // 2 | Tampilkan data pada peta
    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: coordinates, // starting position, berdasarkan data geometry
        zoom: 12, // starting zoom
    });

    // Menambahkan kontrol ekstra untuk peta
    map.addControl(new mapboxgl.NavigationControl());

    new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map)
});