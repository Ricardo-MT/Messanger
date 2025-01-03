import PWABadge from "./PWABadge.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ROUTE_NAMES } from "./settings/routes.ts";
import { HomePage } from "./modules/home/page.tsx";
import { LoginPage } from "./modules/login/page.tsx";
import { NotFoundPage } from "./modules/notFound/page.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { AuthProvider } from "./contexts/authProvider.tsx";
import { AuthenticatedGuard } from "./routeGuards/AuthenticatedGuard.tsx";
import { ResetPasswordPage } from "./modules/resetPassword/page.tsx";
import { ProfilePage } from "./modules/universe/profile/page.tsx";
import { UniverseLayout } from "./modules/universe/layout.tsx";
import { ChatPage } from "./modules/universe/chat/page.tsx";
import { ManageProfilesPage } from "./modules/manage/manageProfiles/page.tsx";
import { servicesCollection } from "./services/servicesCollection.ts";
import { ManageLayout } from "./modules/manage/layout.tsx";
import { ManageChatsPage } from "./modules/manage/manageChats/page.tsx";
import { UserLoading } from "./components/userLoading/UserLoading.tsx";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider preferencesService={servicesCollection.preferences}>
            <Routes>
              <Route path={ROUTE_NAMES.HOME} element={<AuthenticatedGuard />}>
                <Route index element={<HomePage />} />
                <Route path={ROUTE_NAMES.APP} element={<UniverseLayout />}>
                  <Route index element={<Navigate to={ROUTE_NAMES.CHAT} />} />
                  <Route path={ROUTE_NAMES.PROFILE} element={<ProfilePage />} />
                  <Route path={ROUTE_NAMES.CHAT} element={<ChatPage />} />
                </Route>
                <Route path={ROUTE_NAMES.MANAGE} element={<ManageLayout />}>
                  <Route
                    index
                    element={<Navigate to={ROUTE_NAMES.MANAGE_PROFILES} />}
                  />
                  <Route
                    path={ROUTE_NAMES.MANAGE_PROFILES}
                    element={<ManageProfilesPage />}
                  />
                  <Route
                    path={ROUTE_NAMES.MANAGE_CHATS}
                    element={<ManageChatsPage />}
                  />
                </Route>
              </Route>
              <Route path={ROUTE_NAMES.LOGIN} element={<LoginPage />} />
              <Route
                path={ROUTE_NAMES.RESET_PASSWORD}
                element={<ResetPasswordPage />}
              />
              <Route path={ROUTE_NAMES.NOT_FOUND} element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <UserLoading />
          </AuthProvider>
        </BrowserRouter>
      </Provider>
      <PWABadge />
    </>
  );
}

export default App;
