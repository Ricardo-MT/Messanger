import { onAuthStateChanged } from "firebase/auth";
import { PropsWithChildren, useEffect } from "react";
import { authApp } from "../settings/firebaseApp";
import { useAppDispatch, useAppSelector } from "../store/storeHooks";
import { authSlice, authState } from "./authSlice";
import { useNavigate } from "react-router";
import { ROUTE_NAMES } from "../settings/routes";

const { setUser, clearUser } = authSlice.actions;

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(authState);
  const navigate = useNavigate();

  useEffect(() => {
    if (userState.loading) return;
    if (userState.user) {
      navigate(ROUTE_NAMES.HOME);
    } else {
      navigate(ROUTE_NAMES.LOGIN);
    }
  }, [navigate, userState.loading, userState.user]);

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
