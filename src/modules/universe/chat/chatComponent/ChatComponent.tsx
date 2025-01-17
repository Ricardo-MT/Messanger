import { Message } from "../../../../interfaces/message";
import { Chat } from "../../../../interfaces/chat";
import css from "../chat.module.css";
import { useAppSelector } from "../../../../store/storeHooks";
import { universeState } from "../../universeSlice";
import { useChatCompose } from "./useChatCompose";
import { ChatPicture } from "../components/ChatPicture";
import { BiChevronLeft, BiSend } from "react-icons/bi";
import { useMemo, useRef } from "react";
import { Profile } from "../../../../interfaces/profile";

type Props = {
  chat?: Chat | null;
  messages: Message[];
  onGoBack: () => void;
};

export const ChatComponent = ({ chat, messages, onGoBack }: Props) => {
  const { profile } = useAppSelector(universeState);
  const { text, setText, submit } = useChatCompose();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const listItems: (Message | string)[] = useMemo(() => {
    const items: (Message | string)[] = [];
    let lastDate = messages[0]?.timestamp.toDateString() ?? "";
    messages.forEach((message) => {
      const date = message.timestamp.toDateString();
      if (date !== lastDate) {
        items.push(lastDate);
        lastDate = date;
      }
      items.push(message);
    });
    items.push(lastDate);
    return items;
  }, [messages]);

  if (!chat) {
    return <div>Select a chat</div>;
  }

  const handleSubmit = (
    e?: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLTextAreaElement>
  ) => {
    e?.preventDefault();
    e?.stopPropagation();
    textAreaRef.current?.focus();
    submit();
  };

  return (
    <>
      <div className={`${css.chatHeader} chatHeader`}>
        <BiChevronLeft
          size={24}
          className={css.chatGoBack}
          onClick={onGoBack}
        />
        <ChatPicture chat={chat} currentUserId={profile!.id} />
        {chat.members.find((member) => member.id !== profile?.id)?.name}
      </div>
      <div className={`${css.chatBody} ${chat.isGroup ? css.chatBody : ""}`}>
        {listItems.map((message, i) => {
          if (typeof message === "string") {
            return (
              <div
                key={message}
                className={`dateSeparator ${css.dateSeparator}`}
              >
                {message}
              </div>
            );
          }
          const thisProfile =
            message.senderId === profile?.id
              ? profile!
              : chat.members.find((member) => member.id === message.senderId)!;
          const shouldShowImage =
            chat.isGroup &&
            message.senderId !== profile?.id &&
            !(i > 0 && listItems[i - 1].senderId === message.senderId);
          return (
            <OneMessage
              key={message.id}
              message={message}
              mine={message.senderId === profile?.id}
              profile={thisProfile}
              shouldShowImage={shouldShowImage}
            />
          );
        })}
      </div>
      <form
        className={`${css.chatInputContainer} chatInputContainer`}
        onSubmit={handleSubmit}
      >
        <textarea
          ref={textAreaRef}
          rows={1}
          value={text}
          onChange={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `calc(${e.target.scrollHeight}px - .85rem)`;
            setText(e.target.value);
          }}
          onSubmit={handleSubmit}
        />
        <span
          className={`${css.chatSubmitButtonContainer} chatSubmitButtonContainer`}
          onClick={() => handleSubmit()}
        >
          <BiSend
            className={`${css.chatSubmitButton} chatSubmitButton`}
            size={24}
          />
        </span>
      </form>
    </>
  );
};

export const OneMessage = ({
  message,
  mine,
  profile,
  shouldShowImage,
}: {
  message: Message;
  mine: boolean;
  profile: Profile;
  shouldShowImage?: boolean;
}) => {
  return (
    <div
      className={`messageContainer ${css.messageContainer} ${
        mine ? `myMessage ` + css.myMessage : `otherMessage ` + css.otherMessage
      }`}
    >
      <span
        className={`messageProfileImage ${css.messageProfileImage}`}
        data-profile-image={(shouldShowImage && profile.avatar) || ""}
        style={{
          "--profile-image": `url(${profile.avatar})`,
        }}
      ></span>
      <div className={`messageContent ${css.messageContent}`}>
        <span>{message.text}</span>
        <span className="timestamp">
          {message.timestamp.toLocaleTimeString().substring(0, 5)}
        </span>
      </div>
    </div>
  );
};
