import create from 'zustand'

export const useAuthStore = create((set) => {
    return {
        user: null,
        setUser: (user) => set({ user }),
        isAuthenticated: () => !!set.getState().user,
        logout: () => set({ user: null }),
    } 
})