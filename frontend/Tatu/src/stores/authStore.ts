import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  username: string;
  rol: number;
  id: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  photo: string | null;
  profileData: (url: string) => void;
  login: (user_handle: string, user_id: number, role_id: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      photo: null,
      profileData: (url: string) => set({ photo: url }),
      login: (user_handle: string, user_id: number, role_id: number) =>
        set({
          isAuthenticated: true,
          user: {
            username: user_handle,
            rol: role_id,
            id: user_id,
          },
        }),
      logout: () => set({ isAuthenticated: false, user: null, photo: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
