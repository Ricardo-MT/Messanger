import { Message } from "../../../interfaces/message";
import { Chat } from "../../../interfaces/chat";
import css from "./chat.module.css";
import { useAppSelector } from "../../../store/storeHooks";
import { universeState } from "../universeSlice";
import { useChatCompose } from "./useChatCompose";

type Props = {
  chat?: Chat | null;
  messages: Message[];
};

export const ChatComponent = ({ chat, messages }: Props) => {
  const { profile } = useAppSelector(universeState);
  const { text, setText, submit } = useChatCompose();
  if (!chat) {
    return <div>Select a chat</div>;
  }

  return (
    <>
      <div className={css.chatHeader}>
        {chat.name} - {chat.updatedAt.toUTCString()}
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
        className={css.chatInputContainer}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        />
        <button onClick={submit}>Send</button>
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
      className={`${css.message} ${mine ? css.myMessage : css.otherMessage}`}
    >
      <div>{message.text}</div>
      <div>{message.timestamp.toUTCString()}</div>
    </div>
  );
};
