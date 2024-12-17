import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat } from "../../../interfaces/chat";
import { RootState } from "../../../store/store";
import { Message } from "../../../interfaces/message";

interface ChatState {
  chats: Chat[];
  chat: Chat | null;
  messages: Record<string, Message[]>;
  error: string;
  loading: boolean;
}

const initialState: ChatState = {
  chats: [],
  chat: null,
  messages: {},
  error: "",
  loading: true,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    appendChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = [...state.chats, ...action.payload];
    },
    removeChats: (state, action: PayloadAction<string[]>) => {
      const chatIds = action.payload;
      for (const chatId of chatIds) {
        state.chats = state.chats.filter((chat) => chat.id !== chatId);
        delete state.messages[chatId];
        if (state.chat?.id === chatId) {
          state.chat = null;
        }
      }
    },
    updateChats: (state, action: PayloadAction<Chat[]>) => {
      const chats = action.payload;
      state.chats = state.chats.map((chat) => {
        const newChat = chats.find((c) => c.id === chat.id);
        return newChat || chat;
      });
    },
    setChat: (state, action: PayloadAction<Chat | null>) => {
      state.chat = action.payload;
    },
    attachMessages: (
      state,
      action: PayloadAction<{ chatId: string; messages: Message[] }>
    ) => {
      const chatId = action.payload.chatId;
      const messages = action.payload.messages;
      state.messages[chatId] = [...(state.messages[chatId] || []), ...messages];
    },
    updateMessages: (
      state,
      action: PayloadAction<{
        chatId: string;
        add: Message[];
        modify: Message[];
        remove: string[];
      }>
    ) => {
      const { chatId, remove, add, modify } = action.payload;
      let messages = [...(state.messages[chatId] || [])]
        .filter((message) => !remove.includes(message.id))
        .map((message) => modify.find((m) => m.id === message.id) || message);

      const addFiltered = add.filter(
        (message) => !messages.find((m) => m.id === message.id)
      );

      for (const message of addFiltered) {
        let indexToInsert = messages.findIndex(
          (m) => message.timestamp > m.timestamp
        );
        if (indexToInsert === -1) {
          indexToInsert = messages.length - 1;
        }
        messages = [
          ...messages.slice(0, indexToInsert),
          message,
          ...messages.slice(indexToInsert),
        ];
      }
      state.messages = { ...state.messages, [chatId]: messages };
    },
    reset: (state) => {
      state.chats = [];
      state.chat = null;
      state.messages = {};
      state.error = "";
    },
    success: (state) => {
      state.error = "";
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    startLoading: (state) => {
      state.loading = true;
    },
  },
});

export const chatState = (state: RootState) => state.chat;
