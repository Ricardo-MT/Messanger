import { collection } from "firebase/firestore";
import { firestoreDb } from "./firebaseApp";

export const collections = {
  UNIVERSE: "universe",
  PROFILE: "profile",
  USER: "user",
  CHAT: "chat",
  MESSAGE: "message",
};

export const db = {
  universe: collection(firestoreDb, collections.UNIVERSE),
  profile: collection(firestoreDb, collections.PROFILE),
  user: collection(firestoreDb, collections.USER),
  chat: collection(firestoreDb, collections.CHAT),
  message: collection(firestoreDb, collections.MESSAGE),
};
