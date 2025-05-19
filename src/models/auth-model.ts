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
  export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number | null;
    isSuccess: boolean;
  }

  export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }
  export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  }
  export interface UserResponse{
    user: User;
    token: string;
    expiresAt: string;
  }