// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUrzac8LmpwU1X1SDEUcctsqwEA5MZnYU",
  authDomain: "one-ingredient-chef.firebaseapp.com",
  projectId: "one-ingredient-chef",
  storageBucket: "one-ingredient-chef.firebasestorage.app",
  messagingSenderId: "675761069172",
  appId: "1:675761069172:web:bdb07cfa8d046959d88521",
  measurementId: "G-CJTH0N494Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Storage (images)
export const storage = getStorage(app);