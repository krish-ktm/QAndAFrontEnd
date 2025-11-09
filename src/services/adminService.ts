import { ApiClient } from './api';
import { 
  ApiResponse, 
  AuthUser, 
  Product, 
  Topic, 
  QnA, 
  Quiz,
  PDF,
  PaginatedResponse,
  GrantProductAccessRequest,
  RevokeProductAccessRequest,
  ChangeUserRoleRequest
} from '../types/api';

/**
 * Service for admin-related API endpoints
 */
export class AdminService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // User Management

  /**
   * List users (paginated/filtered)
   */
  async getUsers(
    filters: { 
      search?: string;
      role?: 'USER' | 'ADMIN' | 'MASTER_ADMIN';
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<AuthUser>>> {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.role) queryParams.append('role', filters.role);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return await this.apiClient.get<PaginatedResponse<AuthUser>>(`/admin/users${queryString}`);
  }

  /**
   * Get user detail
   */
  async getUserDetail(userId: string): Promise<ApiResponse<AuthUser>> {
    return await this.apiClient.get<AuthUser>(`/admin/users/${userId}`);
  }

  /**
   * Change user role
   */
  async changeUserRole(userId: string, data: ChangeUserRoleRequest): Promise<ApiResponse<AuthUser>> {
    return await this.apiClient.put<AuthUser>(`/admin/users/${userId}/role`, data);
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<ApiResponse<null>> {
    return await this.apiClient.delete<null>(`/admin/users/${userId}`);
  }

  /**
   * Get products assigned to user
   */
  async getUserProducts(userId: string): Promise<ApiResponse<Product[]>> {
    return await this.apiClient.get<Product[]>(`/admin/users/${userId}/products`);
  }

  /**
   * Grant product access to user
   */
  async grantProductAccess(data: GrantProductAccessRequest): Promise<ApiResponse<null>> {
    return await this.apiClient.post<null>('/admin/users/grant-product-access', data);
  }

  /**
   * Revoke product access from user
   */
  async revokeProductAccess(data: RevokeProductAccessRequest): Promise<ApiResponse<null>> {
    return await this.apiClient.post<null>('/admin/users/revoke-product-access', data);
  }

  // Product CRUD (Master Admin)

  /**
   * List all products
   */
  async getAllProducts(): Promise<ApiResponse<Product[]>> {
    return await this.apiClient.get<Product[]>('/admin/products');
  }

  /**
   * Get product detail
   */
  async getProductDetail(productId: string): Promise<ApiResponse<Product>> {
    return await this.apiClient.get<Product>(`/admin/products/${productId}`);
  }

  /**
   * Create product
   */
  async createProduct(data: Partial<Product>): Promise<ApiResponse<Product>> {
    return await this.apiClient.post<Product>('/admin/products', data);
  }

  /**
   * Update product
   */
  async updateProduct(productId: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
    return await this.apiClient.put<Product>(`/admin/products/${productId}`, data);
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: string): Promise<ApiResponse<null>> {
    return await this.apiClient.delete<null>(`/admin/products/${productId}`);
  }

  // Topic CRUD (Admin+)

  /**
   * List topics (filterable)
   */
  async getAllTopics(
    filters: { 
      productId?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<Topic>>> {
    const queryParams = new URLSearchParams();
    
    if (filters.productId) queryParams.append('productId', filters.productId);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return await this.apiClient.get<PaginatedResponse<Topic>>(`/admin/topics${queryString}`);
  }

  /**
   * Get topic detail
   */
  async getTopicDetail(topicId: string): Promise<ApiResponse<Topic>> {
    return await this.apiClient.get<Topic>(`/admin/topics/${topicId}`);
  }

  /**
   * Create topic
   */
  async createTopic(data: Partial<Topic>): Promise<ApiResponse<Topic>> {
    return await this.apiClient.post<Topic>('/admin/topics', data);
  }

  /**
   * Update topic
   */
  async updateTopic(topicId: string, data: Partial<Topic>): Promise<ApiResponse<Topic>> {
    return await this.apiClient.put<Topic>(`/admin/topics/${topicId}`, data);
  }

  /**
   * Delete topic
   */
  async deleteTopic(topicId: string): Promise<ApiResponse<null>> {
    return await this.apiClient.delete<null>(`/admin/topics/${topicId}`);
  }

  // Q&A Admin routes

  /**
   * List all Q&As (filterable)
   */
  async getAllQnAs(
    filters: { 
      topicId?: string;
      level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<QnA>>> {
    const queryParams = new URLSearchParams();
    
    if (filters.topicId) queryParams.append('topicId', filters.topicId);
    if (filters.level) queryParams.append('level', filters.level);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return await this.apiClient.get<PaginatedResponse<QnA>>(`/admin/qna${queryString}`);
  }

  /**
   * Get Q&A detail
   */
  async getQnADetailAdmin(qnaId: string): Promise<ApiResponse<QnA>> {
    return await this.apiClient.get<QnA>(`/admin/qna/${qnaId}`);
  }

  /**
   * Create Q&A
   */
  async createQnA(data: Partial<QnA>): Promise<ApiResponse<QnA>> {
    return await this.apiClient.post<QnA>('/admin/qna', data);
  }

  /**
   * Update Q&A
   */
  async updateQnA(qnaId: string, data: Partial<QnA>): Promise<ApiResponse<QnA>> {
    return await this.apiClient.put<QnA>(`/admin/qna/${qnaId}`, data);
  }

  /**
   * Delete Q&A
   */
  async deleteQnA(qnaId: string): Promise<ApiResponse<null>> {
    return await this.apiClient.delete<null>(`/admin/qna/${qnaId}`);
  }

  // Quiz Admin routes

  /**
   * List all quizzes (filterable)
   */
  async getAllQuizzes(
    filters: { 
      topicId?: string;
      level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<Quiz>>> {
    const queryParams = new URLSearchParams();
    
    if (filters.topicId) queryParams.append('topicId', filters.topicId);
    if (filters.level) queryParams.append('level', filters.level);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return await this.apiClient.get<PaginatedResponse<Quiz>>(`/admin/quizzes${queryString}`);
  }

  /**
   * Get quiz detail
   */
  async getQuizDetailAdmin(quizId: string): Promise<ApiResponse<Quiz>> {
    return await this.apiClient.get<Quiz>(`/admin/quizzes/${quizId}`);
  }

  /**
   * Create quiz
   */
  async createQuiz(data: Partial<Quiz>): Promise<ApiResponse<Quiz>> {
    return await this.apiClient.post<Quiz>('/admin/quizzes', data);
  }

  /**
   * Update quiz
   */
  async updateQuiz(quizId: string, data: Partial<Quiz>): Promise<ApiResponse<Quiz>> {
    return await this.apiClient.put<Quiz>(`/admin/quizzes/${quizId}`, data);
  }

  /**
   * Delete quiz
   */
  async deleteQuiz(quizId: string): Promise<ApiResponse<null>> {
    return await this.apiClient.delete<null>(`/admin/quizzes/${quizId}`);
  }

  // PDF Admin routes

  /**
   * List all PDFs (filterable)
   */
  async getAllPDFs(
    filters: { 
      topicId?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<PDF>>> {
    const queryParams = new URLSearchParams();
    
    if (filters.topicId) queryParams.append('topicId', filters.topicId);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return await this.apiClient.get<PaginatedResponse<PDF>>(`/admin/pdfs${queryString}`);
  }

  /**
   * Get PDF detail
   */
  async getPDFDetailAdmin(pdfId: string): Promise<ApiResponse<PDF>> {
    return await this.apiClient.get<PDF>(`/admin/pdfs/${pdfId}`);
  }

  /**
   * Create PDF
   */
  async createPDF(data: Partial<PDF>): Promise<ApiResponse<PDF>> {
    return await this.apiClient.post<PDF>('/admin/pdfs', data);
  }

  /**
   * Update PDF
   */
  async updatePDF(pdfId: string, data: Partial<PDF>): Promise<ApiResponse<PDF>> {
    return await this.apiClient.put<PDF>(`/admin/pdfs/${pdfId}`, data);
  }

  /**
   * Delete PDF
   */
  async deletePDF(pdfId: string): Promise<ApiResponse<null>> {
    return await this.apiClient.delete<null>(`/admin/pdfs/${pdfId}`);
  }
}
