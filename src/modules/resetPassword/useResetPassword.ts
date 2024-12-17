import { useMemo } from "react";
import { useAppDispatch } from "../../store/storeHooks";
import { resetPasswordSlice } from "./resetPasswordSlice";
import { sendPasswordResetEmail } from "firebase/auth";
import { authApp } from "../../settings/firebaseApp";
import { FirebaseError } from "firebase/app";

const { changeEmail, submit, error, success } = resetPasswordSlice.actions;

export const useResetPassword = () => {
  const dispatch = useAppDispatch();
  const value = useMemo(() => {
    return {
      onEmailChange: (value: string) => {
        dispatch(changeEmail(value));
      },
      onSubmit: ({
        event,
        email,
      }: {
        event: React.FormEvent<HTMLFormElement>;
        email: string;
      }) => {
        event.preventDefault();
        dispatch(submit());
        sendPasswordResetEmail(authApp, email)
          .then(() => {
            dispatch(success());
          })
          .catch((e) => {
            console.error(e);
            let message = "An error occurred";
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
