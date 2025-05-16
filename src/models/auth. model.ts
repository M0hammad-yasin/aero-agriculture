/**
 * User entity interface
 */
export interface User {
    id: string;
    name: string;
    email: string;  
    image?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  /**
   * Login request payload
   */
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  /**
   * Registration request payload
   */
  export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  /**
   * Authentication response
   */
  export interface AuthResponse {
    user: User;
    token: string;
    expiresAt: string;
  }
  
  /**
   * Profile update request
   */
  export interface ProfileUpdateRequest {
    name?: string;
    email?: string;
    image?: string;
    currentPassword?: string;
    newPassword?: string;
  }