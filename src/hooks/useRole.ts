import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/store/auth";

import { RoleTypes } from "@/utils/types";
import baseApi from "@/api/baseApi";

interface Body {
  id: number;
  enabled?: boolean;
}

export const useRole = ({ enabled, id }: Body) => {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["role", id],
    queryFn: () =>
      baseApi
        .get(`/roles/${id}`)
        .then(({ data: response }) => response as RoleTypes),
    enabled: enabled && !!token,
  });
};
export default useRole;
