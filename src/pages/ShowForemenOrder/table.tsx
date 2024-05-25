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
import { BtnTypes, ExpenditureToolType, ModalTypes } from "@/utils/types";
import useExpenditure from "@/hooks/useExpenditure";
import { debounce, disableAction } from "@/utils/helpers";
import toolUpdateMutation from "@/hooks/mutation/toolUpdate";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import useQueryString from "@/hooks/custom/useQueryString";
import cl from "classnames";

const ProdsTable = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const modal = Number(useQueryString("modal"));
  const navigateParams = useNavigateParams();
  const { getValues, reset, setValue, register, watch } = useForm<{
    [key: string]: number;
  }>();
  const { mutate, isPending } = removeItemMutation();

  const { mutate: toolUpdate } = toolUpdateMutation();
  const { mutate: updateCount } = toolCountMutation();
  const { data, refetch } = useExpenditure({ id });

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
      const newValue = currentValue < 1 ? currentValue : currentValue - 1;
      newValue > 0 && setValue(`${tool_id}`, newValue);

      newValue > 0 && debouncedUpdateCount(tool_id, newValue);
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

  const handlePrice = () => {
    const vals = order?.expendituretool.reduce((acc: any, item) => {
      acc[`${item.tool_id}`] = getValues(`${item.tool_id}_price`);
      return acc;
    }, {});
    toolUpdate(
      {
        ...vals,
      },
      {
        onSuccess: () => {
          refetch();
          successToast("Успешно Изменен");
        },
        onError: (e) => {
          refetch();
          errorToast(e.message);
        },
      }
    );
  };

  const init = useMemo(() => {
    return order?.expendituretool.reduce((acc: any, item) => {
      acc[item?.id!] = item?.amount ?? 0;
      acc[`${item.tool_id}_price`] = +item.tool?.price || 0;
      return acc;
    }, {});
  }, [order]);

  const checker = useMemo(() => {
    return JSON.stringify(init) === JSON.stringify(watch());
  }, [init, watch()]);

  useEffect(() => {
    reset(init);
  }, [init]);

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
        accessorKey: "num",
        header: t("article"),
        cell: ({ row }) => row.original?.tool?.num,
      },
      // {
      //   accessorKey: "group",
      //   header: t("group"),
      // },
      {
        accessorKey: "mainunit",
        header: t("measurement"),
        cell: ({ row }) => row.original?.tool?.mainunit,
      },
      {
        accessorKey: "price_per",
        header: t("price_per"),
        // cell: ({ row }) => row.original?.tool?.price,
        cell: ({ row }) => (
          <input
            className="max-w-80 w-full bg-transparent"
            type="number"
            disabled={disableAction[order?.status!]}
            {...register(`${row.original.tool_id}_price`)}
          />
        ),
      },
      {
        accessorKey: "amount",
        header: t("qnt"),
        cell: ({ row }) => (
          <div className="flex gap-2 items-center">
            {!disableAction[order?.status!] && (
              <button
                className="text-xl"
                type="button"
                onClick={() => handleDecrement(row.original.id)}
              >
                -
              </button>
            )}

            <span>
              <input
                className="w-16 bg-transparent text-center"
                disabled
                type="number"
                {...register(`${row.original.id}`)}
              />
            </span>
            {!disableAction[order?.status!] && (
              <button
                onClick={() => handleIncrement(row.original.id)}
                className="text-xl"
                type="button"
              >
                +
              </button>
            )}
            <p className="opacity-0">{row.original.amount}</p>
          </div>
        ),
      },
      {
        accessorKey: "sum",
        header: t("sum"),
        cell: ({ row }) =>
          Number(getValues(`${row.original?.id}`)) *
          Number(getValues(`${row.original?.tool_id}_price`)),
      },
      {
        accessorKey: "action",
        size: 5,
        header: "",
        cell: ({ row }) =>
          !disableAction[order?.status!] && (
            <button type="button" onClick={() => deleteItem(row.original.id)}>
              <img src="/icons/crossRed.svg" alt="delete" />
            </button>
          ),
      },
    ],
    [
      t,
      getValues,
      handleDecrement,
      handleIncrement,
      deleteItem,
      register,
      order?.status,
    ]
  );

  if (isPending) return <Loading />;

  return (
    <>
      <Header title={"products"}>
        <div className="flex gap-2">
          <Button
            className={cl(
              { ["opacity-100"]: !checker },
              "transition-opacity opacity-0"
            )}
            btnType={BtnTypes.primary}
            onClick={handlePrice}
          >
            {t("save")}
          </Button>
          {!disableAction[order?.status!] && (
            <Button
              btnType={BtnTypes.success}
              onClick={() => navigateParams({ modal: ModalTypes.add_prods })}
            >
              {t("add_products")}
            </Button>
          )}
        </div>
      </Header>
      <VirtualTable
        columns={columns}
        data={order?.expendituretool}
        exHeight={120}
      />
      {/* <div className="w-full flex justify-end pr-10 my-4">
        <h1 className="text-3xl font-bold">
          {t("total")}: {renderTotal}
        </h1>
      </div> */}
    </>
  );
};

export default ProdsTable;
