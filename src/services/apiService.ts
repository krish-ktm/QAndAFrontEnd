import { ApiClient } from './api';
import { AuthService } from './authService';
import { UserService } from './userService';
import { ProductService } from './productService';
import { AdminService } from './adminService';

import {
  mockAuthApi,
  mockUserApi,
  mockProductApi
} from './mockApi';

import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ChangePasswordRequest,
  UserProfile,
  Bookmark,
  Progress,
  QuizAttempt,
  UserStats,
  PaginatedResponse,
  Product,
  Topic,
  QnA,
  QuizGroup,
  Quiz,
  PDF,
  Flashcard,
  QuizSubmitRequest,
  QuizSubmitResponse
} from '../types/api';

// Check if we should use mock API or real API
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

/**
 * API Service that combines real and mock implementations
 */
export class APIService {
  private apiClient: ApiClient;
  private authService: AuthService;
  private userService: UserService;
  private productService: ProductService;
  // Admin service will be used when implementing admin features
  private readonly adminService: AdminService;

  constructor() {
    this.apiClient = new ApiClient();
    this.authService = new AuthService(this.apiClient);
    this.userService = new UserService(this.apiClient);
    this.productService = new ProductService(this.apiClient);
    this.adminService = new AdminService(this.apiClient);
  }

  // Method to get the admin service when needed
  getAdminService(): AdminService {
    return this.adminService;
  }

