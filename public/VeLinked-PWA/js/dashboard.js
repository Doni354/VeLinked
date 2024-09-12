
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase, ref, query, get, update, orderByChild, equalTo, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

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



// Function to load driverId based on user email
async function loadDriverIdByEmail(userEmail) {
    try {
        console.log("Fetching driverId for user email:", userEmail);
        const driversRef = ref(database, 'Drivers');
        const driversSnapshot = await get(driversRef);

        let driverId = null;

        // Loop through drivers to find matching email
        driversSnapshot.forEach((doc) => {
            const driverData = doc.val();
            if (driverData.email === userEmail) {
                driverId = doc.key; // doc.key is the driverId
                console.log("DriverId found:", driverId);
            }
        });

        if (!driverId) {
            console.log("No matching driverId found for this email.");
            return;
        }

        // Use driverId to fetch expanses
        loadDriverExpansesByDriverId(driverId);

    } catch (error) {
        console.error("Error fetching driverId:", error);
    }
}
// Function to load expanses using driverId and calculate total price for each type
async function loadDriverExpansesByDriverId(driverId) {
    try {
        console.log("Loading expanses for driverId:", driverId);
        const expansesRef = ref(database, 'Expenses');
        const expansesSnapshot = await get(expansesRef);

        let expansesData = [];
        let totalCostByType = {}; // Object to hold the total cost for each type

        // Loop through expanses and find those matching driverId
        expansesSnapshot.forEach((doc) => {
            const expanse = doc.val();
            console.log("Checking expanse: ", expanse); // Log each expanse

            if (expanse.driverId === driverId) {
                expansesData.push(expanse);

                // Calculate total price for each type
                const { type, price } = expanse;

                // Ensure price is a number
                const numericPrice = Number(price);

                if (!totalCostByType[type]) {
                    totalCostByType[type] = 0;
                }

                // Sum up the total cost for each type
                totalCostByType[type] += numericPrice;
            }
        });

        if (expansesData.length === 0) {
            console.log("No expanses found for this driver.");
        }

        // Display expanses and total cost for each type
        displayExpanses(expansesData, totalCostByType);

    } catch (error) {
        console.error("Error loading expanses:", error);
    }
}

// Function to display expanses in the card container
function displayExpanses(expansesData, totalCostByType) {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = ""; // Clear previous content

    expansesData.forEach(expanse => {
        const { type, price, desc } = expanse;
        
        // Format price to currency format (e.g., Rp. 982 K)
        const formattedPrice = formatCurrency(price);

        // Shorten description if too long
        const shortDesc = desc.length > 20 ? desc.substring(0, 20) + '...' : desc;

        // Create card element
        const card = document.createElement('div');
        card.classList.add('card');

        // Create image element
        const img = document.createElement('img');
        img.src = `assets/expanse/${type}.svg`; // Load image based on type
        img.alt = type;

        // Create h3 element for price
        const h3 = document.createElement('h3');
        h3.textContent = formattedPrice;

        // Create p element for description
        const p = document.createElement('p');
        p.textContent = shortDesc;

        // Append elements to card
        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(p);

        // Append card to container
        cardContainer.appendChild(card);

        // Add click event listener to show details in overlay
        card.addEventListener('click', () => {
            showExpenseDetails(expanse, totalCostByType[expanse.type]);  // Pass the total cost of the same type
        });
    });
}

// Function to show expense details in overlay, including total cost for the type
function showExpenseDetails(expanse, totalCostForType) {
    const { type, price, desc, date, photo } = expanse;

    // Format date and price
    const formattedDate = formatDate(new Date(date));
    const formattedPrice = formatCurrency(price);
    const formattedTotalCost = formatCurrency(totalCostForType); // Format total cost to IDR

    // Set overlay data
    document.getElementById('overlay-title').innerText = `${type} Cost Detail`;
    document.getElementById('overlay-icon').src = `assets/expanse/${type}.svg`;
    document.getElementById('overlay-cost').innerText = formattedPrice;
    document.getElementById('overlay-total-cost').innerText = `Total Cost ${type}: ${formattedTotalCost}`; // Display total cost for the type
    document.getElementById('overlay-date').innerText = formattedDate;
    document.getElementById('overlay-description').innerText = desc;

    // Show overlay
    const overlayElement = document.getElementById('expense-overlay');
    overlayElement.classList.remove('hidden');

    // Close the overlay when clicking outside of the content
    overlayElement.addEventListener('click', function(event) {
        if (event.target === overlayElement) { // Close if the click is outside overlay-content
            overlayElement.classList.add('hidden');
        }
    });

    // Add image preview functionality (if applicable)
    if (photo) {
        document.getElementById('view-image').setAttribute('href', photo);
        document.getElementById('view-image').innerText = "View Attached Photo";
    } else {
        document.getElementById('view-image').innerText = "No Photo Available";
    }
}

// Helper function to format currency
function formatCurrency(price) {
    return Number(price).toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).replace('Rp', 'Rp.');
}

// Helper function to format date
function formatDate(date) {
    const month = date.getMonth() + 1; // Months start from 0 in JavaScript
    const day = date.getDate();
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


// Event listener for user authentication state change
onAuthStateChanged(auth, user => {
    if (user) {
        console.log("User logged in:", user.email);
        loadDriverIdByEmail(user.email); // Fetch driverId by user email
    } else {
        console.log("No user is signed in.");
        window.location.href = "index.html"; // Redirect to login if no user is signed in
    }
});













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

    // Animasi fade-out untuk menghilangkan gambar lama
    engineImage.classList.add("hidden");

    // Setelah animasi fade-out selesai, ubah gambar dan teks status
    setTimeout(() => {
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

        // Tampilkan gambar dengan animasi fade-in
        engineImage.classList.remove("hidden");
    }, 300); // Sesuaikan waktu dengan durasi animasi (300ms)
}


// Toggle engine status function
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

// Real-time listener for engine status
function listenForEngineStatus() {
    if (vehicleUsedId) {
        const vehicleRef = ref(database, `Vehicle/${vehicleUsedId}/engine_status`);
        onValue(vehicleRef, snapshot => {
            if (snapshot.exists()) {
                const engineStatus = snapshot.val();
                updateButtonState(engineStatus);
            } else {
                console.log("No engine status available.");
            }
        });
    }
}

// Ensure the DOM is fully loaded
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

                            // Listen for real-time engine status updates
                            listenForEngineStatus();

                            // Add event listener to toggle button
                            document.getElementById('toggleButton').addEventListener('click', toggleEngineStatus);
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
            window.location.href = "index.html"; // Redirect to login if not signed in
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



        