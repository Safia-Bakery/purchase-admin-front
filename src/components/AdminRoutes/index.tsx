import { Outlet } from "react-router-dom";
import CustomSidebar from "../Sidebar";
import BreadCrump from "../BreadCrump";
import { useNavigate } from "react-router-dom";
import useToken from "@/hooks/useToken";
import { logoutHandler, tokenSelector } from "@/store/reducers/auth";
import { useAppDispatch, useAppSelector } from "@/store/rootConfig";
import { useEffect } from "react";
import Loading from "../Loader";

const AdminRoutes = () => {
  const token = useAppSelector(tokenSelector);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { error, isLoading } = useToken({});

  useEffect(() => {
    if (!token) navigate("/login");
    if (!!error) dispatch(logoutHandler());
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
