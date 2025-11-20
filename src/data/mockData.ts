import {
  AuthUser,
  Product,
  Topic,
  QnA,
  QuizGroup,
  Quiz,
  PDF,
  Bookmark,
  Progress,
  QuizAttempt,
  UserStats,
  Flashcard
} from '../types/api';

// Mock Users
export const mockUsers: (AuthUser & { password: string })[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN',
    password: 'admin123'
  },
  {
    id: '2',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'USER',
    password: 'password123'
  },
  {
    id: '3',
    email: 'guest@example.com',
    name: 'Guest User',
    role: 'USER',
    password: 'guest123'
  }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Data Structures & Algorithms',
    slug: 'data-structures-algorithms',
    description: 'Master the fundamentals of DSA with comprehensive Q&A, quizzes, and reference materials',
    isActive: true,
    createdAt: '2023-01-15T10:30:00.000Z',
    updatedAt: '2023-01-15T10:30:00.000Z'
  },
  {
    id: '2',
    name: 'System Design Fundamentals',
    slug: 'system-design-fundamentals',
    description: 'Learn how to design scalable systems with real-world examples and case studies',
    isActive: true,
    createdAt: '2023-02-20T14:45:00.000Z',
    updatedAt: '2023-02-20T14:45:00.000Z'
  },
  {
    id: '3',
    name: 'Behavioral Interview Mastery',
    slug: 'behavioral-interview-mastery',
    description: 'Ace your behavioral interviews with curated questions and proven frameworks',
    isActive: true,
    createdAt: '2023-03-10T09:15:00.000Z',
    updatedAt: '2023-03-10T09:15:00.000Z'
  },
];

// Mock Topics
export const mockTopics: Topic[] = [
  {
    id: 't1',
    productId: '1',
    name: 'Recursion & Algorithms',
    order: 1,
    createdAt: '2023-01-15T11:00:00.000Z',
    updatedAt: '2023-01-15T11:00:00.000Z'
  },
  {
    id: 't2',
    productId: '1',
    name: 'Data Structures Fundamentals',
    order: 2,
    createdAt: '2023-01-15T11:05:00.000Z',
    updatedAt: '2023-01-15T11:05:00.000Z'
  },
  {
    id: 't3',
    productId: '2',
    name: 'Distributed Systems',
    order: 1,
    createdAt: '2023-02-20T15:00:00.000Z',
    updatedAt: '2023-02-20T15:00:00.000Z'
  },
];

