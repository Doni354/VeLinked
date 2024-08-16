// Fungsi untuk menampilkan data kendaraan
function displayVehicleCard(vehicleData, docId) {
    const vehicleDetailsRow = document.querySelector(".vehicleDetailsRow");

    const vehicleCard = document.createElement("div");
    vehicleCard.classList.add("vehicleCard");

    const vehicleCardContent = document.createElement("div");
    vehicleCardContent.classList.add("vehicleCardContent");

    const vehicleInfo = document.createElement("div");
    vehicleInfo.classList.add("vehicleInfo");

    const vehicleText = document.createElement("div");
    vehicleText.classList.add("vehicleText");

    const vehicleTitle = document.createElement("h3");
    vehicleTitle.classList.add("vehicleTitle");
    vehicleTitle.textContent = vehicleData.nickname;

    const usersTotalLabel = document.createElement("p");
    usersTotalLabel.classList.add("usersTotalLabel");
    usersTotalLabel.textContent = vehicleData.name;

    vehicleText.appendChild(vehicleTitle);
    vehicleText.appendChild(usersTotalLabel);

    const vehicleThumbnail = document.createElement("img");
    vehicleThumbnail.classList.add("vehicleThumbnail");
    vehicleThumbnail.src = `assets/images/${vehicleData.type}.svg`;

    vehicleInfo.appendChild(vehicleText);
    vehicleInfo.appendChild(vehicleThumbnail);

    const statusRow = document.createElement("div");
    statusRow.classList.add("statusRow");

    const statusIcon = document.createElement("img");
    statusIcon.classList.add("statusIcon");

    const statusLabel = document.createElement("div");
    statusLabel.classList.add("statusLabel");

    // Dapatkan referensi ke status kendaraan di Realtime Database
    const vehicleStatusRef = firebase.database().ref(`Vehicle/${docId}/status_device`);

    // Mendengarkan perubahan status di Realtime Database
    vehicleStatusRef.on('value', snapshot => {
        const status = snapshot.val();
        statusIcon.src = `assets/images/${status ? 'online' : 'offline'}.svg`;
        statusLabel.textContent = status ? 'Online' : 'Offline';
    });

    statusRow.appendChild(statusIcon);
    statusRow.appendChild(statusLabel);

    vehicleCardContent.appendChild(vehicleInfo);
    vehicleCardContent.appendChild(statusRow);

    vehicleCard.appendChild(vehicleCardContent);

    vehicleCard.addEventListener("click", () => {
        window.location.href = `details.html?docId=${encodeURIComponent(docId)}`;
    });

    vehicleDetailsRow.appendChild(vehicleCard);
}

// Fungsi untuk memuat dan menampilkan data kendaraan dari Firestore
function loadAndDisplayVehicles() {
    const user = firebase.auth().currentUser;

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const vehiclesRef = firebase.firestore().collection("Vehicle").where("user_id", "==", user.uid);
    const vehicleDetailsRow = document.querySelector(".vehicleDetailsRow");

    vehiclesRef.onSnapshot(snapshot => {
        vehicleDetailsRow.innerHTML = "";

        snapshot.forEach(doc => {
            const vehicleData = doc.data();
            const docId = doc.id;
            displayVehicleCard(vehicleData, docId);
        });
    }, error => {
        console.error("Error fetching vehicles:", error);
    });
}

document.addEventListener("DOMContentLoaded", event => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            loadAndDisplayVehicles();
        } else {
            window.location.href = "login.html";
        }
    });
});
