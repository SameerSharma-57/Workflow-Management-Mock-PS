// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Replace these with your Firebase project's values
const firebaseConfig = {
    apiKey: "AIzaSyALQODrZ_XDaneAyDu9PgSjzR39mKAGAEM",
    authDomain: "workflow-management-3ae7b.firebaseapp.com",
    projectId: "workflow-management-3ae7b",
    storageBucket: "workflow-management-3ae7b.appspot.com",
    messagingSenderId: "212016950250",
    appId: "1:212016950250:web:59dd990aaf4ce8aee4e093",
    measurementId: "G-C5YYKSMYC0"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Google Auth provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",  // Force account selection every time
});

export { auth, provider, signInWithPopup, signOut };
