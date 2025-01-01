import { Link, NavLink, Outlet } from "react-router";
import { useManage } from "./useManage";
import { useEffect } from "react";
import { servicesCollection } from "../../services/servicesCollection";
import { ROUTE_NAMES } from "../../settings/routes";
import { useAppSelector } from "../../store/storeHooks";
import { manageClientState } from "./manageClientSlice";
import { useManageProfiles } from "./manageProfiles/useManageProfile";
import css from "./manage.module.css";

export const ManageLayout = () => {
  useEffect(() => {
    servicesCollection.preferences.setLastModuleVisited("manage");
  }, []);
  useManage();
  useManageProfiles();
  const { error, loading, universes, universe } =
    useAppSelector(manageClientState);
  return (
    <div className={css.container}>
      <div className={css.navigator}>
        <h3>Manage your universes</h3>
        <Link to={ROUTE_NAMES.HOME}>Back home</Link>
        <select defaultValue={universe?.id}>
          {universes.map((universe) => (
            <option key={universe.id} value={universe.id}>
              {universe.name}
            </option>
          ))}
        </select>
        <NavLink to={ROUTE_NAMES.MANAGE_PROFILES}>Profiles</NavLink>
        <NavLink to={ROUTE_NAMES.MANAGE_CHATS}>Chats</NavLink>
      </div>
      <div className={css.content}>
        {error ? <p>{error}</p> : null}
        {loading ? <p>Loading ...</p> : <Outlet />}
      </div>
    </div>
  );
};
