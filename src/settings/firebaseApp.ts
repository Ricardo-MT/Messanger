import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import { getAuth } from "firebase/auth";

export const firebaseApp = initializeApp(firebaseConfig);
export const authApp = getAuth(firebaseApp);
