import { useAuth } from "@/hooks/useAuth";
import { api } from "./api";
import { useTokenStore } from "@/store/tokenStore";

api.interceptors.request.use(
  (config) => {
    const { accessToken } = useTokenStore();
    const token = accessToken;

    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await useAuth().refreshToken();
        originalRequest.headers.Authorization = useAuth().accessToken;
        return api(originalRequest);
      } catch (refreshError) {
        useAuth().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
