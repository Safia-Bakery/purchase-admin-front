import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/baseApi";

interface Body {
  id: number;
  amount?: number;
}

const toolCountMutation = () => {
  return useMutation({
    mutationKey: ["expenditure_update_count"],
    mutationFn: async (body: Body) => {
      const { data } = await baseApi.put("/expanditure/cart", body);
      return data;
    },
  });
};
export default toolCountMutation;
