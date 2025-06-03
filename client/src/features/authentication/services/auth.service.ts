import { BaseApiService, axiosInstance } from '../../../services/api';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  ProfileUpdateRequest, 
  ApiResponse
} from '../../../models/auth-model';

/**
 * Authentication service for handling user authentication
 */
class AuthService extends BaseApiService<User> {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor() {
   
    const baseUrl = '/auth';
    super(axiosInstance, baseUrl);
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
        // Store tokens securely
        this.setToken(response.data.accessToken);
        if (response.data.refreshToken) {
          this.setRefreshToken(response.data.refreshToken);
        }
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
      return await this.customPost<RegisterRequest, AuthResponse>('register', registerData);
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
      const response = await this.customPost<void, void>('logout');
      
      // Clear tokens regardless of API response
      this.clearTokens();
      
      return response;
    } catch (error) {
      // Clear tokens even if logout API fails
      this.clearTokens();
      return this.handleError<void>(error);
    }
  }

  /**
   * Get current user profile
   * @returns Promise with API response
   */
  async getCurrentProfile(): Promise<ApiResponse<User>> {
    try {
      return await this.customGet<User>('users/profile');
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
      return await this.customPut<ProfileUpdateRequest, User>('users/profile', profileData);
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
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.customPost<{ refreshToken: string }, AuthResponse>(
        'refresh-token', 
        { refreshToken }
      );

      if (response.isSuccess && response.data) {
        this.setToken(response.data.accessToken);
        if (response.data.refreshToken) {
          this.setRefreshToken(response.data.refreshToken);
        }
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
   * Get stored refresh token
   * @returns refresh token string or null
   */
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
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
   * Set refresh token
   * @param refreshToken - Refresh token
   */
  private setRefreshToken(refreshToken: string): void {
    try {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  /**
   * Clear all stored tokens
   */
  private clearTokens(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
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