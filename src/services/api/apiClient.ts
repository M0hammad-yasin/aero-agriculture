import HttpClient from './httpClient';

/**
 * API Client Singleton
 * Responsible for creating and exporting a configured Axios instance
 */
class ApiClient {
  private static instance: ApiClient;
  private httpClient: HttpClient;

  private constructor() {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    
    this.httpClient = new HttpClient({
      baseURL: apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get the singleton instance of ApiClient
   */
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Get the configured Axios instance
   */
  public getAxiosInstance() {
    return this.httpClient.getInstance();
  }
}

// Export a singleton instance
const apiClient = ApiClient.getInstance();
export default apiClient.getAxiosInstance();