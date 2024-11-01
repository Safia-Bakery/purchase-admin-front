import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/store/auth";

import baseApi from "@/api/baseApi";
import { EPresetTimes } from "@/utils/helpers";

interface Body {
  id: number;
  enabled?: boolean;
}

export const useToolsExcel = ({ enabled, id }: Body) => {
  const { token } = useAuthStore();
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
