export interface Chat {
  id: string;
  createdAt: string;
  createdBy: string;
  isGroup: boolean;
  members: string[];
  name: string;
  universeId: string;
  updatedAt: string;
}
