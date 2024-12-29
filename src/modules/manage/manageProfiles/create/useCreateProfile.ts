import { useMemo, useState } from "react";
import { useAppSelector } from "../../../../store/storeHooks";
import { manageClientState } from "../../manageClientSlice";
import { FirebaseError } from "firebase/app";
import { addDoc, doc } from "firebase/firestore";
import { collections, db } from "../../../../settings/collections";
import { firestoreDb } from "../../../../settings/firebaseApp";

type CreateProfile = {
  alias: string;
  avatar?: string;
  name: string;
};

const initialState: CreateProfile = {
  alias: "",
  avatar: "",
  name: "",
};

export const useCreateProfile = () => {
  const { universe } = useAppSelector(manageClientState);
  const [profile, setProfile] = useState<CreateProfile>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const onAliasChange = (alias: string) => setProfile({ ...profile, alias });
  const onNameChange = (name: string) => setProfile({ ...profile, name });
  const onSubmit = async () => {
    if (!universe || !profile.name || !profile.alias) {
      return;
    }
    setLoading(true);
    try {
      const universeRef = doc(firestoreDb, collections.UNIVERSE, universe!.id);
      const now = new Date();
      await addDoc(db.profile, {
        universeId: universeRef,
        alias: profile.alias,
        name: profile.name,
        createdAt: now,
        updatedAt: now,
      });
      setLoading(false);
      return true;
    } catch (error) {
      const message =
        (error as FirebaseError).message || "Error creating profile";
      setError(message);
      setLoading(false);
    }
    return false;
  };

  const value = useMemo(
    () => ({ profile, onAliasChange, onNameChange, onSubmit, loading, error }),
    [profile, loading, error]
  );
  return value;
};
