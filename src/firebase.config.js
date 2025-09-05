import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUrzac8LmpwU1X1SDEUcctsqwEA5MZnYU",
  authDomain: "one-ingredient-chef.firebaseapp.com",
  projectId: "one-ingredient-chef",
  storageBucket: "one-ingredient-chef.firebasestorage.app",
  messagingSenderId: "675761069172",
  appId: "1:675761069172:web:32ea84be667c6529d88521",
  measurementId: "G-G1FF4Y76VX"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Auth login/logout 
export const loginWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);