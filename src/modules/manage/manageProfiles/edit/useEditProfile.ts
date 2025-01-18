import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../../store/storeHooks";
import { manageUniversesState } from "../../manageUniversesSlice";
import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import { collections, db } from "../../../../settings/collections";
import { firestoreDb, storageApp } from "../../../../settings/firebaseApp";
import {
  getProfileAvatarStoragePath,
  Profile,
} from "../../../../interfaces/profile";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

type EditProfile = {
  alias: string;
  avatar?: File;
  name: string;
};

export const useEditProfile = (initialProfile: Profile) => {
  const { universe } = useAppSelector(manageUniversesState);
  const [newProfile, setProfile] = useState<EditProfile>({
    alias: initialProfile.alias,
    avatar: undefined,
    name: initialProfile.name,
  });
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const onAliasChange = (alias: string) => setProfile({ ...newProfile, alias });
  const onNameChange = (name: string) => setProfile({ ...newProfile, name });
  const onAvatarChange = (avatar: File) =>
    setProfile({ ...newProfile, avatar });
  const onSubmit = async () => {
    if (!universe || !newProfile.name || !newProfile.alias) {
      return;
    }
    setLoading(true);
    try {
      const universeRef = doc(firestoreDb, collections.UNIVERSE, universe!.id);
      const now = new Date();
      let avatarUrl = initialProfile.avatar;
      if (newProfile.avatar) {
        const path = getProfileAvatarStoragePath(
          universe.id,
          initialProfile.id
        );
        const avatarRef = ref(storageApp, path);
        const imageRes = await uploadBytes(avatarRef, newProfile.avatar);
        avatarUrl = await getDownloadURL(imageRes.ref);
      }
      await setDoc(
        doc(db.profile, initialProfile.id),
        {
          universeId: universeRef,
          alias: newProfile.alias,
          name: newProfile.name,
          avatar: avatarUrl,
          updatedAt: now,
        },
        { merge: true }
      );
      setLoading(false);
      return true;
    } catch (error) {
      const message =
        (error as FirebaseError).message || "Error creando perfil";
      setError(message);
      setLoading(false);
    }
    return false;
  };

  useEffect(() => {
    let urlObject = "";
    if (newProfile.avatar) {
      urlObject = URL.createObjectURL(newProfile.avatar);
      setAvatarPreview(urlObject);
    }
    return () => {
      if (urlObject) {
        URL.revokeObjectURL(urlObject);
      }
    };
  }, [newProfile.avatar]);

  const value = useMemo(
    () => ({
      newProfile,
      avatarPreview,
      onAliasChange,
      onNameChange,
      onAvatarChange,
      onSubmit,
      loading,
      error,
    }),
    [newProfile, avatarPreview, loading, error]
  );
  return value;
};
