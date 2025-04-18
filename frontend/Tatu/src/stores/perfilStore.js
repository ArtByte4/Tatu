import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useProfile = create( persist(
  (set) => ({
  photo: null,
  profileData: (url) => set({photo: url })
}),
{
  name: "profile-storage", 
  getStorage: () => localStorage,
}
));
