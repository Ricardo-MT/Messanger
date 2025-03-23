import { useMemo, useRef, useState } from "react";
import { Profile } from "../../../../interfaces/profile";
import { Chat } from "../../../../interfaces/chat";
import { Message } from "../../../../interfaces/message";

type Props = {
  profile: Profile | null;
  chat: Chat | null | undefined;
  messages: Message[];
};

export const useChatComponent = ({ profile, chat, messages }: Props) => {
  const [fullScreenImage, setFullScreenImage] = useState<string | undefined>();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
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
  const value = useMemo(
    () => ({
      fullScreenImage,
      setFullScreenImage,
      textAreaRef,
      chatTitle,
      lastSeenTimestamp,
      listItems,
    }),
    [chatTitle, fullScreenImage, lastSeenTimestamp, listItems]
  );
  return value;
};
