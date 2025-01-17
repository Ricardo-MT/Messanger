import { useMemo } from "react";
import { useAppDispatch } from "../../store/storeHooks";
import { loginSlice } from "./loginSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authApp } from "../../settings/firebaseApp";
import { FirebaseError } from "firebase/app";

const { field, submit, error } = loginSlice.actions;

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const value = useMemo(() => {
    return {
      onEmailChange: (value: string) => {
        dispatch(field({ field: "email", value }));
      },
      onPasswordChange: (value: string) => {
        dispatch(field({ field: "password", value }));
      },
      onSubmit: ({
        event,
        email,
        password,
      }: {
        event: React.FormEvent<HTMLFormElement>;
        email: string;
        password: string;
      }) => {
        event.preventDefault();
        dispatch(submit());
        signInWithEmailAndPassword(authApp, email, password)
          .then(() => {})
          .catch((e) => {
            console.error(e);
            let message = "Ha ocurrido un error";
            switch (true) {
              case e instanceof FirebaseError:
                message = e.code;
                break;

              default:
                break;
            }
            dispatch(error({ error: message }));
          });
      },
    };
  }, [dispatch]);
  return value;
};