// Mock Q&A
export const mockQnAs: QnA[] = (() => {
  const topics = ['t1', 't2', 't3'];
  const companies = ['Amazon', 'Google', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Uber', 'Twitter'];
  const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
  const now = new Date().toISOString();

  const items: QnA[] = [];
  topics.forEach(topicId => {
    for (let i = 1; i <= 100; i++) {
      const level = levels[i % levels.length];
      items.push({
        id: `${topicId}-${i}`,
        topicId,
        question: `Sample question ${i} for topic ${topicId}`,
        answer: `Sample answer ${i} for topic ${topicId}.`,
        ...(i % 5 === 0 ? {} : { exampleCode: `// Example code snippet ${i}` }),
        level,
        companyTags: [companies[i % companies.length]],
        createdAt: now,
        updatedAt: now,
      });
    }
  });
  return items;
})();

// Mock Quiz Groups
export const mockQuizGroups: QuizGroup[] = [
  {
    id: 'qg1',
    productId: '1',
    name: 'Algorithm Complexity',
    description: 'Test your knowledge of algorithm time and space complexity',
    order: 1,
    isActive: true,
    level: 'INTERMEDIATE',
    estimatedDuration: 15,
    createdAt: '2023-01-17T10:00:00.000Z',
    updatedAt: '2023-01-17T10:00:00.000Z'
  },
  {
    id: 'qg2',
    productId: '1',
    name: 'Data Structures',
    description: 'Questions about common data structures and their implementations',
    order: 2,
    isActive: true,
    level: 'INTERMEDIATE',
    estimatedDuration: 20,
    createdAt: '2023-01-17T10:15:00.000Z',
    updatedAt: '2023-01-17T10:15:00.000Z'
  },
  {
    id: 'qg3',
    productId: '2',
    name: 'System Design Patterns',
    description: 'Common design patterns used in system architecture',
    order: 1,
    isActive: true,
    level: 'BEGINNER',
    estimatedDuration: 25,
    createdAt: '2023-02-22T12:00:00.000Z',
    updatedAt: '2023-02-22T12:00:00.000Z'
  },
];

// Mock Quizzes
export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    quizGroupId: 'qg1',
    question: 'What is the time complexity of binary search on a sorted array?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correctAnswer: 'B',
    explanation: 'Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.',
    level: 'BEGINNER',
    estimatedTime: 2,
    companyTags: ['Google', 'Microsoft'],
    createdAt: '2023-01-17T11:00:00.000Z',
    updatedAt: '2023-01-17T11:00:00.000Z'
  },
  {
    id: '2',
    quizGroupId: 'qg2',
    question: 'Which data structure is best for implementing a LRU cache?',
    options: ['Array', 'Hash Map + Doubly Linked List', 'Binary Tree', 'Stack'],
    correctAnswer: 'B',
    explanation: 'A combination of Hash Map (for O(1) lookups) and Doubly Linked List (for O(1) removals and insertions) provides optimal LRU cache implementation.',
    level: 'INTERMEDIATE',
    estimatedTime: 3,
    companyTags: ['Amazon', 'Meta'],
    createdAt: '2023-01-17T11:15:00.000Z',
    updatedAt: '2023-01-17T11:15:00.000Z'
  },
  {
    id: '3',
    quizGroupId: 'qg1',
    question: 'What is the worst-case time complexity of QuickSort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctAnswer: 'C',
    explanation: 'QuickSort has O(n²) worst-case complexity when the pivot is always the smallest or largest element, though average case is O(n log n).',
    level: 'INTERMEDIATE',
    estimatedTime: 3,
    companyTags: ['Google', 'Microsoft', 'Amazon'],
    createdAt: '2023-01-17T11:30:00.000Z',
    updatedAt: '2023-01-17T11:30:00.000Z'
  },
  {
    id: '4',
    quizGroupId: 'qg3',
    question: 'Which design pattern is used for creating a single instance of a class?',
    options: ['Factory Pattern', 'Observer Pattern', 'Singleton Pattern', 'Strategy Pattern'],
    correctAnswer: 'C',
    explanation: 'Singleton pattern ensures a class has only one instance and provides a global point of access to it.',
    level: 'BEGINNER',
    estimatedTime: 2,
    companyTags: ['Amazon', 'Microsoft'],
    createdAt: '2023-02-22T13:00:00.000Z',
    updatedAt: '2023-02-22T13:00:00.000Z'
  },
  {
    id: '5',
    quizGroupId: 'qg3',
    question: 'What is the primary purpose of a load balancer?',
    options: ['Data encryption', 'Distribute traffic across servers', 'Store user sessions', 'Cache static content'],
    correctAnswer: 'B',
    explanation: 'Load balancers distribute incoming network traffic across multiple servers to ensure no single server is overwhelmed.',
    level: 'BEGINNER',
    estimatedTime: 2,
    companyTags: ['Amazon', 'Google', 'Netflix'],
    createdAt: '2023-02-22T13:15:00.000Z',
    updatedAt: '2023-02-22T13:15:00.000Z'
  },
];

// Mock PDFs
export const mockPDFs: PDF[] = [
  {
    id: '1',
    topicId: 't1',
    title: 'Big O Notation Cheat Sheet',
    fileUrl: 'https://www.bigocheatsheet.com/',
    fileSize: 1024000,
    createdAt: '2023-01-18T14:00:00.000Z',
    updatedAt: '2023-01-18T14:00:00.000Z'
  },
  {
    id: '2',
    topicId: 't2',
    title: 'Common Data Structures Reference',
    fileUrl: 'https://example.com/data-structures.pdf',
    fileSize: 2048000,
    createdAt: '2023-01-18T14:15:00.000Z',
    updatedAt: '2023-01-18T14:15:00.000Z'
  },
  {
    id: '3',
    topicId: 't1',
    title: 'Algorithm Design Patterns',
    fileUrl: 'https://example.com/algorithm-patterns.pdf',
    fileSize: 3072000,
    createdAt: '2023-01-18T14:30:00.000Z',
    updatedAt: '2023-01-18T14:30:00.000Z'
  },
  {
    id: '4',
    topicId: 't3',
    title: 'System Design Interview Guide',
    fileUrl: 'https://example.com/system-design-guide.pdf',
    fileSize: 4096000,
    createdAt: '2023-02-23T15:00:00.000Z',
    updatedAt: '2023-02-23T15:00:00.000Z'
  },
  {
    id: '5',
    topicId: 't3',
    title: 'Scalability Principles',
    fileUrl: 'https://example.com/scalability.pdf',
    fileSize: 1536000,
    createdAt: '2023-02-23T15:15:00.000Z',
    updatedAt: '2023-02-23T15:15:00.000Z'
  },
];

// Mock Bookmarks
export const mockBookmarks: Bookmark[] = [
  {
    id: 'b1',
    userId: '2',
    qnaId: '2',
    createdAt: '2023-03-15T10:00:00.000Z'
  },
  {
    id: 'b2',
    userId: '2',
    qnaId: '5',
    createdAt: '2023-03-16T11:30:00.000Z'
  },
  {
    id: 'b3',
    userId: '2',
    pdfId: '2',
    createdAt: '2023-03-17T14:45:00.000Z'
  },
  {
    id: 'b4',
    userId: '2',
    pdfId: '4',
    createdAt: '2023-03-18T09:20:00.000Z'
  }
];

