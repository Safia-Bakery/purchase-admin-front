import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@/components/Card";
import Pagination from "@/components/Pagination";
import {
  OrderStatusName,
  dateTimeFormat,
  handleIdx,
  yearMonthDate,
} from "@/utils/helpers";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";

import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { BtnTypes, OrderStatus, OrderType } from "@/utils/types";
import Header from "@/components/Header";
import Button from "@/components/Button";

import useSelectsStore from "@/store/selects";
import useOrders from "@/hooks/useOrders";
import dayjs from "dayjs";
import VirtualTable from "@/components/VirtualTable";
import { ColumnDef } from "@tanstack/react-table";
import MainSelect from "@/components/BaseInputs/MainSelect";
import cl from "classnames";
import useOrdersExcel from "@/hooks/useOrdersExcel";
import useBackExcel from "@/hooks/custom/useBackExcel";
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";

type Filter = {
  from?: Date;
  to?: Date;
  status?: string;
};

const Orders = () => {
  const { t } = useTranslation();
  const { lang } = useSelectsStore();
  const page = Number(useQueryString("page")) || 1;
  const [filter, $filter] = useState<Filter>();
  const { data: orders, isLoading } = useOrders({
    page,
    ...(!!filter?.status && { status: filter?.status }),
    ...(!!filter?.to && { to_date: dayjs(filter?.to).format(yearMonthDate) }),
    ...(!!filter?.from && {
      from_date: dayjs(filter?.from).format(yearMonthDate),
    }),
  });

  const handleChange = (key: Filter) =>
    $filter((prev) => ({ ...prev, ...key }));

  const { data: orderExcel, refetch: excelRefetch } = useOrdersExcel({
    enabled: false,
    ...(!!filter?.to && { to_date: dayjs(filter?.to).format(yearMonthDate) }),
    ...(!!filter?.from && {
      from_date: dayjs(filter?.from).format(yearMonthDate),
    }),
    ...(!!filter?.status && { status: filter?.status }),
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
        header: t("group_problem"),
        cell: ({ row }) => row.original?.category?.[`name_${lang}`],
      },
      {
        accessorKey: "created_at",
        header: t("ordered_date"),
        size: 10,
        cell: ({ row }) =>
          dayjs(row.original?.created_at).format(dateTimeFormat),
      },
      {
        accessorKey: "purchaser?.[0]?.user?.name",
        header: t("responsible"),
        cell: ({ row }) =>
          row.original?.purchaser?.[0]?.user?.name || t("not_given"),
      },
      {
        accessorKey: "status",
        header: t("status"),
        cell: ({ row }) => t(OrderStatus[row.original.status]),
      },
    ],
    [lang]
  );

  const onSubmit = () => excelRefetch();

  useEffect(() => {
    if (orderExcel?.file) useBackExcel(orderExcel.file);
  }, [orderExcel]);

  if (isLoading) return <Loading />;

  return (
    <Card>
      <Header title={"orders"}>
        <div className="flex gap-2">
          <MainDatePicker
            selected={filter?.from}
            placeholderText={t("from_date")}
            dateFormat="dd-MM-YYYY"
            onChange={(e: Date) => handleChange({ from: e })}
          />
          <MainDatePicker
            placeholderText={t("to_date")}
            dateFormat="dd-MM-YYYY"
            onChange={(e: Date) => handleChange({ to: e })}
            selected={filter?.to}
          />
          <MainSelect
            values={OrderStatusName}
            onChange={(e) => handleChange({ status: e.target.value })}
            value={filter?.status}
          />
          <Button
            onClick={onSubmit}
            className="bg-red-300 !min-w-max"
            btnType={BtnTypes.primary}
          >
            {t("download_excel")}
          </Button>
        </div>
      </Header>

      <div className="p-4">
        <div>
          <ItemsCount data={orders} />

          {orders?.items && (
            <VirtualTable
              rowClassName={({ original }) =>
                cl({
                  ["bg-red-200"]: original.status === OrderStatus.denied,
                  ["bg-blue-200"]: original.status === OrderStatus.received,
                  ["bg-green-200"]: original.status === OrderStatus.done,
                })
              }
              columns={columns}
              data={orders?.items}
              exHeight={100}
            />
          )}

          {!!orders && <Pagination totalPages={orders.pages} />}
        </div>
      </div>
    </Card>
  );
};

export default Orders;
