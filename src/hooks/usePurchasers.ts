import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/store/auth";

import { PurchasersTypes, RoleTypes } from "@/utils/types";
import baseApi from "@/api/baseApi";
import { EPresetTimes } from "@/utils/helpers";

interface Params {
  enabled?: boolean;
  size?: number;
  page?: number;
}

export const usePurchasers = ({ enabled, ...params }: Params) => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["purchasers", params],
    queryFn: () =>
      baseApi
        .get("/purchasers", { params })
        .then(({ data: response }) => response as PurchasersTypes),
    enabled: enabled && !!token,
    staleTime: EPresetTimes.MINUTE * 10,
  });
};
export default usePurchasers;
