import { onAuthStateChanged } from "firebase/auth";
import { PropsWithChildren, useEffect } from "react";
import { authApp } from "../settings/firebaseApp";
import { useAppDispatch, useAppSelector } from "../store/storeHooks";
import { authSlice, authState } from "./authSlice";
import { useNavigate } from "react-router";
import { ROUTE_NAMES } from "../settings/routes";
import { PreferencesService } from "../services/preferences";

const { setUser, clearUser } = authSlice.actions;

export const AuthProvider = ({
  children,
  preferencesService,
}: PropsWithChildren & {
  preferencesService: PreferencesService;
}) => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(authState);
  const navigate = useNavigate();

  useEffect(() => {
    if (userState.loading) return;
    if (userState.user) {
      const lastModule = preferencesService.getLastModuleVisited();
      switch (lastModule) {
        case "app":
          navigate(ROUTE_NAMES.APP);
          break;
        case "manage":
          navigate(ROUTE_NAMES.MANAGE);
          break;
        default:
          navigate(ROUTE_NAMES.HOME);
          break;
      }
    } else {
      navigate(ROUTE_NAMES.LOGIN);
    }
  }, [userState.loading, userState.user]);

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(authApp, (user) => {
      if (user) {
        dispatch(setUser({ user }));
      } else {
        dispatch(clearUser());
      }
    });
    return () => {
      unsuscribe();
    };
  }, [dispatch]);
  return children;
};
