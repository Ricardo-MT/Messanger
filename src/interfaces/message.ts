import { DocumentData } from "firebase/firestore";

export interface Message {
  id: string;
  chatId: string;
  readByAll: boolean;
  text: string;
  timestamp: Date;
  senderId: string;
}

export const messageFromDoc = (id: string, data: DocumentData): Message => {
  return {
    ...data,
    timestamp: data.timestamp.toDate(),
    senderId: data.senderId.id,
    chatId: data.chatId.id,
    id,
  } as Message;
};
