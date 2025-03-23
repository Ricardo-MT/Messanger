import { Message } from "../../../../interfaces/message";
import { Chat } from "../../../../interfaces/chat";
import css from "../chat.module.css";
import { useAppSelector } from "../../../../store/storeHooks";
import { universeState } from "../../universeSlice";
import { useChatCompose } from "./useChatCompose";
import { ChatPicture } from "../components/ChatPicture";
import {
  BiChevronLeft,
  BiSend,
  BiSolidTrash,
  BiTrashAlt,
  BiReply,
  BiReplyAll,
  BiCopy,
  BiEdit,
  BiWorld,
  BiPin,
} from "react-icons/bi";
import { servicesCollection } from "../../../../services/servicesCollection";
import { useChatComponent } from "./useChatComponent";
import { ContextMenu } from "../../../../components/contextMenu/ContextMenu";
import { OneMessage } from "./OneMessage";

type Props = {
  chat?: Chat | null;
  messages: Message[];
  onGoBack: () => void;
};

export const ChatComponent = ({ chat, messages, onGoBack }: Props) => {
  const { profile } = useAppSelector(universeState);
  const { text, setText, submit } = useChatCompose(servicesCollection.message);
  const {
    fullScreenImage,
    setFullScreenImage,
    textAreaRef,
    chatTitle,
    lastSeenTimestamp,
    listItems,
    handleOnDeleteMessage,
  } = useChatComponent({
    profile,
    chat,
    messages,
    messageService: servicesCollection.message,
  });

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
          const isMine = message.senderId === profile?.id;
          const isSameAsPrev = prevMessageSenderId === message.senderId;
          // We only show the image if this is chat group, the message is not mine
          // and the previous message was not from the same sender.
          const shouldShowImage = chat.isGroup && !isMine && !isSameAsPrev;
          const component = (
            <OneMessage
              key={"oneMessage" + message.id}
              onImageClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (message.image) {
                  setFullScreenImage(message.image);
                }
              }}
              message={message}
              mine={isMine}
              profile={thisProfile}
              shouldShowImage={shouldShowImage}
              shouldAnimate={message.timestamp > lastSeenTimestamp}
            />
          );

          return isMine ? (
            <ContextMenu
              key={message.id}
              options={[
                {
                  label: "Responder",
                  onClick: () => {
                    console.log("Responder");
                  },
                  icon: BiReply,
                },
                {
                  label: "Reenviar",
                  onClick: () => {
                    console.log("Reenviar");
                  },
                  icon: BiReplyAll,
                },
                {
                  label: "Copiar",
                  onClick: () => {
                    console.log("Copiar");
                  },
                  icon: BiCopy,
                },
                {
                  label: "Editar",
                  onClick: () => {
                    console.log("Editar");
                  },
                  icon: BiEdit,
                },
                {
                  label: "Traducir",
                  onClick: () => {
                    console.log("Traducir");
                  },
                  icon: BiWorld,
                },
                {
                  label: "Anclar",
                  onClick: () => {
                    console.log("Anclar");
                  },
                  icon: BiPin,
                },
                {
                  label: "Borrar",
                  onClick: () => {
                    handleOnDeleteMessage(message);
                  },
                  icon: BiTrashAlt,
                  iconColor: "var(--error)",
                },
                {
                  label: "Borrar sin rastros",
                  onClick: () => {
                    console.log("Borrar sin rastros");
                  },
                  icon: BiSolidTrash,
                  iconColor: "var(--error)",
                },
              ]}
            >
              {component}
            </ContextMenu>
          ) : (
            component
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
