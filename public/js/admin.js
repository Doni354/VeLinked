document.addEventListener("DOMContentLoaded", event => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Pengguna telah login
            firebase.firestore().collection("admin_access").doc("admin_list").get()
            .then(doc => {
                if (doc.exists) {
                    const allowedUIDs = doc.data().allowed_uids;
                    if (allowedUIDs.includes(user.uid)) {
                        // UID pengguna ada dalam daftar UID yang diizinkan, biarkan akses ke halaman admin.html
                    } else {
                        // UID pengguna tidak ada dalam daftar UID yang diizinkan, arahkan kembali ke dashboard.html
                        window.location.href = "dashboard.html";
                    }
                } else {
                    console.error("Document not found");
                }
            })
            .catch(error => {
                console.error("Error getting document:", error);
            });
        } else {
            // Pengguna belum login, arahkan ke halaman login
            window.location.href = "login.html";
        }
    });
});

document.addEventListener("DOMContentLoaded", event => {
    // Inisialisasi Data Tables
    $('#userDataTable').DataTable();

    // Mendapatkan data semua pengguna yang pernah login
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in, maka ambil data pengguna dari Firestore
            firebase.firestore().collection("users").get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        const userData = doc.data();
                        // Cek apakah ID pengguna sama dengan ID pengguna yang sedang login
                        if (userData.uid !== user.uid) {
                            const profilePhoto = userData.photoURL;
                            const username = userData.displayName;
                            const email = userData.email;
                            const userId = userData.uid;
                            const loginTime = userData.lastLogin ? userData.lastLogin.toDate().toLocaleString() : 'N/A';

                            $('#userDataTable').DataTable().row.add([
                                `<img src="${profilePhoto}" width="50" height="50">`,
                                username,
                                email,
                                userId,
                                loginTime.toLocaleString(),
                                `<button onclick="viewProfile('${userId}')" class="btn btn-primary">View Profile</button>` // Tombol "View Profile"
                            ]).draw();                            
                        }
                    });
                })
                .catch(error => {
                    console.error("Error getting user data: ", error);
                    // Beri respons kepada pengguna jika terjadi kesalahan
                    alert("Error getting user data. Please try again later.");
                });
        } else {
            // User is signed out
            console.log("No user signed in.");
        }
    });
});

// Fungsi untuk mengarahkan pengguna ke halaman profil pengguna
function viewProfile(userId) {
    // Redirect pengguna ke halaman user-profile.html dengan mengirimkan UID pengguna sebagai parameter URL
    window.location.href = `user-profile.html?userId=${encodeURIComponent(userId)}`;
}



