import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/storeHooks";
import { manageClientState } from "../manageClientSlice";
import { manageProfilesSlice } from "./manageProfilesSlice";
import {
  doc,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { firestoreDb } from "../../../settings/firebaseApp";
import { collections, db } from "../../../settings/collections";
import { Profile, profileFromDoc } from "../../../interfaces/profile";
import { FirebaseError } from "firebase/app";
import { Universe } from "../../../interfaces/universe";

const { setError, setProfiles, updateProfiles } = manageProfilesSlice.actions;

export const useManageProfiles = () => {
  const dispatch = useAppDispatch();
  const { universe } = useAppSelector(manageClientState);

  const listenToProfiles = async (universe: Universe) => {
    const universeRef = doc(firestoreDb, collections.UNIVERSE, universe.id);
    const q = query(
      db.profile,
      where("universeId", "==", universeRef),
      orderBy("name", "asc")
    );
    return onSnapshot(q, (snapshot) => {
      const add: Profile[] = [];
      const remove: string[] = [];
      const modify: Profile[] = [];
      for (const change of snapshot.docChanges()) {
        const profile = profileFromDoc(change.doc.id, change.doc.data());
        switch (change.type) {
          case "added":
            add.push(profile);
            break;
          case "removed":
            remove.push(profile.id);
            break;
          case "modified":
            modify.push(profile);
            break;
        }
      }
      dispatch(updateProfiles({ add, remove, modify }));
    });
  };

  useEffect(() => {
    if (!universe) {
      dispatch(setProfiles([]));
      return;
    }
    let unsuscribe: Unsubscribe | undefined;
    listenToProfiles(universe)
      .then((fn) => {
        unsuscribe = fn;
      })
      .catch((error) => {
        console.error(error);
        dispatch(setError((error as FirebaseError).message));
      });
    return () => {
      unsuscribe && unsuscribe();
    };
  }, [universe]);
};
