import { FIREBASE_ADMIN } from '$env/static/private';
import admin from 'firebase-admin';
import { initializeFirestore } from 'firebase-admin/firestore';

var serviceAccount = JSON.parse(FIREBASE_ADMIN);
export const app = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

export const db = initializeFirestore(app);
export default admin;
