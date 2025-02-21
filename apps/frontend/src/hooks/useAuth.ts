import { TUserLoginInput } from "@repo/types";
import { useTokenStore } from "../store/tokenStore";
import { useUserStore } from "../store/userStore";
import { loginAPI, logoutAPI, refreshTokenAPI } from "@/lib/apiClient";

export const useAuth = () => {
  const { setTokens, clearTokens, isAuthenticated, accessToken } =
    useTokenStore();
  const { user, setUser, deleteUser } = useUserStore();

  const login = async (data: TUserLoginInput) => {
    try {
      const response = await loginAPI(data);
      const { accessToken, user } = response.data;
      setTokens({ accessToken });
      setUser(user);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutAPI();
      clearTokens();
      deleteUser();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await refreshTokenAPI();
      const { accessToken, user } = response.data;
      setTokens({ accessToken });
      setUser(user);
    } catch (error) {
      console.error("Refresh token failed", error);
      throw error;
    }
  };

  return { isAuthenticated, login, logout, user, refreshToken, accessToken, setTokens, setUser };
};
