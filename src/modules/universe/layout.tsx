import { NavLink, Outlet } from "react-router";
import { ROUTE_NAMES } from "../../settings/routes";
import css from "./layout.module.css";
import { useUniverse } from "./useUniverse";
import { useChat } from "./chat/useChat.ts";
import { BiSolidChat, BiSolidCog } from "react-icons/bi";
import { servicesCollection } from "../../services/servicesCollection.ts";
import { useEffect } from "react";

export const UniverseLayout = () => {
  useEffect(() => {
    servicesCollection.preferences.setLastModuleVisited("app");
  }, []);
  useUniverse();
  useChat();

  return (
    <div className={css.container}>
      <div className={css.nav}>
        <NavLink to={ROUTE_NAMES.CHAT}>
          <BiSolidChat size={24} />
        </NavLink>
        <NavLink to={ROUTE_NAMES.PROFILE}>
          <BiSolidCog size={24} />
        </NavLink>
      </div>
      <div className={css.content}>
        <Outlet />
      </div>
    </div>
  );
};
