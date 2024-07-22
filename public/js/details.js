// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
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
        const vehicleDocRef = firebase.firestore().collection("Vehicle").doc(docId);

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
        vehicleDocRef.onSnapshot(doc => {
            if (doc.exists) {
                const vehicleData = doc.data();
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
    const vehtittleDiv = document.querySelector('.vehtittledat');

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
        
            // Dapatkan referensi dokumen kendaraan dari Firestore berdasarkan docId
            const vehicleDocRef = firebase.firestore().collection("Vehicle").doc(docId);
            const logsCollectionRef = firebase.firestore().collection("Logs");
        
            // Ambil data kendaraan dan update checkbox engine
            vehicleDocRef.onSnapshot(doc => {
                if (doc.exists) {
                    const vehicleData = doc.data();
                    // Update nilai checkbox berdasarkan nilai engine
                    engineStatusCheckbox.checked = vehicleData.engine;
                } else {
                    console.log("No such document!");
                }
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
        
                // Update nilai engine di Firestore berdasarkan checkbox
                vehicleDocRef.update({
                    engine: isChecked
                }).then(() => {
                    console.log("Engine status updated successfully!");
                    // Kirim log ke Firestore
                    logsCollectionRef.add(logEntry).then(() => {
                        console.log("Log entry added successfully!");
                    }).catch(error => {
                        console.error("Error adding log entry:", error);
                    });
                }).catch(error => {
                    console.error("Error updating engine status:", error);
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

