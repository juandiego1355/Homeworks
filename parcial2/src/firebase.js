import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_6WUIZpR2w7n8Uo7BtutcRd1PDmmmkQc",
  authDomain: "parcial-ed2.firebaseapp.com",
  projectId: "parcial-ed2",
  storageBucket: "parcial-ed2.firebasestorage.app",
  messagingSenderId: "158045744256",
  appId: "1:158045744256:web:39eded73d138c425330a65",
  measurementId: "G-5T4ZY96X2B",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
