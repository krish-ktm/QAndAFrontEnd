import { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  UserProfile,
  PaginatedResponse,
  Product,
  Topic,
  QnA,
  Quiz,
  PDF,
  Bookmark,
  Progress,
  QuizAttempt,
  UserStats,
  QuizSubmitRequest,
  QuizSubmitResponse
} from '../types/api';

import {
  mockUsers,
  mockProducts,
  mockTopics,
  mockQnAs,
  mockQuizzes,
  mockPDFs,
  mockBookmarks,
  mockProgress,
  mockQuizAttempts,
  mockUserStats
} from './mockData';

// Helper function to create API responses
function createResponse<T>(data: T, message: string = 'Success'): ApiResponse<T> {
  return {
    success: true,
    message,
    data
  };
}

// Helper function to create paginated responses
function createPaginatedResponse<T>(
  items: T[], 
  page: number = 1, 
  limit: number = 10
): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);
  
  return {
    items: paginatedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
}

// Helper function to simulate API delay
function delay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock Auth API
export const mockAuthApi = {
  register: async (data: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
    await delay();
    
    // Check if email already exists
    const existingUser = mockUsers.find(user => user.email.toLowerCase() === data.email.toLowerCase());
    if (existingUser) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const newUser = {
      id: `${mockUsers.length + 1}`,
      email: data.email,
      name: data.name,
      role: 'USER' as const,
      password: data.password
    };
    
    // In a real implementation, we would save this user to the database
    // mockUsers.push(newUser);
    
    return createResponse({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    }, 'Registration successful');
  },
  
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    await delay();
    
    const user = mockUsers.find(
      user => user.email.toLowerCase() === data.email.toLowerCase() && user.password === data.password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return createResponse({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    }, 'Login successful');
  },
  
  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> => {
    await delay();
    
    if (refreshToken !== 'mock-refresh-token') {
      throw new Error('Invalid refresh token');
    }
    
    return createResponse({
      accessToken: 'new-mock-access-token'
    }, 'Token refreshed');
  },
  
  logout: async (): Promise<ApiResponse<null>> => {
    await delay();
    return createResponse(null, 'Logged out successfully');
  },
  
  forgotPassword: async (data: { email: string }): Promise<ApiResponse<null>> => {
    await delay();
    
    const user = mockUsers.find(user => user.email.toLowerCase() === data.email.toLowerCase());
    if (!user) {
      throw new Error('Email not found');
    }
    
    return createResponse(null, 'Password reset link sent to your email');
  },
  
  resetPassword: async (data: { token: string, password: string }): Promise<ApiResponse<null>> => {
    await delay();
    
    if (data.token !== 'valid-reset-token') {
      throw new Error('Invalid or expired reset token');
    }
    
    return createResponse(null, 'Password reset successfully');
  }
};

