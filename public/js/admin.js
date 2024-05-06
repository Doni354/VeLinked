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
    firebase.firestore().collection("users").get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const userData = doc.data();
                const profilePhoto = userData.photoURL;
                const username = userData.displayName;
                const email = userData.email;
                const userId = userData.uid;
                const loginTime = userData.lastLogin ? userData.lastLogin.toDate().toLocaleString() : 'N/A'; // Convert lastLogin to date format or 'N/A' if not available

                // Menambahkan baris baru ke dalam tabel
                $('#userDataTable').DataTable().row.add([
                    `<img src="${profilePhoto}" width="50" height="50">`,
                    username,
                    email,
                    userId,
                    loginTime
                ]).draw();
            });
        })
        .catch(error => {
            console.error("Error getting user data: ", error);
            // Beri respons kepada pengguna jika terjadi kesalahan
            alert("Error getting user data. Please try again later.");
        });
});

