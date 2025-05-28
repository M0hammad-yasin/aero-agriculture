import axios, { AxiosInstance,  } from 'axios';

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
        const token = localStorage.getItem('auth_token');
        
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
        console.error('Request interceptor error:', error);
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
          if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            // Try to refresh token first
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              try {
                // Attempt token refresh
                const refreshResponse = await this.instance.post('/auth/refresh', {
                  refreshToken
                });
                
                if (refreshResponse.data?.token) {
                  localStorage.setItem('auth_token', refreshResponse.data.token);
                  // Retry original request with new token
                  originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
                  return this.instance(originalRequest);
                }
              } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
              }
            }
            
            // Clear auth data and redirect to login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            
            // Only redirect if we're not already on the login page
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
          
          // Handle 403 Forbidden
          if (status === 403) {
            console.error('Access forbidden - insufficient permissions');
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