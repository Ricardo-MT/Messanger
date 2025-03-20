import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/storeHooks";
import { universeState } from "../universeSlice";
import { chatSlice } from "./chatSlice";
import { FirebaseError } from "firebase/app";
import {
  doc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  Unsubscribe,
} from "firebase/firestore";
import { Chat, chatFromDoc } from "../../../interfaces/chat";
import { collections, db } from "../../../settings/collections";
import { firestoreDb } from "../../../settings/firebaseApp";
import { Message, messageFromDoc } from "../../../interfaces/message";
import { MessageService } from "../../../services/message";

const {
  updateMessages,
  attachMessages,
  reset,
  success,
  setError,
  startLoading,
  updateChatsUpgrade,
} = chatSlice.actions;

export const useChat = (messageService: MessageService) => {
  const { profile } = useAppSelector(universeState);
  const dispatch = useAppDispatch();

  const listenToChats = useCallback(
    async (chat: Chat, latestTimestamp: Date, profileId: string) => {
      try {
        const chatRef = doc(firestoreDb, collections.CHAT, chat.id);
        const q = query(
          db.message,
          where("chatId", "==", chatRef),
          where("timestamp", ">", latestTimestamp),
          orderBy("timestamp", "desc")
        );
        return onSnapshot(q, (snapshot) => {
          const add: Message[] = [];
          const remove: string[] = [];
          const modify: Message[] = [];
          for (const change of snapshot.docChanges()) {
            if (change.type === "added") {
              add.push(messageFromDoc(change.doc.id, change.doc.data()));
            }
            if (change.type === "removed") {
              remove.push(change.doc.id);
            }
            if (change.type === "modified") {
              modify.push(messageFromDoc(change.doc.id, change.doc.data()));
            }
          }
          for (const message of add) {
            if (message.deliveredTo?.[profileId]) {
              continue;
            }
            messageService.deliveredMessageToMember(message.id, profileId);
          }
          dispatch(
            updateMessages({
              chatId: chat.id,
              add,
              remove,
              modify,
            })
          );
        });
      } catch (error) {
        console.error(error);
        dispatch(setError((error as FirebaseError).message));
      }
    },
    [dispatch]
  );

  const fetchLastMessagesFromChats = useCallback(
    async (chats: Chat[], profileId: string) => {
      const unsubscribeFromChats: Record<string, Unsubscribe | undefined> = {};
      try {
        await Promise.all(
          chats.map(async (chat) => {
            const chatRef = doc(firestoreDb, collections.CHAT, chat.id);
            const q = query(
              db.message,
              where("chatId", "==", chatRef),
              orderBy("timestamp", "desc"),
              limit(30)
            );
            const docs = await getDocs(q);
            const messages = await Promise.all(
              docs.docs.map((doc) => messageFromDoc(doc.id, doc.data()))
            );
            dispatch(
              attachMessages({
                chatId: chat.id,
                messages,
              })
            );
            setTimeout(() => {
              messages.forEach((message) => {
                if (message.deliveredTo?.[profileId]) {
                  return;
                }
                messageService.deliveredMessageToMember(message.id, profileId);
              });
            }, 0);
            const lastTimestamp = messages[0]?.timestamp || new Date();
            unsubscribeFromChats[chat.id] = await listenToChats(
              chat,
              lastTimestamp,
              profileId
            );
          })
        );
      } catch (error) {
        console.error(error);
        dispatch(setError((error as FirebaseError).message));
      }
      return () => {
        Object.keys(unsubscribeFromChats).forEach((chatId) => {
          const unsubscribe = unsubscribeFromChats[chatId];
          if (unsubscribe) {
            unsubscribe();
          }
        });
      };
    },
    []
  );

  const fetchChatsByProfile = useCallback(async (profileId: string) => {
    try {
      dispatch(startLoading());
      const profileRef = doc(firestoreDb, collections.PROFILE, profileId);
      const q = query(
        db.chat,
        where("members", "array-contains", profileRef),
        orderBy("updatedAt", "desc")
      );
      const suscriberToChats = onSnapshot(q, async (snapshot) => {
        const addedChats: Chat[] = [];
        const modifiedChats: Chat[] = [];
        const removedChats: string[] = [];
        for (const change of snapshot.docChanges()) {
          if (change.type === "added") {
            addedChats.push(
              await chatFromDoc(change.doc.id, change.doc.data())
            );
          }
          if (change.type === "modified") {
            modifiedChats.push(
              await chatFromDoc(change.doc.id, change.doc.data())
            );
          }
          if (change.type === "removed") {
            removedChats.push(change.doc.id);
          }
        }
        dispatch(
          updateChatsUpgrade({
            add: addedChats,
            modify: modifiedChats,
            remove: removedChats,
          })
        );
        if (addedChats.length) {
          fetchLastMessagesFromChats(addedChats, profileId);
        }
      });
      setTimeout(() => {
        dispatch(success());
      }, 500);
      return () => {
        suscriberToChats();
      };
    } catch (error) {
      console.error(error);
      dispatch(setError((error as FirebaseError).message));
    }
  }, []);

  useEffect(() => {
    dispatch(reset());
    if (profile?.id) {
      fetchChatsByProfile(profile.id);
    }
  }, [profile?.id]);

  const cleanup = useCallback(() => {
    dispatch(reset());
  }, []);

  return cleanup;
};
