import useToolsExcel from "@/hooks/useToolsExcel";
import { useParams } from "react-router-dom";
import Button from "../Button";
import { BtnTypes } from "@/utils/types";
import { useEffect } from "react";
import useBackExcel from "@/hooks/custom/useBackExcel";

const DownloadToolsExcel = () => {
  const { id } = useParams();
  const { data, refetch } = useToolsExcel({ id: +id!, enabled: false });

  useEffect(() => {
    if (data?.file) useBackExcel(data.file);
  }, [data]);

  return (
    <Button btnType={BtnTypes.success} onClick={refetch}>
      Excel
    </Button>
  );
};

export default DownloadToolsExcel;
