// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeuYNRvuBIqPLBZ_hCMdomHH4MMPkQI-M",
  authDomain: "flashcard-saas-f0171.firebaseapp.com",
  projectId: "flashcard-saas-f0171",
  storageBucket: "flashcard-saas-f0171.appspot.com",
  messagingSenderId: "181552543974",
  appId: "1:181552543974:web:71b9e75c0ded7b4ac8a327",
  measurementId: "G-PLHSRZ2XLL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {db};