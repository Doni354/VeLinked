import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
const auth = getAuth();
// Event listener for user authentication state change
onAuthStateChanged(auth, user => {
    if (user) {
        displayUserProfilePic(user);
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