const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Cloud Function untuk mendengarkan perubahan di Realtime Database dan menyalinnya ke Firestore
exports.syncVehicleData = functions.database.ref('/Vehicle/{docId}')
    .onWrite(async (change, context) => {
        const docId = context.params.docId;
        const data = change.after.val();

        if (!data || !data.lat || !data.lng) {
            console.error('Invalid data received from Realtime Database');
            return null;
        }

        try {
            // Update Firestore dengan data terbaru
            const firestoreDocRef = admin.firestore().collection('Vehicle').doc(docId);
            await firestoreDocRef.set({
                lat: data.lat,
                lng: data.lng
            }, { merge: true });

            console.log(`Data successfully written to Firestore: ${docId}`);
            return null;
        } catch (error) {
            console.error('Error writing document to Firestore: ', error);
            return null;
        }
    });
