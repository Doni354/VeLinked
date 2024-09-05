
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase, ref, query, get, update, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB9qUzLViR5uALw9Qf_xzJpd20acoV0FEs",
    authDomain: "velinked-web.firebaseapp.com",
    databaseURL: "https://velinked-web-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "velinked-web",
    storageBucket: "velinked-web.appspot.com",
    messagingSenderId: "844821073092",
    appId: "1:844821073092:web:f243c25668079240ec0d91",
    measurementId: "G-CLGQ4RWWTX"
};











// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);
















// Event listener for user authentication state change
onAuthStateChanged(auth, user => {
    if (user) {
        displayUserProfilePic(user);
        displayUserData(user);
    } else {
        console.log("No user is signed in.");
        window.location.href = "index.html"; // Redirect to login if no user is signed in
    }
});






function displayUserProfilePic(user) {
    
    const userNameDiv = document.getElementById("user-name");

    // Cek apakah pengguna sudah login
    if (user) {
        
        userNameDiv.innerText = "Hi, " + user.displayName;
    } else {
        // Jika pengguna belum login, atur gambar profil default dan kosongkan nama pengguna
        profilePicDiv.innerHTML = '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuEiaDNDqRo6K0Zn_NlRJjAde-B1zommEhIg&usqp=CAU" alt="Default Profile Picture" class="profile-pic">';
        userNameDiv.innerText = "";
    }
}

// Event listener untuk memastikan kode dijalankan setelah konten dimuat
document.addEventListener("DOMContentLoaded", event => {
    onAuthStateChanged(auth, user => {
        if (user) {
            // If user is logged in, display user information
            displayUserProfilePic(user);


        } else {
            // If user is not logged in, redirect to login page
            window.location.href = "index.html";
        }
    });
});






// Function to display user data
function displayUserData(user) {
    const driverRef = ref(database, 'Drivers');
    const userQuery = query(driverRef, orderByChild('email'), equalTo(user.email));

    get(userQuery).then(snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                document.getElementById("fullName").innerText = `${data.fullName}`;
                
                const photoElement = document.getElementById("driverPhoto");
                photoElement.src = data.driverPhotoUrl;
                photoElement.alt = "Driver Photo";
            });
        } else {
            console.log("No data available for this email.");
        }
    }).catch(error => {
        console.error("Error fetching data:", error);
    });
}











// Fungsi untuk menampilkan data Vehicle berdasarkan vehicleUsed pada koleksi Drivers
function displayVehicleData(user) {
    const driverRef = ref(database, 'Drivers');
    const driverQuery = query(driverRef, orderByChild('email'), equalTo(user.email));

    get(driverQuery)
        .then(snapshot => {
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const driverData = childSnapshot.val();
                    const vehicleUsed = driverData.vehicleUsed;

                    // Query untuk mencari nickname di koleksi Vehicle
                    const vehicleRef = ref(database, `Vehicle/${vehicleUsed}`);
                    get(vehicleRef)
                        .then(vehicleSnapshot => {
                            if (vehicleSnapshot.exists()) {
                                const vehicleData = vehicleSnapshot.val();
                                const nickname = vehicleData.nickname;
                                // Menampilkan data di elemen HTML
                                document.getElementById("vehicle-nickname").innerText = `Using ${nickname}`;
                            } else {
                                console.log("No vehicle data found for the given vehicleUsed.");
                            }
                        })
                        .catch(error => {
                            console.error("Error fetching vehicle data:", error);
                        });
                });
            } else {
                console.log("No driver data available for this email.");
            }
        })
        .catch(error => {
            console.error("Error fetching driver data:", error);
        });
}

// Memastikan fungsi dipanggil setelah user login
onAuthStateChanged(auth, user => {
    if (user) {
        displayVehicleData(user);
    } else {
        console.log("No user is signed in.");
        window.location.href = "index.html"; // Redirect ke halaman login jika user belum login
    }
});





