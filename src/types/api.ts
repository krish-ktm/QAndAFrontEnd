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

export interface QuizGroup {
  id: string;
  productId: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedDuration?: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  quizGroupId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedTime?: number; // in minutes
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

export interface Flashcard {
  id: string;
  productId: string;
  topicId: string;
  front: string;
  back: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
  mastered: boolean;
  lastReviewed?: string;
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

// Refresh and Reset Token Types
export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
}

// Roadmap Types
export interface Roadmap {
  id: string;
  productId: string;
  title: string;
  description: string;
  type: 'LEARNING_PATH' | 'DECISION_TREE';
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

export interface RoadmapNode {
  id: string;
  type: 'start' | 'end' | 'milestone' | 'decision' | 'note' | 'group' | 'info' | 'code' | 'video' | 'checklist' | 'quiz' | 'resource' | 'service' | 'database' | 'queue' | 'uml' | 'math';
  position: { x: number; y: number };
  parentNode?: string;
  extent?: 'parent';
  style?: React.CSSProperties;
  data: {
    label: string;
    content?: string; // Markdown supported detailed info
    subLabel?: string;
    image?: string;
    tags?: { text: string; color?: string }[];
    items?: string[];
    link?: string;
    language?: string;
    code?: string;
    videoUrl?: string;
    description?: string;
    question?: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
    resources?: { type: 'pdf' | 'link' | 'github' | 'video' | 'download'; title: string; url: string }[];
    // System Design Props
    endpoints?: string[];
    status?: 'healthy' | 'degraded' | 'down' | 'unknown';
    version?: string;
    techStack?: string[];
    dbType?: string;
    connectionStatus?: 'active' | 'inactive';
    shards?: number;
    queueType?: string;
    messageCount?: number;
    consumers?: number;
    // General CS Props
    attributes?: string[];
    methods?: string[];
    equation?: string;

    clickAction?: 'open-drawer' | 'none'; // Control click behavior
    style?: {
      shape?: 'rectangle' | 'rounded' | 'circle' | 'diamond';
      backgroundColor?: string;
      textColor?: string;
      borderColor?: string;
    };
  };
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: React.CSSProperties;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  markerEnd?: any;
  markerStart?: any;
}
