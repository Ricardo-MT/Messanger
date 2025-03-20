import { useCallback, useEffect } from "react";
import { Message } from "../../../../interfaces/message";
import { MessageService } from "../../../../services/message";
import { useAppSelector } from "../../../../store/storeHooks";
import { universeState } from "../../universeSlice";

type Props = {
  messageService: MessageService;
  message: Message;
};
export const useChatComponent = ({ messageService, message }: Props) => {
  const { profile } = useAppSelector(universeState);
  const updateSeenStatus = useCallback(async () => {
    const id = profile?.id ?? "";

    if (message.seenBy?.[id]) {
      return;
    }
    await messageService.seenMessageByMember(message.id, id);
  }, [profile?.id]);

  useEffect(() => {
    updateSeenStatus();
  }, [updateSeenStatus]);
};
