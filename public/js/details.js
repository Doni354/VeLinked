// Ambil nilai docId dari URL
const urlParams = new URLSearchParams(window.location.search);
const docId = urlParams.get('docId');

// Fungsi untuk menampilkan data kendaraan
function displayVehicleDetails(vehicleData) {
    // Tampilkan data kendaraan sesuai dengan kebutuhan Anda
    console.log(vehicleData);
    // Contoh: Tampilkan nama kendaraan di dalam elemen dengan ID "vehicleName"
    document.getElementById("vehicleName").textContent = vehicleData.name;
    // Contoh: Tampilkan jenis kendaraan di dalam elemen dengan ID "vehicleType"
    document.getElementById("vehicleType").textContent = vehicleData.type;
    // Contoh: Tampilkan status kendaraan di dalam elemen dengan ID "vehicleStatus"
    document.getElementById("vehicleStatus").textContent = vehicleData.status ? 'Online' : 'Offline';
}

// Fungsi untuk mengambil data kendaraan dari Firestore berdasarkan docId
function getVehicleDetails(docId) {
    // Dapatkan referensi ke dokumen kendaraan dengan docId yang sesuai
    firebase.firestore().collection("Vehicle").doc(docId).get()
        .then(doc => {
            if (doc.exists) {
                // Panggil fungsi untuk menampilkan data kendaraan
                const vehicleData = doc.data();
                displayVehicleDetails(vehicleData);
            } else {
                console.log("No such document!");
            }
        })
        .catch(error => {
            console.error("Error getting document:", error);
        });
}

// Panggil fungsi untuk mendapatkan dan menampilkan detail kendaraan
getVehicleDetails(docId);
