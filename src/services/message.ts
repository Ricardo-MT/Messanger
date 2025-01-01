import {
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
  addDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { firestoreDb } from "../settings/firebaseApp";
import { collections, db } from "../settings/collections";
import { Message, messageFromDoc } from "../interfaces/message";

export interface MessageService {
  removeMessagesByChat: (chatId: string) => Promise<void>;
  createMessage: (message: {
    chatId: string;
    text: string;
    senderId: string;
    timestamp: Date;
  }) => Promise<Message>;
}

export const messageService = (): MessageService => ({
  removeMessagesByChat: async (chatId: string) => {
    const chatRef = doc(firestoreDb, collections.CHAT, chatId);
    const q = query(db.message, where("chatId", "==", chatRef));
    const messages = await getDocs(q);
    await Promise.all(messages.docs.map((doc) => deleteDoc(doc.ref)));
  },
  createMessage: async (message: {
    chatId: string;
    text: string;
    senderId: string;
    timestamp: Date;
  }) => {
    const chatRef = doc(firestoreDb, collections.CHAT, message.chatId);
    const senderRef = doc(firestoreDb, collections.PROFILE, message.senderId);
    const messageRef = await addDoc(db.message, {
      chatId: chatRef,
      text: message.text,
      readByAll: false,
      senderId: senderRef,
      timestamp: Timestamp.fromDate(message.timestamp),
    });
    const messageDoc = await getDoc(messageRef);
    return messageFromDoc(messageDoc.id, messageDoc.data()!);
  },
});
