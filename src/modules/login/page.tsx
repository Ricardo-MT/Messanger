import { useAppSelector } from "../../store/storeHooks";
import { loginState } from "./loginSlice";
import { useLogin } from "./useLogin";

export const LoginPage = () => {
  return <LoginView />;
};

const LoginView = () => {
  const state = useAppSelector(loginState);
  const { onEmailChange, onPasswordChange, onSubmit } = useLogin();

  return (
    <>
      <h2>Login</h2>
      <form
        onSubmit={(event) =>
          onSubmit({ event, email: state.email, password: state.password })
        }
      >
        <div>
          <input
            type="text"
            value={state.email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div>
          <input
            type="password"
            value={state.password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      <p>{state.error}</p>
    </>
  );
};
