export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  progress: number;
  tags: string[];
}

export interface Topic {
  id: string;
  productId: string;
  name: string;
}

export interface QnA {
  id: string;
  productId: string;
  topicId: string;
  question: string;
  answer: string;
  company: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  bookmarked: boolean;
}

export interface Quiz {
  id: string;
  productId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface PDF {
  id: string;
  productId: string;
  title: string;
  url: string;
  bookmarked: boolean;
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

export interface MockUserWithCredentials extends User {
  password: string;
}

export const mockUsers: MockUserWithCredentials[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    password: 'admin123'
  },
  {
    id: '2',
    email: 'john@example.com',
    name: 'John Doe',
    password: 'password123'
  },
  {
    id: '3',
    email: 'guest@example.com',
    name: 'Guest User',
    password: 'guest123'
  }
];

export const mockUser: User = mockUsers[0];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Data Structures & Algorithms',
    description: 'Master the fundamentals of DSA with comprehensive Q&A, quizzes, and reference materials',
    progress: 65,
    tags: ['DSA', 'Interview Prep', 'Coding'],
  },
  {
    id: '2',
    name: 'System Design Fundamentals',
    description: 'Learn how to design scalable systems with real-world examples and case studies',
    progress: 40,
    tags: ['System Design', 'Architecture', 'Scalability'],
  },
  {
    id: '3',
    name: 'Behavioral Interview Mastery',
    description: 'Ace your behavioral interviews with curated questions and proven frameworks',
    progress: 80,
    tags: ['Behavioral', 'STAR Method', 'Leadership'],
  },
];

export const mockTopics: Topic[] = [
  { id: 't1', productId: '1', name: 'Recursion & Algorithms' },
  { id: 't2', productId: '1', name: 'Data Structures Fundamentals' },
  { id: 't3', productId: '2', name: 'Distributed Systems' },
];

