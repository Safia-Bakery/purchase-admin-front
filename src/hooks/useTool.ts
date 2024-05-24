import { useQuery } from "@tanstack/react-query";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/rootConfig";
import { ToolType } from "@/utils/types";
import baseApi from "@/api/baseApi";

interface Body {
  id?: number;
  enabled?: boolean;
}

export const useTool = ({ enabled, ...params }: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["tool", params],
    queryFn: () =>
      baseApi
        .get("/v1/tools", { params })
        .then(({ data: response }) => response as ToolType),
    enabled: enabled && !!token,
    // staleTime: EPresetTimes.MINUTE * 10,
  });
};
export default useTool;
