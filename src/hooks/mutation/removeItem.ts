import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/baseApi";

interface Body {
  id: number;
}

const removeItemMutation = () => {
  return useMutation({
    mutationKey: ["expenditure_remove"],
    mutationFn: async (body: Body) => {
      const { data } = await baseApi.delete("/expanditure/cart", {
        data: body,
      });
      return data;
    },
  });
};
export default removeItemMutation;
