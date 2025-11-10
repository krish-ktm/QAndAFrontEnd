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
  UserStats
} from '../types/api';

// Mock Users
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

/* Legacy hard-coded QnAs retained below for reference but excluded from build
[
  {
    id: '1',
    topicId: 't1',
    question: 'What is recursion and when should you use it?',
    answer: 'Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem. Use recursion when: 1) The problem can be broken into similar sub-problems, 2) You need to traverse tree or graph structures, 3) The solution has a natural recursive definition (like factorial or Fibonacci). Always ensure you have a base case to prevent infinite recursion.',
    exampleCode: 'function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }',
    level: 'INTERMEDIATE',
    companyTags: ['Amazon', 'Google', 'Microsoft'],
    createdAt: '2023-01-16T09:00:00.000Z',
    updatedAt: '2023-01-16T09:00:00.000Z'
  },
  {
    id: '2',
    topicId: 't2',
    question: 'Explain the difference between Stack and Queue data structures',
    answer: 'Stack follows LIFO (Last In First Out) principle - the last element added is the first to be removed. Common operations: push, pop, peek. Use cases: undo functionality, expression evaluation, backtracking. Queue follows FIFO (First In First Out) principle - the first element added is the first to be removed. Common operations: enqueue, dequeue, front. Use cases: task scheduling, breadth-first search, print queue management.',
    exampleCode: 'class Stack { constructor(){ this.data=[];} push(x){ this.data.push(x);} pop(){ return this.data.pop(); }}',
    level: 'BEGINNER',
    companyTags: ['Amazon', 'Meta'],
    createdAt: '2023-01-16T09:15:00.000Z',
    updatedAt: '2023-01-16T09:15:00.000Z'
  },
  {
    id: '3',
    topicId: 't1',
    question: 'What is Dynamic Programming and when should you apply it?',
    answer: 'Dynamic Programming (DP) is an optimization technique that solves complex problems by breaking them into overlapping sub-problems and storing their solutions to avoid redundant calculations. Apply DP when: 1) Problem has optimal substructure (optimal solution contains optimal solutions to sub-problems), 2) Problem has overlapping sub-problems, 3) You can define a recurrence relation. Common examples: Fibonacci, longest common subsequence, knapsack problem. Two approaches: top-down (memoization) and bottom-up (tabulation).',
    exampleCode: 'const fib = (n, memo={}) => n<=1 ? n : memo[n] ??= fib(n-1,memo)+fib(n-2,memo);',
    level: 'ADVANCED',
    companyTags: ['Google', 'Meta', 'Apple'],
    createdAt: '2023-01-16T09:30:00.000Z',
    updatedAt: '2023-01-16T09:30:00.000Z'
  },
  {
    id: '4',
    topicId: 't2',
    question: 'How does a Hash Table work and what is collision resolution?',
    answer: 'A Hash Table uses a hash function to map keys to array indices for O(1) average-case lookup, insertion, and deletion. The hash function converts the key into an integer index. Collision occurs when two keys hash to the same index. Resolution methods: 1) Chaining - store multiple elements at same index using linked lists, 2) Open Addressing - find another empty slot using probing (linear, quadratic, or double hashing). Load factor (n/m) affects performance; rehashing occurs when load factor exceeds threshold.',
    exampleCode: 'function hash(key,size){ let h=0; for(const c of key) h=(h*31+ c.charCodeAt(0))%size; return h; }',
    level: 'INTERMEDIATE',
    companyTags: ['Amazon', 'Google'],
    createdAt: '2023-01-16T09:45:00.000Z',
    updatedAt: '2023-01-16T09:45:00.000Z'
  },
  {
    id: '5',
    topicId: 't3',
    question: 'What is CAP theorem in distributed systems?',
    answer: 'CAP theorem states that a distributed system can only guarantee two of three properties: Consistency (all nodes see same data at same time), Availability (every request receives a response), Partition Tolerance (system continues despite network partitions). In practice, partition tolerance is mandatory, so you choose between CP (consistency + partition tolerance) like MongoDB, HBase or AP (availability + partition tolerance) like Cassandra, DynamoDB. Modern systems use eventual consistency as a middle ground.',
    exampleCode: 'N/A',
    level: 'ADVANCED',
    companyTags: ['Amazon', 'Google', 'Netflix'],
    createdAt: '2023-02-21T10:00:00.000Z',
    updatedAt: '2023-02-21T10:00:00.000Z'
  },
  {
    id: '6',
    topicId: 't3',
    question: 'Explain the differences between SQL and NoSQL databases',
    answer: 'SQL databases are relational, use structured schemas, support ACID transactions, scale vertically, and use SQL query language. Best for: complex queries, transactions, structured data. Examples: PostgreSQL, MySQL. NoSQL databases are non-relational, have flexible schemas, support BASE properties, scale horizontally. Types: Document (MongoDB), Key-Value (Redis), Column-family (Cassandra), Graph (Neo4j). Best for: large-scale data, rapid development, unstructured data. Choose based on data structure, scalability needs, and consistency requirements.',
    exampleCode: 'SELECT * FROM users WHERE id = 1; // vs. db.users.find({_id: 1})',
    level: 'INTERMEDIATE',
    companyTags: ['Meta', 'Twitter', 'Uber'],
    createdAt: '2023-02-21T10:15:00.000Z',
    updatedAt: '2023-02-21T10:15:00.000Z'
  },
];

*/

// Mock Quiz Groups
export const mockQuizGroups: QuizGroup[] = [
  {
    id: 'qg1',
    productId: '1',
    name: 'Algorithm Complexity',
    description: 'Test your knowledge of algorithm time and space complexity',
    order: 1,
    isActive: true,
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
