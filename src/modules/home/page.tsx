import { Link } from "react-router";
import { authApp } from "../../settings/firebaseApp";
import { useAppSelector } from "../../store/storeHooks";
import { UniversesList } from "./universeList";
import { ROUTE_NAMES } from "../../settings/routes";
import { useManage } from "../manage/useManage";
import { manageUniversesState } from "../manage/manageUniversesSlice";

export const HomePage = () => {
  const { universes } = useAppSelector(manageUniversesState);
  useManage();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <button
        style={{
          alignSelf: "flex-end",
        }}
        onClick={() => {
          authApp.signOut();
        }}
      >
        CERRAR SESIÓN
      </button>
      <h1>WeChat</h1>
      {!!universes.length && (
        <Link to={ROUTE_NAMES.MANAGE}>Administra tus universos</Link>
      )}
      <h2>Tus universos</h2>
      <UniversesList />
    </div>
  );
};
