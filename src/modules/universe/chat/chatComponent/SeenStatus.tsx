import { useMemo } from "react";
import { Message } from "../../../../interfaces/message";
import { messageSeenStatus } from "../../../../settings/messageSeenStatus";

export const SeenStatus = ({ message }: { message: Message }) => {
  const status = useMemo(() => {
    if (message.seenByAll) {
      return messageSeenStatus.seen;
    }
    if (message.deliveredToAll) {
      return messageSeenStatus.delivered;
    }
    return messageSeenStatus.sent;
  }, [message]);

  return <span data-message-seen-status={status}></span>;
};
