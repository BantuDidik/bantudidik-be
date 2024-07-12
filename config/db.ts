import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import admin from "firebase-admin";

const serviceAccount = require("../admin-credentials.json");

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId:process.env.APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export { app, admin, db, getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification};