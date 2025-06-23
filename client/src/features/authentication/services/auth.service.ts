import { BaseApiService, axiosInstance } from '../../../services/api';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  ProfileUpdateRequest, 
  ApiResponse
} from '../../../models/auth-model';
import { TokenManager } from '../utils/auth.utils';

/**
 * Authentication service for handling user authentication
 */
class AuthService extends BaseApiService<User> {
  private readonly TOKEN_KEY = 'auth_token';

  constructor() {   
    super(axiosInstance, '/auth');
  }

  /**
   * Login user
   * @param loginData - Login credentials
   * @returns Promise with API response
   */
  async login(loginData: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.customPost<LoginRequest, AuthResponse>('login', loginData);
      if (response.isSuccess && response.data) {
        // Store access token in localStorage
        this.setToken(response.data.accessToken);
        // No need to store refresh token as it's handled by HTTP-only cookie
      }
      
      return response;
    } catch (error) {
      return this.handleError<AuthResponse>(error);
    }
  }

  /**
   * Register a new user
   * @param registerData - Registration data
   * @returns Promise with API response
   */
  async register(registerData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.customPost<RegisterRequest, AuthResponse>('register', registerData);
      if (response.isSuccess && response.data) {
        // Store access token in localStorage
        this.setToken(response.data.accessToken);
        // No need to store refresh token as it's handled by HTTP-only cookie
      }
      return response;
    } catch (error) {
      console.log("authservice 55", error);
      return this.handleError<AuthResponse>(error);
    }
  }

  /**
   * Logout user
   * @returns Promise with API response
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      // The server will clear the refresh token cookie
      const response = await this.customPost<void, void>('logout');
      
      // Clear access token from local storage
      TokenManager.clearTokens();
      
      return response;
    } catch (error) {
      // Clear tokens even if logout API fails
      TokenManager.clearTokens();

      return this.handleError<void>(error);
    }
  }

  /**
   * Get current user profile
   * @returns Promise with API response
   */
  async getCurrentProfile(): Promise<ApiResponse<User>> {
    try {
      return await this.customGet<User>('user/profile');
    } catch (error) {
      return this.handleError<User>(error);
    }
  }

  /**
   * Update user profile
   * @param profileData - Profile data to update
   * @returns Promise with API response
   */
  async updateProfile(profileData: ProfileUpdateRequest): Promise<ApiResponse<User>> {
    try {
      const data= await this.customPut<ProfileUpdateRequest, User>('user/profile', profileData);
      return data;
    } catch (error) {

      return this.handleError<User>(error);
    }
  }

  /**
   * Refresh authentication token
   * @returns Promise with API response
   */
  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    try {
      // No need to send the refresh token as it will be sent automatically as a cookie
      const response = await this.customPost<object, AuthResponse>('refresh-token', {});
      if (response.isSuccess && response.data) {
        this.setToken(response.data.accessToken);
        // Refresh token is handled by HTTP-only cookies
      }

      return response;
    } catch (error) {
      return this.handleError<AuthResponse>(error);
    }
  }

  /**
   * Check if the user is authenticated
   * @returns boolean indicating if the user has a valid token
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic token validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      // If token parsing fails, consider it invalid
      return false;
    }
  }

  /**
   * Get stored authentication token
   * @returns token string or null
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Set authentication token
   * @param token - JWT token
   */
  private setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store auth token:', error);
    }
  }

  /**
   * Clear stored tokens
   */
  private clearTokens(): void {
    try {
      // Only clear the access token from localStorage
      // The refresh token is handled by the HTTP-only cookie
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Validate email format
   * @param email - Email to validate
   * @returns boolean indicating if email is valid
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * @param password - Password to validate
   * @returns object with validation result and message
   */
  static validatePassword(password: string): { isValid: boolean; message: string } {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    return { isValid: true, message: 'Password is valid' };
  }
}

export default AuthService;