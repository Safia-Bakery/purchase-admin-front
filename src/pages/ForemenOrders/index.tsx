import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import Pagination from "@/components/Pagination";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { BtnTypes, ExpenditureType, OrderStatus } from "@/utils/types";
import Header from "@/components/Header";
import Button from "@/components/Button";
import useExpenditure from "@/hooks/useExpenditure";
import { ColumnDef } from "@tanstack/react-table";
import VirtualTable from "@/components/VirtualTable";
import cl from "classnames";
import dayjs from "dayjs";
import { dateTimeFormat } from "@/utils/helpers";

const ForemenOrders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const page = Number(useQueryString("page")) || 1;
  const {
    data: orders,
    isLoading,
    isFetching,
  } = useExpenditure({
    page,
  });

  const columns = useMemo<ColumnDef<ExpenditureType>[]>(
    () => [
      {
        accessorKey: "id",
        size: 5,
        header: "№",
        cell: ({ row }) => (
          <Link className="text-blue-500" to={`${row.original.id}`}>
            {row.original.id}
          </Link>
        ),
      },
      {
        accessorKey: "name",
        header: t("foreman"),
        cell: ({ row }) => row.original?.client?.name,
      },
      {
        accessorKey: "branch",
        header: t("branch"),
        cell: ({ row }) => row.original?.branch?.name,
      },
      {
        accessorKey: "created_at",
        header: t("order_created_date"),
        cell: ({ row }) =>
          dayjs(row.original?.created_at).format(dateTimeFormat),
      },
      {
        accessorKey: "status",
        header: t("status"),
        cell: ({ row }) => t(OrderStatus[row.original.status]),
      },
    ],
    []
  );

  if (isLoading) return <Loading />;

  return (
    <Card>
      <Header title={"foremen_orders"}>
        <div className="flex gap-2">
          <Button btnType={BtnTypes.primary} onClick={() => navigate(-1)}>
            {t("back")}
          </Button>
        </div>
      </Header>

      <div className="p-4">
        <div className="table-responsive grid-view">
          <ItemsCount data={orders} />
          <VirtualTable
            columns={columns}
            data={orders?.items}
            exHeight={100}
            rowClassName={({ original }) =>
              cl({
                ["bg-red-200"]: original.status === OrderStatus.denied,
                ["bg-blue-200"]: original.status === OrderStatus.received,
                ["bg-green-200"]: original.status === OrderStatus.done,
              })
            }
          />
          {isFetching && <Loading />}

          {!!orders && <Pagination totalPages={orders.pages} />}
        </div>
      </div>
    </Card>
  );
};

export default ForemenOrders;
