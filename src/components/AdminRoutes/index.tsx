import { Outlet } from "react-router-dom";
import CustomSidebar from "../Sidebar";
import BreadCrump from "../BreadCrump";

const AdminRoutes = () => {
  return (
    <>
      <CustomSidebar />
      <BreadCrump />

      <div className="flex flex-col flex-1">
        <Outlet />
      </div>
    </>
  );
};

export default AdminRoutes;
