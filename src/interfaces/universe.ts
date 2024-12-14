import { DocumentData } from "firebase/firestore";

export interface Universe {
  id: string;
  active: boolean;
  clientId: string;
  createdAt: string;
  name: string;
  updatedAt: string;
}

export const universeFromDoc = (id: string, data: DocumentData): Universe => {
  return {
    ...data,
    createdAt: data.createdAt.toDate().toLocaleDateString("es-ES"),
    updatedAt: data.updatedAt.toDate().toLocaleDateString("es-ES"),
    id,
  } as Universe;
};
