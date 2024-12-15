import { useAppSelector } from "../../../store/storeHooks";
import { universeState } from "../universeSlice";
import { useUniverse } from "../useUniverse";
import defaultImage from "../../../assets/default-avatar.png";

export const ProfilePage = () => {
  const { profile } = useAppSelector(universeState);
  useUniverse();
  return (
    <div>
      <h1>My profile</h1>
      <picture>
        <source srcSet={profile?.avatar} type="image/webp" />
        <img src={defaultImage} alt={profile?.name} />
      </picture>
      <p>{profile?.name || "No profile"}</p>
      <p>{profile?.alias}</p>
    </div>
  );
};
