import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import useQueryString from "custom/useQueryString";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { BtnTypes, ExpenditureType } from "@/utils/types";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { ColumnDef } from "@tanstack/react-table";
import VirtualTable from "@/components/VirtualTable";
import useTools from "@/hooks/useTools";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";

const BuildingMaterials = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigateParams = useNavigateParams();
  const parent_id = useQueryString("parent_id");
  const parent_name = useQueryString("parent_name");
  const {
    data: tools,
    isLoading,
    isFetching,
  } = useTools({
    ...(!!parent_id && { parent_id }),
  });

  const columns = useMemo<ColumnDef<ExpenditureType>[]>(
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
      },
      {
        accessorKey: "price",
        header: t("price"),
      },
      {
        accessorKey: "code",
        header: t("code"),
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
      <Header title={parent_name || "buildingMaterials"}>
        <div className="flex gap-2">
          <Button btnType={BtnTypes.primary} onClick={() => navigate(-1)}>
            {t("back")}
          </Button>
        </div>
      </Header>
      <ul className="my-4">
        {tools?.folders.map((item) => (
          <li
            key={item.id}
            onClick={() =>
              navigateParams({ parent_id: item.id, parent_name: item.name })
            }
          >
            <span className="bg-gray-300 border-b border-b-black flex gap-3 items-center py-2 px-4 hover:bg-gray-400">
              <img src="/icons/folder.svg" alt="folder" />
              <h3>{item.name}</h3>
            </span>
          </li>
        ))}
      </ul>

      {!!tools?.tools.length && (
        <div className="p-4">
          <VirtualTable columns={columns} data={tools?.tools} />
          {isFetching && <Loading />}
        </div>
      )}
    </Card>
  );
};

export default BuildingMaterials;
