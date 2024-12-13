import { Link } from "react-router";
import { ROUTE_NAMES } from "../../settings/routes";

export const HomePage = () => {
  return (
    <>
      <h1>Messanger</h1>
      <Link to={ROUTE_NAMES.LOGIN}>Go to Login</Link>
    </>
  );
};
