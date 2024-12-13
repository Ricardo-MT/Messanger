import { enviorment } from "./enviorment";

export const firebaseConfig = {
  apiKey: enviorment.VITE_FIREBASE_API_KEY,
  authDomain: enviorment.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: enviorment.VITE_FIREBASE_PROJECT_ID,
  storageBucket: enviorment.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: enviorment.VITE_FIREBASE_MESSANGING_SENDER_ID,
  appId: enviorment.VITE_FIREBASE_APP_ID,
  measurementId: enviorment.VITE_FIREBASE_MEASUREMENT_ID,
};
