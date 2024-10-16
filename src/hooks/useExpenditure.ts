import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/store/auth";

import { ExpendituresType } from "@/utils/types";
import baseApi from "@/api/baseApi";

interface Params {
  id?: string;
  size?: number;
  page?: number;
  name?: string;
  client_id?: string;
  branch_id?: string;
  status?: string;
  enabled?: boolean;
}

export const useExpenditure = ({ enabled, ...params }: Params) => {
  const { token } = useAuthStore();
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
