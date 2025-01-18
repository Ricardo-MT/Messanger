import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  and,
  setDoc,
} from "firebase/firestore";
import { firestoreDb, storageApp } from "../settings/firebaseApp";
import { collections, db } from "../settings/collections";
import { Chat, chatFromDoc, getChatImageStoragePath } from "../interfaces/chat";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
    image?: Buffer;
    isGroup: boolean;
    creatorId: string;
    members: string[];
  }) => Promise<Chat>;
  addImageToChat: (chat: Chat, imageBuffer: Buffer) => Promise<void>;
}

const addImageToChat = async (chat: Chat, imageBuffer: Buffer) => {
  const chatRef = doc(db.chat, chat.id);
  const chatImageRef = ref(
    storageApp,
    getChatImageStoragePath(chat.universeId, chat.id)
  );
  const imageRes = await uploadBytes(chatImageRef, imageBuffer);
  const imageUrl = await getDownloadURL(imageRes.ref);
  await setDoc(
    chatRef,
    {
      image: imageUrl,
      updatedAt: new Date(),
    },
    { merge: true }
  );
};

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
    image?: Buffer;
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
    const chatParsed = await chatFromDoc(chatDoc.id, chatDoc.data()!);
    if (chat.image) {
      await addImageToChat(chatParsed, chat.image);
    }
    return chatParsed;
  },
  addImageToChat,
});
