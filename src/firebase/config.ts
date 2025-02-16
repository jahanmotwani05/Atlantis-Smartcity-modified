import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDv1bxjXONjtuaHT47Pk03MSEStLbqT2Ig",
  authDomain: "atlantis-smartcity.firebaseapp.com",
  projectId: "atlantis-smartcity",
  storageBucket: "atlantis-smartcity.firebasestorage.app",
  messagingSenderId: "496992661059",
  appId: "1:496992661059:web:55980359dd347146cfeef6",
  measurementId: "G-NDTQ3QXQRZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);