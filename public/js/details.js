// Import the functions you need from the SDKs you need
            import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
            import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
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

            // Initialize Firebase
            const app = initializeApp(firebaseConfig);
            const analytics = getAnalytics(app);


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

        // Ambil data kendaraan
        vehicleDocRef.get().then(doc => {
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
        }).catch(error => {
            console.error("Error getting document:", error);
        });

        // Fungsi untuk menampilkan detail kendaraan
        function displayVehicleDetails(vehicleData) {
            const vehicleDetailsContainer = document.querySelector(".vehicle-details");
            const detailsHTML = `
                <div>
                    <h2>${vehicleData.name}</h2>
                    <p>Type: ${vehicleData.type}</p>
                    <p>Status: ${vehicleData.status ? 'Online' : 'Offline'}</p>
                    <!-- Tambahkan lebih banyak informasi kendaraan sesuai kebutuhan -->
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
            const vehicleDetailsContainer = document.querySelector(".vehtittle");
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



