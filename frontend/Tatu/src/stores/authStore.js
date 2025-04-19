import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: {},
      photo: null,
      profileData: (url) => set({photo: url }),
      login: (user_handle, user_id) =>
        set({
          isAuthenticated: true,
          user: { 
            username: user_handle, 
            id: user_id,
          },
        }),
      logout: () => set({ isAuthenticated: false, user: {}, photo: null}),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
