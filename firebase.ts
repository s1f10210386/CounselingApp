import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: "counseling-withchatgpt",
  storageBucket: "counseling-withchatgpt.appspot.com",
  messagingSenderId: "742581117683",
  appId: "1:742581117683:web:cf82683ff1475104ed0d86"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);