import { User } from '../../../models/auth-model';

// Token storage keys
export const TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_KEY = 'auth_user';
interface JwtPayload {
    exp?: number; // Optional, since some tokens might not have it
    [key: string]: unknown; // Allow additional properties
  }
/**
 * Token management utilities
 */
export class TokenManager {
  /**
   * Store authentication token
   */
  static setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store auth token:', error);
    }
  }

  /**
   * Get authentication token
   */
  static getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve auth token:', error);
      return null;
    }
  }

  /**
   * Store refresh token
   */
  static setRefreshToken(token: string): void {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  /**
   * Clear all authentication tokens
   */
  static clearTokens(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to clear auth tokens:', error);
    }
  }

  /**
   * Check if token exists and is not empty
   */
  static hasToken(): boolean {
    const token = this.getToken();
    return token !== null && token.trim() !== '';
  }

  /**
   * Check if refresh token exists and is not empty
   */
  static hasRefreshToken(): boolean {
    const token = this.getRefreshToken();
    return token !== null && token.trim() !== '';
  }

  /**
   * Decode JWT token payload (without verification)
   * Note: This is for client-side use only, never trust this on the server
   */
  static decodeToken<T = unknown>(token: string): T | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as T;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }
  

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken<JwtPayload>(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const decoded = this.decodeToken<JwtPayload>(token);
      if (!decoded || !decoded.exp) {
        return null;
      }
      return new Date(decoded.exp * 1000);
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  }

  /**
   * Check if token will expire soon (within 5 minutes)
   */
  static willTokenExpireSoon(token: string, minutesThreshold: number = 5): boolean {
    try {
      const decoded = this.decodeToken<JwtPayload>(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      
      const currentTime = Date.now() / 1000;
      const thresholdTime = currentTime + (minutesThreshold * 60);
      return decoded.exp < thresholdTime;
    } catch (error) {
      console.error('Error checking token expiration threshold:', error);
      return true;
    }
  }
}

/**
 * Validation utilities
 */
export class ValidationUtils {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Validate password strength
   */
  static isValidPassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate name format
   */
  static isValidName(name: string): boolean {
    const trimmedName = name.trim();
    return trimmedName.length >= 2 && trimmedName.length <= 50 && /^[a-zA-Z\s]+$/.test(trimmedName);
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>"'&]/g, '');
  }
}

/**
 * Security utilities
 */
export class SecurityUtils {
  /**
   * Generate a random string for CSRF protection or nonces
   */
  static generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Hash a string using a simple hash function (for client-side use only)
   */
  static simpleHash(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  /**
   * Check if the current environment is secure (HTTPS)
   */
  static isSecureContext(): boolean {
    return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  }

  /**
   * Mask sensitive data for logging
   */
  static maskSensitiveData(data: string, visibleChars: number = 4): string {
    if (data.length <= visibleChars) {
      return '*'.repeat(data.length);
    }
    return data.substring(0, visibleChars) + '*'.repeat(data.length - visibleChars);
  }
}

/**
 * User utilities
 */
export class UserUtils {
  /**
   * Get user initials from name
   */
  static getUserInitials(user: User): string {
    if (!user.name) return 'U';
    
    const names = user.name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * Get user display name
   */
  static getDisplayName(user: User): string {
    return user.name || user.email || 'Unknown User';
  }

  /**
   * Check if user has a profile image
   */
  static hasProfileImage(user: User): boolean {
    return !!(user.image && user.image.trim() !== '');
  }

  /**
   * Get user avatar URL or fallback
   */
  static getAvatarUrl(user: User, fallbackUrl?: string): string {
    if (this.hasProfileImage(user)) {
      return user.image!;
    }
    
    if (fallbackUrl) {
      return fallbackUrl;
    }
    
    // Generate a default avatar URL based on user initials
    const initials = this.getUserInitials(user);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
  }
}

/**
 * Storage utilities with error handling
 */
export class StorageUtils {
  /**
   * Safely set item in localStorage
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static setItem(key: string, value: any): boolean {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Failed to set localStorage item '${key}':`, error);
      return false;
    }
  }

  /**
   * Safely get item from localStorage
   */
  static getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item);
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Failed to get localStorage item '${key}':`, error);
      return defaultValue || null;
    }
  }

  /**
   * Safely remove item from localStorage
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove localStorage item '${key}':`, error);
      return false;
    }
  }

  /**
   * Clear all localStorage items with a specific prefix
   */
  static clearItemsWithPrefix(prefix: string): boolean {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error(`Failed to clear localStorage items with prefix '${prefix}':`, error);
      return false;
    }
  }
}