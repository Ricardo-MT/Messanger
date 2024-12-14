import { authState } from "../../contexts/authSlice";
import { authApp } from "../../settings/firebaseApp";
import { useAppSelector } from "../../store/storeHooks";
import { UniversesList } from "./universeList";

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
      <h2>Your universes</h2>
      <UniversesList />
    </div>
  );
};
