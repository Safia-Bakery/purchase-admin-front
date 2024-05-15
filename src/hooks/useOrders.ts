import { useQuery } from "@tanstack/react-query";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/rootConfig";
import { OredersType } from "@/utils/types";
import baseApi from "@/api/baseApi";

interface Body {
  user_id?: string;
  category_id?: string;
  created_at?: string;
  status?: number | string;
  page?: number;
  id?: number;
  enabled?: boolean;
}

export const useOrders = ({ enabled, ...params }: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["order", params],
    queryFn: () =>
      baseApi
        .get("/order", { params })
        .then(({ data: response }) => response as OredersType),
    enabled: enabled && !!token,
  });
};
export default useOrders;
