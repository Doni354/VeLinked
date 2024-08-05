document.addEventListener('DOMContentLoaded', function () {
    // Mendeteksi perubahan status autentikasi saat halaman dimuat
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Pengguna sudah login
            const userId = user.uid;

            // Fungsi untuk memperbarui status berdasarkan perubahan lastUpdate
            function updateStatus(doc) {
                // Periksa jika dokumen memiliki field lastUpdate
                if (doc.exists && doc.data().lastUpdate) {
                    // Dapatkan timestamp lastUpdate dan saat ini
                    const lastUpdate = doc.data().lastUpdate.toMillis();
                    const currentTimestamp = firebase.firestore.Timestamp.now().toMillis();
                    // Tentukan apakah perlu mengupdate status
                    if (currentTimestamp - lastUpdate <= 10000) {
                        // Update status menjadi true hanya jika belum pernah diupdate sebelumnya atau lastUpdate berubah
                        if (!doc.data().status || !doc.data().lastUpdateUpdated || doc.data().lastUpdateUpdated < lastUpdate) {
                            firebase.firestore().collection("Vehicle").doc(doc.id).update({
                                status: true,
                                lastUpdateUpdated: currentTimestamp // Tandai timestamp saat lastUpdate terakhir diperbarui
                            })
                            .then(() => {
                                console.log("Status updated to true for document: ", doc.id);
                            })
                            .catch(error => {
                                console.error("Error updating status for document: ", doc.id, error);
                            });
                        }
                    } else {
                        // Update status menjadi false jika lebih dari 20 detik tidak ada perubahan
                        firebase.firestore().collection("Vehicle").doc(doc.id).update({
                            status: false,
                            lastUpdateUpdated: firebase.firestore.FieldValue.serverTimestamp() // Tandai timestamp saat status diubah menjadi false
                        })
                        .then(() => {
                            console.log("Status updated to false for document: ", doc.id);
                        })
                        .catch(error => {
                            console.error("Error updating status for document: ", doc.id, error);
                        });
                    }
                } else {
                    // Jika tidak ada field lastUpdate, set status menjadi false
                    firebase.firestore().collection("Vehicle").doc(doc.id).update({
                        status: false,
                        lastUpdateUpdated: firebase.firestore.FieldValue.serverTimestamp() // Tandai timestamp saat status diubah menjadi false
                    })
                    .then(() => {
                        console.log("Status updated to false for document (no lastUpdate): ", doc.id);
                    })
                    .catch(error => {
                        console.error("Error updating status for document (no lastUpdate): ", doc.id, error);
                    });
                }
            }

            // Set interval untuk memantau perubahan 
            setInterval(function() {
                // Ambil semua dokumen di koleksi Vehicle
                firebase.firestore().collection("Vehicle").get()
                    .then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                            updateStatus(doc);
                        });
                    })
                    .catch(error => {
                        console.error("Error fetching documents: ", error);
                    });
            }, 15000); // 15 detik sekali

            // Check if the user data already exists in the database
            firebase.firestore().collection("users").doc(userId).get()
                .then(doc => {
                    if (doc.exists) {
                        // Jika data sudah ada, lakukan update status atau informasi lainnya di sini
                        console.log("User data exists, updating...");
                        // Misalnya, update status login terakhir
                        firebase.firestore().collection("users").doc(userId).update({
                            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(() => {
                            console.log("User data updated successfully");
                        })
                        .catch(error => {
                            console.error("Error updating user data: ", error);
                        });
                    } else {
                        // Jika data belum ada, buat data baru untuk pengguna
                        console.log("User data doesn't exist, creating...");
                        const userData = {
                            uid: userId,
                            displayName: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL,
                            // Misalnya, tambahkan status login terakhir
                            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                            phone: "",
                            address: ""
                        };
                        // Simpan data pengguna di Firestore
                        firebase.firestore().collection("users").doc(userId).set(userData)
                            .then(() => {
                                console.log("User data created successfully");
                            })
                            .catch(error => {
                                console.error("Error creating user data: ", error);
                            });
                    }
                })
                .catch(error => {
                    console.error("Error getting user data: ", error);
                });
        } else {
            // Pengguna belum login, arahkan kembali ke halaman login
            window.location.href = "login.html";
        }
    });
});