import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@/components/Card";
import Pagination from "@/components/Pagination";
import { OrderStatusName, dateTimeFormat, handleIdx } from "@/utils/helpers";
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
import MainSelect from "@/components/BaseInputs/MainSelect";
import cl from "classnames";
import MainInput from "@/components/BaseInputs/MainInput";
import useOrdersExcel from "@/hooks/useOrdersExcel";
import useBackExcel from "@/hooks/custom/useBackExcel";
import { useForm } from "react-hook-form";

type Filter = {
  from?: string;
  to?: string;
  status?: string;
};

const Orders = () => {
  const { t } = useTranslation();
  const lang = useAppSelector(langSelector);
  const page = Number(useQueryString("page")) || 1;
  const [filter, $filter] = useState<Filter>();
  const { data: orders, isLoading } = useOrders({
    page,
  });

  const { register, getValues, handleSubmit } = useForm();

  const { data: orderExcel, refetch: excelRefetch } = useOrdersExcel({
    enabled: false,
    ...(!!filter?.from && { from: filter?.from }),
    ...(!!filter?.to && { to: filter?.to }),
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
        accessorKey: "status",
        header: t("status"),
        cell: ({ row }) => t(OrderStatus[row.original.status]),
      },
    ],
    [lang]
  );

  const onSubmit = () => {
    const { from, to, status } = getValues();
    $filter({
      ...(!!from && { from }),
      ...(!!to && { to }),
      ...(!!status && { status }),
    });
    setTimeout(() => {
      excelRefetch();
    }, 100);
  };

  useEffect(() => {
    if (orderExcel?.file) useBackExcel(orderExcel.file);
  }, [orderExcel]);

  if (isLoading) return <Loading />;

  return (
    <Card>
      <Header title={"orders"}>
        <form className="flex gap-2" onSubmit={handleSubmit(onSubmit)}>
          <MainInput type="date" register={register("from")} />
          <MainInput type="date" register={register("to")} />
          <MainSelect values={OrderStatusName} register={register("status")} />
          <Button
            type="submit"
            className="bg-red-300 !min-w-max"
            btnType={BtnTypes.primary}
          >
            {t("download_excel")}
          </Button>
        </form>
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
