import { ApiClient } from './api';
import { 
  ApiResponse, 
  UserProfile, 
  Bookmark, 
  Progress, 
  QuizAttempt,
  UserStats,
  PaginatedResponse
} from '../types/api';

/**
 * Service for user-related API endpoints
 */
export class UserService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Get the current user's profile
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return await this.apiClient.get<UserProfile>('/users/profile');
  }

  /**
   * Update the current user's profile
   */
  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return await this.apiClient.put<UserProfile>('/users/profile', data);
  }

  /**
   * Get the current user's bookmarks
   */
  async getBookmarks(): Promise<ApiResponse<Bookmark[]>> {
    return await this.apiClient.get<Bookmark[]>('/users/bookmarks');
  }

  /**
   * Add a bookmark
   */
  async addBookmark(data: { qnaId?: string; pdfId?: string }): Promise<ApiResponse<Bookmark>> {
    return await this.apiClient.post<Bookmark>('/users/bookmarks', data);
  }

  /**
   * Remove a bookmark
   */
  async removeBookmark(bookmarkId: string): Promise<ApiResponse<null>> {
    return await this.apiClient.delete<null>(`/users/bookmarks/${bookmarkId}`);
  }

  /**
   * Get the current user's progress across topics
   */
  async getProgress(): Promise<ApiResponse<Progress[]>> {
    return await this.apiClient.get<Progress[]>('/users/progress');
  }

  /**
   * Update topic progress
   */
  async updateProgress(data: { topicId: string; completionPercent: number; score: number }): Promise<ApiResponse<Progress>> {
    return await this.apiClient.post<Progress>('/users/progress', data);
  }

  /**
   * Get paginated quiz attempts
   */
  async getQuizAttempts(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<QuizAttempt>>> {
    return await this.apiClient.get<PaginatedResponse<QuizAttempt>>(`/users/quiz-attempts?page=${page}&limit=${limit}`);
  }

  /**
   * Get attempts for a specific quiz
   */
  async getQuizAttemptsForQuiz(quizId: string): Promise<ApiResponse<QuizAttempt[]>> {
    return await this.apiClient.get<QuizAttempt[]>(`/users/quiz-attempts/${quizId}`);
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<ApiResponse<UserStats>> {
    return await this.apiClient.get<UserStats>('/users/stats');
  }
}
