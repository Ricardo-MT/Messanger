export interface Message {
  id: string;
  chatId: string;
  readByAll: boolean;
  text: string;
  timestamp: string;
  senderId: string;
}
