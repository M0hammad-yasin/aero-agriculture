import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import authService from '../services';
import { LoginRequest, RegisterRequest, User, UserResponse } from '../../../models/auth-model';
import axios, { AxiosError } from 'axios';

/**
 * Custom hook for authentication-related operations
 */
export const useAuth = () => {
  const navigate = useNavigate();

  // Auth store state and actions
  const {
    login: storeLogin,
    logout: storeLogout,
    user,
    isAuthenticated
  } = useAuthStore();

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle user login
   * @param credentials - User login credentials
   */
  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      if(response?.data){
        const {id,name,email,image}=response.data.user;
      storeLogin({
        id,
        name,
        email,
        image
      });}

      navigate('/dashboard');
      return user;
    } catch (err: unknown) {
      let errorMsg = 'Failed to login. Please check your credentials.';
      if (axios.isAxiosError(err)) {
        errorMsg = err.response?.data?.message || errorMsg;
      }
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user registration
   * @param userData - User registration data
   */
  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);
      if(response.isSuccess) navigate('/login');
      else(
        setError(response.error)
      )
      return user;
    } catch (err: unknown) {
      let errorMsg = 'Failed to register. Please try again.';
      if (axios.isAxiosError(err)) {
        errorMsg = err.response?.data?.message || errorMsg;
      }
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user logout
   */
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      storeLogout();
      navigate('/login');
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch the current user's profile
   */
  const fetchUserProfile = async (): Promise<UserResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.getCurrentProfile();
      const profile = response.data;

      storeLogin({
        name: profile.name,
        email: profile.email,
        image: profile.image
      });

      return profile;
    } catch (err: unknown) {
      let errorMsg = 'Failed to fetch user profile.';
      if (axios.isAxiosError(err)) {
        errorMsg = err.response?.data?.message || errorMsg;
      }
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    fetchUserProfile,
    isLoading,
    error,
    user,
    isAuthenticated
  };
};

export default useAuth;
