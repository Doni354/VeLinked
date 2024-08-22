// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, query, where, orderBy, onSnapshot, collection, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";

import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";
            // TODO: Add SDKs for Firebase products that you want to use
            // https://firebase.google.com/docs/web/setup#available-libraries

            // Your web app's Firebase configuration
            // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {
            apiKey: "AIzaSyB9qUzLViR5uALw9Qf_xzJpd20acoV0FEs",
            authDomain: "velinked-web.firebaseapp.com",
            projectId: "velinked-web",
            storageBucket: "velinked-web.appspot.com",
            messagingSenderId: "844821073092",
            appId: "1:844821073092:web:f243c25668079240ec0d91",
            measurementId: "G-CLGQ4RWWTX"
        };

            const app = initializeApp(firebaseConfig);
            const analytics = getAnalytics(app);
            const db = getFirestore(app);
            const storage = getStorage(app);
            const storageRef = ref(storage);

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

            const deleteButton = document.getElementById('confirmDelete');




        // Fungsi untuk mendapatkan parameter dari URL
        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }


        // Mendapatkan nilai docId dari parameter URL
        const docId = getParameterByName('docId');

        // Dapatkan referensi dokumen kendaraan dari Firestore berdasarkan docId
        const vehicleDocRef = doc(db, "Vehicle", docId);


// Reference to the Logs collection filtered by docId
const logsRef = collection(db, 'Logs');
const queryLogs = query(logsRef, where('docId', '==', docId), orderBy('timestamp', 'desc'));





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

async function uploadPicture(file) {
    const storageReference = ref(storage, 'Vehicle/Image/' + file.name);
    await uploadBytes(storageReference, file);
    return await getDownloadURL(storageReference);
}

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

    let updatedData = {
        nickname: nicknameInput.value,
        type: typeSelect.value,
        brand: brandSelect.value,
        name: nameInput.value,
        plate: plateInput.value.toUpperCase(),
        email: emailInput.value || null
    };

    try {
        showPopup("Uploading data...");
        if (picInput.files[0]) {
            const pictureURL = await uploadPicture(picInput.files[0]);
            updatedData.picture = pictureURL;
        }
        await updateDoc(vehicleDocRef, updatedData);
        showPopup("Data berhasil diperbarui!");
        toggleFormEdit();
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









// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
    const logTable = document.getElementById('logTable');

    // Real-time listener for Logs collection
    onSnapshot(queryLogs, (snapshot) => {
        logTable.innerHTML = ''; // Clear previous data

        snapshot.forEach((doc) => {
            const logData = doc.data();
            const logItem = document.createElement('div');
            logItem.classList.add('log-item');
            logItem.innerHTML = `
                <p><strong>Engine Status:</strong> ${logData.engineStatus}</p>
                <p><strong>Timestamp:</strong> ${logData.timestamp.toDate()}</p>
            `;
            logTable.appendChild(logItem);
        });
    });
});
        
        // Fungsi untuk menghapus dokumen kendaraan
deleteButton.addEventListener('click', async () => {
    try {
        // Hapus dokumen berdasarkan docId
        await firebase.firestore().collection('Vehicle').doc(docId).delete();
        console.log('Dokumen berhasil dihapus');
        
        // Redirect ke halaman dashboard setelah berhasil menghapus
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Error saat menghapus dokumen:', error);
        // Handle error jika perlu
    }
});


        // Ambil data kendaraan
        onSnapshot(vehicleDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const vehicleData = docSnap.data();
                // Tampilkan data kendaraan di halaman
                displayVehicleDetails(vehicleData);
                displayVehicleName(vehicleData);
                displayVehicleNickName(vehicleData);
                displayVehicleImage(vehicleData);
                displayVehicleNameLT(vehicleData);
                
            } else {
                console.log("No such document!");
            }
        }, error => {
            console.error("Error getting document:", error);
        });
