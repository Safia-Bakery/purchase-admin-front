import { lazy, useEffect } from "react";
import i18n from "./localization";
import { useAppSelector } from "./store/rootConfig";
import { langSelector } from "@/store/reducers/selects";
import { Route, Routes } from "react-router-dom";
import Suspend from "./components/Suspend";
import "dayjs/locale/ru";
import "react-datepicker/dist/react-datepicker.css";
import routes from "./utils/routes";
import useToken from "./hooks/useToken";

const Login = lazy(() => import("@/pages/Login"));
const AdminRoutes = lazy(() => import("@/components/AdminRoutes"));
const Categories = lazy(() => import("@/pages/Categories"));
const EditAddCategory = lazy(() => import("@/pages/EditAddCategory"));
const Orders = lazy(() => import("@/pages/Orders"));
const ShowOrder = lazy(() => import("@/pages/ShowOrder"));

const ForemenOrders = lazy(() => import("@/pages/ForemenOrders"));
const ShowForemenOrder = lazy(() => import("@/pages/ShowForemenOrder"));

const Tools = lazy(() => import("@/pages/Tools"));
const UpdateTools = lazy(() => import("@/pages/UpdateTools"));

const Foremen = lazy(() => import("@/pages/Foremen"));
const EditAddForemen = lazy(() => import("@/pages/EditAddForemen"));

const Roles = lazy(() => import("@/pages/Roles"));
const EditAddRole = lazy(() => import("@/pages/EditAddRole"));

const Users = lazy(() => import("@/pages/Users"));
const EditAddUser = lazy(() => import("@/pages/EditAddUser"));

const TgRoutes = lazy(() => import("@/components/TgRoutes"));
const SelectBranch = lazy(() => import("@/tg-routes/SelectBranch"));
const SelectProduct = lazy(() => import("@/tg-routes/SelectProduct"));
const Success = lazy(() => import("@/tg-routes/Success"));

const App = () => {
  const lang = useAppSelector(langSelector);
  const { data: me, isLoading } = useToken({});

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
        {/*        
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
              <Tools />
            </Suspend>
          }
        />

        <Route
          path={"building-materials/:id"}
          element={
            <Suspend>
              <UpdateTools />
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

        <Route
          path={"roles"}
          element={
            <Suspend>
              <Roles />
            </Suspend>
          }
        />
        <Route
          path={"roles/add"}
          element={
            <Suspend>
              <EditAddRole />
            </Suspend>
          }
        />
        <Route
          path={"roles/:id"}
          element={
            <Suspend>
              <EditAddRole />
            </Suspend>
          }
        />

        <Route
          path={"users"}
          element={
            <Suspend>
              <Users />
            </Suspend>
          }
        />
        <Route
          path={"users/add"}
          element={
            <Suspend>
              <EditAddUser />
            </Suspend>
          }
        />
        <Route
          path={"users/:id"}
          element={
            <Suspend>
              <EditAddUser />
            </Suspend>
          }
        /> */}
      </Route>
    </Routes>
  );
};

export default App;
