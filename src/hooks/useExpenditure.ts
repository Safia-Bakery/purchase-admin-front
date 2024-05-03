import { useQuery } from "@tanstack/react-query";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/rootConfig";
import { ExpendituresType } from "@/utils/types";
import baseApi from "@/api/baseApi";

interface Body {
  id?: string;
  size?: number;
  page?: number;
  name?: string;
  enabled?: boolean;
}

export const useExpenditure = ({ enabled, ...params }: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["expenditure", params],
    queryFn: () =>
      baseApi
        .get("/expanditure", { params })
        .then(({ data: response }) => response as ExpendituresType),
    enabled: enabled && !!token,
  });
};

export default useExpenditure;
