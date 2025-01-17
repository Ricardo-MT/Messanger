import { useAppSelector } from "../../../store/storeHooks";
import { universeState } from "../universeSlice";
import defaultImage from "../../../assets/default-avatar.png";
import { Link } from "react-router";
import { ROUTE_NAMES } from "../../../settings/routes";
import css from "./profile.module.css";

export const ProfilePage = () => {
  const { profile } = useAppSelector(universeState);
  return (
    <div className={css.container}>
      <picture>
        <source srcSet={profile?.avatar} type="image/webp" />
        <img className={css.avatar} src={defaultImage} alt={profile?.name} />
      </picture>
      <p>{profile?.name || "Sin nombre"}</p>
      <p>{profile?.alias || "Sin alias"}</p>
      <Link to={ROUTE_NAMES.HOME}>Atrás a inicio</Link>
    </div>
  );
};
