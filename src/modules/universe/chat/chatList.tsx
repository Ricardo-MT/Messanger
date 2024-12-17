import { Chat } from "../../../interfaces/chat";
import css from "./chat.module.css";

type Props = {
  chats: Chat[];
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
};
export const ChatList = ({ chats, selectedChatId, onSelectChat }: Props) => {
  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={chat.id === selectedChatId ? css.selectedChat : ""}
          onClick={() => onSelectChat(chat.id)}
        >
          <div>{chat.name}</div>
          <div>{chat.updatedAt.toUTCString()}</div>
        </div>
      ))}
    </>
  );
};
