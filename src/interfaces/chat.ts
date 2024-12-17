import { DocumentData } from "firebase/firestore";

export interface Chat {
  id: string;
  createdAt: Date;
  createdBy: string;
  isGroup: boolean;
  members: string[];
  name: string;
  universeId: string;
  updatedAt: Date;
}

export const chatFromDoc = (id: string, data: DocumentData): Chat => {
  return {
    ...data,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
    id,
  } as Chat;
};
