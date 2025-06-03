import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

/**
 * Response wrapper for API responses
 */
export interface ApiResponse<T> {
  data: T | null;
  message:string,
  error: string | null;
  status: number;
  isSuccess: boolean;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: "asc" | "desc";
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

/**
 * Base API Service for CRUD operations
 * Generic type T represents the entity model
 * Generic type ID represents the type of the entity's ID (string, number, etc.)
 */
abstract class BaseApiService<T, ID = string> {
  protected readonly axios: AxiosInstance;
  protected readonly resourceUrl: string;

  /**
   * Constructor for the base API service
   * @param axios - Axios instance to use for requests
   * @param resourceUrl - Base URL for the resource endpoints
   */
  constructor(axios: AxiosInstance, resourceUrl: string) {
    this.axios = axios;
    this.resourceUrl = resourceUrl;
  }

  /**
   * Handle API errors and format the response
   * @param error - The error object from axios
   * @returns Formatted API response with error details
   */
  protected handleError<R>(error: unknown): ApiResponse<R> {
    if (error instanceof AxiosError) {
      const status = error.response?.status || (error.request ? 503 : 500);
      const message =
        error.response?.data?.error ||
        error.message ||
        "Unknown error occurred";

      console.error(`API Error (${status}):`, message);

      return {
        message,
        data: null,
        error: message,
        status,
        isSuccess: false,
      };
    }

    // Handle non-axios errors
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return {
      data: null,
      message: errorMessage,
      error: errorMessage,
      status: 500,
      isSuccess: false,
    };
  }

  /**
   * Format successful API responses
   * @param response - The axios response object
   * @returns Formatted API response with data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected formatResponse<R>(response: AxiosResponse<any>): ApiResponse<R> {
    // Check if response.data already has the structure we expect from the server
    if (response.data && typeof response.data === 'object' && 'isSuccess' in response.data && 'data' in response.data) {
      // Server already provides a structured response, extract and use it directly
      return {
        data: response.data.data as R,
        message: response.data.message || '',
        error: response.data.error || null,
        status: response.status,
        isSuccess: response.data.isSuccess
      };
    }
    
    // Fallback to the original implementation if response.data doesn't have the expected structure
    return {
      data: response.data as R,
      message: '',
      error: null,
      status: response.status,
      isSuccess: true,
    };
  }

  /**
   * Get all entities
   * @param config - Optional axios request configuration
   * @returns Promise with API response containing array of entities
   */
  async getAll(config?: AxiosRequestConfig): Promise<ApiResponse<T[]>> {
    try {
      const response = await this.axios.get<T[]>(this.resourceUrl, config);
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError<T[]>(error);
    }
  }

  /**
   * Get paginated entities
   * @param params - Pagination parameters
   * @param config - Optional axios request configuration
   * @returns Promise with API response containing paginated results
   */
  async getPaginated(
    params: PaginationParams = {},
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    try {
      const { page = 0, size = 10, sort, order } = params;

      const response = await this.axios.get<PaginatedResponse<T>>(
        this.resourceUrl,
        {
          ...config,
          params: {
            ...config?.params,
            page,
            size,
            ...(sort && { sort }),
            ...(order && { order }),
          },
        }
      );

      return this.formatResponse(response);
    } catch (error) {
      return this.handleError<PaginatedResponse<T>>(error);
    }
  }

  /**
   * Get an entity by ID
   * @param id - Entity ID
   * @param config - Optional axios request configuration
   * @returns Promise with API response containing the entity
   */
  async getById(id: ID, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axios.get<T>(
        `${this.resourceUrl}/${id}`,
        config
      );
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Create a new entity
   * @param entity - Entity data to create
   * @param config - Optional axios request configuration
   * @returns Promise with API response containing the created entity
   */
  async create(
    entity: Partial<T>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axios.post<T>(
        this.resourceUrl,
        entity,
        config
      );
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Update an existing entity
   * @param id - Entity ID
   * @param entity - Updated entity data
   * @param config - Optional axios request configuration
   * @returns Promise with API response containing the updated entity
   */
  async update(
    id: ID,
    entity: Partial<T>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axios.put<T>(
        `${this.resourceUrl}/${id}`,
        entity,
        config
      );
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Partially update an entity (PATCH)
   * @param id - Entity ID
   * @param entity - Partial entity with fields to update
   * @param config - Optional axios request configuration
   * @returns Promise with API response containing the updated entity
   */
  async patch(
    id: ID,
    entity: Partial<T>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axios.patch<T>(
        `${this.resourceUrl}/${id}`,
        entity,
        config
      );
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Delete an entity
   * @param id - Entity ID
   * @param config - Optional axios request configuration
   * @returns Promise with API response indicating success or failure
   */
  async delete(
    id: ID,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<void>> {
    try {
      const response = await this.axios.delete<void>(
        `${this.resourceUrl}/${id}`,
        config
      );
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError<void>(error);
    }
  }

  /**
   * Perform a custom GET request
   * @param url - Endpoint URL (will be appended to resourceUrl)
   * @param config - Optional axios request configuration
   * @returns Promise with API response containing the result
   */
  async customGet<R>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<R>> {
    try {
      const response = await this.axios.get<R>(
        `${this.resourceUrl}/${url}`,
        config
      );
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError<R>(error);
    }
  }

  /**
   * Perform a custom POST request
   * @param url - Endpoint URL (will be appended to resourceUrl)
   * @param data - Request body data
   * @param config - Optional axios request configuration
   * @returns Promise with API response containing the result
   */
  async customPost<D, R>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<R>> {
    try {
      const response = await this.axios.post<R>(
        `${this.resourceUrl}/${url}`,
        data,
        config
      );
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError<R>(error);
    }
  }

  /**
   * Perform a custom PUT request
   * @param url - Endpoint URL (will be appended to resourceUrl)
   * @param data - Request body data
   * @param config - Optional axios request configuration
   * @returns Promise with API response containing the result
   */
  async customPut<D, R>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<R>> {
    try {
      const response = await this.axios.put<R>(
        `${this.resourceUrl}/${url}`,
        data,
        config
      );
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError<R>(error);
    }
  }

  /**
   * Perform a custom PATCH request
   * @param url - Endpoint URL (will be appended to resourceUrl)
   * @param data - Request body data
   * @param config - Optional axios request configuration
   * @returns Promise with API response containing the result
   */
  async customPatch<D, R>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<R>> {
    try {
      const response = await this.axios.patch<R>(
        `${this.resourceUrl}/${url}`,
        data,
        config
      );
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError<R>(error);
    }
  }

  /**
   * Perform a custom DELETE request
   * @param url - Endpoint URL (will be appended to resourceUrl)
   * @param config - Optional axios request configuration
   * @returns Promise with API response containing the result
   */
  async customDelete<R>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<R>> {
    try {
      const response = await this.axios.delete<R>(
        `${this.resourceUrl}/${url}`,
        config
      );
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError<R>(error);
    }
  }
}

export default BaseApiService;
