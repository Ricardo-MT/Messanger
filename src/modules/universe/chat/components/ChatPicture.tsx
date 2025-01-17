import { useMemo } from "react";
import { Chat } from "../../../../interfaces/chat";
import css from "../chat.module.css";
import { BiChat } from "react-icons/bi";

type Props = {
  chat: Chat;
  currentUserId?: string;
};
export const ChatPicture = ({ chat, currentUserId }: Props) => {
  const picture = useMemo(
    () =>
      chat.isGroup
        ? null
        : chat.members.find((member) => member.id !== currentUserId)?.avatar,
    [chat, currentUserId]
  );
  return (
    <div className={`chatPictureContainer ${css.chatPictureContainer}`}>
      {picture ? (
        <img
          className={`chatPicture ${css.chatPicture}`}
          src={picture}
          alt="chat"
        />
      ) : (
        <BiChat size={24} color="var(--primary)" />
      )}
    </div>
  );
};
