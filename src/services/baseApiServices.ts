import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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
   * Get all entities
   * @param config - Optional axios request configuration
   * @returns Promise with array of entities
   */
  async getAll(config?: AxiosRequestConfig): Promise<T[]> {
    const response: AxiosResponse<T[]> = await this.axios.get(
      this.resourceUrl,
      config
    );
    return response.data;
  }

  /**
   * Get paginated entities
   * @param page - Page number (0-based)
   * @param size - Page size
   * @param config - Optional axios request configuration
   * @returns Promise with paginated response
   */
  async getPaginated(
    page: number = 0,
    size: number = 10,
    config?: AxiosRequestConfig
  ): Promise<{ items: T[]; total: number; page: number; size: number }> {
    const response = await this.axios.get(this.resourceUrl, {
      ...config,
      params: {
        ...config?.params,
        page,
        size,
      },
    });
    return response.data;
  }

  /**
   * Get an entity by ID
   * @param id - Entity ID
   * @param config - Optional axios request configuration
   * @returns Promise with the entity
   */
  async getById(id: ID, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.get(
      `${this.resourceUrl}/${id}`,
      config
    );
    return response.data;
  }

  /**
   * Create a new entity
   * @param entity - Entity data to create
   * @param config - Optional axios request configuration
   * @returns Promise with the created entity
   */
  async create(entity: Partial<T>, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.post(
      this.resourceUrl,
      entity,
      config
    );
    return response.data;
  }

  /**
   * Update an existing entity
   * @param id - Entity ID
   * @param entity - Updated entity data
   * @param config - Optional axios request configuration
   * @returns Promise with the updated entity
   */
  async update(id: ID, entity: Partial<T>, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.put(
      `${this.resourceUrl}/${id}`,
      entity,
      config
    );
    return response.data;
  }

  /**
   * Partially update an entity (PATCH)
   * @param id - Entity ID
   * @param entity - Partial entity with fields to update
   * @param config - Optional axios request configuration
   * @returns Promise with the updated entity
   */
  async patch(id: ID, entity: Partial<T>, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.patch(
      `${this.resourceUrl}/${id}`,
      entity,
      config
    );
    return response.data;
  }

  /**
   * Delete an entity
   * @param id - Entity ID
   * @param config - Optional axios request configuration
   * @returns Promise with the deletion result
   */
  async delete(id: ID, config?: AxiosRequestConfig): Promise<void> {
    await this.axios.delete(`${this.resourceUrl}/${id}`, config);
  }

  /**
   * Perform a custom GET request
   * @param url - Endpoint URL (will be appended to resourceUrl)
   * @param config - Optional axios request configuration
   * @returns Promise with the response data
   */
  async customGet<R>(url: string, config?: AxiosRequestConfig): Promise<R> {
    const response: AxiosResponse<R> = await this.axios.get(
      `${this.resourceUrl}/${url}`,
      config
    );
    return response.data;
  }

  /**
   * Perform a custom POST request
   * @param url - Endpoint URL (will be appended to resourceUrl)
   * @param data - Request body data
   * @param config - Optional axios request configuration
   * @returns Promise with the response data
   */
  async customPost<D, R>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<R> {
    const response: AxiosResponse<R> = await this.axios.post(
      `${this.resourceUrl}/${url}`,
      data,
      config
    );
    return response.data;
  }
}

export default BaseApiService;