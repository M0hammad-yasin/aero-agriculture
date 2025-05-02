import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Import the layout store
import {useLayoutStore as layoutStore} from "./useLayoutStore" ;
interface User {
  name: string;
  email: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          error: null,
        });

        // Update the layout store user as well
        layoutStore.setState({ user });
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
        
        // Update the layout store user as well
        layoutStore.setState({ user: null });
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage
      storage: {
        getItem: (name: string) => {
          const str = localStorage.getItem(name);
          if (str) return JSON.parse(str);
          return null;
        },
        setItem: (name: string, value: unknown) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          localStorage.removeItem(name);
        }
      }
    }
  )
);