import { Message } from "../../../../interfaces/message";
import { Chat } from "../../../../interfaces/chat";
import css from "../chat.module.css";
import { useAppSelector } from "../../../../store/storeHooks";
import { universeState } from "../../universeSlice";
import { useChatCompose } from "./useChatCompose";
import { ChatPicture } from "../components/ChatPicture";
import { BiChevronLeft, BiSend } from "react-icons/bi";
import { useRef } from "react";

type Props = {
  chat?: Chat | null;
  messages: Message[];
  onGoBack: () => void;
};

export const ChatComponent = ({ chat, messages, onGoBack }: Props) => {
  const { profile } = useAppSelector(universeState);
  const { text, setText, submit } = useChatCompose();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
      <div className={css.chatBody}>
        {messages.map((message) => (
          <OneMessage
            key={message.id}
            message={message}
            mine={message.senderId === profile?.id}
          />
        ))}
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
}: {
  message: Message;
  mine: boolean;
}) => {
  return (
    <div
      className={`message ${css.message} ${
        mine ? `myMessage ` + css.myMessage : `otherMessage ` + css.otherMessage
      }`}
    >
      <span>{message.text}</span>
      <span className="timestamp">
        {message.timestamp.toLocaleTimeString().substring(0, 5)}
      </span>
    </div>
  );
};
