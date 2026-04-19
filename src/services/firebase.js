// This file initializes Firebase services (Auth + Firestore) for the app

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPpyq7eAv4zAwPU6F_9GcN1ebVr6zHnqA",
  authDomain: "syntax-flow.firebaseapp.com",
  projectId: "syntax-flow",
  storageBucket: "syntax-flow.firebasestorage.app",
  messagingSenderId: "613407937955",
  appId: "1:613407937955:web:8d39d5549eb66e398fb616",
  measurementId: "G-3G6Z1H35EM"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Firestore setup (long polling avoids network issues in some environments)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Authentication setup
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();