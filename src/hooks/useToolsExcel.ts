import { useQuery } from "@tanstack/react-query";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/rootConfig";
import baseApi from "@/api/baseApi";
import { EPresetTimes } from "@/utils/helpers";

interface Body {
  id: number;
  enabled?: boolean;
}

export const useToolsExcel = ({ enabled, id }: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["excel_expanditure", id],
    queryFn: () =>
      baseApi
        .get("/expanditure/excell", { params: { id } })
        .then(
          ({ data: response }) => response as { file: string; success: boolean }
        ),
    enabled: enabled && !!token,
    staleTime: EPresetTimes.MINUTE * 10,
  });
};
export default useToolsExcel;
