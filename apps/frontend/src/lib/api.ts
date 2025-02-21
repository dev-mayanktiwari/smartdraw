import { useTokenStore } from "@/store/tokenStore";
import axios from "axios";
import { refreshTokenAPI } from "./apiClient";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = useTokenStore.getState();
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await refreshTokenAPI();
        const { accessToken } = response.data;
        useTokenStore.setState({ accessToken });
        originalRequest.headers.Authorization = accessToken;
        return api(originalRequest);
      } catch (refreshError) {
        useTokenStore.setState({ accessToken: null });
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
