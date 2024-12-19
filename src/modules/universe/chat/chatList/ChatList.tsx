import { Chat } from "../../../../interfaces/chat";
import { useAppSelector } from "../../../../store/storeHooks";
import { universeState } from "../../universeSlice";
import css from "../chat.module.css";
import { ChatPicture } from "../components/ChatPicture";

type Props = {
  chats: Chat[];
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
};
export const ChatList = ({ chats, selectedChatId, onSelectChat }: Props) => {
  const { profile } = useAppSelector(universeState);
  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`chatListItem ${css.chatListItem} ${
            chat.id === selectedChatId ? css.selectedChat : ""
          }`}
          onClick={() => onSelectChat(chat.id)}
        >
          <ChatPicture chat={chat} currentUserId={profile?.id} />
          <div className={`chatName ${css.chatName}`}>
            {chat.isGroup
              ? chat.name
              : chat.members.find((member) => member.id !== profile?.id)?.name}
          </div>
          <span className="timestamp">
            {chat.updatedAt.toLocaleTimeString().substring(0, 5)}
          </span>
        </div>
      ))}
    </>
  );
};
