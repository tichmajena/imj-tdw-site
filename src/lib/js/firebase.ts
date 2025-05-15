// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDe_FiWdKQ9LnBahnRjgy8RXBBWJcQrhSo',
	authDomain: 'imj-tdw-site.firebaseapp.com',
	projectId: 'imj-tdw-site',
	storageBucket: 'imj-tdw-site.firebasestorage.app',
	messagingSenderId: '835436901184',
	appId: '1:835436901184:web:98c2c164ea223f432740a5',
	measurementId: 'G-8S7G2FJ8P1'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
