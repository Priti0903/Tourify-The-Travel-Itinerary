// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHDHXRvra5gFikXG1VGMgWWRRqIxYtqdU",
  authDomain: "ai-travel-itinerary-8a348.firebaseapp.com",
  projectId: "ai-travel-itinerary-8a348",
  storageBucket: "ai-travel-itinerary-8a348.firebasestorage.app",
  messagingSenderId: "790325999375",
  appId: "1:790325999375:web:f0b46f18c9ae5dc328707a",
  measurementId: "G-QR6BM6HZSR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);