// Fungsi untuk login menggunakan Google
function googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            // Redirect ke dashboard setelah login berhasil
            window.location.href = "./dashboard.html";
        })
        .catch(console.log);
}

// Fungsi untuk logout
function logout() {
    firebase.auth().signOut().then(() => {
        // Berhasil logout, redirect ke index.html
        window.location.href = "./index.html";
    }).catch((error) => {
        console.error("Error while logging out:", error);
    });
}

function displayUserProfilePic(user) {
    const profilePicDiv = document.getElementById("profile-picture");
    const userNameDiv = document.getElementById("user-name");

    // Cek apakah pengguna sudah login
    if (user) {
        // Buat elemen gambar untuk foto profil pengguna
        const profilePic = document.createElement("img");
        profilePic.src = user.photoURL;
        profilePic.classList.add("profile-pic"); // Tambahkan kelas khusus untuk styling

        // Tambahkan event listener untuk memeriksa apakah gambar berhasil dimuat
        profilePic.addEventListener("error", function() {
            // Jika gambar gagal dimuat, atur sumbernya ke gambar profil default
            profilePic.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuEiaDNDqRo6K0Zn_NlRJjAde-B1zommEhIg&usqp=CAU"; // Sesuaikan path jika perlu
        });

        // Tambahkan gambar profil ke dalam placeholder
        profilePicDiv.appendChild(profilePic);
        // Tampilkan nama pengguna
        userNameDiv.innerText = "Hi, " + user.displayName;
    } else {
        // Jika pengguna belum login, atur gambar profil default dan kosongkan nama pengguna
        profilePicDiv.innerHTML = '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuEiaDNDqRo6K0Zn_NlRJjAde-B1zommEhIg&usqp=CAU" alt="Default Profile Picture" class="profile-pic">';
        userNameDiv.innerText = "";
    }
}

// Event listener untuk memastikan kode dijalankan setelah konten dimuat
document.addEventListener("DOMContentLoaded", event => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // If user is logged in, display user information
            displayUserProfilePic(user);

            const welcomeMessage = document.getElementById("welcome-message");
            welcomeMessage.textContent += user.displayName;
        } else {
            // If user is not logged in, redirect to login page
            window.location.href = "login.html";
        }
    });
});
