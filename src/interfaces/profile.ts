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
