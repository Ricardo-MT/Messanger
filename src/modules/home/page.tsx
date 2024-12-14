import { authState } from "../../contexts/authSlice";
import { authApp } from "../../settings/firebaseApp";
import { useAppSelector } from "../../store/storeHooks";

export const HomePage = () => {
  const { user } = useAppSelector(authState);
  return (
    <>
      <h1>Messanger</h1>
      <h3>{user?.email}</h3>
      <button
        onClick={() => {
          authApp.signOut();
        }}
      >
        LOG OUT
      </button>
    </>
  );
};
