import Card from "@/components/Card";
import Header from "@/components/Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BtnTypes, MainPermissions } from "@/utils/types";
import Pagination from "@/components/Pagination";
import { handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import useToken from "@/hooks/useToken";
import useUsers from "@/hooks/useUsers";
import Button from "@/components/Button";

const column = [
  { name: "№", key: "" },
  { name: "ФИО", key: "full_name" },
  { name: "Роль", key: "group.name" },
  { name: "Телефон", key: "phone_number" },
  { name: "status", key: "status" },
  { name: "", key: "" },
];

const Users = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = (route: string) => () => navigate(route);
  const { pathname } = useLocation();
  const { data: me } = useToken({});
  const client = useQueryString("client");
  const currentPage = Number(useQueryString("page")) || 1;
  const { data: users, isLoading: orderLoading } = useUsers({
    page: currentPage,
  });

  return (
    <Card>
      <Header title={!client ? "users" : "client"}>
        {me?.permissions?.[MainPermissions.usersAll] && (
          <Button btnType={BtnTypes.primary} onClick={handleNavigate("add")}>
            {t("add")}
          </Button>
        )}
      </Header>

      <div className="p-3">
        <ItemsCount data={users} />
        <table className="table table-hover">
          <TableHead column={column} data={users?.items} />

          <tbody>
            {!!users?.items?.length &&
              !orderLoading &&
              users?.items.map((user, idx) => (
                <tr className="bg-blue" key={idx}>
                  <td width="40">{handleIdx(idx)}</td>
                  <td>{user.name || t("not_given")}</td>
                  <td width={250}>
                    {user.role?.id ? (
                      <Link
                        to={
                          me?.permissions?.[MainPermissions.rolesAll]
                            ? `/roles/${user?.role?.id}`
                            : pathname
                        }
                      >
                        {user.role?.name}
                      </Link>
                    ) : (
                      t("not_given")
                    )}
                  </td>
                  <td>{user?.phone || t("not_given")}</td>
                  <td>{!user?.status ? t("not_active") : t("active")}</td>
                  <td width={40}>
                    {me?.permissions?.[MainPermissions.usersAll] && (
                      <TableViewBtn onClick={handleNavigate(`${user?.id}`)} />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {orderLoading && <Loading />}
        {!users?.items?.length && !orderLoading && <EmptyList />}
        {!!users && <Pagination totalPages={users.pages} />}
      </div>
    </Card>
  );
};

export default Users;
