import { chatService } from "./chat";
import { messageService } from "./message";
import { preferencesService } from "./preferences";

export const servicesCollection = {
  preferences: preferencesService(),
  chat: chatService(),
  message: messageService(),
};
