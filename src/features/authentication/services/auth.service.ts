import { BaseApiService, createDefaultHttpClient } from '../../../services/api';
// User interfaces
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  ProfileUpdateRequest, 
} from '../../../models/auth-model';
import { ApiResponse } from '../../../models/auth-model';
/**
 * Authentication service for handling user authentication
 */
class AuthService extends BaseApiService<User>{
  constructor() {
    const httpClient=createDefaultHttpClient();
    const axios = httpClient.getInstance();
    const baseUrl = '/api/v1/auth';
    super(axios, baseUrl);
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
   * Register a new user
   * @param registerData - Registration data
   * @returns Promise with API response
   */
  async register(registerData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.customPost<RegisterRequest, AuthResponse>('register', registerData);
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
    return this.customGet<User>('users/profile');
  }

  /**
   * Update user profile
   * @param profileData - Profile data to update
   * @returns Promise with API response
   */
  async updateProfile(profileData: ProfileUpdateRequest): Promise<ApiResponse<User>> {
    return this.customPut<ProfileUpdateRequest, User>('users/profile', profileData);
  }

  /**
   * Check if the user is authenticated
   * @returns boolean indicating if the user has a token
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
export default AuthService;