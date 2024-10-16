import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/store/auth";

import { ToolsSearchTypes } from "@/utils/types";
import baseApi from "@/api/baseApi";
import { EPresetTimes } from "@/utils/helpers";

interface Body {
  id?: string;
  size?: number;
  page?: number;
  name?: string;
  enabled?: boolean;
}

export const useToolsSearch = ({ enabled, ...params }: Body) => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["tool_search", params],
    queryFn: () =>
      baseApi
        .get("/tool/search", { params })
        .then(({ data: response }) => response as ToolsSearchTypes),
    enabled: enabled && !!token,
    staleTime: EPresetTimes.MINUTE * 10,
  });
};
export default useToolsSearch;

//
