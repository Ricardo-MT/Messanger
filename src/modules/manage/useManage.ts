import { useEffect } from "react";
import { authState } from "../../contexts/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/storeHooks";
import { manageUniversesSlice } from "./manageUniversesSlice";
import { FirebaseError } from "firebase/app";
import { doc, getDocs, query, where } from "firebase/firestore";
import { firestoreDb } from "../../settings/firebaseApp";
import { collections, db } from "../../settings/collections";
import { universeFromDoc } from "../../interfaces/universe";

const { setUniverses, setUniverse, success, setError, startLoading } =
  manageUniversesSlice.actions;

export const useManage = () => {
  const { user } = useAppSelector(authState);
  const dispatch = useAppDispatch();

  const fetchUniversesToManage = async (userId: string) => {
    dispatch(startLoading());
    try {
      const userRef = doc(firestoreDb, collections.USER, userId);
      const q = query(
        db.universe,
        where("managers", "array-contains", userRef)
      );
      const universesSnapshot = await getDocs(q);
      const universes = universesSnapshot.docs.map((doc) => {
        return universeFromDoc(doc.id, doc.data());
      });
      dispatch(setUniverses(universes));
      if (universes.length > 0) {
        dispatch(setUniverse(universes[0]));
      }
      dispatch(success());
    } catch (error) {
      console.error(error);
      const message =
        (error as FirebaseError).message || "Error cargando universos";
      dispatch(setError(message));
    }
  };

  useEffect(() => {
    if (!user) {
      dispatch(setUniverses([]));
      dispatch(setUniverse(null));
      return;
    }
    fetchUniversesToManage(user.uid);
  }, [user]);
};
