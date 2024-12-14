import { collection } from "firebase/firestore";
import { firestoreDb } from "./firebaseApp";

export const db = {
  universe: collection(firestoreDb, "universe"),
  profile: collection(firestoreDb, "profile"),
  user: collection(firestoreDb, "user"),
};
