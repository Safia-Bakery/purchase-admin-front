import { useQuery } from "@tanstack/react-query";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/rootConfig";
import { OrderType } from "@/utils/types";
import baseApi from "@/api/baseApi";

interface Body {
  id?: number;
  enabled?: boolean;
}

export const useOrder = ({ enabled, id }: Body) => {
  const token = useAppSelector(tokenSelector);
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
