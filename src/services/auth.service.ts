import { AxiosInstance } from 'axios';
import BaseApiService, { ApiResponse } from './baseApiService';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ProfileUpdateRequest 
} from '../models/auth.model';

/**
 * Authentication Service
 * Handles API calls for authentication and user management
 */
class AuthService extends BaseApiService<User> {
  constructor(axios: AxiosInstance) {
    // Use the version prefix from the API structure document
    super(axios, '/api/v1/auth');
  }

  /**
   * Register a new user
   * @param registerData - Registration data
   * @returns Promise with API response
   */
  async register(registerData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.customPost<RegisterRequest, AuthResponse>('register', registerData);
  }

  /**
   * Login user
   * @param loginData - Login credentials
   * @returns Promise with API response
   */
  async login(loginData: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.customPost<LoginRequest, AuthResponse>('login', loginData);
  }

  /**
   * Logout user
   * @returns Promise with API response
   */
  async logout(): Promise<ApiResponse<void>> {
    return this.customPost<void, void>('logout');
  }

  /**
   * Get current user profile
   * @returns Promise with API response
   */
  async getCurrentProfile(): Promise<ApiResponse<User>> {
    return this.customGet<User>('../users/profile');
  }

  /**
   * Update user profile
   * @param profileData - Profile data to update
   * @returns Promise with API response
   */
  async updateProfile(profileData: ProfileUpdateRequest): Promise<ApiResponse<User>> {
    return this.customPut<ProfileUpdateRequest, User>('../users/profile', profileData);
  }
}

export default AuthService;