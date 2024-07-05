import Card from "@/components/Card";
import Header from "@/components/Header";
import { Link, useNavigate } from "react-router-dom";
import { MainPermissions, RoleTypes } from "@/utils/types";

import Loading from "@/components/Loader";
import { useState } from "react";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import useRoles from "@/hooks/useRoles";
import EmptyList from "@/components/EmptyList";
import { useTranslation } from "react-i18next";
import Button from "@/components/Button";
import useToken from "@/hooks/useToken";

const column = [
  { name: "№", key: "" },
  { name: "name", key: "name" },
  { name: "status", key: "status" },
  { name: "", key: "" },
];

const Roles = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = (route: string) => () => navigate(route);
  const [sort, $sort] = useState<RoleTypes[]>();
  const { data: me } = useToken({});

  const { data: roles, isLoading: rolesLoading } = useRoles({});
  if (rolesLoading) return <Loading />;

  return (
    <Card>
      <Header title={"roles"}>
        {me?.permissions?.[MainPermissions.rolesAll] && (
          <Button onClick={handleNavigate("add")}>{t("add")}</Button>
        )}
      </Header>

      <table className="table table-hover">
        <TableHead
          column={column}
          onSort={(data) => $sort(data)}
          data={roles}
        />

        {!!roles?.length && (
          <tbody>
            {(sort?.length ? sort : roles)?.map((role, idx) => (
              <tr className="bg-blue" key={role.id}>
                <td width="40">{idx + 1}</td>
                <td>{role?.name}</td>
                <td>{!role.status ? t("not_active") : t("active")}</td>
                <td width={40}>
                  {/* {me?.permission?.[MainPermissions.rolesAll] && ( */}
                  <TableViewBtn onClick={handleNavigate(`${role.id}`)} />
                  {/* )} */}
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {!roles?.length && !rolesLoading && <EmptyList />}
    </Card>
  );
};

export default Roles;
