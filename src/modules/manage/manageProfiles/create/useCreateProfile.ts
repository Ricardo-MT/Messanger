import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../../store/storeHooks";
import { manageClientState } from "../../manageClientSlice";
import { FirebaseError } from "firebase/app";
import { addDoc, doc, setDoc } from "firebase/firestore";
import { collections, db } from "../../../../settings/collections";
import { firestoreDb, storageApp } from "../../../../settings/firebaseApp";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

type CreateProfile = {
  alias: string;
  avatar?: File;
  name: string;
};

const initialState: CreateProfile = {
  alias: "",
  avatar: undefined,
  name: "",
};

export const useCreateProfile = () => {
  const { universe } = useAppSelector(manageClientState);
  const [profile, setProfile] = useState<CreateProfile>(initialState);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onAliasChange = (alias: string) => setProfile({ ...profile, alias });
  const onNameChange = (name: string) => setProfile({ ...profile, name });
  const onAvatarChange = (avatar: File) => setProfile({ ...profile, avatar });
  const onSubmit = async () => {
    if (!universe || !profile.name || !profile.alias) {
      return;
    }
    setLoading(true);
    try {
      const universeRef = doc(firestoreDb, collections.UNIVERSE, universe!.id);
      const now = new Date();
      const res = await addDoc(db.profile, {
        universeId: universeRef,
        alias: profile.alias,
        name: profile.name,
        createdAt: now,
        updatedAt: now,
      });
      if (profile.avatar) {
        const path = `${universe?.clientId}/${universe?.id}/profiles/${res.id}/avatar.jpg`;
        const avatarRef = ref(storageApp, path);
        const imageRes = await uploadBytes(avatarRef, profile.avatar);
        const avatarUrl = await getDownloadURL(imageRes.ref);
        await setDoc(
          doc(db.profile, res.id),
          {
            avatar: avatarUrl,
          },
          { merge: true }
        );
      }
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

  useEffect(() => {
    let urlObject = "";
    if (profile.avatar) {
      urlObject = URL.createObjectURL(profile.avatar);
      setAvatarPreview(urlObject);
    }
    return () => {
      if (urlObject) {
        URL.revokeObjectURL(urlObject);
      }
    };
  }, [profile.avatar]);

  const value = useMemo(
    () => ({
      profile,
      avatarPreview,
      onAliasChange,
      onNameChange,
      onAvatarChange,
      onSubmit,
      loading,
      error,
    }),
    [profile, avatarPreview, loading, error]
  );
  return value;
};
