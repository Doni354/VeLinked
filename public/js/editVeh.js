

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

const form = document.getElementById('vehicleForm');
const nicknameInput = document.getElementById('nickname');
const typeSelect = document.getElementById('type');
const brandSelect = document.getElementById('brand');
const nameInput = document.getElementById('name');
const plateInput = document.getElementById('plate');
const emailInput = document.getElementById('email');
const picInput = document.getElementById('pic');
const picPreview = document.getElementById('pic-preview');
const fileName = document.getElementById('file-name');
const popup = document.getElementById('popup');

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const docId = getParameterByName('docId');
const vehicleDocRef = doc(db, "Vehicle", docId);

async function fetchVehicleData() {
    try {
        const docSnap = await getDoc(vehicleDocRef);
        if (docSnap.exists()) {
            const vehicleData = docSnap.data();
            nicknameInput.value = vehicleData.nickname || '';
            typeSelect.value = vehicleData.type || '';
            brandSelect.value = vehicleData.brand || '';
            nameInput.value = vehicleData.name || '';
            plateInput.value = vehicleData.plate || '';
            emailInput.value = vehicleData.email || '';
            if (vehicleData.picture) {
                picPreview.src = vehicleData.picture;
                picPreview.style.width = '25px';
                picPreview.style.height = '25px';
                fileName.textContent = 'Picture chosen';
            }
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

fetchVehicleData();

picInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        fileName.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            picPreview.src = e.target.result;
            picPreview.style.width = '25px';
            picPreview.style.height = '25px';
        };
        reader.readAsDataURL(file);
    } else {
        picPreview.src = 'assets/images/Input-vehpic.svg';
        picPreview.style.width = 'auto';
        picPreview.style.height = 'auto';
        fileName.textContent = 'No picture chosen (optional)';
    }
});

plateInput.addEventListener('input', (event) => {
    plateInput.value = plateInput.value.toUpperCase();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (nicknameInput.value.trim() === "") {
        showPopup("Vehicle NickName tidak boleh kosong!");
        return;
    }
    
    if (typeSelect.value.trim() === "") {
        showPopup("Kamu harus memilih Vehicle Type!");
        return;
    }

    if (brandSelect.value.trim() === "") {
        showPopup("Kamu harus memilih Brand Kendaraan!");
        return;
    }

    if (nameInput.value.trim() === "") {
        showPopup("Vehicle Name tidak boleh kosong!");
        return;
    }

    if (plateInput.value.trim() === "") {
        showPopup("Plate no tidak boleh kosong!");
        return;
    }

    const updatedData = {
        nickname: nicknameInput.value,
        type: typeSelect.value,
        brand: brandSelect.value,
        name: nameInput.value,
        plate: plateInput.value.toUpperCase(),
        email: emailInput.value || null
    };

    try {
        await updateDoc(vehicleDocRef, updatedData);
        showPopup("Data berhasil diperbarui!");
    } catch (error) {
        console.error("Error updating document:", error);
        showPopup("Terjadi kesalahan saat memperbarui data: " + error.message);
    }
});

function showPopup(message) {
    popup.textContent = message;
    popup.style.display = "block";
    setTimeout(() => {
        popup.style.display = "none";
    }, 3000);
}