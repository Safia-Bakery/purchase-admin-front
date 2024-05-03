import { useQuery } from "@tanstack/react-query";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/rootConfig";
import { ClientsType } from "@/utils/types";
import baseApi from "@/api/baseApi";
import { EPresetTimes } from "@/utils/helpers";

interface Body {
  id?: string;
  status?: number;
  name?: string;
  size?: number;
  page?: number;
  enabled?: boolean;
}

export const useClients = ({ enabled, ...params }: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["clients", params],
    queryFn: () =>
      baseApi
        .get("/clients", { params })
        .then(({ data: response }) => response as ClientsType),
    enabled: enabled && !!token,
  });
};

export default useClients;
