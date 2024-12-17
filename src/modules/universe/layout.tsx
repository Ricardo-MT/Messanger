import { NavLink, Outlet } from "react-router";
import { ROUTE_NAMES } from "../../settings/routes";
import css from "./layout.module.css";
import { useUniverse } from "./useUniverse";
import { useChat } from "./chat/useChat.ts";

export const UniverseLayout = () => {
  useUniverse();
  useChat();
  return (
    <div className={css.container}>
      <div className={css.nav}>
        <NavLink to={ROUTE_NAMES.CHAT}>Chat</NavLink>
        <NavLink to={ROUTE_NAMES.PROFILE}>Profile</NavLink>
      </div>
      <div className={css.content}>
        <Outlet />
      </div>
    </div>
  );
};
