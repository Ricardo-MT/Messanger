import { Message } from "../../../../interfaces/message";
import { Chat } from "../../../../interfaces/chat";
import css from "../chat.module.css";
import { useAppSelector } from "../../../../store/storeHooks";
import { universeState } from "../../universeSlice";
import { useChatCompose } from "./useChatCompose";
import { ChatPicture } from "../components/ChatPicture";

type Props = {
  chat?: Chat | null;
  messages: Message[];
  onGoBack: () => void;
};

export const ChatComponent = ({ chat, messages, onGoBack }: Props) => {
  const { profile } = useAppSelector(universeState);
  const { text, setText, submit } = useChatCompose();

  if (!chat) {
    return <div>Select a chat</div>;
  }

  return (
    <>
      <div className={`${css.chatHeader} chatHeader`}>
        <span className={css.chatGoBack} onClick={() => onGoBack()}>
          Back
        </span>{" "}
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
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <textarea
          rows={1}
          value={text}
          onChange={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `calc(${e.target.scrollHeight}px - .85rem)`;
            setText(e.target.value);
          }}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            submit();
          }}
        />
        <span onClick={submit}>Send</span>
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
