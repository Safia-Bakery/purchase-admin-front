import { lazy } from "react";
import { MainPermissions } from "./types";

const Orders = lazy(() => import("@/pages/Orders"));

const Categories = lazy(() => import("@/pages/Categories"));
const EditAddCategory = lazy(() => import("@/pages/EditAddCategory"));
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

const routes = [
  { element: <Orders />, url: "orders", permission: MainPermissions.orders },
  {
    element: <ShowOrder />,
    url: "orders/:id",
    permission: MainPermissions.ordersAll,
  },
  {
    element: <Categories />,
    url: "categories",
    permission: MainPermissions.categories,
  },
  {
    element: <EditAddCategory />,
    url: "categories/:id",
    permission: MainPermissions.categoriesAll,
  },
  {
    element: <EditAddCategory />,
    url: "categories/add",
    permission: MainPermissions.categoriesAll,
  },
  {
    element: <ForemenOrders />,
    url: "foreman-orders",
    permission: MainPermissions.foremanOrders,
  },
  {
    element: <ShowForemenOrder />,
    url: "foreman-orders/:id",
    permission: MainPermissions.foremanOrdersAdd,
  },
  {
    element: <Tools />,
    url: "building-materials",
    permission: MainPermissions.buildingMaterials,
  },
  {
    element: <UpdateTools />,
    url: "building-materials/:id",
    permission: MainPermissions.buildingMaterials,
  },
  { element: <Foremen />, url: "foremen", permission: MainPermissions.foremen },
  {
    element: <EditAddForemen />,
    url: "foremen/add",
    permission: MainPermissions.foremenAll,
  },
  {
    element: <EditAddForemen />,
    url: "foremen/:id",
    permission: MainPermissions.foremenAll,
  },
  { element: <Roles />, url: "roles", permission: MainPermissions.roles },
  {
    element: <EditAddRole />,
    url: "roles/add",
    permission: MainPermissions.rolesAll,
  },
  {
    element: <EditAddRole />,
    url: "roles/:id",
    permission: MainPermissions.rolesAll,
  },
  { element: <Users />, url: "users", permission: MainPermissions.users },
  {
    element: <EditAddUser />,
    url: "users/add",
    permission: MainPermissions.usersAll,
  },
  {
    element: <EditAddUser />,
    url: "users/:id",
    permission: MainPermissions.usersAll,
  },
];
export default routes;
