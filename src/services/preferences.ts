const LAST_MODULE_VISITED = "LAST_MODULE_VISITED";

type MODULES = "app" | "manage";

export interface PreferencesService {
  getLastModuleVisited: () => MODULES | null;
  setLastModuleVisited: (module: MODULES) => void;
}

export const preferencesService = (): PreferencesService => ({
  getLastModuleVisited: () =>
    localStorage.getItem(LAST_MODULE_VISITED) as MODULES,
  setLastModuleVisited: (module: "app" | "manage") =>
    localStorage.setItem(LAST_MODULE_VISITED, module),
});
