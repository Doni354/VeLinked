//      Memunculkan tampilan profile user yang dipatkan melalui param url

document.addEventListener('DOMContentLoaded', function () {
    // Ambil UID pengguna dari parameter URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    // Pastikan UID pengguna tersedia
    if (userId) {
        // Ambil data pengguna dari Firestore berdasarkan UID
        firebase.firestore().collection("users").doc(userId).get()
            .then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    // Update profile picture, name, email, phone number, and address in the HTML
                    document.getElementById("profile-pic").src = userData.photoURL;
                    document.getElementById("user-name").innerText = userData.displayName;
                    document.getElementById("user-email").innerText = userData.email;
                    const phone = userData.phone ? userData.phone : "Phone number not available";
                    const address = userData.address ? userData.address : "Address not available";
                    document.getElementById("phone").innerText = phone;
                    document.getElementById("address").innerText = address;
                } else {
                    console.log("No such document!");
                }
            })
            .catch(error => {
                console.error("Error getting user data:", error);
                // Beri respons kepada pengguna jika terjadi kesalahan
            });
    } else {
        // Jika UID pengguna tidak tersedia dalam parameter URL, arahkan kembali ke halaman sebelumnya
        window.history.back();
    }
});
