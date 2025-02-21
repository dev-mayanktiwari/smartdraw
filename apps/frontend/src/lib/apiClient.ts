import { api } from "./api";
import { ENDPOINTS } from "./endpoints";
import { TUserLoginInput, TUserRegistrationInput } from "@repo/types";

export const refreshTokenAPI = async () => {
  const response = await api.put(ENDPOINTS.REFRESH_TOKEN);
  return response.data;
};

export const authCheckAPI = async (token: string | null) => {
  const response = await api.get(ENDPOINTS.AUTH_CHECK, {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};

export const registerAPI = async (data: TUserRegistrationInput) => {
  const response = await api.post(ENDPOINTS.REGISTER, data);
  return response.data;
};

export const loginAPI = async (data: TUserLoginInput) => {
  const response = await api.post(ENDPOINTS.LOGIN, data);
  return response.data;
};

export const logoutAPI = async () => {
  const response = await api.put(ENDPOINTS.LOGOUT);
  return response.data;
};

export const googleLoginAPI = async () => {
  const response = await api.get(ENDPOINTS.GOOGLE_LOGIN);
  return response.data;
};

export const verifyEmailAPI = async (code: string, token: string) => {
  const response = await api.put(
    ENDPOINTS.VERIFY_EMAIL + `?token=${token}&code=${code}`
  );
  return response.data;
};
