import { useMutation } from "@tanstack/react-query";
import { errorToast } from "@/utils/toast";
import baseApi from "@/api/baseApi";

interface LoginTypes {
  access_token: string;
  token_type: string;
  status_user: string;
  success: boolean;
}

const loginMutation = () => {
  const contentType = "application/x-www-form-urlencoded";

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (body: { username: string; password: string }) =>
      baseApi
        .post("/login", body, { headers: { "Content-Type": contentType } })
        .then(({ data }) => data as unknown as LoginTypes),

    onError: (e) => errorToast(e.message),
    retry: 2,
    retryDelay: 1000,
  });
};
export default loginMutation;
