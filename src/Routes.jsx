import { Suspense } from "react";
import { Route, Routes as RouterRoutes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.jsx";
import RouteFallback from "./components/shell/RouteFallback.jsx";
import { BARE_ROUTES, HomePage, ROUTES } from "./routes.js";

const Routes = () => (
  <Suspense fallback={<RouteFallback />}>
    <RouterRoutes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        {ROUTES.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Route>
      {BARE_ROUTES.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </RouterRoutes>
  </Suspense>
);

export default Routes;
