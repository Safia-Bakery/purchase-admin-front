import { useQuery } from "@tanstack/react-query";

import { tokenSelector } from "reducers/auth";

import { useAppSelector } from "@/store/rootConfig";
import { UserType } from "@/utils/types";
import baseApi from "@/api/baseApi";

export const useToken = ({ enabled = true }) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["me_token"],
    queryFn: () =>
      baseApi.get("/me").then(({ data: response }) => response as UserType),
    enabled: !!token && enabled,
  });
};

export default useToken;
