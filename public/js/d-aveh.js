import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const db = getFirestore();

let nameInput = document.getElementById("name");
let typeInput = document.getElementById("type");
let addVehButton = document.getElementById("addVeh");
let formContainer = document.getElementById("formContainer");
let popup = document.getElementById("popup");

// Event listener untuk menambahkan kendaraan
addVehButton.addEventListener("click", async (event) => {
    event.preventDefault(); // Mencegah perilaku default dari form submission

    // Memastikan input nama tidak kosong
    if (nameInput.value.trim() === "") {
        showPopup("Nama tidak boleh kosong!");
        return;
    }

    // Mendapatkan pengguna saat ini
    const user = firebase.auth().currentUser;
    if (!user) {
        // Jika pengguna belum login, arahkan mereka ke halaman login
        window.location.href = "login.html";
        return;
    }

    try {
        // Menambahkan data kendaraan
        await addDocument_AutoID(user.uid);
        // Menampilkan popup data berhasil ditambahkan
        showPopup("Data berhasil ditambahkan");
        // Kosongkan form nama
        nameInput.value = "";
        // Tutup form tambah kendaraan
        toggleForm();
    } catch (error) {
        console.error("Error adding document: ", error);
        showPopup("Terjadi kesalahan saat menambahkan data: " + error.message); // Menampilkan pesan kesalahan
    }
});

// Fungsi untuk menampilkan popup dengan pesan tertentu
function showPopup(message) {
    popup.textContent = message;
    popup.style.display = "block";
    setTimeout(() => {
        popup.style.display = "none";
    }, 3000); // Popup akan hilang setelah 3 detik
}

// Fungsi untuk menambahkan data kendaraan dengan user_id
async function addDocument_AutoID(userID) {
    const ref = collection(db, "Vehicle");

    await addDoc(ref, {
        name: nameInput.value,
        type: typeInput.value,
        status: true,
        user_id: userID
    });
}
