export const ENDPOINTS = {
  REGISTER: "auth/register",
  GOOGLE_LOGIN: "auth/google",
  LOGIN: "auth/login",
  LOGOUT: "auth/logout",
  VERIFY_EMAIL: "auth/verify-email",
  CHANGE_PASSWORD: "auth/change-password",
  FORGOT_PASSWORD: "auth/forgot-password",
  RESET_PASSWORD: "auth/reset-password",
  REFRESH_TOKEN: "auth/refresh-token",
  SELF: "auth/self",
  AUTH_CHECK: "auth/status"
} as const;
