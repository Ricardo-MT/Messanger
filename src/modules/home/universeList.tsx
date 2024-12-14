import { useEffect } from "react";
import { useAppSelector } from "../../store/storeHooks";
import { universeListState } from "./universeListSlice";
import { useUniverseList } from "./useUniverseList";

export const UniversesList = () => {
  const { universes, loading, error } = useAppSelector(universeListState);
  const { fetchUniverseList } = useUniverseList();
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
          }}
          key={universe.id}
        >
          <h3>{universe.name}</h3>
          <p>Created at: {universe.createdAt}</p>
          <p>Updated at: {universe.updatedAt}</p>
        </div>
      ))}
    </>
  );
};