// Event listener untuk mengubah preview gambar saat ada perubahan pada input gambar


        // Fungsi untuk menampilkan detail kendaraan
        function displayVehicleDetails(vehicleData) {
            const vehicleDetailsContainer = document.querySelector(".vehicle_Details-setting");
            const email = vehicleData.email ? vehicleData.email : "No email provided";
            const imageUrl = vehicleData.picture && vehicleData.picture.trim() !== '' ? vehicleData.picture : 'assets/images/CarD.svg';
            const detailsHTML = `
            <div class="vehicle-info-setting">
                <div class="vehicle-image-setting">
                    <img src="${imageUrl}" alt="${vehicleData.name}">
                </div>
                <div class="vehicle-text-setting">
                    <h3>${vehicleData.name}</h3>
                    <p><strong>Nickname:</strong> ${vehicleData.nickname}</p>
                    <p><strong>Type:</strong> ${vehicleData.type}</p>
                    <p><strong>Plate:</strong> ${vehicleData.plate}</p>
                    <p><strong>Email:</strong> ${email}</p>
                </div>
            </div>
            `;
            vehicleDetailsContainer.innerHTML = detailsHTML;
        }
       
        function displayVehicleName(vehicleData) {
            const vehicleDetailsContainer = document.querySelector(".vehname");
            const detailsHTML = `
                    <p>${vehicleData.name}</p>
            `;
            vehicleDetailsContainer.innerHTML = detailsHTML;
        }
        function displayVehicleNickName(vehicleData) {
            const vehicleDetailsContainer = document.querySelector(".vehtittledat");
            const detailsHTML = `
                    <p>${vehicleData.nickname}</p>
            `;
            vehicleDetailsContainer.innerHTML = detailsHTML;
        }
        function displayVehicleNameLT(vehicleData) {
            const vehicleNameElements = document.querySelectorAll(".vehicle-name");
            vehicleNameElements.forEach(element => {
                element.innerHTML = vehicleData.nickname;
            });
        }
        function displayVehicleImage(vehicleData) {
            const vehicleDetailsContainer = document.querySelector(".vehimg");
            const imageUrl = (vehicleData.picture && vehicleData.picture.trim() !== '') ? vehicleData.picture : 'assets/images/CarD.svg';
            const detailsHTML = `
                <img src="${imageUrl}" alt="${vehicleData.name}">
            `;
            vehicleDetailsContainer.innerHTML = detailsHTML;
        }



        // Ambil elemen tombol "Show Detail"
const showDetailButton = document.querySelector('.ShowDetail');

// Tambahkan class active saat tombol ditekan
showDetailButton.addEventListener('click', function() {
    const vehdataDiv = document.querySelector('.vehdata');
    const vehtittleDiv = document.querySelector('.vehtittle');

    vehtittleDiv.classList.toggle('active');
    
    // Ganti class sesuai dengan kondisi active
    vehtittleDiv.classList.contains('active') ? vehtittleDiv.classList.remove('inactive') : vehtittleDiv.classList.add('inactive');

    vehdataDiv.classList.toggle('active');
    
    // Ganti class sesuai dengan kondisi active
    vehdataDiv.classList.contains('active') ? vehdataDiv.classList.remove('inactive') : vehdataDiv.classList.add('inactive');

    // Tambahkan atau hilangkan class advstats sesuai kondisi active
    const statsDiv = document.querySelector('.stats');
    const advStatsDiv = document.createElement('div');
    advStatsDiv.classList.add('Data', 'advstats');
    advStatsDiv.innerHTML = `
        <div style="margin-top:30px; margin-left: 10px;">
        <div class="Dat" style="color:#65B768;">Closed</div>
        <div class="stat">Door Condition</div>
        <div class="Dat" style="color:#E14444;">Outside</div>
        <div class="stat">Area Control</div>
        <div class="Dat" style="color:#E14444;">145 Km/Hours</div>
        <div class="stat">Average Speed</div>
        </div>
    `;

    const existingAdvStatsDiv = document.querySelector('.advstats');
    if (existingAdvStatsDiv) {
        existingAdvStatsDiv.remove();
    } else {
        statsDiv.insertAdjacentElement('afterend', advStatsDiv);
    }
});


