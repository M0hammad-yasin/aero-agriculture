import axios, { AxiosInstance } from 'axios';
import { ApiResponse, AuthResponse } from '../../models/auth-model';
import { TokenManager } from '../../features/authentication/utils/auth.utils';
import { navigateToLogin } from '../../utils/navigation';
import { useAuthStore } from '../../features/authentication/store/useAuthStore';

/**
 * Configuration for the HTTP client
 */
interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * HttpClient class to handle Axios configuration and setup
 */
class HttpClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor(config: HttpClientConfig) {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000, // Default timeout of 30 seconds
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      withCredentials: true, // Enable sending cookies with requests
    });

    this.setupInterceptors();
  }

  private processQueue(error: unknown | null = null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    this.failedQueue = [];
  }

  private handleTokenExpiration() {
    // Clear tokens
    TokenManager.clearTokens();
    // Reset auth store state
    const resetAuth = useAuthStore.getState().reset;
    resetAuth();
    // Navigate to login
    navigateToLogin();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Get token from localStorage using consistent key
        const token = TokenManager.getToken();
        if(!token){
          TokenManager.clearTokens();
        }
        // If token exists and is valid, add it to the headers
        if (token && config.headers) {
          try {
            // Basic token validation
            if (token.trim() !== '') {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            console.error('Error setting authorization header:', error);
            // Remove invalid token
            TokenManager.clearTokens();
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle common error scenarios
        if (error.response) {
          const status = error.response.status;
          
          // Handle 401 Unauthorized
          if (status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh-token')) {
            if (this.isRefreshing) {
              // If already refreshing, queue this request
              return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
              })
                .then(() => this.instance(originalRequest))
                .catch((err) => Promise.reject(err));
            }

            this.isRefreshing = true;
            originalRequest._retry = true;

            try {
              // Attempt token refresh - the cookie will be sent automatically
              const refreshResponse = await this.instance.post<ApiResponse<AuthResponse>>('/auth/refresh-token');
         
              if (refreshResponse.data.data?.accessToken) {
                // Store the new access token
                TokenManager.setToken(refreshResponse.data.data.accessToken);
                // Update authorization header
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data.accessToken}`;
                // Process queued requests
                this.processQueue();
                // Retry original request
                return this.instance(originalRequest);
              } else {
                this.processQueue(error);
                this.handleTokenExpiration();
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              this.processQueue(refreshError);
              this.handleTokenExpiration();
            } finally {
              this.isRefreshing = false;
            }
          }
          
          // Handle 403 Forbidden
          if (status === 403) {
            console.error('Access forbidden - insufficient permissions : ',error.response?.data);
          }
          
          // Handle 404 Not Found
          if (status === 404) {
            console.error('Resource not found:', error.config?.url);
          }
          
          // Handle 422 Validation Error
          if (status === 422) {
            console.error('Validation error:', error.response.data);
          }
          
          // Handle 500+ Server Errors
          if (status >= 500) {
            console.error('Server error occurred:', status, error.response.data);
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received from server - network error');
        } else {
          // Something happened in setting up the request
          console.error('Error setting up request:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get the axios instance
   */
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

export default HttpClient;