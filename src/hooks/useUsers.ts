import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/baseApi";
import { UsersTypes } from "@/utils/types";
import { EPresetTimes } from "@/utils/helpers";

type Params = {
  enabled?: boolean;
  size?: number;
  page?: number;
  id?: number;
};

export const useUsers = ({ enabled, ...params }: Params) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () =>
      baseApi.get("/users", { params }).then(({ data: response }) => {
        return response as UsersTypes;
      }),
    enabled,
    refetchOnMount: true,
    staleTime: EPresetTimes.MINUTE * 10,
  });
};
export default useUsers;
