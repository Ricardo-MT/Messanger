import { DocumentData } from "firebase/firestore";

export interface Profile {
  id: string;
  alias: string;
  avatar: string;
  createdAt: string;
  name: string;
  universeId: string;
  updatedAt: string;
  userId?: string;
}

export const profileFromDoc = (id: string, data: DocumentData): Profile => {
  return {
    ...data,
    createdAt: data.createdAt.toDate().toLocaleDateString("es-ES"),
    updatedAt: data.updatedAt.toDate().toLocaleDateString("es-ES"),
    id,
  } as Profile;
};

export const getProfileAvatarStoragePath = (
  universeId: string,
  profileId: string
) => {
  if (!universeId) {
    throw new Error(
      "Universe id is required to get profile avatar storage path"
    );
  }
  if (!profileId) {
    throw new Error(
      "Profile id is required to get profile avatar storage path"
    );
  }
  return `universes/${universeId}/profiles/${profileId}/avatar.jpg`;
};
