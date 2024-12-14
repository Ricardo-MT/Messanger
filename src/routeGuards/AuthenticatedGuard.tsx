import { Navigate, Outlet } from "react-router";
import { authState } from "../contexts/authSlice";
import { useAppSelector } from "../store/storeHooks";
import { ROUTE_NAMES } from "../settings/routes";

export const AuthenticatedGuard = () => {
  const userState = useAppSelector(authState);

  return userState.user ? <Outlet /> : <Navigate to={ROUTE_NAMES.LOGIN} />;
};
