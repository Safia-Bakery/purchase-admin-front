import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/baseApi";

interface Body {
  [key: number]: number;
}

const toolUpdateMutation = () => {
  return useMutation({
    mutationKey: ["update_tool"],
    mutationFn: async (body: Body) => {
      const { data } = await baseApi.put("/v1/tools", { data: body });
      return data;
    },
  });
};
export default toolUpdateMutation;
