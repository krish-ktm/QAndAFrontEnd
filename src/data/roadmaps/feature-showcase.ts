import { Roadmap } from '../../types/api';
import { MarkerType } from '@xyflow/react';

export const featureShowcase: Roadmap = {
    id: 'feature-showcase',
    productId: '1',
    title: 'Edge Features Showcase',
    description: 'Demonstrating different edge types, floating edges, and custom markers.',
    type: 'LEARNING_PATH',
    nodes: [
        {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
                label: 'Start',
                content: 'Start Node',
                style: { shape: 'rounded', backgroundColor: '#ffffff', borderColor: '#cbd5e1' }
            }
        },
        {
            id: '2',
            type: 'milestone',
            position: { x: 250, y: 0 },
            data: {
                label: 'Bezier Edge',
                content: 'Default Bezier Edge',
                style: { shape: 'rectangle', backgroundColor: '#ffffff', borderColor: '#cbd5e1' }
            }
        },
        {
            id: '3',
            type: 'milestone',
            position: { x: 500, y: 0 },
            data: {
                label: 'Straight Edge',
                content: 'Straight Edge',
                style: { shape: 'rectangle', backgroundColor: '#ffffff', borderColor: '#cbd5e1' }
            }
        },
        {
            id: '4',
            type: 'milestone',
            position: { x: 0, y: 150 },
            data: {
                label: 'Step Edge',
                content: 'Step Edge',
                style: { shape: 'rectangle', backgroundColor: '#ffffff', borderColor: '#cbd5e1' }
            }
        },
        {
            id: '5',
            type: 'milestone',
            position: { x: 250, y: 150 },
            data: {
                label: 'Smoothstep Edge',
                content: 'Smoothstep Edge',
                style: { shape: 'rectangle', backgroundColor: '#ffffff', borderColor: '#cbd5e1' }
            }
        },
        {
            id: '6',
            type: 'milestone',
            position: { x: 500, y: 150 },
            data: {
                label: 'Custom Marker',
                content: 'Edge with custom marker.',
                style: { shape: 'rectangle', backgroundColor: '#ffffff', borderColor: '#cbd5e1' }
            }
        },
        {
            id: '12',
            type: 'group',
            data: { label: 'Visual Group' },
            position: { x: 800, y: 0 },
            style: { width: 400, height: 300 },
        },
        {
            id: '13',
            type: 'code',
            data: {
                label: 'Example Code',
                language: 'typescript',
                code: `function hello() {\n  console.log("Hello World");\n}`
            },
            position: { x: 850, y: 50 },
            parentNode: '12',
            extent: 'parent',
        },
        {
            id: '9',
            type: 'decision',
            data: {
                label: 'Floating Edge Source',
                style: { shape: 'diamond', backgroundColor: '#ffffff', borderColor: '#cbd5e1' }
            },
            position: { x: 100, y: 500 },
        },
        {
            id: '10',
            type: 'info',
            data: {
                label: 'Rich Content Node',
                subLabel: 'A visually appealing multi-purpose node',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
                tags: [
                    { text: 'New', color: '#3b82f6' },
                    { text: 'Feature', color: '#10b981' }
                ],
                items: [
                    'Supports images',
                    'Custom tags',
                    'List items',
                    'External links'
                ],
                link: 'https://reactflow.dev',
                style: { borderColor: '#e2e8f0' }
            },
            position: { x: 600, y: 500 },
        },
        {
            id: '11',
            type: 'milestone',
            data: {
                label: 'Circle Floating Target',
                style: { shape: 'circle', backgroundColor: '#ffffff', borderColor: '#cbd5e1' }
            },
            position: { x: 300, y: 700 },
        },
        {
            id: '14',
            type: 'video',
            data: {
                label: 'React Flow Intro',
                videoUrl: 'https://www.youtube.com/watch?v=2V1EPkE6Jks',
                description: 'Learn the basics of React Flow in this short video.',
                style: { borderColor: '#cbd5e1' }
            },
            position: { x: 900, y: 500 },
        },
        {
            id: '15',
            type: 'checklist',
            data: {
                label: 'Implementation Steps',
                items: [
                    'Install React Flow',
                    'Create initial nodes',
                    'Add custom node types',
                    'Connect edges',
                    'Deploy application'
                ],
                style: { borderColor: '#cbd5e1' }
            },
            position: { x: 900, y: 900 },
        },
        {
            id: '16',
            type: 'quiz',
            data: {
                label: 'Knowledge Check',
                question: 'What is the primary purpose of React Flow?',
                options: [
                    'To manage database connections',
                    'To build node-based applications',
                    'To style CSS components',
                    'To optimize server performance'
                ],
                correctAnswer: 1,
                explanation: 'React Flow is a library for building node-based applications like workflows, diagrams, and roadmaps.',
                style: { borderColor: '#cbd5e1' }
            },
            position: { x: 1250, y: 500 },
        },
        {
            id: '17',
            type: 'resource',
            data: {
                label: 'Useful Resources',
                resources: [
                    { type: 'link', title: 'React Flow Documentation', url: 'https://reactflow.dev/docs' },
                    { type: 'github', title: 'React Flow GitHub', url: 'https://github.com/xyflow/xyflow' },
                    { type: 'video', title: 'React Flow Tutorial', url: 'https://www.youtube.com/watch?v=2V1EPkE6Jks' },
                    { type: 'pdf', title: 'Node Graph Concepts', url: '#' }
                ],
                style: { borderColor: '#cbd5e1' }
            },
            position: { x: 1250, y: 900 },
        },
    ],
    edges: [
        { id: 'e1-2', source: '1', target: '2', type: 'default', label: 'Bezier', animated: true, style: { stroke: '#94a3b8' } },
        { id: 'e1-3', source: '1', target: '3', type: 'step', label: 'Step', style: { stroke: '#94a3b8', strokeDasharray: '5,5' } },
        { id: 'e2-4', source: '2', target: '4', type: 'straight', label: 'Straight', style: { stroke: '#94a3b8' }, markerEnd: { type: MarkerType.ArrowClosed } },
        { id: 'e3-5', source: '3', target: '5', type: 'smoothstep', label: 'Smoothstep', style: { stroke: '#94a3b8' } },
        {
            id: 'e5-6',
            source: '5',
            target: '6',
            type: 'smoothstep',
            label: 'Custom Marker',
            style: { stroke: '#ec4899', strokeWidth: 2 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#ec4899',
                width: 20,
                height: 20,
            }
        },
        {
            id: 'e9-11',
            source: '9',
            target: '11',
            type: 'floating',
            label: 'Diamond to Circle',
            style: { stroke: '#3b82f6', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
        },
        {
            id: 'e6-10',
            source: '6',
            target: '10',
            type: 'smoothstep',
            style: { stroke: '#cbd5e1' }
        },
        {
            id: 'e10-13',
            source: '10',
            target: '13',
            type: 'smoothstep',
            style: { stroke: '#cbd5e1' }
        },
        {
            id: 'e10-14',
            source: '10',
            target: '14',
            type: 'smoothstep',
            style: { stroke: '#cbd5e1' },
            sourceHandle: 'right-source',
            targetHandle: 'left-target',
            label: 'Explicit Direction'
        },
        {
            id: 'e14-15',
            source: '14',
            target: '15',
            type: 'smoothstep',
            style: { stroke: '#cbd5e1' }
        },
        {
            id: 'e14-16',
            source: '14',
            target: '16',
            type: 'smoothstep',
            style: { stroke: '#cbd5e1' }
        },
        {
            id: 'e16-17',
            source: '16',
            target: '17',
            type: 'smoothstep',
            style: { stroke: '#cbd5e1' }
        }
    ]
};
