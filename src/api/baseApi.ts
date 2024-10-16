import axios, { AxiosInstance, AxiosResponse } from "axios";
import useAuthStore from "@/store/auth";

export const baseURL = "https://backend.purchase.safiabakery.uz";

const logoutObj: { [key: number]: boolean } = {
  401: true,
  403: true,
};

const baseApi: AxiosInstance = axios.create({
  baseURL,
});

baseApi.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore?.getState();
    // const token = store.getState()?.auth?.token;
    // const token = useAuthStore?.getState()?.token;
    // const logout = useAuthStore?.getState()?.logoutHandler;
    console.log(token, "api token");
    if (!!token) {
      if (config.headers) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

baseApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (logoutObj[error?.response?.status]) {
      const { logoutHandler } = useAuthStore?.getState();
      logoutHandler();
    }
    return Promise.reject(error);
  }
);
export default baseApi;
