import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/storeHooks";
import { manageClientState } from "../manageClientSlice";
import { manageProfilesSlice } from "./manageProfilesSlice";
import { doc, getDocs, query, where } from "firebase/firestore";
import { firestoreDb } from "../../../settings/firebaseApp";
import { collections, db } from "../../../settings/collections";
import { profileFromDoc } from "../../../interfaces/profile";
import { FirebaseError } from "firebase/app";

const { setError, success, startLoading, setProfiles } =
  manageProfilesSlice.actions;

export const useManageProfiles = () => {
  const dispatch = useAppDispatch();
  const { universe } = useAppSelector(manageClientState);
  const fetchProfilesByUniverse = async (universeId: string) => {
    dispatch(startLoading());
    try {
      const universeRef = doc(firestoreDb, collections.UNIVERSE, universeId);
      const q = query(db.profile, where("universeId", "==", universeRef));
      const profilesSnapshot = await getDocs(q);
      const profiles = profilesSnapshot.docs.map((doc) =>
        profileFromDoc(doc.id, doc.data())
      );
      dispatch(setProfiles(profiles));
      dispatch(success());
    } catch (error) {
      console.error(error);
      const message =
        (error as FirebaseError).message || "Error fetching profiles";
      dispatch(setError(message));
    }
  };
  useEffect(() => {
    if (!universe) {
      dispatch(setProfiles([]));
      return;
    }
    fetchProfilesByUniverse(universe.id);
  }, [universe]);
};
