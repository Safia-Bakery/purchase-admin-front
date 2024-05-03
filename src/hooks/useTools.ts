import { useQuery } from "@tanstack/react-query";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/rootConfig";
import { ToolsType } from "@/utils/types";
import baseApi from "@/api/baseApi";
import { EPresetTimes } from "@/utils/helpers";

interface Body {
  parent_id?: string;
  name?: string;
  enabled?: boolean;
}

export const useTools = ({ enabled, ...params }: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["tool_iarch", params],
    queryFn: () =>
      baseApi
        .get("/tool/iarch", { params })
        .then(({ data: response }) => response as ToolsType),
    enabled: enabled && !!token,
    staleTime: EPresetTimes.MINUTE * 10,
  });
};
export default useTools;
