import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

export const firebaseApp = initializeApp(firebaseConfig);
export const authApp = getAuth(firebaseApp);
export const firestoreDb = getFirestore(firebaseApp);
export const storageApp = getStorage(firebaseApp);
export const messaging = getMessaging(firebaseApp);
