import { ApiClient } from './api';
import { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest,
  ChangePasswordRequest
} from '../types/api';

/**
 * Service for authentication-related API endpoints
 */
export class AuthService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    return await this.apiClient.post<LoginResponse>('/auth/register', data, false);
  }

  /**
   * Login a user
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.apiClient.post<LoginResponse>('/auth/login', data, false);
    
    if (response.success && response.data.accessToken) {
      this.apiClient.setAccessToken(response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response;
  }

  /**
   * Refresh the access token
   */
  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await this.apiClient.post<{ accessToken: string }>(
      '/auth/refresh',
      { refreshToken },
      false
    );
    
    if (response.success && response.data.accessToken) {
      this.apiClient.setAccessToken(response.data.accessToken);
    }
    
    return response;
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<ApiResponse<null>> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    try {
      if (refreshToken) {
        await this.apiClient.post<null>('/auth/logout', { refreshToken });
      }
    } finally {
      // Clear tokens regardless of API response
      this.apiClient.setAccessToken(null);
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    
    return { success: true, message: 'Logged out successfully', data: null };
  }

  /**
   * Request a password reset link
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<null>> {
    return await this.apiClient.post<null>('/auth/forgot-password', data, false);
  }

  /**
   * Reset password using token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<null>> {
    return await this.apiClient.post<null>('/auth/reset-password', data, false);
  }

  /**
   * Change password (authenticated)
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
    return await this.apiClient.put<null>('/users/change-password', data);
  }
}
