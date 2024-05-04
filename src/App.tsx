import { lazy, useEffect } from "react";
import i18n from "./localization";
import { useAppSelector } from "./store/rootConfig";
import { langSelector } from "@/store/reducers/selects";
import { Route, Routes } from "react-router-dom";
import Suspend from "./components/Suspend";
import "dayjs/locale/ru";

const Login = lazy(() => import("@/pages/Login"));
const AdminRoutes = lazy(() => import("@/components/AdminRoutes"));
const Categories = lazy(() => import("@/pages/Categories"));
const EditAddCategory = lazy(() => import("@/pages/EditAddCategory"));
const Orders = lazy(() => import("@/pages/Orders"));
const ShowOrder = lazy(() => import("@/pages/ShowOrder"));

const ForemenOrders = lazy(() => import("@/pages/ForemenOrders"));
const ShowForemenOrder = lazy(() => import("@/pages/ShowForemenOrder"));

const BuildingMaterials = lazy(() => import("@/pages/BuildingMaterials"));

const Foremen = lazy(() => import("@/pages/Foremen"));
const EditAddForemen = lazy(() => import("@/pages/EditAddForemen"));

const TgRoutes = lazy(() => import("@/components/TgRoutes"));
const SelectBranch = lazy(() => import("@/tg-routes/SelectBranch"));
const SelectProduct = lazy(() => import("@/tg-routes/SelectProduct"));
const Success = lazy(() => import("@/tg-routes/Success"));

const App = () => {
  const lang = useAppSelector(langSelector);

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
          path={"orders"}
          element={
            <Suspend>
              <Orders />
            </Suspend>
          }
        />
        <Route
          path={"orders/:id"}
          element={
            <Suspend>
              <ShowOrder />
            </Suspend>
          }
        />
        <Route
          path={"categories"}
          element={
            <Suspend>
              <Categories />
            </Suspend>
          }
        />
        <Route
          path={"categories/:id"}
          element={
            <Suspend>
              <EditAddCategory />
            </Suspend>
          }
        />
        <Route
          path={"categories/add"}
          element={
            <Suspend>
              <EditAddCategory />
            </Suspend>
          }
        />
        <Route
          path={"foreman-orders"}
          element={
            <Suspend>
              <ForemenOrders />
            </Suspend>
          }
        />
        <Route
          path={"foreman-orders/:id"}
          element={
            <Suspend>
              <ShowForemenOrder />
            </Suspend>
          }
        />

        <Route
          path={"building-materials"}
          element={
            <Suspend>
              <BuildingMaterials />
            </Suspend>
          }
        />

        <Route
          path={"foremen"}
          element={
            <Suspend>
              <Foremen />
            </Suspend>
          }
        />
        <Route
          path={"foremen/add"}
          element={
            <Suspend>
              <EditAddForemen />
            </Suspend>
          }
        />
        <Route
          path={"foremen/:id"}
          element={
            <Suspend>
              <EditAddForemen />
            </Suspend>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
