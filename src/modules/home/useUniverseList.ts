import { useMemo } from "react";
import { Universe, universeFromDoc } from "../../interfaces/universe";
import { collections, db } from "../../settings/collections";
import { useAppDispatch, useAppSelector } from "../../store/storeHooks";
import { universeListSlice } from "./universeListSlice";
import {
  doc,
  documentId,
  DocumentReference,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { authState } from "../../contexts/authSlice";
import { FirebaseError } from "firebase/app";
import { firestoreDb } from "../../settings/firebaseApp";

const { fetchUniverseList, fetchUniverseListError, fetchUniverseListSuccess } =
  universeListSlice.actions;

export const useUniverseList = () => {
  const { user } = useAppSelector(authState);
  const dispatch = useAppDispatch();
  const value = useMemo(
    () => ({
      fetchUniverseList: async () => {
        try {
          if (!user) {
            return;
          }
          dispatch(fetchUniverseList());
          const userRef = doc(firestoreDb, collections.USER, user!.uid);
          const q = query(db.profile, where("userId", "==", userRef));

          const profilesSnapshot = await getDocs(q);
          const universesId = profilesSnapshot.docs.map((doc) => {
            return (doc.data().universeId as DocumentReference).id;
          });

          const q2 = query(
            db.universe,
            where(documentId(), "in", universesId),
            where("active", "==", true)
          );
          const universesSnapshot = await getDocs(q2);

          const universes: Universe[] = [];
          universesSnapshot.forEach((doc) => {
            universes.push(universeFromDoc(doc.id, doc.data()));
          });
          dispatch(fetchUniverseListSuccess(universes));
        } catch (error) {
          console.error(error);
          dispatch(fetchUniverseListError((error as FirebaseError).message));
        }
      },
    }),
    [dispatch, user]
  );
  return value;
};
