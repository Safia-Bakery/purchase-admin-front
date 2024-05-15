import { useQuery } from "@tanstack/react-query";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/rootConfig";
import { CategoriesType } from "@/utils/types";
import baseApi from "@/api/baseApi";

interface Body {
  name?: string;
  id?: number;
  status?: string | number;
  enabled?: boolean;
  page?: number;
}

export const useCategories = ({ enabled, ...params }: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () =>
      baseApi
        .get("/category", { params })
        .then(({ data: response }) => response as CategoriesType),
    enabled: enabled && !!token,
  });
};
export default useCategories;
