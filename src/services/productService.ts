import { ApiClient } from './api';
import { 
  ApiResponse, 
  Product, 
  Topic, 
  QnA, 
  QuizGroup,
  Quiz,
  PDF,
  PaginatedResponse,
  QuizSubmitRequest,
  QuizSubmitResponse
} from '../types/api';

/**
 * Service for product and content-related API endpoints
 */
export class ProductService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Get products list visible to the user
   */
  async getProducts(): Promise<ApiResponse<Product[]>> {
    return await this.apiClient.get<Product[]>('/products');
  }
  
  /**
   * Get product detail
   */
  async getProductDetail(productId: string): Promise<ApiResponse<Product>> {
    return await this.apiClient.get<Product>(`/products/${productId}`);
  }

  /**
   * Get topics for a product
   */
  async getTopics(productId: string): Promise<ApiResponse<Topic[]>> {
    return await this.apiClient.get<Topic[]>(`/products/${productId}/topics`);
  }

  /**
   * Get Q&A list for a product (with optional filters)
   */
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
    const queryParams = new URLSearchParams();
    
    if (filters.topicId) queryParams.append('topicId', filters.topicId);
    if (filters.level) queryParams.append('level', filters.level);
    if (filters.company) queryParams.append('company', filters.company);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return await this.apiClient.get<PaginatedResponse<QnA>>(`/products/${productId}/qna${queryString}`);
  }

  /**
   * Get Q&A detail
   */
  async getQnADetail(productId: string, qnaId: string): Promise<ApiResponse<QnA>> {
    return await this.apiClient.get<QnA>(`/products/${productId}/qna/${qnaId}`);
  }

  /**
   * Get quiz groups for a product
   */
  async getQuizGroups(productId: string): Promise<ApiResponse<QuizGroup[]>> {
    return await this.apiClient.get<QuizGroup[]>(`/products/${productId}/quiz-groups`);
  }

  /**
   * Get quiz group detail
   */
  async getQuizGroupDetail(productId: string, quizGroupId: string): Promise<ApiResponse<QuizGroup>> {
    return await this.apiClient.get<QuizGroup>(`/products/${productId}/quiz-groups/${quizGroupId}`);
  }

  /**
   * Get quizzes for a product (with optional filters)
   */
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
    const queryParams = new URLSearchParams();
    
    if (filters.quizGroupId) queryParams.append('quizGroupId', filters.quizGroupId);
    if (filters.level) queryParams.append('level', filters.level);
    if (filters.company) queryParams.append('company', filters.company);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return await this.apiClient.get<PaginatedResponse<Quiz>>(`/products/${productId}/quizzes${queryString}`);
  }

  /**
   * Get quiz detail
   */
  async getQuizDetail(productId: string, quizId: string): Promise<ApiResponse<Quiz>> {
    return await this.apiClient.get<Quiz>(`/products/${productId}/quizzes/${quizId}`);
  }

  /**
   * Submit quiz answer
   */
  async submitQuizAnswer(
    productId: string, 
    quizId: string, 
    data: QuizSubmitRequest
  ): Promise<ApiResponse<QuizSubmitResponse>> {
    return await this.apiClient.post<QuizSubmitResponse>(
      `/products/${productId}/quizzes/${quizId}/submit`, 
      data
    );
  }
  
  /**
   * Get PDFs list for a product
   */
  async getPDFs(productId: string): Promise<ApiResponse<PDF[]>> {
    return await this.apiClient.get<PDF[]>(`/products/${productId}/pdfs`);
  }
  
  /**
   * Get PDF metadata
   */
  async getPDFDetail(productId: string, pdfId: string): Promise<ApiResponse<PDF>> {
    return await this.apiClient.get<PDF>(`/products/${productId}/pdfs/${pdfId}`);
  }
}
