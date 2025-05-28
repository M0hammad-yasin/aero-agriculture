import HttpClient from './httpClient';

/**
 * Configuration for creating an HTTP client
 */
interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Create and configure an HTTP client
 * @param config - Configuration for the HTTP client
 * @returns Configured HTTP client
 */
export const createHttpClient = (config: HttpClientConfig): HttpClient => {
  return new HttpClient(config);
};

/**
 * Get the base URL for API requests
 * @returns Base URL string
 */
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_APP_API_URL || 
         'http://localhost:3000';
};

/**
 * Create a default HTTP client with base URL from environment
 * @returns Configured HTTP client
 */
export const createDefaultHttpClient = (): HttpClient => {
  return createHttpClient({
    baseURL: getApiBaseUrl()
  });
};

export { default as HttpClient } from './httpClient';
export { default as BaseApiService } from './baseApiServices';