export const mockQnA: QnA[] = [
  {
    id: '1',
    productId: '1',
    topicId: 't1',
    question: 'What is recursion and when should you use it?',
    answer: 'Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem. Use recursion when: 1) The problem can be broken into similar sub-problems, 2) You need to traverse tree or graph structures, 3) The solution has a natural recursive definition (like factorial or Fibonacci). Always ensure you have a base case to prevent infinite recursion.',
    company: ['Amazon', 'Google', 'Microsoft'],
    difficulty: 'intermediate',
    bookmarked: false,
  },
  {
    id: '2',
    productId: '1',
    topicId: 't2',
    question: 'Explain the difference between Stack and Queue data structures',
    answer: 'Stack follows LIFO (Last In First Out) principle - the last element added is the first to be removed. Common operations: push, pop, peek. Use cases: undo functionality, expression evaluation, backtracking. Queue follows FIFO (First In First Out) principle - the first element added is the first to be removed. Common operations: enqueue, dequeue, front. Use cases: task scheduling, breadth-first search, print queue management.',
    company: ['Amazon', 'Meta'],
    difficulty: 'beginner',
    bookmarked: true,
  },
  {
    id: '3',
    productId: '1',
    topicId: 't1',
    question: 'What is Dynamic Programming and when should you apply it?',
    answer: 'Dynamic Programming (DP) is an optimization technique that solves complex problems by breaking them into overlapping sub-problems and storing their solutions to avoid redundant calculations. Apply DP when: 1) Problem has optimal substructure (optimal solution contains optimal solutions to sub-problems), 2) Problem has overlapping sub-problems, 3) You can define a recurrence relation. Common examples: Fibonacci, longest common subsequence, knapsack problem. Two approaches: top-down (memoization) and bottom-up (tabulation).',
    company: ['Google', 'Meta', 'Apple'],
    difficulty: 'advanced',
    bookmarked: false,
  },
  {
    id: '4',
    productId: '1',
    topicId: 't2',
    question: 'How does a Hash Table work and what is collision resolution?',
    answer: 'A Hash Table uses a hash function to map keys to array indices for O(1) average-case lookup, insertion, and deletion. The hash function converts the key into an integer index. Collision occurs when two keys hash to the same index. Resolution methods: 1) Chaining - store multiple elements at same index using linked lists, 2) Open Addressing - find another empty slot using probing (linear, quadratic, or double hashing). Load factor (n/m) affects performance; rehashing occurs when load factor exceeds threshold.',
    company: ['Amazon', 'Google'],
    difficulty: 'intermediate',
    bookmarked: false,
  },
  {
    id: '5',
    productId: '2',
    topicId: 't3',
    question: 'What is CAP theorem in distributed systems?',
    answer: 'CAP theorem states that a distributed system can only guarantee two of three properties: Consistency (all nodes see same data at same time), Availability (every request receives a response), Partition Tolerance (system continues despite network partitions). In practice, partition tolerance is mandatory, so you choose between CP (consistency + partition tolerance) like MongoDB, HBase or AP (availability + partition tolerance) like Cassandra, DynamoDB. Modern systems use eventual consistency as a middle ground.',
    company: ['Amazon', 'Google', 'Netflix'],
    difficulty: 'advanced',
    bookmarked: true,
  },
  {
    id: '6',
    productId: '2',
    topicId: 't3',
    question: 'Explain the differences between SQL and NoSQL databases',
    answer: 'SQL databases are relational, use structured schemas, support ACID transactions, scale vertically, and use SQL query language. Best for: complex queries, transactions, structured data. Examples: PostgreSQL, MySQL. NoSQL databases are non-relational, have flexible schemas, support BASE properties, scale horizontally. Types: Document (MongoDB), Key-Value (Redis), Column-family (Cassandra), Graph (Neo4j). Best for: large-scale data, rapid development, unstructured data. Choose based on data structure, scalability needs, and consistency requirements.',
    company: ['Meta', 'Twitter', 'Uber'],
    difficulty: 'intermediate',
    bookmarked: false,
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    productId: '1',
    question: 'What is the time complexity of binary search on a sorted array?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correctAnswer: 1,
    explanation: 'Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.',
  },
  {
    id: '2',
    productId: '1',
    question: 'Which data structure is best for implementing a LRU cache?',
    options: ['Array', 'Hash Map + Doubly Linked List', 'Binary Tree', 'Stack'],
    correctAnswer: 1,
    explanation: 'A combination of Hash Map (for O(1) lookups) and Doubly Linked List (for O(1) removals and insertions) provides optimal LRU cache implementation.',
  },
  {
    id: '3',
    productId: '1',
    question: 'What is the worst-case time complexity of QuickSort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctAnswer: 2,
    explanation: 'QuickSort has O(n²) worst-case complexity when the pivot is always the smallest or largest element, though average case is O(n log n).',
  },
  {
    id: '4',
    productId: '2',
    question: 'Which design pattern is used for creating a single instance of a class?',
    options: ['Factory Pattern', 'Observer Pattern', 'Singleton Pattern', 'Strategy Pattern'],
    correctAnswer: 2,
    explanation: 'Singleton pattern ensures a class has only one instance and provides a global point of access to it.',
  },
  {
    id: '5',
    productId: '2',
    question: 'What is the primary purpose of a load balancer?',
    options: ['Data encryption', 'Distribute traffic across servers', 'Store user sessions', 'Cache static content'],
    correctAnswer: 1,
    explanation: 'Load balancers distribute incoming network traffic across multiple servers to ensure no single server is overwhelmed.',
  },
];

export const mockPDFs: PDF[] = [
  {
    id: '1',
    productId: '1',
    title: 'Big O Notation Cheat Sheet',
    url: 'https://www.bigocheatsheet.com/',
    bookmarked: false,
  },
  {
    id: '2',
    productId: '1',
    title: 'Common Data Structures Reference',
    url: '#',
    bookmarked: true,
  },
  {
    id: '3',
    productId: '1',
    title: 'Algorithm Design Patterns',
    url: '#',
    bookmarked: false,
  },
  {
    id: '4',
    productId: '2',
    title: 'System Design Interview Guide',
    url: '#',
    bookmarked: true,
  },
  {
    id: '5',
    productId: '2',
    title: 'Scalability Principles',
    url: '#',
    bookmarked: false,
  },
  {
    id: '6',
    productId: '3',
    title: 'STAR Method Framework',
    url: '#',
    bookmarked: false,
  },
];

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
