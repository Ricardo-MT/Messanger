import { useCallback, useEffect, useMemo } from "react";
import { Universe, universeFromDoc } from "../../interfaces/universe";
import { collections, db } from "../../settings/collections";
import { useAppDispatch, useAppSelector } from "../../store/storeHooks";
import { universeSlice, universeState } from "./universeSlice";
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
import { profileFromDoc } from "../../interfaces/profile";

const { startLoading, setUniverses, setUniverse, setProfile, setError, reset } =
  universeSlice.actions;

export const useUniverse = () => {
  const { user } = useAppSelector(authState);
  const { universe, universes } = useAppSelector(universeState);

  const dispatch = useAppDispatch();
  const fetchUniverseList = useCallback(async () => {
    try {
      if (!user) {
        return;
      }
      dispatch(startLoading());
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
      dispatch(setUniverses(universes));
      dispatch(setUniverse(universes[0]));
    } catch (error) {
      console.error(error);
      dispatch(setError((error as FirebaseError).message));
    }
  }, [user]);

  const fetchProfileByUniverse = useCallback(
    async (universeId: string, userId: string) => {
      try {
        const universeRef = doc(firestoreDb, collections.UNIVERSE, universeId);
        const userRef = doc(firestoreDb, collections.USER, userId);
        const q = query(
          db.profile,
          where("universeId", "==", universeRef),
          where("userId", "==", userRef)
        );
        const profileSnapshot = await getDocs(q);
        if (profileSnapshot.empty) {
          dispatch(setProfile(null));
          return;
        }
        const document = profileSnapshot.docs[0];
        const profile = profileFromDoc(document.id, document.data());
        dispatch(setProfile(profile));
      } catch (error) {
        console.error(error);
        dispatch(setError((error as FirebaseError).message));
      }
    },
    []
  );

  const selectUniverse = useCallback(
    (universeId: string) => {
      const universe = universes.find((u) => u.id === universeId);
      if (!universe) {
        return;
      }
      dispatch(setUniverse(universe));
    },
    [dispatch, universes]
  );

  useEffect(() => {
    if (universe && user) {
      fetchProfileByUniverse(universe.id, user!.uid);
    }
  }, [universe?.id, user?.uid]);

  useEffect(() => {
    fetchUniverseList();
  }, [fetchUniverseList]);

  const cleanup = useCallback(() => {
    dispatch(reset());
  }, []);

  const value = useMemo(
    () => ({
      selectUniverse,
      cleanup,
    }),
    [selectUniverse, cleanup]
  );
  return value;
};
