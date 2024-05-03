import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/baseApi";

interface Body {
  client_id?: number;
  branch_id?: number;
  comment?: string;
  tools?: {
    [key: string]: string;
  };
  id?: number;
  status?: number;
  deny_reason?: string;
}

const expenditureMutation = () => {
  return useMutation({
    mutationKey: ["expenditure"],
    mutationFn: async (body: Body) => {
      if (body.id) {
        const { data } = await baseApi.put("/expanditure", body);
        return data;
      }
      const { data } = await baseApi.post("/expanditure", body);
      return data;
    },
  });
};
export default expenditureMutation;
