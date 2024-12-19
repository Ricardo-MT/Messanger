import { useMemo } from "react";
import { Chat } from "../../../../interfaces/chat";
import css from "../chat.module.css";

type Props = {
  chat: Chat;
  currentUserId?: string;
};
export const ChatPicture = ({ chat, currentUserId }: Props) => {
  const picture = useMemo(
    () => chat.members.find((member) => member.id !== currentUserId)?.avatar,
    [chat.members, currentUserId]
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
        <div>{chat.name.padStart(2)}</div>
      )}
    </div>
  );
};
