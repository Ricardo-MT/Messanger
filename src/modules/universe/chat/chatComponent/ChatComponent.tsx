import { MouseEvent } from "react";
import { Message } from "../../../../interfaces/message";
import { Chat } from "../../../../interfaces/chat";
import css from "../chat.module.css";
import { useAppSelector } from "../../../../store/storeHooks";
import { universeState } from "../../universeSlice";
import { useChatCompose } from "./useChatCompose";
import { ChatPicture } from "../components/ChatPicture";
import { BiChevronLeft, BiSend } from "react-icons/bi";
import { CSSProperties, useMemo, useRef, useState } from "react";
import { Profile } from "../../../../interfaces/profile";
import { SeenStatus } from "./SeenStatus";
import { useChatComponent } from "./useChatComponent";
import { servicesCollection } from "../../../../services/servicesCollection";

type Props = {
  chat?: Chat | null;
  messages: Message[];
  onGoBack: () => void;
};

export const ChatComponent = ({ chat, messages, onGoBack }: Props) => {
  const { profile } = useAppSelector(universeState);
  const [fullScreenImage, setFullScreenImage] = useState<string | undefined>();
  const { text, setText, submit } = useChatCompose(servicesCollection.message);
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

  const chatTitle = useMemo(() => {
    if (!chat) {
      return "";
    }
    if (chat.isGroup) {
      return chat.name;
    }
    return chat.members.find((member) => member.id !== profile?.id)?.name ?? "";
  }, [chat, profile]);

  const lastSeenTimestamp = useMemo(() => {
    if (!chat || !messages.length) {
      return new Date();
    }
    const lastMessage = messages[0];
    return lastMessage?.timestamp;
  }, [chat?.id]);

  if (!chat) {
    return <div>Selecciona un chat</div>;
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
        {chatTitle}
      </div>
      <div
        className={`${css.chatBody} ${
          chat.isGroup ? css.chatBody : ""
        } chatBody`}
      >
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
          const prevMessageSenderId =
            i === 0 || typeof listItems[i - 1] === "string"
              ? null
              : (listItems[i - 1] as Message).senderId;
          // We only show the image if this is chat group, the message is not mine
          // and the previous message was not from the same sender.
          const shouldShowImage =
            chat.isGroup &&
            message.senderId !== profile?.id &&
            !(prevMessageSenderId === message.senderId);
          return (
            <OneMessage
              key={message.id}
              onImageClick={(e) => {
                e.stopPropagation();
                if (message.image) {
                  setFullScreenImage(message.image);
                }
              }}
              message={message}
              mine={message.senderId === profile?.id}
              profile={thisProfile}
              shouldShowImage={shouldShowImage}
              shouldAnimate={message.timestamp > lastSeenTimestamp}
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
      {fullScreenImage && (
        <div
          className={`${css.fullScreenImage} fullScreenImage`}
          onClick={() => setFullScreenImage(undefined)}
        >
          <img src={fullScreenImage} alt="fullScreenImage" />
        </div>
      )}
    </>
  );
};

export const OneMessage = ({
  message,
  mine,
  profile,
  shouldShowImage,
  onImageClick,
  shouldAnimate,
}: {
  message: Message;
  mine: boolean;
  profile: Profile;
  shouldShowImage?: boolean;
  onImageClick: (e: MouseEvent) => void;
  shouldAnimate: boolean;
}) => {
  useChatComponent({ message, messageService: servicesCollection.message });
  return (
    <div
      className={`messageContainer ${css.messageContainer} ${
        shouldAnimate ? css.shouldAnimate : ""
      } ${
        mine ? `myMessage ` + css.myMessage : `otherMessage ` + css.otherMessage
      }`}
    >
      <span
        className={`messageProfileImage ${css.messageProfileImage}`}
        data-profile-image={(shouldShowImage && profile.avatar) || ""}
        style={
          {
            "--profile-image": `url(${profile.avatar})`,
          } as CSSProperties
        }
      ></span>
      <div className={`messageContent ${css.messageContent}`}>
        {message.image && (
          <img
            src={message.image}
            alt="message"
            className={`messageImage ${css.messageImage}`}
            onClick={onImageClick}
          />
        )}
        <span>{message.text}</span>
        <div className={`${css.messageFooter} messageFooter`}>
          <span className="timestamp">
            {message.timestamp.toLocaleTimeString().substring(0, 5)}
          </span>
          {mine && <SeenStatus message={message} />}
        </div>
      </div>
    </div>
  );
};
