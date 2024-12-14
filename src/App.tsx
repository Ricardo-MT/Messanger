import PWABadge from "./PWABadge.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import { ROUTE_NAMES } from "./settings/routes.ts";
import { HomePage } from "./modules/home/page.tsx";
import { LoginPage } from "./modules/login/page.tsx";
import { NotFoundPage } from "./modules/notFound/page.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { AuthProvider } from "./contexts/authProvider.tsx";
import { AuthenticatedGuard } from "./routeGuards/AuthenticatedGuard.tsx";
import { ResetPasswordPage } from "./modules/resetPassword/page.tsx";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path={ROUTE_NAMES.HOME} element={<AuthenticatedGuard />}>
                <Route index element={<HomePage />} />
              </Route>
              <Route path={ROUTE_NAMES.LOGIN} element={<LoginPage />} />
              <Route
                path={ROUTE_NAMES.RESET_PASSWORD}
                element={<ResetPasswordPage />}
              />
              <Route path={ROUTE_NAMES.NOT_FOUND} element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </Provider>
      <PWABadge />
    </>
  );
}

export default App;
