import { useQuery } from "@tanstack/react-query";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/rootConfig";
import { RoleTypes } from "@/utils/types";
import baseApi from "@/api/baseApi";
import { EPresetTimes } from "@/utils/helpers";

interface Params {
  enabled?: boolean;
}

export const useRoles = ({ enabled, ...params }: Params) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["roles", params],
    queryFn: () =>
      baseApi
        .get("/roles", { params })
        .then(({ data: response }) => response as RoleTypes[]),
    enabled: enabled && !!token,
    staleTime: EPresetTimes.MINUTE * 10,
  });
};
export default useRoles;
