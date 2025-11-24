import { Roadmap } from '../../types/api';

export const pythonBasics: Roadmap = {
    id: 'python-basics',
    title: 'Python Basics',
    description: 'Start your programming journey with Python. Simple, readable, and powerful.',
    productId: '1', // Data Structures & Algorithms
    type: 'LEARNING_PATH',
    nodes: [
        {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
                label: 'Install Python',
                content: '# Setup\n\nDownload and install Python from python.org.\n\nVerify installation:\n`python --version`'
            }
        },
        {
            id: '2',
            type: 'milestone',
            position: { x: 0, y: 0 },
            data: {
                label: 'Variables & Types',
                content: '# Variables\n\nPython is dynamically typed.\n\n- Integers, Floats\n- Strings\n- Booleans\n- None'
            }
        },
        {
            id: '3',
            type: 'milestone',
            position: { x: 0, y: 0 },
            data: {
                label: 'Control Flow',
                content: '# Control Flow\n\nMake decisions in your code.\n\n- if/elif/else\n- for loops\n- while loops'
            }
        },
        {
            id: '4',
            type: 'milestone',
            position: { x: 0, y: 0 },
            data: {
                label: 'Functions',
                content: '# Functions\n\nReusable blocks of code.\n\n- `def` keyword\n- Arguments & Return values\n- Lambda functions'
            }
        },
        {
            id: '5',
            type: 'end',
            position: { x: 0, y: 0 },
            data: {
                label: 'Build a Script',
                content: '# Practice\n\nBuild a simple calculator or a to-do list CLI app to practice what you learned.'
            }
        }
    ],
    edges: [
        { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right-source', targetHandle: 'left-target' },
        { id: 'e2-3', source: '2', target: '3', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e3-4', source: '3', target: '4', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e4-5', source: '4', target: '5', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' }
    ]
};
