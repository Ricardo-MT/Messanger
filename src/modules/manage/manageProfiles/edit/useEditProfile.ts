import { useMemo, useState } from "react";
import { useAppSelector } from "../../../../store/storeHooks";
import { manageClientState } from "../../manageClientSlice";
import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import { collections, db } from "../../../../settings/collections";
import { firestoreDb } from "../../../../settings/firebaseApp";
import { Profile } from "../../../../interfaces/profile";

type EditProfile = {
  alias: string;
  avatar?: string;
  name: string;
};

export const useEditProfile = (initialProfile: Profile) => {
  const { universe } = useAppSelector(manageClientState);
  const [newProfile, setProfile] = useState<EditProfile>({
    alias: initialProfile.alias,
    avatar: initialProfile.avatar,
    name: initialProfile.name,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const onAliasChange = (alias: string) => setProfile({ ...newProfile, alias });
  const onNameChange = (name: string) => setProfile({ ...newProfile, name });
  const onSubmit = async () => {
    if (!universe || !newProfile.name || !newProfile.alias) {
      return;
    }
    setLoading(true);
    try {
      const universeRef = doc(firestoreDb, collections.UNIVERSE, universe!.id);
      const now = new Date();
      await setDoc(
        doc(db.profile, initialProfile.id),
        {
          universeId: universeRef,
          alias: newProfile.alias,
          name: newProfile.name,
          updatedAt: now,
        },
        { merge: true }
      );
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
    () => ({
      newProfile,
      onAliasChange,
      onNameChange,
      onSubmit,
      loading,
      error,
    }),
    [newProfile, loading, error]
  );
  return value;
};
