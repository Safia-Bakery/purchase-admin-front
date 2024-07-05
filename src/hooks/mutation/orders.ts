import baseApi from "@/api/baseApi";
import { useMutation } from "@tanstack/react-query";

interface Body {
  status?: number;
  id: string;
  deny_reason?: string;
  purchaser_id?: number;
}

const orderMutation = () => {
  return useMutation({
    mutationKey: ["orders"],
    mutationFn: async (body: Body) => {
      const { data } = await baseApi.put("/order", body);
      return data;
    },
  });
};
export default orderMutation;
