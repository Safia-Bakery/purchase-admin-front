import { useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";
import VirtualTable from "@/components/VirtualTable";
import Loading from "@/components/Loader";
import removeItemMutation from "@/hooks/mutation/removeItem";
import toolCountMutation from "@/hooks/mutation/toolCount";
import { errorToast, successToast } from "@/utils/toast";
import { ExpenditureToolType } from "@/utils/types";
import useExpenditure from "@/hooks/useExpenditure";
import { debounce } from "@/utils/helpers";

const ProdsTable = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { getValues, reset, setValue, register } = useForm<{
    [key: string]: number;
  }>();
  const { mutate, isPending } = removeItemMutation();
  const { mutate: updateCount, isPending: updateCountPending } =
    toolCountMutation();
  const { data, refetch, isFetching } = useExpenditure({ id });

  const order = data?.items?.[0];

  const deleteItem = useCallback(
    (id: number) => {
      mutate(
        { id },
        {
          onSuccess: () => {
            refetch();
            successToast("success");
          },
          onError: (e) => errorToast(e.message),
        }
      );
    },
    [mutate, refetch]
  );

  // Debounce function directly in useCallback
  const debouncedUpdateCount = useCallback(
    debounce((tool_id: number, amount: number) => {
      updateCount(
        { id: tool_id, amount },
        {
          onSuccess: () => {
            refetch();
            successToast("success");
          },
          onError: (e) => errorToast(e.message),
        }
      );
    }, 500),
    [updateCount]
  );

  const handleDecrement = useCallback(
    (tool_id: number) => {
      const currentValue = getValues(`${tool_id}`);
      const newValue = currentValue < 1 ? 0 : currentValue - 1;
      setValue(`${tool_id}`, newValue);

      newValue > 0
        ? debouncedUpdateCount(tool_id, newValue)
        : deleteItem(tool_id);
    },
    [getValues, setValue, debouncedUpdateCount, deleteItem]
  );

  const handleIncrement = useCallback(
    (tool_id: number) => {
      const newValue = getValues(`${tool_id}`) + 1;
      setValue(`${tool_id}`, newValue);
      debouncedUpdateCount(tool_id, newValue);
    },
    [getValues, setValue, debouncedUpdateCount]
  );

  useEffect(() => {
    const init = order?.expendituretool.reduce((acc: any, item) => {
      acc[item?.id!] = item?.amount ?? 0;
      return acc;
    }, {});
    reset(init);
  }, [order, reset]);

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
              type="button"
              onClick={() => handleDecrement(row.original.id)}
            >
              -
            </button>

            <span>
              <input
                className="w-16 bg-transparent text-center"
                disabled
                {...register(`${row.original.id}`)}
              />
            </span>
            <button
              onClick={() => handleIncrement(row.original.id)}
              className="text-xl"
              type="button"
            >
              +
            </button>
            <p className="opacity-0">{row.original.amount}</p>
          </div>
        ),
      },
      {
        accessorKey: "sum",
        header: t("sum"),
        cell: ({ row }) =>
          Number(getValues(`${row.original?.id}`)) * row.original?.tool?.price,
      },
      {
        accessorKey: "action",
        size: 5,
        header: "",
        cell: ({ row }) => (
          <button type="button" onClick={() => deleteItem(row.original.id)}>
            <img src="/icons/crossRed.svg" alt="delete" />
          </button>
        ),
      },
    ],
    [t, getValues, handleDecrement, handleIncrement, deleteItem, register]
  );

  if (isPending) return <Loading />;

  return <VirtualTable columns={columns} data={order?.expendituretool} />;
};

export default ProdsTable;
