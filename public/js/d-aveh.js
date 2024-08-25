import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";
import { getDatabase, ref as dbRef, set, push } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const storage = getStorage();
const rtdb = getDatabase();  // Realtime Database

let brandInput = document.getElementById("brand");
let emailInput = document.getElementById("email");
let nickInput = document.getElementById("nickname");
let plateInput = document.getElementById("plate");
let nameInput = document.getElementById("name");
let typeInput = document.getElementById("type");
let addVehButton = document.getElementById("addVeh");
let formContainer = document.getElementById("formContainer");
let popup = document.getElementById("popup");
let picInput = document.getElementById("pic");
let fileNameSpan = document.getElementById("file-name");
let picPreview = document.getElementById("pic-preview");

// Update file name display and preview image when a file is selected
picInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        fileNameSpan.textContent = file.name;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            picPreview.src = e.target.result;
            picPreview.style.width = '25px';
            picPreview.style.height = '25px';
        };
        reader.readAsDataURL(file);
    }
});

// Event listener untuk mengubah input plat nomor menjadi huruf kapital
plateInput.addEventListener('input', (event) => {
    plateInput.value = plateInput.value.toUpperCase();
});

// Event listener untuk menambahkan kendaraan
addVehButton.addEventListener("click", async (event) => {
    event.preventDefault(); // Mencegah perilaku default dari form submission

    if (nickInput.value.trim() === "") {
        showPopup("NickName tidak boleh kosong!");
        return;
    }
    
    if (typeInput.value.trim() === "") {
        showPopup("Kamu harus memilih tipe kendaraan!");
        return;
    }

    if (brandInput.value.trim() === "") {
        showPopup("Kamu harus memilih Brand Kendaraan!");
        return;
    }

    if (nameInput.value.trim() === "") {
        showPopup("Nama tidak boleh kosong!");
        return;
    }

    if (plateInput.value.trim() === "") {
        showPopup("Nomor Plat tidak boleh kosong!");
        return;
    }

    const user = firebase.auth().currentUser;
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {
        showPopup("Data sedang diproses...");

        let pictureURL = "";
        if (picInput.files.length > 0) {
            pictureURL = await uploadPicture(picInput.files[0]);
        }

        await addDocument_AutoID(user.uid, pictureURL);
        showPopup("Data berhasil ditambahkan");
        clearForm();
        toggleForm();
    } catch (error) {
        console.error("Error adding document: ", error);
        showPopup("Terjadi kesalahan saat menambahkan data: " + error.message);
    }
});

async function uploadPicture(file) {
    const storageReference = storageRef(storage, 'Vehicle/Image/' + file.name);
    await uploadBytes(storageReference, file);
    return await getDownloadURL(storageReference);
}

function showPopup(message) {
    popup.textContent = message;
    popup.style.display = "block";
    setTimeout(() => {
        popup.style.display = "none";
    }, 3000);
}

async function addDocument_AutoID(userID, pictureURL) {
    // Menghasilkan key baru untuk data di Realtime Database
    const newVehRef = push(dbRef(rtdb, 'Vehicle'));

    // Menambahkan data ke Realtime Database
    await set(newVehRef, {
        nickname: nickInput.value,
        name: nameInput.value,
        type: typeInput.value,
        brand: brandInput.value,
        engine_status: false,
        plate: plateInput.value,
        email: emailInput.value,
        picture: pictureURL,
        user_id: userID
    });
}

function clearForm() {
    nickInput.value = "";
    nameInput.value = "";
    typeInput.value = "";
    brandInput.value = "";
    plateInput.value = "";
    emailInput.value = "";
    fileNameSpan.textContent = "No picture chosen (optional)";
    picInput.value = "";
    picPreview.src = "assets/images/Input-vehpic.svg"; // reset preview image to default
    picPreview.style.width = 'auto'; // reset width
    picPreview.style.height = 'auto'; // reset height
}
