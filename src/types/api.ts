// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'MASTER_ADMIN';
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// User Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'MASTER_ADMIN';
}

export interface Bookmark {
  id: string;
  userId: string;
  qnaId?: string;
  pdfId?: string;
  createdAt: string;
}

export interface Progress {
  id: string;
  userId: string;
  topicId: string;
  completionPercent: number;
  score: number;
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
  createdAt: string;
}

export interface UserStats {
  totalQuizAttempts: number;
  correctAnswers: number;
  averageScore: number;
  completedTopics: number;
  totalBookmarks: number;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  productId: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface QnA {
  id: string;
  topicId: string;
  question: string;
  answer: string;
  exampleCode?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  companyTags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  companyTags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizSubmitRequest {
  selectedAnswer: string;
  timeTaken: number;
}

export interface QuizSubmitResponse {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  attempt: QuizAttempt;
}

export interface PDF {
  id: string;
  topicId: string;
  title: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

// Admin Types
export interface UserProductAccess {
  userId: string;
  productId: string;
}

export interface GrantProductAccessRequest {
  userId: string;
  productId: string;
}

export interface RevokeProductAccessRequest {
  userId: string;
  productId: string;
}

export interface ChangeUserRoleRequest {
  role: 'USER' | 'ADMIN' | 'MASTER_ADMIN';
}
