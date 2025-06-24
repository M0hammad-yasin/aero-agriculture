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

  /**
   * Get the Axios instance
   */
  public getInstance(): AxiosInstance {
    return this.instance;
  }

  /**
   * Process the queue of failed requests
   */
  private processQueue(error?: unknown): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    this.failedQueue = [];
  }

  /**
   * Handle token expiration
   */
  private handleTokenExpiration(): void {
    TokenManager.clearTokens();
    useAuthStore.getState().setUser(null);
    navigateToLogin();
  }

  /**
   * Setup Axios interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Get the token
        const token = TokenManager.getToken();
        
        // If token exists, add it to the headers
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Check if the request contains FormData
        if (config.data instanceof FormData) {
          // Remove the Content-Type header to let the browser set it with the boundary
          delete config.headers['Content-Type'];
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
        const status = error.response?.status;

        // Handle token refresh
        if (status === 401 && !originalRequest._retry && !this.isRefreshing) {
          originalRequest._retry = true;
          this.isRefreshing = true;

          // Add request to queue if refresh is in progress
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => {
                return this.instance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

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

        return Promise.reject(error);
      }
    );
  }
}

export default HttpClient;