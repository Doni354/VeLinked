// Fungsi untuk menampilkan data kendaraan
function displayVehicleCard(vehicleData, docId) {
    // Dapatkan elemen container untuk menempatkan kartu kendaraan
    const vehicleDetailsRow = document.querySelector(".vehicleDetailsRow");

    // Buat elemen div untuk kartu kendaraan
    const vehicleCard = document.createElement("div");
    vehicleCard.classList.add("vehicleCard");

    // Buat elemen div untuk konten kartu kendaraan
    const vehicleCardContent = document.createElement("div");
    vehicleCardContent.classList.add("vehicleCardContent");

    // Buat elemen div untuk informasi kendaraan
    const vehicleInfo = document.createElement("div");
    vehicleInfo.classList.add("vehicleInfo");

    // Buat elemen div untuk teks kendaraan
    const vehicleText = document.createElement("div");
    vehicleText.classList.add("vehicleText");

    // Buat elemen h3 untuk judul kendaraan
    const vehicleTitle = document.createElement("h3");
    vehicleTitle.classList.add("vehicleTitle");
    vehicleTitle.textContent = vehicleData.name;

    // Buat elemen h5 untuk label total pengguna
    const usersTotalLabel = document.createElement("h5");
    usersTotalLabel.classList.add("usersTotalLabel");
    usersTotalLabel.textContent = "Total users";

    // Tambahkan elemen judul dan label ke dalam div teks kendaraan
    vehicleText.appendChild(vehicleTitle);
    vehicleText.appendChild(usersTotalLabel);

    // Buat elemen img untuk thumbnail kendaraan
    const vehicleThumbnail = document.createElement("img");
    vehicleThumbnail.classList.add("vehicleThumbnail");
    vehicleThumbnail.src = `assets/images/${vehicleData.type}.svg`;

    // Tambahkan elemen teks dan thumbnail ke dalam div informasi kendaraan
    vehicleInfo.appendChild(vehicleText);
    vehicleInfo.appendChild(vehicleThumbnail);

    // Buat elemen div untuk baris status
    const statusRow = document.createElement("div");
    statusRow.classList.add("statusRow");

    // Buat elemen img untuk ikon status
    const statusIcon = document.createElement("img");
    statusIcon.classList.add("statusIcon");
    statusIcon.src = `assets/images/${vehicleData.status ? 'online' : 'offline'}.svg`;

    // Buat elemen div untuk label status
    const statusLabel = document.createElement("div");
    statusLabel.classList.add("statusLabel");
    statusLabel.textContent = vehicleData.status ? 'Online' : 'Offline';

    // Tambahkan ikon status dan label status ke dalam baris status
    statusRow.appendChild(statusIcon);
    statusRow.appendChild(statusLabel);

    // Tambahkan div informasi kendaraan dan baris status ke dalam konten kartu kendaraan
    vehicleCardContent.appendChild(vehicleInfo);
    vehicleCardContent.appendChild(statusRow);

    // Tambahkan konten kartu kendaraan ke dalam kartu kendaraan
    vehicleCard.appendChild(vehicleCardContent);

    // Tambahkan event listener untuk menangani klik pada kartu kendaraan
    vehicleCard.addEventListener("click", () => {
        // Redirect pengguna ke halaman details.html dengan mengirim nama dokumen (doc) sebagai parameter URL
        window.location.href = `details.html?docId=${encodeURIComponent(docId)}`;
    });

    // Tambahkan kartu kendaraan ke dalam container kendaraan
    vehicleDetailsRow.appendChild(vehicleCard);
}

// Fungsi untuk memuat dan menampilkan data kendaraan dari Firestore
function loadAndDisplayVehicles() {
    // Dapatkan pengguna yang sedang login
    const user = firebase.auth().currentUser;

    // Periksa apakah pengguna sedang login
    if (!user) {
        // Jika tidak ada pengguna yang login, redirect ke halaman login
        window.location.href = "login.html";
        return;
    }

    // Dapatkan referensi ke koleksi kendaraan di Firestore
    const vehiclesRef = firebase.firestore().collection("Vehicle").where("user_id", "==", user.uid);

    // Dapatkan elemen container untuk menempatkan kartu kendaraan
    const vehicleDetailsRow = document.querySelector(".vehicleDetailsRow");

    // Mendengarkan perubahan pada koleksi kendaraan
    vehiclesRef.onSnapshot(snapshot => {
        // Kosongkan elemen container sebelum menampilkan data baru
        vehicleDetailsRow.innerHTML = "";

        // Iterasi setiap dokumen untuk menampilkan kartu kendaraan
        snapshot.forEach(doc => {
            const vehicleData = doc.data();
            const docId = doc.id; // Dapatkan ID dokumen (doc)
            displayVehicleCard(vehicleData, docId);
        });
    }, error => {
        console.error("Error fetching vehicles:", error);
    });
}

// Event listener untuk memuat dan menampilkan data kendaraan saat konten dimuat
document.addEventListener("DOMContentLoaded", event => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Jika pengguna sudah login, tampilkan kendaraan
            loadAndDisplayVehicles();
        } else {
            // Jika pengguna belum login, redirect ke halaman login
            window.location.href = "login.html";
        }
    });
});
