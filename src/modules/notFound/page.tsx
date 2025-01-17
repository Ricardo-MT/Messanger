import { Link } from "react-router";
import { ROUTE_NAMES } from "../../settings/routes";

export const NotFoundPage = () => {
  return (
    <>
      <h1>404 Not found</h1>
      <Link to={ROUTE_NAMES.HOME}>Ir a inicio</Link>
    </>
  );
};
