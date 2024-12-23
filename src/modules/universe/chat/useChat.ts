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
} from "firebase/firestore";
import { Chat, chatFromDoc } from "../../../interfaces/chat";
import { collections, db } from "../../../settings/collections";
import { firestoreDb } from "../../../settings/firebaseApp";
import { Message, messageFromDoc } from "../../../interfaces/message";

const {
  setChats,
  appendChats,
  updateChats,
  removeChats,
  updateMessages,
  attachMessages,
  reset,
  success,
  setError,
  startLoading,
} = chatSlice.actions;

export const useChat = () => {
  const { profile, universe } = useAppSelector(universeState);
  const dispatch = useAppDispatch();
  // const { chats, chat } = useAppSelector(chatState);

  // useEffect(() => {
  //   if (!chat && chats.length) {
  //     dispatch(setChat(chats[0]));
  //   }
  // }, [chats, chat]);

  const listenToChats = useCallback(
    async (chat: Chat, latestTimestamp: Date) => {
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

  const fetchLastMessagesFromChats = useCallback(async (chats: Chat[]) => {
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
          const lastTimestamp = messages[0].timestamp;
          listenToChats(chat, lastTimestamp);
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(setError((error as FirebaseError).message));
    }
  }, []);

  const fetchChatsByProfile = useCallback(
    async (profileId: string, universeId: string) => {
      try {
        dispatch(startLoading());
        const profileRef = doc(firestoreDb, collections.PROFILE, profileId);
        const universeRef = doc(firestoreDb, collections.UNIVERSE, universeId);
        const q = query(
          db.chat,
          where("universeId", "==", universeRef),
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
          if (modifiedChats.length) {
            dispatch(updateChats(modifiedChats));
          }
          if (removedChats.length) {
            dispatch(removeChats(removedChats));
          }
          if (addedChats.length) {
            dispatch(appendChats(addedChats));
            fetchLastMessagesFromChats(addedChats);
          }
        });
        dispatch(success());
        return () => {
          suscriberToChats();
        };
      } catch (error) {
        console.error(error);
        dispatch(setError((error as FirebaseError).message));
      }
    },
    []
  );

  useEffect(() => {
    dispatch(reset());
    if (profile) {
      fetchChatsByProfile(profile.id, universe!.id);
    } else {
      dispatch(setChats([]));
    }
    return () => {
      dispatch(setChats([]));
    };
  }, [profile]);
};
