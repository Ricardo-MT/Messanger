import PWABadge from "./PWABadge.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import { ROUTE_NAMES } from "./settings/routes.ts";
import { HomePage } from "./modules/home/page.tsx";
import { LoginPage } from "./modules/login/page.tsx";
import { NotFoundPage } from "./modules/notFound/page.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path={ROUTE_NAMES.HOME} element={<HomePage />} />
          <Route path={ROUTE_NAMES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTE_NAMES.NOT_FOUND} element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <PWABadge />
    </>
  );
}

export default App;
