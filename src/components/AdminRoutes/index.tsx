import { Outlet } from "react-router-dom";
import CustomSidebar from "../Sidebar";
import BreadCrump from "../BreadCrump";
import { useNavigate } from "react-router-dom";
import useToken from "@/hooks/useToken";
import { useEffect } from "react";
import Loading from "../Loader";
import useAuthStore from "@/store/auth";

const AdminRoutes = () => {
  const { token, logoutHandler } = useAuthStore();
  const navigate = useNavigate();

  const { error, isLoading } = useToken({});

  useEffect(() => {
    if (!token) navigate("/login");
    if (!!error) logoutHandler();
  }, [token, error]);

  if (isLoading) return <Loading />;

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
