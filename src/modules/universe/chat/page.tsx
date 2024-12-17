import { useAppSelector } from "../../../store/storeHooks";
import { ChatComponent } from "./chat";
import css from "./chat.module.css";
import { ChatList } from "./chatList";
import { chatState } from "./chatSlice";
import { useChatControllers } from "./useChatControllers";

export const ChatPage = () => {
  const { chats, chat, messages } = useAppSelector(chatState);
  const { selectChat } = useChatControllers();
  return (
    <div className={css.container}>
      <div className={css.chatList}>
        <ChatList
          chats={chats}
          selectedChatId={chat?.id}
          onSelectChat={selectChat}
        />
      </div>
      <div className={css.chatContent}>
        <ChatComponent chat={chat} messages={messages[chat?.id ?? ""] ?? []} />
      </div>
    </div>
  );
};
