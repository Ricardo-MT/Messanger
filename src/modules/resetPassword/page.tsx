import { Link } from "react-router";
import { useAppSelector } from "../../store/storeHooks";
import { resetPasswordState } from "./resetPasswordSlice";
import { useResetPassword } from "./useResetPassword";
import { ROUTE_NAMES } from "../../settings/routes";

export const ResetPasswordPage = () => {
  return <ResetPasswordView />;
};

const ResetPasswordView = () => {
  const { email, error, success } = useAppSelector(resetPasswordState);
  const { onEmailChange, onSubmit } = useResetPassword();

  return success ? (
    <>
      <h2>Check your email!</h2>
      <Link to={ROUTE_NAMES.LOGIN}>Back to login</Link>
    </>
  ) : (
    <>
      <h2>
        Type in your email, we'll send you an email with further instructions
      </h2>
      <form onSubmit={(event) => onSubmit({ event, email })}>
        <div>
          <input
            type="text"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div>
          <button type="submit">Send reset password</button>
        </div>
      </form>
      <p>{error}</p>
      <Link to={ROUTE_NAMES.LOGIN}>Back to login</Link>
    </>
  );
};
