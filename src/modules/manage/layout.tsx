import { Link, Outlet } from "react-router";
import { useManage } from "./useManage";
import { useEffect } from "react";
import { servicesCollection } from "../../services/servicesCollection";
import { ROUTE_NAMES } from "../../settings/routes";
import { useAppSelector } from "../../store/storeHooks";
import { manageClientState } from "./manageClientSlice";

export const ManageLayout = () => {
  useEffect(() => {
    servicesCollection.preferences.setLastModuleVisited("manage");
  }, []);
  useManage();
  const { error, loading, universes, universe } =
    useAppSelector(manageClientState);
  return (
    <>
      <Link
        style={{
          float: "right",
        }}
        to={ROUTE_NAMES.HOME}
      >
        Back home
      </Link>
      <h1>Manage your universes</h1>
      <select value={universe?.id}>
        {universes.map((universe) => (
          <option key={universe.id} value={universe.id}>
            {universe.name}
          </option>
        ))}
      </select>
      {error ? <p>{error}</p> : null}
      {loading ? <p>Loading ...</p> : <Outlet />}
    </>
  );
};
