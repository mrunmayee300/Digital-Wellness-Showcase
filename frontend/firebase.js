import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDGCTrcVwRU3_4WAkzV9U95X-apQbO-UM",
  authDomain: "digital-wellness-showcase.firebaseapp.com",
  projectId: "digital-wellness-showcase",
  storageBucket: "digital-wellness-showcase.appspot.com",
  messagingSenderId: "1024433365820",
  appId: "1:1024433365820:web:b1f84680d0baa537d4b439",
  measurementId: "G-8P1B3YKR7J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

// Services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Auth helpers
export const signIn = () => signInWithPopup(auth, provider);
export const onUserChange = (callback) => onAuthStateChanged(auth, callback);

// Firestore helpers
export {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  onSnapshot
};
