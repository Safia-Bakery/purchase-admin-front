import { useMutation } from "@tanstack/react-query";
import { errorToast } from "@/utils/toast";
import baseApi from "@/api/baseApi";

interface Body {
  password?: string;
  address?: string;
  name: string;
  inn?: string;
  email?: string;
  company_name?: string;
  phone?: string;
  role_id: number;
  id?: number;
  status?: number | boolean;
}

const userMutation = () => {
  return useMutation({
    mutationKey: ["create_update_user"],
    mutationFn: async (body: Body) => {
      if (body.id) {
        const res = await baseApi.put("/users", body);
        return res;
      } else {
        const res = await baseApi.post("/users", body);
        if (res.status === 200) return res;
      }
    },
    onError: (e: any) =>
      errorToast(e.response?.data.detail ? e.response?.data.detail : e.message),
  });
};
export default userMutation;
