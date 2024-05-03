import { useTranslation } from "react-i18next";
import { lazy, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import useQueryString from "custom/useQueryString";
import { useNavigateParams } from "custom/useCustomNavigate";
import Loading from "@/components/Loader";
import Suspend from "@/components/Suspend";
import {
  BtnTypes,
  ExpenditureToolType,
  ModalTypes,
  Operations,
  OrderStatus,
} from "@/utils/types";
import { dateTimeFormat } from "@/utils/helpers";
import Container from "@/components/Container";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { errorToast, successToast } from "@/utils/toast";
import useExpenditure from "@/hooks/useExpenditure";
import expenditureMutation from "@/hooks/mutation/expenditure";
import VirtualTable from "@/components/VirtualTable";
import { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";

const ProdsTable = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const modal = Number(useQueryString("modal"));
  const navigateParams = useNavigateParams();
  const { mutate, isPending } = expenditureMutation();
  const handleModal = (type: ModalTypes) => {
    navigateParams({ modal: type });
  };
  const { getValues, reset, setValue, register } = useForm();

  const { data } = useExpenditure({ id: id });

  const order = data?.items?.[0];

  const handleValue =
    ({ id, op }: { id: number; op: Operations }) =>
    () => {
      setValue(
        `${id}`,
        op === Operations.decrement
          ? +getValues(`${id}`) - 1
          : +getValues(`${id}`) + 1
      );
    };

  useEffect(() => {
    const init = order?.expendituretool.reduce((acc: any, item) => {
      acc[item?.tool_id!] = item?.amount ?? 0;
      return acc;
    }, {});
    reset(init);
  }, [order]);

  const columns = useMemo<ColumnDef<ExpenditureToolType>[]>(
    () => [
      {
        accessorKey: "#",
        header: "№",
        size: 5,
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "name",
        header: t("name_in_table"),
        cell: ({ row }) => row.original?.tool?.name,
      },
      {
        accessorKey: "group",
        header: t("group"),
      },
      {
        accessorKey: "measurement",
        header: t("measurement"),
      },
      {
        accessorKey: "price_per",
        header: t("price_per"),
        cell: ({ row }) => row.original?.tool?.price,
      },
      {
        accessorKey: "amount",
        header: t("qnt"),
        cell: ({ row }) => (
          <div className="flex gap-2 items-center">
            <button
              className="text-xl"
              onClick={handleValue({
                op: Operations.decrement,
                id: row.original.tool_id,
              })}
            >
              -
            </button>
            <span>
              <input
                className="w-16 bg-transparent text-center"
                disabled
                {...register(`${row.original.tool_id}`)}
              />
            </span>
            <button
              onClick={handleValue({
                op: Operations.increment,
                id: row.original.tool_id,
              })}
              className="text-xl"
            >
              +
            </button>
          </div>
        ),
      },
      {
        accessorKey: "sum",
        header: t("sum"),
        cell: ({ row }) => Number(getValues(`${row.original?.tool_id}`)) * 2, // row.original?.tool?.price
      },
    ],
    []
  );

  return <VirtualTable columns={columns} data={order?.expendituretool} />;
};

export default ProdsTable;
