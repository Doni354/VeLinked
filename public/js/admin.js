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