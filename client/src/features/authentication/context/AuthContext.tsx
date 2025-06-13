import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/auth.hook';
import { User, LoginRequest, RegisterRequest, ProfileUpdateRequest } from '../../../models/auth-model';

interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<{ success: boolean; user?: User; error?: string }>;
  updateProfile: (userData: ProfileUpdateRequest) => Promise<{ success: boolean; user?: User; error?: string }>;
  refreshToken: () => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
  resetAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {isAuthenticated,isInitialized,clearError,fetchUserProfile,updateProfile,refreshToken,login,user,isLoading,error,logout,register,resetAuth} = useAuth();

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!isAuthenticated || !isInitialized) return;

    const refreshInterval = setInterval(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Auto token refresh failed:', error);
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, isInitialized, refreshToken]);

  // Handle visibility change to refresh token when user returns
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && isAuthenticated) {
        try {
          await refreshToken();
        } catch (error) {
          console.error('Token refresh on visibility change failed:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated, refreshToken]);

  const contextValue: AuthContextType = {
    // State
    user,
   isAuthenticated,
    isLoading,
   error,
    isInitialized,
    
    // Actions
    login,
    register,
    logout,
    fetchUserProfile,
    updateProfile,
    refreshToken,
   clearError,
    resetAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protecting routes
// eslint-disable-next-line react-refresh/only-export-components
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading, isInitialized } = useAuthContext();

    if (!isInitialized || isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login page
      window.location.href = '/login';
      return null;
    }

    return <Component {...props} />;
  };
};

// // Hook for checking if user has specific permissions
// export const usePermissions = () => {
//   const { user } = useAuthContext();
  
//   const hasPermission = (permission: string): boolean => {
//     // Implement your permission logic here
//     // This is a basic example - you might have roles, permissions array, etc.
//     return user ? true : false;
//   };
  
//   const hasRole = (role: string): boolean => {
//     // Implement your role checking logic here
//     return user ? true : false;
//   };
  
//   return {
//     hasPermission,
//     hasRole,
//   };
// };