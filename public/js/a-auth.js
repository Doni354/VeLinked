// Function to handle Google login
function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();


    firebase.auth().signInWithPopup(provider)
        .then(result => {
            // Redirect to dashboard after successful login
            window.location.href = "../dashboard.html";
        })
        .catch(console.log);
}

// Function to handle Google Logut
function logout() {
    console.log("Logout button clicked."); // Debugging message
    firebase.auth().signOut().then(() => {
        // Sign-out successful, redirect to index.html
        window.location.href = "../index.html";
    }).catch(error => {
        // An error happened
        console.error("Error while logging out:", error);
    });
}


