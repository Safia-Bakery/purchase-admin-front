import { lazy, useEffect } from "react";
import i18n from "./localization";
import { Route, Routes } from "react-router-dom";
import Suspend from "./components/Suspend";
import "dayjs/locale/ru";
import "react-datepicker/dist/react-datepicker.css";
import routes from "./utils/routes";
import useToken from "./hooks/useToken";
import useSelectsStore from "./store/selects";

const Login = lazy(() => import("@/pages/Login"));
const AdminRoutes = lazy(() => import("@/components/AdminRoutes"));
const Orders = lazy(() => import("@/pages/Orders"));

const TgRoutes = lazy(() => import("@/components/TgRoutes"));
const SelectBranch = lazy(() => import("@/tg-routes/SelectBranch"));
const SelectProduct = lazy(() => import("@/tg-routes/SelectProduct"));
const Success = lazy(() => import("@/tg-routes/Success"));

const App = () => {
  const { lang } = useSelectsStore();
  const { data: me } = useToken({});

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <Routes>
      <Route
        element={
          <Suspend>
            <Login />
          </Suspend>
        }
        path={"/login"}
      />
      <Route
        element={
          <Suspend>
            <TgRoutes />
          </Suspend>
        }
        path={"/tg"}
      >
        <Route
          path={"select-branch"}
          element={
            <Suspend>
              <SelectBranch />
            </Suspend>
          }
        />
        <Route
          path={"select-product"}
          element={
            <Suspend>
              <SelectProduct />
            </Suspend>
          }
        />
        <Route
          path={"success/:id"}
          element={
            <Suspend>
              <Success />
            </Suspend>
          }
        />
      </Route>

      <Route
        element={
          <Suspend>
            <AdminRoutes />
          </Suspend>
        }
        path={"/"}
      >
        <Route
          index
          path="*"
          element={
            <Suspend>
              <Orders />
            </Suspend>
          }
        />
        {routes.map(
          (route) =>
            me?.permissions?.[route.permission] && (
              <Route
                key={route.url}
                path={route.url}
                element={<Suspend>{route.element}</Suspend>}
              />
            )
        )}
      </Route>
    </Routes>
  );
};

export default App;
