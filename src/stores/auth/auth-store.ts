"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ user: null, isLoading: false }),
    }),
    {
      name: "auth-storage",
      // Only persist user data, not loading state
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
