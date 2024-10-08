
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase, ref, query, get, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB9qUzLViR5uALw9Qf_xzJpd20acoV0FEs",
    authDomain: "velinked-web.firebaseapp.com",
    databaseURL: "https://velinked-web-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "velinked-web",
    storageBucket: "velinked-web.appspot.com",
    messagingSenderId: "844821073092",
    appId: "1:844821073092:web:f243c25668079240ec0d91",
    measurementId: "G-CLGQ4RWWTX"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);