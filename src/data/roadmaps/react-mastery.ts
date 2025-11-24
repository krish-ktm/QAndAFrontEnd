import { Roadmap } from '../../types/api';

export const reactMastery: Roadmap = {
    id: 'react-mastery',
    title: 'React Mastery',
    description: 'A comprehensive guide to becoming a React expert, covering advanced patterns, performance, and ecosystem.',
    productId: '1', // Data Structures & Algorithms (using same product for visibility)
    type: 'LEARNING_PATH',
    nodes: [
        {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
                label: 'React Fundamentals',
                content: '# React Fundamentals\n\nBefore diving deep, ensure you have a solid grasp of:\n\n- JSX\n- Components & Props\n- State & Lifecycle\n- Handling Events'
            }
        },
        {
            id: '2',
            type: 'milestone',
            position: { x: 0, y: 0 },
            data: {
                label: 'Hooks Deep Dive',
                content: '# Hooks\n\nMaster the built-in hooks:\n\n- useState, useEffect\n- useContext, useReducer\n- useRef, useMemo, useCallback\n- **Custom Hooks**'
            }
        },
        {
            id: '3',
            type: 'milestone',
            position: { x: 0, y: 0 },
            data: {
                label: 'Advanced Patterns',
                content: '# Advanced Patterns\n\nLevel up your component design:\n\n- Compound Components\n- Render Props\n- Higher-Order Components (HOCs)\n- Controlled vs Uncontrolled'
            }
        },
        {
            id: '4',
            type: 'decision',
            position: { x: 0, y: 0 },
            data: {
                label: 'State Management?',
                content: '# State Management\n\nDo you need a global state library?\n\n- **Context API**: Simple, low frequency updates\n- **Redux/Zustand**: Complex state, high frequency\n- **React Query**: Server state'
            }
        },
        {
            id: '5',
            type: 'milestone',
            position: { x: 0, y: 0 },
            data: {
                label: 'Redux Toolkit',
                content: '# Redux Toolkit\n\nThe standard way to write Redux logic.\n\n- Slices\n- Thunks\n- RTK Query'
            }
        },
        {
            id: '6',
            type: 'milestone',
            position: { x: 0, y: 0 },
            data: {
                label: 'TanStack Query',
                content: '# TanStack Query\n\nPowerful asynchronous state management.\n\n- Caching\n- Background updates\n- Optimistic updates'
            }
        },
        {
            id: '7',
            type: 'milestone',
            position: { x: 0, y: 0 },
            data: {
                label: 'Performance',
                content: '# Performance Optimization\n\nKeep your app fast.\n\n- Code Splitting (React.lazy)\n- Memoization\n- Virtualization\n- Profiler API'
            }
        },
        {
            id: '8',
            type: 'end',
            position: { x: 0, y: 0 },
            data: {
                label: 'React Expert',
                content: '# Congratulations!\n\nYou have mastered the React ecosystem. Now build something amazing!'
            }
        }
    ],
    edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e2-3', source: '2', target: '3', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e3-4', source: '3', target: '4', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e4-5', source: '4', target: '5', animated: true, label: 'Complex State', sourceHandle: 'left-source', targetHandle: 'top-target' },
        { id: 'e4-6', source: '4', target: '6', animated: true, label: 'Server State', sourceHandle: 'right-source', targetHandle: 'top-target' },
        { id: 'e5-7', source: '5', target: '7', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e6-7', source: '6', target: '7', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e7-8', source: '7', target: '8', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' }
    ]
};
