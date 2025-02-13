import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tokens } from "@repo/types";

interface TokenStore {
  accessToken: string | null;
  setTokens: (tokens: Pick<Tokens, "accessToken">) => void;
  clearTokens: () => void;
  isAuthenticated: () => boolean;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      accessToken: null,

      setTokens: (tokens) => set({ accessToken: tokens.accessToken }),

      clearTokens: () => set({ accessToken: null }),

      isAuthenticated: () => Boolean(get().accessToken),
    }),
    { name: "auth-storage" }
  )
);
