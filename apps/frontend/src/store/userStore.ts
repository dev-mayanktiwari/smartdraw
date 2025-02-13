import { TokenPayload } from "@repo/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: TokenPayload | null;
  setUser: (user: TokenPayload) => void;
  updateUser: (updates: Partial<TokenPayload>) => void;
  deleteUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      deleteUser: () => set({ user: null }),
    }),
    { name: "active-user" }
  )
);
