import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/store/auth";
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
  const { token } = useAuthStore();
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
