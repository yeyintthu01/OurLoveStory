import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwzQIFYWwOSYBomvMqZriVB8e3rA3_Pzs",
  authDomain: "our-love-story-3d8d7.firebaseapp.com",
  projectId: "our-love-story-3d8d7",
  storageBucket: "our-love-story-3d8d7.firebasestorage.app",
  messagingSenderId: "516281941597",
  appId: "1:516281941597:web:14931078da609a51e397b4",
  measurementId: "G-HYVTL22HNB",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
