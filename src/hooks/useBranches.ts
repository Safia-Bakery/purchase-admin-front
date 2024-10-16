import { useQuery } from "@tanstack/react-query";
import { BranchesType } from "@/utils/types";
import baseApi from "@/api/baseApi";
import { EPresetTimes } from "@/utils/helpers";
import useAuthStore from "@/store/auth";

interface Body {
  id?: string;
  size?: number;
  page?: number;
  name?: string;
  enabled?: boolean;
}

export const useBranch = ({ enabled, ...params }: Body) => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["branch", params],
    queryFn: () =>
      baseApi
        .get("/branch", { params })
        .then(({ data: response }) => response as BranchesType),
    enabled: enabled && !!token,
    staleTime: EPresetTimes.MINUTE * 10,
  });
};

export default useBranch;
