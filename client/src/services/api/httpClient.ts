import axios, { AxiosInstance,  } from 'axios';
import { ApiResponse, AuthResponse } from '../../models/auth-model';
import { TokenManager } from '../../features/authentication';

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
            localStorage.removeItem('auth_token');
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
      (response) => (response),
      async (error) => {
        const originalRequest = error.config;

        // Handle common error scenarios
        if (error.response) {
          const status = error.response.status;
          
          // Handle 401 Unauthorized
          if (status === 401 && true && !(originalRequest._retry)&&
          !originalRequest.url.includes('/auth/refresh-token') ) {
            originalRequest._retry = true;
            try {
              // Attempt token refresh - the cookie will be sent automatically
              const refreshResponse = await this.instance.post<ApiResponse<AuthResponse>>('/auth/refresh-token');
         
              if (refreshResponse.data.data?.accessToken) {
                // Store the new access token
                localStorage.setItem('auth_token', refreshResponse.data.data.accessToken);
                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data.accessToken}`;
                return this.instance(originalRequest);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
            }
            
            // Clear auth data and redirect to login
            localStorage.removeItem('auth_token');
            // No need to remove refresh_token from localStorage as it's now handled by HTTP-only cookies
            
            // Only redirect if we're not already on the login page
            // if (!window.location.pathname.includes('/login')) {
            //   window.location.href = '/login';
            // }
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