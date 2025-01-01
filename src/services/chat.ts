import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  and,
} from "firebase/firestore";
import { firestoreDb } from "../settings/firebaseApp";
import { collections, db } from "../settings/collections";
import { Chat, chatFromDoc } from "../interfaces/chat";

export interface ChatService {
  removeChat: (chatId: string) => Promise<void>;
  getChatsByName: (chatName: string, universeId: string) => Promise<Chat[]>;
  getPrivateChatByMembers: (
    members: string[],
    universeId: string
  ) => Promise<Chat[] | null>;
  createChat: (chat: {
    universeId: string;
    name: string;
    isGroup: boolean;
    creatorId: string;
    members: string[];
  }) => Promise<Chat>;
}

export const chatService = (): ChatService => ({
  removeChat: async (chatId: string) => {
    const chatRef = doc(firestoreDb, collections.CHAT, chatId);
    await deleteDoc(chatRef);
  },
  getPrivateChatByMembers: async (members: string[], universeId: string) => {
    const universeRef = doc(firestoreDb, collections.UNIVERSE, universeId);
    const [first, second] = members.map((member) =>
      doc(firestoreDb, collections.PROFILE, member)
    );
    const q1 = query(
      db.chat,
      and(
        where("universeId", "==", universeRef),
        where("isGroup", "==", false),
        where("members", "in", [
          [first, second],
          [second, first],
        ])
      )
    );
    const chats = await getDocs(q1);
    if (chats.docs.length === 0) {
      return null;
    }
    const filtered = Array.from(chats.docs).filter(
      (doc) => doc.data().members.length === 2
    );
    if (!filtered) {
      return null;
    }
    return Promise.all(filtered.map((doc) => chatFromDoc(doc.id, doc.data())));
  },
  getChatsByName: async (chatName: string, universeId: string) => {
    const universeRef = doc(firestoreDb, collections.UNIVERSE, universeId);
    const q = query(
      db.chat,
      where("name", "==", chatName),
      where("universeId", "==", universeRef)
    );
    const chat = await getDocs(q);
    return Promise.all(chat.docs.map((doc) => chatFromDoc(doc.id, doc.data())));
  },
  createChat: async (chat: {
    universeId: string;
    name: string;
    isGroup: boolean;
    creatorId: string;
    members: string[];
  }) => {
    const now = new Date();
    const profileRefs = chat.members.map((member) =>
      doc(firestoreDb, collections.PROFILE, member)
    );
    const universeRef = doc(firestoreDb, collections.UNIVERSE, chat.universeId);
    const creatorRef = doc(firestoreDb, collections.PROFILE, chat.creatorId);
    const chatRef = await addDoc(db.chat, {
      createdAt: now,
      updatedAt: now,
      createdBy: creatorRef,
      isGroup: chat.isGroup,
      members: profileRefs,
      name: chat.name,
      universeId: universeRef,
    });
    const chatDoc = await getDoc(chatRef);
    return chatFromDoc(chatDoc.id, chatDoc.data()!);
  },
});