const image = showDetailButton.querySelector('img');

let isButtonPressed = false;

showDetailButton.addEventListener('click', function() {
    // Ganti status tombol dan ubah gambar sesuai
    isButtonPressed = !isButtonPressed;
    
    if (isButtonPressed) {
        image.src = 'assets/images/ClosedSlideButton.svg';
    } else {
        image.src = 'assets/images/SlideButton.svg';
    }
    
    // Tambahkan animasi saat perubahan gambar
    image.classList.add('clicked');
    
    // Hilangkan class animasi setelah beberapa detik
    setTimeout(function() {
        image.classList.remove('clicked');
    }, 500); // Sesuaikan dengan durasi animasi CSS
});

const userImage = document.querySelector('.user img');
        // Ambil elemen .userdat
        const userdatDiv = document.querySelector('.userdat');
        userdatDiv.style.display = 'none'; // Mulanya tersembunyi

        // Event listener untuk menampilkan dan menyembunyikan div .userdat
        userImage.addEventListener('click', function() {
            userdatDiv.style.display = 'block';
            userdatDiv.classList.add('show'); // Tambahkan class untuk animasi
        });

        const backImage = document.querySelector('.userdat .user img');
        backImage.addEventListener('click', function() {
            userdatDiv.classList.remove('show'); // Hilangkan class untuk animasi
            setTimeout(() => {
                userdatDiv.style.display = 'none';
            }, 500); // Durasi sesuai dengan animasi CSS
        });


        document.addEventListener('DOMContentLoaded', function() {
            const engineStatusCheckbox = document.getElementById('engineStatusCheckbox');
        
            // Mendapatkan nilai docId dari parameter URL
            const docId = getParameterByName('docId');
        
            // Dapatkan referensi ke Vehicle di Realtime Database berdasarkan docId
            const vehicleStatusRef = firebase.database().ref(`Vehicle/${docId}/engine_status`);
            const logsCollectionRef = firebase.firestore().collection("Logs");
        
            // Ambil data engine status dari Realtime Database dan update checkbox engine
            vehicleStatusRef.on('value', snapshot => {
                const engineStatus = snapshot.val();
                engineStatusCheckbox.checked = engineStatus || false;
            });
        
            // Tambahkan event listener untuk checkbox
            engineStatusCheckbox.addEventListener('change', function(event) {
                const isChecked = event.target.checked;
                const timestamp = firebase.firestore.FieldValue.serverTimestamp();
                const logEntry = {
                    docId: docId,
                    engineStatus: isChecked,
                    timestamp: timestamp
                };
        
                // Update nilai engine_status di Realtime Database berdasarkan checkbox
                vehicleStatusRef.set(isChecked).then(() => {
                    console.log("Engine status updated successfully in Realtime Database!");
        
                    // Kirim log ke Firestore
                    logsCollectionRef.add(logEntry).then(() => {
                        console.log("Log entry added successfully!");
                    }).catch(error => {
                        console.error("Error adding log entry:", error);
                    });
                }).catch(error => {
                    console.error("Error updating engine status in Realtime Database:", error);
                    // Reset checkbox jika terjadi error
                    engineStatusCheckbox.checked = !isChecked;
                });
            });
        });
        
        
        

// Fungsi untuk menambahkan event listener dengan ID
document.getElementById('deleteButton').addEventListener('click', function() {
    const popup = document.getElementById('deletePopup');
    popup.style.display = 'block';
});

// Fungsi untuk menutup popup konfirmasi
document.getElementById('cancelDelete').addEventListener('click', function() {
    const popup = document.getElementById('deletePopup');
    popup.style.display = 'none';
});

