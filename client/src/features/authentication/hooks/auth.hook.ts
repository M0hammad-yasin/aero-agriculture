import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LoginRequest, ProfileUpdateRequest, RegisterRequest } from '../../../models/auth-model';
import authService from '../services';


export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    login: setLogin,
    logout: setLogout,
    setLoading,
    setError,
    clearError,
    setUser,
    initialize,
    reset,
  } = useAuthStore();

  const navigate = useNavigate();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
    

      if (isInitialized) return;
      
      setLoading(true);
      try {
        const isAuth = await authService.isAuthenticated();
        if (isAuth) {
          const userProfile = await authService.getCurrentProfile();
          console.log("auth hook 34: ",userProfile.data);
          if (userProfile.data) {
            setLogin(userProfile.data);
          } else {
            // If we can't get profile but token exists, clear everything
            await authService.logout();
            setLogout();
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Clear any invalid tokens
        await authService.logout();
        setLogout();
      } finally {
        setLoading(false);
        initialize();
      }
    };

    initializeAuth();
  }, [isInitialized, setLogin, setLogout, setLoading, initialize]);

  const login = useCallback(async (credentials: LoginRequest) => {
    if (isLoading) return { success: false, error: 'Login already in progress' };
    
    setLoading(true);
    clearError();
    try {
      const response = await authService.login(credentials);
      if (response.isSuccess && response.data) {
        setLogin(response.data?.user);
        return { success: true, user: response.data?.user };
      } else {
        const errorMsg = response.error || 'Invalid response from server';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [isLoading, setLoading, clearError, setLogin, setError]);

  const register = useCallback(async (userData: RegisterRequest) => {
    if (isLoading) return { success: false, error: 'Registration already in progress' };
    
    setLoading(true);
    clearError();
    
    try {
      const {isSuccess,data,error} = await authService.register(userData);
      if (isSuccess && data?.user) {
        return { success: isSuccess, user: data.user };
      } else {
        const errorMsg = error || 'Registration failed. Invalid response from server.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      const errorMessage =error instanceof Error ? error.message : 'Registration failed. Please try again.';
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [isLoading, setLoading, clearError, setError]);

  const logout = useCallback(async () => {
    if (isLoading) return;
    
    setLoading(true);
    clearError();
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      setLogout();
      setLoading(false);
      navigate('/login');
    }
  }, [isLoading, setLoading, clearError, setLogout, navigate]);

  const fetchUserProfile = useCallback(async () => {
    if (isLoading || !isAuthenticated) return { success: false, error: 'Not authenticated' };
    
    setLoading(true);
    clearError();
    
    try {

      const {data,isSuccess,error} = await authService.getCurrentProfile();;
      console.log("auth hook 131",data)
      if (isSuccess && data) {
        setUser(data);
        return { success: true, user: data };
      } else {
        const errorMsg =error|| 'Failed to fetch user profile';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      logout();
      const errorMessage =error instanceof Error ? error.message : 'Failed to fetch user profile';
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [isLoading, isAuthenticated, setLoading, clearError, setUser, setError, logout]);

  const updateProfile = useCallback(async (userData: ProfileUpdateRequest) => {
    if (isLoading || !isAuthenticated) return { success: false, error: 'Not authenticated' };
    
    setLoading(true);
    clearError();
    
    try {
      const {data,isSuccess,error,status} = await authService.updateProfile(userData);
      if (isSuccess && data) {
        setUser(data);
        return { success: true, user: data };
      } else {
        const errorMsg = error||'Failed to update profile';
        setError(errorMsg);
        if(status===401){ 
          logout();}
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      const errorMessage =error instanceof Error ? error.message :  'Failed to update profile';
      
      setError(errorMessage);
      logout();
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [isLoading, isAuthenticated, setLoading, clearError, setUser, setError, logout]);

  const refreshToken = useCallback(async () => {
    if (isLoading) return { success: false, error: 'Refresh already in progress' };
    
    setLoading(true);
    
    try {
      const {isSuccess,data,error} = await authService.refreshToken();
      
      if (isSuccess && data) {
        // Fetch updated user profile after token refresh
        const response = await authService.getCurrentProfile();
        if (response.isSuccess && response.data) {
          setUser(response.data);
        }
        return { success: true };
      } else {
        setError(error || 'Failed to refresh token');
        await logout();
        return { success: false, error: error || 'Session expired. Please login again.' };
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      setError(error instanceof Error? error.message:'Failed to refresh token');
      await logout();
      return { success: false, error: 'Session expired. Please login again.' };
    } finally {
      setLoading(false);
    }
  }, [isLoading, setLoading, setUser,setError, logout]);

  const resetAuth = useCallback(() => {
    reset();
  }, [reset]);

  return {
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
};
