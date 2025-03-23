import {
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
  addDoc,
  updateDoc,
  Timestamp,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { firestoreDb, storageApp } from "../settings/firebaseApp";
import { collections, db } from "../settings/collections";
import {
  getMessageImageStoragePath,
  Message,
  messageFromDoc,
} from "../interfaces/message";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export interface MessageService {
  removeMessagesByChat: (chatId: string) => Promise<void>;
  createMessage: (message: {
    universeId: string;
    chatId: string;
    text: string;
    image?: Buffer;
    senderId: string;
    timestamp: Date;
    members: string[];
  }) => Promise<Message>;
  createMessageFromManage: (message: {
    universeId: string;
    chatId: string;
    text: string;
    image?: Buffer;
    senderId: string;
    timestamp: Date;
    members: string[];
  }) => Promise<Message>;
  deliveredMessageToMember: (
    messageId: string,
    memberId: string
  ) => Promise<void>;
  seenMessageByMember: (messageId: string, memberId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
}

const addImageToMessage = async ({
  universeId,
  message,
  imageBuffer,
}: {
  universeId: string;
  message: Message;
  imageBuffer: Buffer;
}) => {
  const messageRef = doc(db.message, message.id);
  const path = getMessageImageStoragePath(
    universeId,
    message.chatId,
    message.id
  );
  const messageImageRef = ref(storageApp, path);
  const imageRes = await uploadBytes(messageImageRef, imageBuffer, {
    contentType: "image/jpeg",
  });
  const imageUrl = await getDownloadURL(imageRes.ref);
  await setDoc(
    messageRef,
    {
      image: imageUrl,
      updatedAt: new Date(),
    },
    { merge: true }
  );
};

export const messageService = (): MessageService => ({
  removeMessagesByChat: async (chatId: string) => {
    const chatRef = doc(firestoreDb, collections.CHAT, chatId);
    const q = query(db.message, where("chatId", "==", chatRef));
    const messages = await getDocs(q);
    await Promise.all(messages.docs.map((doc) => deleteDoc(doc.ref)));
  },
  createMessage: async (message: {
    universeId: string;
    chatId: string;
    text: string;
    image?: Buffer;
    senderId: string;
    timestamp: Date;
    members: string[];
  }) => {
    const deliveredTo: {
      [key: string]: boolean;
    } = {};
    message.members.forEach((member) => {
      deliveredTo[member] = false;
    });
    deliveredTo[message.senderId] = true;

    const chatRef = doc(firestoreDb, collections.CHAT, message.chatId);
    const senderRef = doc(firestoreDb, collections.PROFILE, message.senderId);
    const messageRef = await addDoc(db.message, {
      chatId: chatRef,
      text: message.text,
      seenByAll: false,
      seenBy: deliveredTo,
      deliveredToAll: false,
      deliveredTo,
      senderId: senderRef,
      timestamp: Timestamp.fromDate(message.timestamp),
    });
    const messageDoc = await getDoc(messageRef);
    const messageParsed = messageFromDoc(messageDoc.id, messageDoc.data()!);
    if (message.image) {
      await addImageToMessage({
        universeId: message.universeId,
        message: messageParsed,
        imageBuffer: message.image,
      });
    }
    return messageParsed;
  },
  createMessageFromManage: async (message: {
    universeId: string;
    chatId: string;
    text: string;
    image?: Buffer;
    senderId: string;
    timestamp: Date;
    members: string[];
  }) => {
    const deliveredTo: {
      [key: string]: boolean;
    } = {};
    message.members.forEach((member) => {
      deliveredTo[member] = true;
    });

    const chatRef = doc(firestoreDb, collections.CHAT, message.chatId);
    const senderRef = doc(firestoreDb, collections.PROFILE, message.senderId);
    const messageRef = await addDoc(db.message, {
      chatId: chatRef,
      text: message.text,
      seenByAll: true,
      seenBy: deliveredTo,
      deliveredToAll: true,
      deliveredTo,
      senderId: senderRef,
      timestamp: Timestamp.fromDate(message.timestamp),
    });
    const messageDoc = await getDoc(messageRef);
    const messageParsed = messageFromDoc(messageDoc.id, messageDoc.data()!);
    if (message.image) {
      await addImageToMessage({
        universeId: message.universeId,
        message: messageParsed,
        imageBuffer: message.image,
      });
    }
    return messageParsed;
  },
  deliveredMessageToMember: async (messageId: string, memberId: string) => {
    const messageRef = doc(firestoreDb, collections.MESSAGE, messageId);
    const messageDoc = await getDoc(messageRef);
    const deliveredTo =
      (messageDoc.data()!.deliveredTo as {
        [key: string]: boolean;
      }) ?? {};
    deliveredTo[memberId] = true;
    const deliveredToAll = Object.values(deliveredTo).every((value) => value);
    await updateDoc(messageRef, {
      [`deliveredTo.${memberId}`]: true,
      deliveredToAll,
    });
  },
  seenMessageByMember: async (messageId: string, memberId: string) => {
    const messageRef = doc(firestoreDb, collections.MESSAGE, messageId);
    const messageDoc = await getDoc(messageRef);
    const seenBy =
      (messageDoc.data()!.seenBy as {
        [key: string]: boolean;
      }) ?? {};
    seenBy[memberId] = true;
    const seenByAll = Object.values(seenBy).every((value) => value);
    await updateDoc(messageRef, {
      [`seenBy.${memberId}`]: true,
      seenByAll,
    });
  },
  deleteMessage: async (messageId: string) => {
    const messageRef = doc(firestoreDb, collections.MESSAGE, messageId);
    await updateDoc(messageRef, {
      deleted: true,
    });
  },
});
