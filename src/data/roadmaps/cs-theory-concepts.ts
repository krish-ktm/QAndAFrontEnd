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
            data: { label: 'CS Concepts' }
        },

        // ==========================================
        // SECTION 1: DESIGN PATTERNS (Observer Pattern)
        // ==========================================
        {
            id: 'dp-group',
            type: 'group',
            position: { x: -600, y: 150 },
            style: { width: 550, height: 800 },
            data: { label: 'Design Patterns: Observer' }
        },
        // Subject Interface / Abstract Class
        {
            id: 'uml-subject',
            type: 'uml',
            position: { x: -580, y: 200 },
            parentNode: 'dp-group',
            extent: 'parent',
            data: {
                label: 'Subject',
                attributes: [
                    '- observers: Observer[]'
                ],
                methods: [
                    '+ attach(o: Observer)',
                    '+ detach(o: Observer)',
                    '+ notify()'
                ]
            }
        },
        // Observer Interface
        {
            id: 'uml-observer-interface',
            type: 'uml',
            position: { x: -280, y: 200 },
            parentNode: 'dp-group',
            extent: 'parent',
            data: {
                label: '<<interface>> Observer',
                attributes: [],
                methods: [
                    '+ update(data: any)'
                ]
            }
        },
        // Concrete Subject
        {
            id: 'uml-concrete-subject',
            type: 'uml',
            position: { x: -580, y: 500 },
            parentNode: 'dp-group',
            extent: 'parent',
            data: {
                label: 'ConcreteSubject',
                attributes: [
                    '- state: any'
                ],
                methods: [
                    '+ getState(): any',
                    '+ setState(state: any)'
                ]
            }
        },
        // Concrete Observer
        {
            id: 'uml-concrete-observer',
            type: 'uml',
            position: { x: -280, y: 500 },
            parentNode: 'dp-group',
            extent: 'parent',
            data: {
                label: 'ConcreteObserver',
                attributes: [
                    '- subject: ConcreteSubject'
                ],
                methods: [
                    '+ update()',
                    '// subject.getState()'
                ]
            }
        },

        // ==========================================
        // SECTION 2: CS THEORY (Recursion & Complexity)
        // ==========================================
        {
            id: 'theory-group',
            type: 'group',
            position: { x: 100, y: 150 },
            style: { width: 500, height: 800 },
            data: { label: 'Theory: Recursion & Complexity' }
        },
        // Recursive Function (UML representation)
        {
            id: 'uml-recursion',
            type: 'uml',
            position: { x: 130, y: 200 },
            parentNode: 'theory-group',
            extent: 'parent',
            data: {
                label: 'RecursiveFactorial',
                attributes: [],
                methods: [
                    '+ factorial(n: int): int',
                    '  if (n <= 1) return 1',
                    '  return n * factorial(n - 1)'
                ]
            }
        },
        // Complexity Analysis (Math)
        {
            id: 'math-recurrence',
            type: 'math',
            position: { x: 130, y: 450 },
            parentNode: 'theory-group',
            extent: 'parent',
            data: {
                label: 'Recurrence Relation',
                equation: 'T(n) = T(n-1) + O(1)'
            }
        },
        {
            id: 'math-solution',
            type: 'math',
            position: { x: 130, y: 600 },
            parentNode: 'theory-group',
            extent: 'parent',
            data: {
                label: 'Time Complexity',
                equation: 'T(n) = O(n)'
            }
        }
    ],
    edges: [
        // Root Connections
        { id: 'e-root-dp', source: 'root', target: 'dp-group', type: 'smoothstep', animated: true, label: 'Patterns' },
        { id: 'e-root-theory', source: 'root', target: 'theory-group', type: 'smoothstep', animated: true, label: 'Theory' },

        // --- Design Patterns Edges ---
        // Subject -> Observer (Association)
        { id: 'e-sub-obs', source: 'uml-subject', target: 'uml-observer-interface', type: 'floating', label: 'notifies', animated: true, sourceHandle: 'right-source', targetHandle: 'left-target' },
        // ConcreteSubject -> Subject (Inheritance)
        { id: 'e-csub-sub', source: 'uml-concrete-subject', target: 'uml-subject', type: 'floating', label: 'extends', style: { strokeDasharray: '5,5' }, sourceHandle: 'top-source', targetHandle: 'bottom-target' },
        // ConcreteObserver -> Observer (Implementation)
        { id: 'e-cobs-obs', source: 'uml-concrete-observer', target: 'uml-observer-interface', type: 'floating', label: 'implements', style: { strokeDasharray: '5,5' }, sourceHandle: 'top-source', targetHandle: 'bottom-target' },
        // ConcreteObserver -> ConcreteSubject (Association/Dependency)
        { id: 'e-cobs-csub', source: 'uml-concrete-observer', target: 'uml-concrete-subject', type: 'floating', label: 'observes', sourceHandle: 'left-source', targetHandle: 'right-target' },

        // --- CS Theory Edges ---
        // Self-Loop for Recursion
        {
            id: 'e-recursion-self',
            source: 'uml-recursion',
            target: 'uml-recursion',
            type: 'smoothstep',
            label: 'calls self',
            animated: true,
            style: { stroke: '#ef4444' } // Red color for emphasis
        },
        // Recursion -> Math
        { id: 'e-rec-math', source: 'uml-recursion', target: 'math-recurrence', type: 'smoothstep', label: 'analyzed by' },
        { id: 'e-math-sol', source: 'math-recurrence', target: 'math-solution', type: 'smoothstep', label: 'solves to' }
    ]
};
