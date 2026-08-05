import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null, // { id, nama, email, role, no_hp, created_at }

      setSession: (token, user) => set({ token, user }),
      updateUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),

      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: "2amstage-auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
