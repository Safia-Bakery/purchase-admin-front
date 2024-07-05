import { useQuery } from "@tanstack/react-query";

import { tokenSelector } from "reducers/auth";

import { useAppSelector } from "@/store/rootConfig";
import { UserType } from "@/utils/types";
import baseApi from "@/api/baseApi";
import { EPresetTimes } from "@/utils/helpers";

export const useToken = ({ enabled = true }) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["me_token"],
    queryFn: () =>
      baseApi.get("/me").then(({ data: response }) => response as UserType),
    staleTime: EPresetTimes.MINUTE * 10,
    enabled: !!token && enabled,
  });
};

export default useToken;