  // Auth methods
  async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    if (USE_MOCK_API) {
      return mockAuthApi.register(data);
    }
    return this.authService.register(data);
  }

  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    if (USE_MOCK_API) {
      return mockAuthApi.login(data);
    }
    return this.authService.login(data);
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    if (USE_MOCK_API) {
      const refreshToken = localStorage.getItem('refreshToken') || 'mock-refresh-token';
      return mockAuthApi.refreshToken(refreshToken);
    }
    return this.authService.refreshToken();
  }

  async logout(): Promise<ApiResponse<null>> {
    if (USE_MOCK_API) {
      return mockAuthApi.logout();
    }
    return this.authService.logout();
  }

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    if (USE_MOCK_API) {
      return mockAuthApi.forgotPassword({ email });
    }
    return this.authService.forgotPassword({ email });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<null>> {
    if (USE_MOCK_API) {
      return mockAuthApi.resetPassword({ token, password });
    }
    return this.authService.resetPassword({ token, password });
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
    if (USE_MOCK_API) {
      // Mock implementation not provided for this, but could be added
      return { success: true, message: 'Password changed successfully', data: null };
    }
    return this.authService.changePassword(data);
  }

  // User methods
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    if (USE_MOCK_API) {
      return mockUserApi.getProfile();
    }
    return this.userService.getProfile();
  }

  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    if (USE_MOCK_API) {
      return mockUserApi.updateProfile(data);
    }
    return this.userService.updateProfile(data);
  }

  async getBookmarks(): Promise<ApiResponse<Bookmark[]>> {
    if (USE_MOCK_API) {
      return mockUserApi.getBookmarks();
    }
    return this.userService.getBookmarks();
  }

  async addBookmark(data: { qnaId?: string; pdfId?: string }): Promise<ApiResponse<Bookmark>> {
    if (USE_MOCK_API) {
      return mockUserApi.addBookmark(data);
    }
    return this.userService.addBookmark(data);
  }

  async removeBookmark(bookmarkId: string): Promise<ApiResponse<null>> {
    if (USE_MOCK_API) {
      return mockUserApi.removeBookmark(bookmarkId);
    }
    return this.userService.removeBookmark(bookmarkId);
  }

  async getProgress(): Promise<ApiResponse<Progress[]>> {
    if (USE_MOCK_API) {
      return mockUserApi.getProgress();
    }
    return this.userService.getProgress();
  }

  async updateProgress(data: { topicId: string; completionPercent: number; score: number }): Promise<ApiResponse<Progress>> {
    if (USE_MOCK_API) {
      return mockUserApi.updateProgress(data);
    }
    return this.userService.updateProgress(data);
  }

  async getQuizAttempts(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<QuizAttempt>>> {
    if (USE_MOCK_API) {
      return mockUserApi.getQuizAttempts(page, limit);
    }
    return this.userService.getQuizAttempts(page, limit);
  }

  async getQuizAttemptsForQuiz(quizId: string): Promise<ApiResponse<QuizAttempt[]>> {
    if (USE_MOCK_API) {
      return mockUserApi.getQuizAttemptsForQuiz(quizId);
    }
    return this.userService.getQuizAttemptsForQuiz(quizId);
  }

  async getStats(): Promise<ApiResponse<UserStats>> {
    if (USE_MOCK_API) {
      return mockUserApi.getStats();
    }
    return this.userService.getStats();
  }

  // Product methods
  async getProducts(): Promise<ApiResponse<Product[]>> {
    if (USE_MOCK_API) {
      return mockProductApi.getProducts();
    }
    return this.productService.getProducts();
  }

  async getProductDetail(productId: string): Promise<ApiResponse<Product>> {
    if (USE_MOCK_API) {
      const response = await mockProductApi.getProducts();
      if (response.success) {
        const product = response.data.find(p => p.id === productId);
        if (product) {
          return { success: true, message: 'Product found', data: product };
        }
        return { success: false, message: 'Product not found', data: {} as Product };
      }
      return response as unknown as ApiResponse<Product>;
    }
    return this.productService.getProductDetail(productId);
  }

  async getTopics(productId: string): Promise<ApiResponse<Topic[]>> {
    if (USE_MOCK_API) {
      return mockProductApi.getTopics(productId);
    }
    return this.productService.getTopics(productId);
  }

  async getQnA(
    productId: string,
    filters: {
      topicId?: string;
      level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
      company?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<QnA>>> {
    if (USE_MOCK_API) {
      return mockProductApi.getQnA(productId, filters);
    }
    return this.productService.getQnA(productId, filters);
  }

  async getQnADetail(productId: string, qnaId: string): Promise<ApiResponse<QnA>> {
    if (USE_MOCK_API) {
      return mockProductApi.getQnADetail(productId, qnaId);
    }
    return this.productService.getQnADetail(productId, qnaId);
  }

  async getQuizGroups(productId: string): Promise<ApiResponse<QuizGroup[]>> {
    if (USE_MOCK_API) {
      return mockProductApi.getQuizGroups(productId);
    }
    return this.productService.getQuizGroups(productId);
  }

  async getQuizGroupDetail(productId: string, quizGroupId: string): Promise<ApiResponse<QuizGroup>> {
    if (USE_MOCK_API) {
      return mockProductApi.getQuizGroupDetail(productId, quizGroupId);
    }
    return this.productService.getQuizGroupDetail(productId, quizGroupId);
  }

  async getQuizzes(
    productId: string,
    filters: {
      quizGroupId?: string;
      level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
      company?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<Quiz>>> {
    if (USE_MOCK_API) {
      return mockProductApi.getQuizzes(productId, filters);
    }
    return this.productService.getQuizzes(productId, filters);
  }

  async getQuizDetail(productId: string, quizId: string): Promise<ApiResponse<Quiz>> {
    if (USE_MOCK_API) {
      return mockProductApi.getQuizDetail(productId, quizId);
    }
    return this.productService.getQuizDetail(productId, quizId);
  }

  async submitQuizAnswer(
    productId: string,
    quizId: string,
    data: QuizSubmitRequest
  ): Promise<ApiResponse<QuizSubmitResponse>> {
    if (USE_MOCK_API) {
      return mockProductApi.submitQuizAnswer(productId, quizId, data);
    }
    return this.productService.submitQuizAnswer(productId, quizId, data);
  }

  async getPDFs(productId: string): Promise<ApiResponse<PDF[]>> {
    if (USE_MOCK_API) {
      return mockProductApi.getPDFs(productId);
    }
    return this.productService.getPDFs(productId);
  }

  async getPDFDetail(productId: string, pdfId: string): Promise<ApiResponse<PDF>> {
    if (USE_MOCK_API) {
      return mockProductApi.getPDFDetail(productId, pdfId);
    }
    return this.productService.getPDFDetail(productId, pdfId);
  }

  async getFlashcards(productId: string): Promise<ApiResponse<Flashcard[]>> {
    if (USE_MOCK_API) {
      return mockProductApi.getFlashcards(productId);
    }
    return this.productService.getFlashcards(productId);
  }

  async updateFlashcardProgress(productId: string, flashcardId: string, mastered: boolean): Promise<ApiResponse<Flashcard>> {
    if (USE_MOCK_API) {
      return mockProductApi.updateFlashcardProgress(productId, flashcardId, mastered);
    }
    return this.productService.updateFlashcardProgress(productId, flashcardId, mastered);
  }

  // Admin methods can be added as needed
}

// Create and export a singleton instance
export const apiService = new APIService();
