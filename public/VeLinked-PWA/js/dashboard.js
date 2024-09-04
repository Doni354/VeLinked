import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase, ref, query, get, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";









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