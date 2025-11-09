import { ApiResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com/api/v1';

/**
 * Base API client for making HTTP requests
 */
export class ApiClient {
  private baseUrl: string;
  private accessToken: string | null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.accessToken = localStorage.getItem('accessToken');
  }

  /**
   * Set the access token for authenticated requests
   */
  setAccessToken(token: string | null): void {
    this.accessToken = token;
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }

  /**
   * Get the current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Create request headers with optional authentication
   */
  private createHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, authenticated: boolean = true): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.createHeaders(authenticated),
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return await response.json() as ApiResponse<T>;
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any, authenticated: boolean = true): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.createHeaders(authenticated),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return await response.json() as ApiResponse<T>;
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data: any, authenticated: boolean = true): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.createHeaders(authenticated),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return await response.json() as ApiResponse<T>;
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, authenticated: boolean = true): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.createHeaders(authenticated),
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return await response.json() as ApiResponse<T>;
  }

  /**
   * Handle error responses
   */
  private async handleError(response: Response): Promise<Error> {
    try {
      const errorData = await response.json();
      return new Error(errorData.message || 'An error occurred');
    } catch (e) {
      return new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
  }
}
