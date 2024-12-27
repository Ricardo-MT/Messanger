import { Link } from "react-router";
import { authState } from "../../contexts/authSlice";
import { authApp } from "../../settings/firebaseApp";
import { useAppSelector } from "../../store/storeHooks";
import { UniversesList } from "./universeList";
import { ROUTE_NAMES } from "../../settings/routes";

export const HomePage = () => {
  const { user } = useAppSelector(authState);
  return (
    <div>
      <button
        style={{
          float: "right",
        }}
        onClick={() => {
          authApp.signOut();
        }}
      >
        LOG OUT
      </button>
      <h1>Messanger</h1>
      <h3>{user?.email}</h3>
      <Link to={ROUTE_NAMES.MANAGE}>Manage your universes</Link>
      <h2>Your universes</h2>
      <UniversesList />
    </div>
  );
};
