import axios, { AxiosInstance, AxiosResponse } from "axios";
import { logoutHandler } from "@/store/reducers/auth";
import { store } from "@/store/rootConfig";

export const baseURL = "https://api.purchase.safiabakery.uz";

const logoutObj: { [key: number]: boolean } = {
  401: true,
  403: true,
};

const baseApi: AxiosInstance = axios.create({
  baseURL,
});

baseApi.interceptors.request.use(
  (config) => {
    const token = store.getState()?.auth?.token;

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
      logoutUser();
    }
    return Promise.reject(error);
  }
);

function logoutUser() {
  store?.dispatch(logoutHandler());
}

export default baseApi;
