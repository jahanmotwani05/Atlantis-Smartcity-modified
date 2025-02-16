import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

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

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);