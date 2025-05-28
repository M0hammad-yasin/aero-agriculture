import { User } from '../../../models/auth-model';
import { create } from 'zustand';
import { persist,PersistOptions } from 'zustand/middleware';
import { useLayoutStore } from '../../../store/useLayoutStore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setUser: (user: User | null) => void;
  initialize: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Define persist options with proper typing
const persistOptions: PersistOptions<AuthState> = {
  name: 'auth-storage',
  storage: {
    getItem: (name: string) => {
      try {
        const str = localStorage.getItem(name);
        if (str) {
          const parsed = JSON.parse(str);
          // Validate the parsed data structure
          if (parsed && typeof parsed === 'object' && 'state' in parsed) {
            return parsed;
          }
        }
        return null;
      } catch (error) {
        console.error('Failed to parse auth storage:', error);
        return null;
      }
    },
    setItem: (name: string, value: unknown) => {
      try {
        localStorage.setItem(name, JSON.stringify(value));
      } catch (error) {
        console.error('Failed to save auth storage:', error);
      }
    },
    removeItem: (name: string) => {
      try {
        localStorage.removeItem(name);
      } catch (error) {
        console.error('Failed to remove auth storage:', error);
      }
    }
  },
  // Only persist user and isAuthenticated, not loading states
  partialize: (state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  } as AuthState),
  // Handle rehydration
  onRehydrateStorage: () => (state) => {
    if (state) {
      state.isLoading = false;
      state.error = null;
      state.isInitialized = true;
    }
  },
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      ...initialState,
      
      login: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          error: null,
          isLoading: false,
        });

        // Update the layout store user as well
        try {
          useLayoutStore.setState({ user });
        } catch (error) {
          console.error('Failed to update layout store:', error);
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
        
        // Update the layout store user as well
        try {
          useLayoutStore.setState({ user: null });
        } catch (error) {
          console.error('Failed to update layout store:', error);
        }
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      setUser: (user: User | null) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          error: null 
        });
        
        // Update the layout store user as well
        try {
          useLayoutStore.setState({ user });
        } catch (error) {
          console.error('Failed to update layout store:', error);
        }
      },
      
      initialize: () => {
        set({ isInitialized: true });
      },
      
      reset: () => {
        set(initialState);
        
        // Clear layout store as well
        try {
          useLayoutStore.setState({ user: null });
        } catch (error) {
          console.error('Failed to clear layout store:', error);
        }
      },
    }),
    persistOptions
  )
);

// Selectors for better performance
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthStatus = () => useAuthStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  isInitialized: state.isInitialized,
}));