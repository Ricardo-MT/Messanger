import { CSSProperties, MouseEventHandler } from "react";
import { Message } from "../../../../interfaces/message";
import { Profile } from "../../../../interfaces/profile";
import css from "../chat.module.css";
import { SeenStatus } from "./SeenStatus";
import { BiBlock } from "react-icons/bi";

export const OneMessage = ({
  message,
  mine,
  profile,
  shouldShowImage,
  onImageClick,
  shouldAnimate,
  ...rest
}: {
  message: Message;
  mine: boolean;
  profile: Profile;
  shouldShowImage?: boolean;
  onImageClick: MouseEventHandler<HTMLImageElement>;
  shouldAnimate: boolean;
}) => {
  return (
    <div
      {...rest}
      data-message-id={message.id}
      className={`messageContainer ${css.messageContainer} ${
        shouldAnimate ? css.shouldAnimate : ""
      } ${
        mine ? `myMessage ` + css.myMessage : `otherMessage ` + css.otherMessage
      }`}
    >
      {!message.deleted && (
        <span
          className={`messageProfileImage ${css.messageProfileImage}`}
          data-profile-image={(shouldShowImage && profile.avatar) || ""}
          style={
            {
              "--profile-image": `url(${profile.avatar})`,
            } as CSSProperties
          }
        ></span>
      )}
      <div className={`messageContent ${css.messageContent}`}>
        {!message.deleted ? (
          <>
            {message.image && (
              <img
                src={message.image}
                alt="message"
                className={`messageImage ${css.messageImage}`}
                onClick={onImageClick}
              />
            )}
            <span>{message.text}</span>
          </>
        ) : (
          <span className={`${css.deletedMessage} deletedMessage`}>
            <BiBlock />
            Mensaje eliminado
          </span>
        )}
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
