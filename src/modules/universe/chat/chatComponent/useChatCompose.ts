import { FirebaseError } from "firebase/app";
import { useCallback, useEffect, useMemo, useState } from "react";
import { doc, addDoc, Timestamp } from "firebase/firestore";
import { useAppSelector } from "../../../../store/storeHooks";
import { universeState } from "../../universeSlice";
import { collections, db } from "../../../../settings/collections";
import { firestoreDb } from "../../../../settings/firebaseApp";
import { chatState } from "../chatSlice";

export const useChatCompose = () => {
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
      const profileRef = doc(firestoreDb, collections.PROFILE, profile.id);
      const chatRef = doc(firestoreDb, collections.CHAT, chat.id);
      await addDoc(db.message, {
        text,
        readByAll: false,
        senderId: profileRef,
        chatId: chatRef,
        timestamp: Timestamp.now(),
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
