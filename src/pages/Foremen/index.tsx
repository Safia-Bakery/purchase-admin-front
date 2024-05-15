import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import Pagination from "@/components/Pagination";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { BtnTypes, ClientType } from "@/utils/types";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { ColumnDef } from "@tanstack/react-table";
import VirtualTable from "@/components/VirtualTable";
import useClients from "@/hooks/useClients";

const Foremen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const page = Number(useQueryString("page")) || 1;
  const {
    data: foremen,
    isLoading,
    isFetching,
  } = useClients({
    page,
  });

  const columns = useMemo<ColumnDef<ClientType>[]>(
    () => [
      {
        accessorKey: "id",
        size: 5,
        header: "№",
        cell: ({ row }) => row.original.id,
      },
      {
        accessorKey: "name",
        header: t("name"),
        cell: ({ row }) => row.original?.name,
      },
      {
        accessorKey: "status",
        header: t("status"),
        cell: ({ row }) =>
          !!row.original?.status ? t("active") : t("inactive"),
      },
    ],
    []
  );

  if (isLoading) return <Loading />;

  return (
    <Card>
      <Header title={"foremen"}>
        <div className="flex gap-2">
          <Button btnType={BtnTypes.primary} onClick={() => navigate(-1)}>
            {t("back")}
          </Button>
        </div>
      </Header>

      <div className="p-4">
        <div className="table-responsive grid-view">
          <ItemsCount data={foremen} />
          <VirtualTable columns={columns} data={foremen?.items} />
          {isFetching && <Loading />}

          {!!foremen && <Pagination totalPages={foremen.pages} />}
        </div>
      </div>
    </Card>
  );
};

export default Foremen;
