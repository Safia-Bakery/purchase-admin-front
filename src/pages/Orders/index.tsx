import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import Pagination from "@/components/Pagination";
import { dateTimeFormat, handleIdx } from "@/utils/helpers";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";

import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { BtnTypes, OrderStatus, OrderType } from "@/utils/types";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useAppSelector } from "@/store/rootConfig";
import { langSelector } from "@/store/reducers/selects";
import useOrders from "@/hooks/useOrders";
import dayjs from "dayjs";
import VirtualTable from "@/components/VirtualTable";
import { ColumnDef } from "@tanstack/react-table";
import OrdersFilter from "./filter";

const Orders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useAppSelector(langSelector);
  const page = Number(useQueryString("page")) || 1;
  const status = useQueryString("status");
  const user_id = useQueryString("user_id");
  const category_id = useQueryString("category_id");
  const created_at = useQueryString("created_at");
  const id = Number(useQueryString("id"));
  const { data: orders, isLoading } = useOrders({
    page,
    ...(!!status?.toString() && { status }),
    ...(!!id && { id }),
    ...(!!user_id && { user_id }),
    ...(!!category_id && { category_id }),
    ...(!!created_at && { created_at }),
  });

  const columns = useMemo<ColumnDef<OrderType>[]>(
    () => [
      {
        accessorKey: "№",
        header: "№",
        size: 5,
        cell: ({ row }) => handleIdx(row.index),
      },
      {
        accessorKey: "id",
        size: 5,
        header: t("order_number"),
        cell: ({ row }) => (
          <Link className="text-blue-500" to={`${row.original.id}`}>
            {row.original.id}
          </Link>
        ),
      },
      {
        accessorKey: "client",
        header: t("client"),
        cell: ({ row }) => row.original?.user?.name,
      },
      {
        accessorKey: "category",
        header: t("category"),
        cell: ({ row }) => row.original?.category?.[`name_${lang}`],
      },
      {
        accessorKey: "created_at",
        header: t("created_at"),
        size: 10,
        cell: ({ row }) =>
          dayjs(row.original?.created_at).format(dateTimeFormat),
      },
      {
        accessorKey: "status",
        header: t("status"),
        cell: ({ row }) => t(OrderStatus[row.original.status]),
      },
    ],
    [lang]
  );

  if (isLoading) return <Loading />;

  return (
    <Card>
      <Header title={"orders"}>
        <div className="flex gap-2">
          <Button
            btnType={BtnTypes.primary}
            onClick={() => navigate("/orders")}
          >
            {t("back")}
          </Button>
        </div>
      </Header>

      <div className="p-4">
        <div>
          <ItemsCount data={orders} />

          <VirtualTable columns={columns} data={orders?.items} exHeight={150}>
            <OrdersFilter />
          </VirtualTable>

          {/* {isLoading && <Loading />} */}
          {/* {!orders?.items?.length && !isLoading && <EmptyList />} */}
          {!!orders && <Pagination totalPages={orders.pages} />}
        </div>
      </div>
    </Card>
  );
};

export default Orders;
