import { DocumentData, DocumentReference, getDoc } from "firebase/firestore";
import { Profile, profileFromDoc } from "./profile";

export interface Chat {
  id: string;
  createdAt: Date;
  createdBy: string;
  isGroup: boolean;
  image?: string;
  members: Profile[];
  name: string;
  universeId: string;
  updatedAt: Date;
}

export const chatFromDoc = async (
  id: string,
  data: DocumentData
): Promise<Chat> => {
  // Populate members with real data
  const members = await Promise.all(
    data.members.map(async (member: DocumentReference) => {
      const profileDoc = await getDoc(member);
      const profile = profileFromDoc(
        profileDoc.id,
        profileDoc.data() as DocumentData
      );
      return profile;
    })
  );

  return {
    ...data,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
    members,
    id,
  } as Chat;
};

export const getChatImageStoragePath = (universeId: string, chatId: string) => {
  if (!universeId) {
    throw new Error("Universe id is required to get chat image storage path");
  }
  if (!chatId) {
    throw new Error("Chat id is required to get chat image storage path");
  }
  return `universes/${universeId}/chats/${chatId}/image.jpg`;
};
