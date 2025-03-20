import { FirebaseError } from "firebase/app";
import { useCallback, useEffect, useMemo, useState } from "react";
// import { doc, addDoc, Timestamp } from "firebase/firestore";
import { useAppSelector } from "../../../../store/storeHooks";
import { universeState } from "../../universeSlice";
// import { collections, db } from "../../../../settings/collections";
// import { firestoreDb } from "../../../../settings/firebaseApp";
import { chatState } from "../chatSlice";
import { MessageService } from "../../../../services/message";

export const useChatCompose = (messageService: MessageService) => {
  const { profile } = useAppSelector(universeState);
  const { chat } = useAppSelector(chatState);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    setText("");
  }, [chat, profile]);
  const submit = useCallback(async () => {
    if (!text || !profile || !chat) {
      return;
    }
    try {
      setText("");
      setError("");
      await messageService.createMessage({
        universeId: profile.universeId,
        chatId: chat.id,
        text,
        senderId: profile.id,
        timestamp: new Date(),
        members: chat.members.map((member) => member.id),
      });
    } catch (e) {
      console.error(e);
      setError((e as FirebaseError).message);
    }
  }, [chat, profile, text]);
  const value = useMemo(
    () => ({ text, setText, error, submit }),
    [text, error, submit]
  );
  return value;
};