// Mock User API
export const mockUserApi = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    await delay();
    
    // Assuming user with ID 2 is logged in
    const user = mockUsers.find(user => user.id === '2');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return createResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  },
  
  updateProfile: async (data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
    await delay();
    
    // Assuming user with ID 2 is logged in
    const user = mockUsers.find(user => user.id === '2');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update user data
    const updatedUser = {
      ...user,
      ...data
    };
    
    return createResponse({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    }, 'Profile updated successfully');
  },
  
  getBookmarks: async (): Promise<ApiResponse<Bookmark[]>> => {
    await delay();
    
    // Assuming user with ID 2 is logged in
    const userBookmarks = mockBookmarks.filter(bookmark => bookmark.userId === '2');
    
    return createResponse(userBookmarks);
  },
  
  addBookmark: async (data: { qnaId?: string; pdfId?: string }): Promise<ApiResponse<Bookmark>> => {
    await delay();
    
    // Check if bookmark already exists
    const existingBookmark = mockBookmarks.find(
      bookmark => 
        bookmark.userId === '2' && 
        ((data.qnaId && bookmark.qnaId === data.qnaId) || 
         (data.pdfId && bookmark.pdfId === data.pdfId))
    );
    
    if (existingBookmark) {
      return createResponse(existingBookmark, 'Bookmark already exists');
    }
    
    // Create new bookmark
    const newBookmark: Bookmark = {
      id: `b${mockBookmarks.length + 1}`,
      userId: '2',
      ...(data.qnaId && { qnaId: data.qnaId }),
      ...(data.pdfId && { pdfId: data.pdfId }),
      createdAt: new Date().toISOString()
    };
    
    return createResponse(newBookmark, 'Bookmark added successfully');
  },
  
  removeBookmark: async (bookmarkId: string): Promise<ApiResponse<null>> => {
    await delay();
    
    const bookmark = mockBookmarks.find(bookmark => bookmark.id === bookmarkId && bookmark.userId === '2');
    
    if (!bookmark) {
      throw new Error('Bookmark not found');
    }
    
    return createResponse(null, 'Bookmark removed successfully');
  },
  
  getProgress: async (): Promise<ApiResponse<Progress[]>> => {
    await delay();
    
    // Assuming user with ID 2 is logged in
    const userProgress = mockProgress.filter(progress => progress.userId === '2');
    
    return createResponse(userProgress);
  },
  
  updateProgress: async (data: { topicId: string; completionPercent: number; score: number }): Promise<ApiResponse<Progress>> => {
    await delay();
    
    // Check if progress already exists
    const existingProgress = mockProgress.find(
      progress => progress.userId === '2' && progress.topicId === data.topicId
    );
    
    if (existingProgress) {
      // Update existing progress
      const updatedProgress: Progress = {
        ...existingProgress,
        completionPercent: data.completionPercent,
        score: data.score,
        updatedAt: new Date().toISOString()
      };
      
      return createResponse(updatedProgress, 'Progress updated successfully');
    }
    
    // Create new progress
    const newProgress: Progress = {
      id: `p${mockProgress.length + 1}`,
      userId: '2',
      topicId: data.topicId,
      completionPercent: data.completionPercent,
      score: data.score,
      updatedAt: new Date().toISOString()
    };
    
    return createResponse(newProgress, 'Progress created successfully');
  },
  
  getQuizAttempts: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<QuizAttempt>>> => {
    await delay();
    
    // Assuming user with ID 2 is logged in
    const userAttempts = mockQuizAttempts.filter(attempt => attempt.userId === '2');
    
    return createResponse(createPaginatedResponse(userAttempts, page, limit));
  },
  
  getQuizAttemptsForQuiz: async (quizId: string): Promise<ApiResponse<QuizAttempt[]>> => {
    await delay();
    
    // Assuming user with ID 2 is logged in
    const quizAttempts = mockQuizAttempts.filter(
      attempt => attempt.userId === '2' && attempt.quizId === quizId
    );
    
    return createResponse(quizAttempts);
  },
  
  getStats: async (): Promise<ApiResponse<UserStats>> => {
    await delay();
    return createResponse(mockUserStats);
  }
};

