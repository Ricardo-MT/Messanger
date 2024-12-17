import { DocumentData, getDoc } from "firebase/firestore";

export interface Message {
  id: string;
  chatId: string;
  readByAll: boolean;
  text: string;
  timestamp: Date;
  senderId: string;
}

export const messageFromDoc = async (
  id: string,
  data: DocumentData
): Promise<Message> => {
  const [chatRef, profileRef] = await Promise.all([
    getDoc(data.chatId),
    getDoc(data.senderId),
  ]);
  return {
    ...data,
    timestamp: data.timestamp.toDate(),
    senderId: profileRef.id,
    chatId: chatRef.id,
    id,
  } as Message;
};
