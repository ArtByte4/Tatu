import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  username: string;
  id: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  photo: string | null;
  profileData: (url: string) => void;
  login: (user_handle: string, user_id: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      photo: null,
      profileData: (url) => set({ photo: url }),
      login: (user_handle, user_id) =>
        set({
          isAuthenticated: true,
          user: {
            username: user_handle,
            id: user_id,
          },
        }),
      logout: () => set({ isAuthenticated: false, user: null, photo: null }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
