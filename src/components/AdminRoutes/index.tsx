import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import BreadCrump from "../BreadCrump";

const AdminRoutes = () => {
  return (
    <>
      <Sidebar />
      <BreadCrump />

      <div className="flex flex-col flex-1">
        <Outlet />
      </div>
    </>
  );
};

export default AdminRoutes;
