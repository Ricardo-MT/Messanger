import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/storeHooks";
import { chatSlice, chatState } from "./chatSlice";

const { setChat } = chatSlice.actions;

export const useChatControllers = () => {
  const dispatch = useAppDispatch();
  const { chats } = useAppSelector(chatState);

  const selectChat = useCallback(
    (chatId?: string | null) => {
      if (!chatId) {
        dispatch(setChat(null));
        return;
      }
      const chat = chats.find((chat) => chat.id === chatId);
      if (!chat) {
        return;
      }
      dispatch(setChat(chat!));
    },
    [dispatch, chats]
  );

  const value = useMemo(() => ({ selectChat }), [selectChat]);
  return value;
};
