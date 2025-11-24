import { Roadmap } from '../../types/api';

export const csTheoryConcepts: Roadmap = {
    id: 'cs-theory-concepts',
    productId: '1', // DSA Product
    title: 'CS Theory & Design Patterns',
    description: 'Explaining core Computer Science concepts like Design Patterns and Algorithm Analysis.',
    type: 'LEARNING_PATH',
    nodes: [
        {
            id: 'root',
            type: 'start',
            position: { x: 0, y: 0 },
            data: { label: 'CS Theory' }
        },

        // --- Design Patterns (UML) ---
        {
            id: 'pattern-group',
            type: 'group',
            position: { x: -350, y: 150 },
            style: { width: 350, height: 400 },
            data: { label: 'Singleton Pattern' }
        },
        {
            id: 'uml-singleton',
            type: 'uml',
            position: { x: -320, y: 200 },
            parentNode: 'pattern-group',
            extent: 'parent',
            data: {
                label: 'DatabaseConnection',
                attributes: [
                    '- static instance: DatabaseConnection',
                    '- connectionString: string'
                ],
                methods: [
                    '- constructor()',
                    '+ static getInstance(): DatabaseConnection',
                    '+ query(sql: string)'
                ]
            }
        },

        // --- Algorithm Analysis (Math) ---
        {
            id: 'math-group',
            type: 'group',
            position: { x: 50, y: 150 },
            style: { width: 350, height: 400 },
            data: { label: 'Algorithm Analysis' }
        },
        {
            id: 'math-big-o',
            type: 'math',
            position: { x: 80, y: 200 },
            parentNode: 'math-group',
            extent: 'parent',
            data: {
                label: 'Big O Definition',
                equation: 'f(n) = O(g(n)) \\iff \\exists c, n_0 : f(n) \\le c \\cdot g(n)'
            }
        },
        {
            id: 'math-master',
            type: 'math',
            position: { x: 80, y: 350 },
            parentNode: 'math-group',
            extent: 'parent',
            data: {
                label: 'Master Theorem',
                equation: 'T(n) = aT(n/b) + f(n)'
            }
        }
    ],
    edges: [
        { id: 'e1', source: 'root', target: 'pattern-group', type: 'smoothstep', animated: true },
        { id: 'e2', source: 'root', target: 'math-group', type: 'smoothstep', animated: true },
        { id: 'e3', source: 'math-big-o', target: 'math-master', type: 'smoothstep', label: 'Advanced' }
    ]
};
