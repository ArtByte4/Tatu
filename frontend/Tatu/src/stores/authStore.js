import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create( persist(
  (set) => ({
  isAuthenticated: false,
  user: {},
  login: (user_handle, user_id) => set({ isAuthenticated: true, user: {user: user_handle, id: user_id} }),
  logout: () => set({ isAuthenticated: false, user: {} }),
}),
{
  name: "auth-storage", 
  getStorage: () => localStorage,
}
));
