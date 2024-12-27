import { useAppSelector } from "../../../store/storeHooks";
import { universeState } from "../universeSlice";
import defaultImage from "../../../assets/default-avatar.png";
import { Link } from "react-router";
import { ROUTE_NAMES } from "../../../settings/routes";

export const ProfilePage = () => {
  const { profile } = useAppSelector(universeState);
  return (
    <div>
      <h1>My profile</h1>
      <picture>
        <source srcSet={profile?.avatar} type="image/webp" />
        <img src={defaultImage} alt={profile?.name} />
      </picture>
      <p>{profile?.name || "No profile"}</p>
      <p>{profile?.alias}</p>
      <Link to={ROUTE_NAMES.HOME}>Back home</Link>
    </div>
  );
};
