import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyBlRojlDYyrOIGzs2iLETqOQD51oM_bKzM",
  authDomain: "history-notes-e4678.firebaseapp.com",
  projectId: "history-notes-e4678",
  storageBucket: "history-notes-e4678.appspot.com",
  messagingSenderId: "547571588436",
  appId: "1:547571588436:web:2492ae3ab2cc1bb413fcc1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);