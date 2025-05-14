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
        // Get token from localStorage
        const token = localStorage.getItem('auth_token');
        
        // If token exists, add it to the headers
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle common error scenarios
        if (error.response) {
          // Handle 401 Unauthorized - redirect to login
          if (error.response.status === 401) {
            // Clear local auth data
            localStorage.removeItem('auth_token');
            // Redirect to login page
            window.location.href = '/login';
          }
          
          // Handle 403 Forbidden
          if (error.response.status === 403) {
            console.error('Access forbidden');
          }
          
          // Handle 404 Not Found
          if (error.response.status === 404) {
            console.error('Resource not found');
          }
          
          // Handle 500 Server Error
          if (error.response.status >= 500) {
            console.error('Server error occurred');
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received from server');
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