import baseApi from "@/api/baseApi";
import { useMutation } from "@tanstack/react-query";

interface Body {
  name: string;
  status?: number;
  id?: number;
  accesses?: number[];
  description?: string;
}

const roleMutation = () => {
  return useMutation({
    mutationKey: ["update_role"],
    mutationFn: (body: Body) => {
      if (body.id) return baseApi.put("/role", body).then(({ data }) => data);
      else return baseApi.post("/role", body).then(({ data }) => data);
    },
  });
};
export default roleMutation;