// Mock Product API
export const mockProductApi = {
  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    await delay();
    return createResponse(mockProducts);
  },
  
  getTopics: async (productId: string): Promise<ApiResponse<Topic[]>> => {
    await delay();
    
    const productTopics = mockTopics.filter(topic => topic.productId === productId);
    
    return createResponse(productTopics);
  },
  
  getQnA: async (
    productId: string, 
    filters: { 
      topicId?: string; 
      level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
      company?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<QnA>>> => {
    await delay();
    
    // Get topics for this product
    const productTopicIds = mockTopics
      .filter(topic => topic.productId === productId)
      .map(topic => topic.id);
    
    // Filter QnAs
    let filteredQnAs = mockQnAs.filter(qna => productTopicIds.includes(qna.topicId));
    
    if (filters.topicId) {
      filteredQnAs = filteredQnAs.filter(qna => qna.topicId === filters.topicId);
    }
    
    if (filters.level) {
      filteredQnAs = filteredQnAs.filter(qna => qna.level === filters.level);
    }
    
    if (filters.company) {
      filteredQnAs = filteredQnAs.filter(qna => qna.companyTags.includes(filters.company as string));
    }
    
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    
    return createResponse(createPaginatedResponse(filteredQnAs, page, limit));
  },
  
  getQnADetail: async (productId: string, qnaId: string): Promise<ApiResponse<QnA>> => {
    await delay();
    
    const qna = mockQnAs.find(qna => qna.id === qnaId);
    
    if (!qna) {
      throw new Error('Q&A not found');
    }
    
    // Verify this QnA belongs to a topic in this product
    const topic = mockTopics.find(topic => topic.id === qna.topicId);
    
    if (!topic || topic.productId !== productId) {
      throw new Error('Q&A not found in this product');
    }
    
    return createResponse(qna);
  },
  
  getQuizzes: async (
    productId: string, 
    filters: { 
      topicId?: string; 
      level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
      company?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<Quiz>>> => {
    await delay();
    
    // Get topics for this product
    const productTopicIds = mockTopics
      .filter(topic => topic.productId === productId)
      .map(topic => topic.id);
    
    // Filter Quizzes
    let filteredQuizzes = mockQuizzes.filter(quiz => productTopicIds.includes(quiz.topicId));
    
    if (filters.topicId) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.topicId === filters.topicId);
    }
    
    if (filters.level) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.level === filters.level);
    }
    
    if (filters.company) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.companyTags.includes(filters.company as string));
    }
    
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    
    return createResponse(createPaginatedResponse(filteredQuizzes, page, limit));
  },
  
  getQuizDetail: async (productId: string, quizId: string): Promise<ApiResponse<Quiz>> => {
    await delay();
    
    const quiz = mockQuizzes.find(quiz => quiz.id === quizId);
    
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    
    // Verify this Quiz belongs to a topic in this product
    const topic = mockTopics.find(topic => topic.id === quiz.topicId);
    
    if (!topic || topic.productId !== productId) {
      throw new Error('Quiz not found in this product');
    }
    
    return createResponse(quiz);
  },
  
  submitQuizAnswer: async (
    productId: string, 
    quizId: string, 
    data: QuizSubmitRequest
  ): Promise<ApiResponse<QuizSubmitResponse>> => {
    await delay();
    
    const quiz = mockQuizzes.find(quiz => quiz.id === quizId);
    
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    
    // Verify this Quiz belongs to a topic in this product
    const topic = mockTopics.find(topic => topic.id === quiz.topicId);
    
    if (!topic || topic.productId !== productId) {
      throw new Error('Quiz not found in this product');
    }
    
    const isCorrect = data.selectedAnswer === quiz.correctAnswer;
    
    // Create a new attempt
    const attempt: QuizAttempt = {
      id: `qa${mockQuizAttempts.length + 1}`,
      userId: '2', // Assuming user with ID 2 is logged in
      quizId,
      selectedAnswer: data.selectedAnswer,
      isCorrect,
      timeTaken: data.timeTaken,
      createdAt: new Date().toISOString()
    };
    
    return createResponse({
      isCorrect,
      correctAnswer: quiz.correctAnswer,
      explanation: quiz.explanation,
      attempt
    }, isCorrect ? 'Correct answer!' : 'Incorrect answer');
  },
  
  getPDFs: async (productId: string): Promise<ApiResponse<PDF[]>> => {
    await delay();
    
    // Get topics for this product
    const productTopicIds = mockTopics
      .filter(topic => topic.productId === productId)
      .map(topic => topic.id);
    
    // Filter PDFs
    const productPDFs = mockPDFs.filter(pdf => productTopicIds.includes(pdf.topicId));
    
    return createResponse(productPDFs);
  },
  
  getPDFDetail: async (productId: string, pdfId: string): Promise<ApiResponse<PDF>> => {
    await delay();
    
    const pdf = mockPDFs.find(pdf => pdf.id === pdfId);
    
    if (!pdf) {
      throw new Error('PDF not found');
    }
    
    // Verify this PDF belongs to a topic in this product
    const topic = mockTopics.find(topic => topic.id === pdf.topicId);
    
    if (!topic || topic.productId !== productId) {
      throw new Error('PDF not found in this product');
    }
    
    return createResponse(pdf);
  }
};

// Mock Admin API
// This is a simplified version, you can expand it as needed
export const mockAdminApi = {
  getUsers: async (
    filters: { 
      search?: string;
      role?: 'USER' | 'ADMIN' | 'MASTER_ADMIN';
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<UserProfile>>> => {
    await delay();
    
    let filteredUsers = [...mockUsers];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        user => user.name.toLowerCase().includes(searchLower) || 
                user.email.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }
    
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    
    // Map to UserProfile (exclude password)
    const userProfiles = filteredUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }));
    
    return createResponse(createPaginatedResponse(userProfiles, page, limit));
  }
  
  // Add more admin API methods as needed
};
