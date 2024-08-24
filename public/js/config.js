// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9qUzLViR5uALw9Qf_xzJpd20acoV0FEs",
  authDomain: "velinked-web.firebaseapp.com",
  projectId: "velinked-web",
  storageBucket: "velinked-web.appspot.com",
  messagingSenderId: "844821073092",
  appId: "1:844821073092:web:f243c25668079240ec0d91",
  measurementId: "G-CLGQ4RWWTX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const firestore = firebase.firestore();
        const realtimeDatabase = firebase.database();

        document.addEventListener('DOMContentLoaded', function() {
            // Fungsi untuk menyalin data dari Firestore ke Realtime Database
            const syncFirestoreToRealtimeDB = async () => {
                try {
                    // Ambil data dari koleksi Vehicle di Firestore
                    const vehicleCollection = await firestore.collection('Vehicle').get();
                    vehicleCollection.forEach(async (doc) => {
                        const data = doc.data();
                        // Salin data ke Realtime Database dengan menggunakan nama document dari Firestore sebagai child di Realtime Database
                        await realtimeDatabase.ref('Vehicle/' + doc.id).set(data);
                    });
                    console.log('Data berhasil disinkronisasi dari Firestore ke Realtime Database.');
                } catch (error) {
                    console.error('Terjadi kesalahan saat sinkronisasi data:', error);
                }
            };

            // Jalankan sinkronisasi
            syncFirestoreToRealtimeDB();
        });