let vehicleUsedId;

        function updateButtonState(engineStatus) {
            const engineImage = document.getElementById('engineImage');
            const statusTitle = document.getElementById('statusTitle');
            const statusMessage = document.getElementById('statusMessage');

            if (engineStatus) {
                engineImage.src = 'assets/images/Engine-On.svg';
                engineImage.alt = 'Engine On';
                statusTitle.innerText = 'TURN OFF ENGINE';
                statusMessage.innerText = 'Your Vehicle is active now';
            } else {
                engineImage.src = 'assets/images/Engine-Off.svg';
                engineImage.alt = 'Engine Off';
                statusTitle.innerText = 'TURN ON ENGINE';
                statusMessage.innerText = 'Your Vehicle is currently off';
            }
        }

        function toggleEngineStatus() {
            const engineImage = document.getElementById('engineImage');
            const currentStatus = engineImage.getAttribute('src') === 'assets/images/Engine-On.svg';
            const newStatus = !currentStatus;

            // Update status in Firebase
            if (vehicleUsedId) {
                const vehicleRef = ref(database, `Vehicle/${vehicleUsedId}`);
                update(vehicleRef, { engine_status: newStatus })
                    .then(() => {
                        console.log("Engine status updated successfully.");
                        updateButtonState(newStatus);
                    })
                    .catch(error => {
                        console.error("Error updating engine status:", error);
                    });
            }
        }

        document.addEventListener("DOMContentLoaded", () => {
            onAuthStateChanged(auth, user => {
                if (user) {
                    const driverRef = ref(database, 'Drivers');
                    const driverQuery = query(driverRef, orderByChild('email'), equalTo(user.email));

                    get(driverQuery)
                        .then(snapshot => {
                            if (snapshot.exists()) {
                                snapshot.forEach(childSnapshot => {
                                    const driverData = childSnapshot.val();
                                    vehicleUsedId = driverData.vehicleUsed;

                                    // Fetch engine status from Vehicle collection
                                    const vehicleRef = ref(database, `Vehicle/${vehicleUsedId}`);
                                    get(vehicleRef)
                                        .then(vehicleSnapshot => {
                                            if (vehicleSnapshot.exists()) {
                                                const vehicleData = vehicleSnapshot.val();
                                                updateButtonState(vehicleData.engine_status);

                                                document.getElementById('toggleButton').addEventListener('click', () => {
                                                    toggleEngineStatus();
                                                });
                                            } else {
                                                console.log("No vehicle data found for the given vehicleUsed.");
                                            }
                                        })
                                        .catch(error => {
                                            console.error("Error fetching vehicle data:", error);
                                        });
                                });
                            } else {
                                console.log("No driver data available for this email.");
                            }
                        })
                        .catch(error => {
                            console.error("Error fetching driver data:", error);
                        });
                } else {
                    console.log("No user is signed in.");
                    window.location.href = "index.html"; // Redirect ke halaman login jika user belum login
                }
            });
        });



 // Fungsi untuk memverifikasi apakah email pengguna yang login ada di Realtime Database
function verifyUserEmail(user) {
    const driverRef = ref(database, 'Drivers'); // Referensi ke koleksi Drivers
    const userQuery = query(driverRef, orderByChild('email'), equalTo(user.email)); // Query untuk mencocokkan email pengguna

    get(userQuery).then(snapshot => {
        if (!snapshot.exists()) {
            // Jika tidak ada email yang cocok, alihkan ke halaman 406.html
            window.location.href = "406.html";
        } else {
            console.log("User email is valid, access granted.");
        }
    }).catch(error => {
        console.error("Error checking user email:", error);
    });
}

// Fungsi untuk memeriksa autentikasi pengguna
onAuthStateChanged(auth, user => {
    if (user) {
        // Verifikasi email pengguna setelah login
        verifyUserEmail(user);
    } else {
        // Jika tidak ada pengguna yang login, arahkan ke halaman login
        window.location.href = "index.html";
    }
});



        