import baseApi from "@/api/baseApi";
import { EPresetTimes } from "@/utils/helpers";
import { PermissionsType } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export const usePermissions = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["all_permissions"],
    queryFn: () =>
      baseApi.get("/permissions").then(({ data: response }) => {
        return response as PermissionsType[];
      }),
    staleTime: EPresetTimes.MINUTE * 10,
    enabled,
  });
};
export default usePermissions;