// Mock Progress
export const mockProgress: Progress[] = [
  {
    id: 'p1',
    userId: '2',
    topicId: 't1',
    completionPercent: 75,
    score: 80,
    updatedAt: '2023-03-20T16:30:00.000Z'
  },
  {
    id: 'p2',
    userId: '2',
    topicId: 't2',
    completionPercent: 50,
    score: 65,
    updatedAt: '2023-03-21T14:15:00.000Z'
  },
  {
    id: 'p3',
    userId: '2',
    topicId: 't3',
    completionPercent: 30,
    score: 70,
    updatedAt: '2023-03-22T11:45:00.000Z'
  }
];

// Mock Quiz Attempts
export const mockQuizAttempts: QuizAttempt[] = [
  {
    id: 'qa1',
    userId: '2',
    quizId: '1',
    selectedAnswer: 'B',
    isCorrect: true,
    timeTaken: 25,
    createdAt: '2023-03-25T10:15:00.000Z'
  },
  {
    id: 'qa2',
    userId: '2',
    quizId: '2',
    selectedAnswer: 'B',
    isCorrect: true,
    timeTaken: 40,
    createdAt: '2023-03-25T10:30:00.000Z'
  },
  {
    id: 'qa3',
    userId: '2',
    quizId: '3',
    selectedAnswer: 'B',
    isCorrect: false,
    timeTaken: 35,
    createdAt: '2023-03-25T10:45:00.000Z'
  },
  {
    id: 'qa4',
    userId: '2',
    quizId: '4',
    selectedAnswer: 'C',
    isCorrect: true,
    timeTaken: 20,
    createdAt: '2023-03-26T11:00:00.000Z'
  }
];

// Mock User Stats
export const mockUserStats: UserStats = {
  totalQuizAttempts: 4,
  correctAnswers: 3,
  averageScore: 75,
  completedTopics: 1,
  totalBookmarks: 4
};

// Mock Flashcards
export const mockFlashcards: Flashcard[] = [
  {
    id: 'fc1',
    productId: '1',
    topicId: 't1',
    front: 'What is the time complexity of binary search?',
    back: 'O(log n) - Binary search divides the search space in half with each comparison.',
    difficulty: 'BEGINNER',
    category: 'Algorithms',
    mastered: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fc2',
    productId: '1',
    topicId: 't1',
    front: 'Explain the concept of memoization',
    back: 'Memoization is an optimization technique where you store the results of expensive function calls and return the cached result when the same inputs occur again.',
    difficulty: 'INTERMEDIATE',
    category: 'Dynamic Programming',
    mastered: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fc3',
    productId: '1',
    topicId: 't2',
    front: 'What is the difference between a stack and a queue?',
    back: 'Stack follows LIFO (Last In First Out) principle, while Queue follows FIFO (First In First Out) principle.',
    difficulty: 'BEGINNER',
    category: 'Data Structures',
    mastered: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fc4',
    productId: '1',
    topicId: 't2',
    front: 'How does a hash table handle collisions?',
    back: 'Common collision resolution techniques include: 1) Chaining (linked lists), 2) Open addressing (linear/quadratic probing), 3) Double hashing.',
    difficulty: 'INTERMEDIATE',
    category: 'Data Structures',
    mastered: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fc5',
    productId: '2',
    topicId: 't3',
    front: 'What is the CAP theorem?',
    back: 'CAP theorem states that a distributed system can only guarantee two out of three properties: Consistency, Availability, and Partition Tolerance.',
    difficulty: 'ADVANCED',
    category: 'Distributed Systems',
    mastered: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fc6',
    productId: '2',
    topicId: 't3',
    front: 'What is horizontal scaling?',
    back: 'Horizontal scaling means adding more machines to your pool of resources to handle increased load, also known as scaling out.',
    difficulty: 'INTERMEDIATE',
    category: 'System Design',
    mastered: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fc7',
    productId: '1',
    topicId: 't1',
    front: 'What is the difference between DFS and BFS?',
    back: 'DFS (Depth First Search) explores as far as possible along each branch before backtracking. BFS (Breadth First Search) explores all neighbors at the present depth before moving to the next level.',
    difficulty: 'INTERMEDIATE',
    category: 'Graph Algorithms',
    mastered: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fc8',
    productId: '1',
    topicId: 't2',
    front: 'What is a balanced binary tree?',
    back: 'A balanced binary tree is a binary tree where the height of the left and right subtrees of any node differ by at most one, ensuring O(log n) operations.',
    difficulty: 'INTERMEDIATE',
    category: 'Data Structures',
    mastered: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
