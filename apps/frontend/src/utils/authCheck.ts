import { authCheckAPI } from "@/lib/apiClient";

export const isUserLoggedIn = async (token: string | null) => {
  try {
    await authCheckAPI(token);
    return true;
  } catch (error) {
    return false;
  }
};
