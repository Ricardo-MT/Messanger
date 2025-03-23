import { DocumentData } from "firebase/firestore";

export interface Message {
  id: string;
  chatId: string;
  seenByAll: boolean;
  seenBy: { [key: string]: boolean };
  deliveredToAll: boolean;
  deliveredTo: { [key: string]: boolean };
  text: string;
  image?: string;
  timestamp: Date;
  senderId: string;
  deleted?: boolean;
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

export const getMessageStoragePath = (
  universeId: string,
  chatId: string,
  messageId: string
) => {
  if (!universeId || typeof universeId !== "string") {
    throw new Error("Universe id is required to get message storage path");
  }
  if (!chatId || typeof chatId !== "string") {
    throw new Error("Chat id is required to get message storage path");
  }
  if (!messageId || typeof messageId !== "string") {
    throw new Error("Message id is required to get message storage path");
  }
  return `universes/${universeId}/chats/${chatId}/messages/${messageId}/`;
};

export const getMessageImageStoragePath = (
  universeId: string,
  chatId: string,
  messageId: string
) => {
  if (!universeId || typeof universeId !== "string") {
    throw new Error(
      "Universe id is required to get message image storage path"
    );
  }
  if (!chatId) {
    throw new Error("Chat id is required to get message image storage path");
  }
  if (!messageId) {
    throw new Error("Message id is required to get message image storage path");
  }
  return `${getMessageStoragePath(universeId, chatId, messageId)}image.jpg`;
};
