import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/store/auth";

import baseApi from "@/api/baseApi";
import { EPresetTimes } from "@/utils/helpers";

interface Body {
  order_status?: string;
  from_date?: string;
  to_date?: string;
  enabled?: boolean;
}

export const useOrdersExcel = ({ enabled, ...params }: Body) => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["orders_excel", params],
    queryFn: () =>
      baseApi
        .get("/v1/orders/excell", { params })
        .then(
          ({ data: response }) => response as { file: string; success: boolean }
        ),
    enabled: enabled && !!token,
    staleTime: EPresetTimes.MINUTE * 10,
  });
};
export default useOrdersExcel;
