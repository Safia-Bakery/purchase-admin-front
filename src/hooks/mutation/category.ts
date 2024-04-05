import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/baseApi";

interface Body {
  status?: number;
  name_uz: string;
  name_ru: string;
  id?: number | string;
}

const categoryMutation = () => {
  return useMutation({
    mutationKey: ["category"],
    mutationFn: async (body: Body) => {
      if (body.id) {
        const { data } = await baseApi.put("/category", body);
        return data;
      }
      const { data } = await baseApi.post("/category", body);
      return data;
    },
  });
};
export default categoryMutation;
