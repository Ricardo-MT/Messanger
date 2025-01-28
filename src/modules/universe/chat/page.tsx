import { useAppSelector } from "../../../store/storeHooks";
import { ChatComponent } from "./chatComponent/ChatComponent";
import css from "./chat.module.css";
import { ChatList } from "./chatList/ChatList";
import { chatState } from "./chatSlice";
import { useEffect, useRef } from "react";
import { useChatControllers } from "./useChatControllers";
import { LoadingComponent } from "../../../components/loadingComponent/LoadingComponent";

export const ChatPage = () => {
  const { chats, chat, messages, loading } = useAppSelector(chatState);
  const { selectChat } = useChatControllers();
  const chatComponentRef = useRef<HTMLDivElement>(null);
  const onGoBack = () => {
    chatComponentRef.current?.classList.remove(css.chatActive, "chatActive");
    setTimeout(() => {
      selectChat(null);
    }, 300);
  };
  useEffect(() => {
    if (chat) {
      chatComponentRef.current?.classList.add(css.chatActive, "chatActive");
    }
  }, [chat]);
  return (
    <>
      <div className={css.container}>
        <div className={css.chatList}>
          <p className={`appBrandName ${css.appBrandName}`}></p>
          <ChatList
            chats={chats}
            selectedChatId={chat?.id}
            onSelectChat={selectChat}
          />
        </div>
        <div
          ref={chatComponentRef}
          className={`chatContent ${css.chatContent}`}
        >
          <ChatComponent
            chat={chat}
            messages={messages[chat?.id ?? ""] ?? []}
            onGoBack={onGoBack}
          />
        </div>
      </div>
      {loading && <LoadingComponent />}
    </>
  );
};
