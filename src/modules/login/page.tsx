import { Link } from "react-router";
import { useAppSelector } from "../../store/storeHooks";
import { loginState } from "./loginSlice";
import { useLogin } from "./useLogin.ts";
import { ROUTE_NAMES } from "../../settings/routes";

export const LoginPage = () => {
  return <LoginView />;
};

const LoginView = () => {
  const state = useAppSelector(loginState);
  const { onEmailChange, onPasswordChange, onSubmit } = useLogin();

  return (
    <>
      <h2>Bienvenido a WeChat</h2>
      <form
        onSubmit={(event) =>
          onSubmit({ event, email: state.email, password: state.password })
        }
      >
        <div>
          <input
            type="email"
            value={state.email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Email"
            autoComplete="email"
          />
        </div>
        <div>
          <input
            type="password"
            value={state.password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Contraseña"
            autoComplete="current-password"
          />
        </div>
        <div>
          <button type="submit">Entrar</button>
        </div>
      </form>
      <p>{state.error}</p>
      <div>
        <h3>¿Olvidaste tu contraseña?</h3>
        <Link to={ROUTE_NAMES.RESET_PASSWORD}>Reestablecer contraseña</Link>
      </div>
    </>
  );
};
