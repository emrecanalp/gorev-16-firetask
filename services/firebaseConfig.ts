// services/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// React Native için Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyChARD__sENTTBD0h8JJ-_cR8VKXh-Gh2E",
  authDomain: "firetasks-a0f8d.firebaseapp.com",
  projectId: "firetasks-a0f8d",
  storageBucket: "firetasks-a0f8d.firebasestorage.app",
  messagingSenderId: "240854124326",
  appId: "1:240854124326:web:0a63d01a066abcb25ea3e7",
};

const app = initializeApp(firebaseConfig);

// React Native'de analytics ÇALIŞMAZ → EKLEME!
export const auth = getAuth(app);
export const db = getFirestore(app);