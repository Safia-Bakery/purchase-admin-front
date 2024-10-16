import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/store/auth";

import { OrderType } from "@/utils/types";
import baseApi from "@/api/baseApi";

interface Body {
  id?: number;
  enabled?: boolean;
}

export const useOrder = ({ enabled, id }: Body) => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["order", id],
    queryFn: () =>
      baseApi
        .get(`/order/${id}`)
        .then(({ data: response }) => response as OrderType),
    enabled: enabled && !!token,
  });
};
export default useOrder;
