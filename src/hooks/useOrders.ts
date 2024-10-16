import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/store/auth";

import { OredersType } from "@/utils/types";
import baseApi from "@/api/baseApi";

interface Body {
  user_id?: string;
  category_id?: string;
  created_at?: string;
  status?: number | string;
  from_date?: string;
  to_date?: string;
  page?: number;
  id?: number;
  enabled?: boolean;
}

export const useOrders = ({ enabled, ...params }: Body) => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () =>
      baseApi
        .get("/order", { params })
        .then(({ data: response }) => response as OredersType),
    enabled: enabled && !!token,
  });
};
export default useOrders;
