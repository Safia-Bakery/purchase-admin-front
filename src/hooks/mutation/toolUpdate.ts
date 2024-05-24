import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/baseApi";

interface Body {
  id: number;
  name?: string;
  status?: number;
  price?: number;
  mainunit?: string;
  code?: string;
}

const toolUpdateMutation = () => {
  return useMutation({
    mutationKey: ["update_tool"],
    mutationFn: async (body: Body) => {
      const { data } = await baseApi.put("/v1/tools", body);
      return data;
    },
  });
};
export default toolUpdateMutation;
