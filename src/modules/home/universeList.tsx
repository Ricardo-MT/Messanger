import { useEffect } from "react";
import { useAppSelector } from "../../store/storeHooks";
import { universeListState } from "./universeListSlice";
import { useUniverseList } from "./useUniverseList";
import { useNavigate } from "react-router";
import { ROUTE_NAMES } from "../../settings/routes";

export const UniversesList = () => {
  const { universes, loading, error } = useAppSelector(universeListState);
  const { fetchUniverseList } = useUniverseList();
  const navigate = useNavigate();
  useEffect(() => {
    fetchUniverseList();
  }, [fetchUniverseList]);
  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {universes.map((universe) => (
        <div
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            backgroundColor: "#020202",
            cursor: "pointer",
          }}
          onClick={() => navigate(ROUTE_NAMES.APP)}
          key={universe.id}
        >
          <h3>{universe.name}</h3>
          <p>Creado: {universe.createdAt}</p>
          <p>Actualizado: {universe.updatedAt}</p>
        </div>
      ))}
    </>
  );
};
