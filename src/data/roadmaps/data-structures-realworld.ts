import { Roadmap } from '../../types/api';
import { MarkerType } from '@xyflow/react';

export const dataStructuresRealWorld: Roadmap = {
    id: 'data-structures-realworld',
    productId: '1', // DSA Product
    title: 'Data Structures in Real World',
    description: 'Visualizing how data structures are used in real applications like Browser History and File Systems.',
    type: 'LEARNING_PATH',
    nodes: [
        {
            id: 'root',
            type: 'start',
            position: { x: 0, y: 0 },
            data: { label: 'Real World DSA' }
        },

        // --- Browser History (Linked List) ---
        {
            id: 'browser-group',
            type: 'group',
            position: { x: -400, y: 150 },
            style: { width: 800, height: 350 },
            data: { label: 'Browser History (Doubly Linked List)' }
        },
        {
            id: 'page-1',
            type: 'linkedList',
            position: { x: -350, y: 250 },
            parentNode: 'browser-group',
            extent: 'parent',
            data: { value: 'google.com', label: 'Home' }
        },
        {
            id: 'page-2',
            type: 'linkedList',
            position: { x: -150, y: 250 },
            parentNode: 'browser-group',
            extent: 'parent',
            data: { value: 'github.com', label: 'Search' }
        },
        {
            id: 'page-3',
            type: 'linkedList',
            position: { x: 50, y: 250 },
            parentNode: 'browser-group',
            extent: 'parent',
            data: { value: 'repo/code', label: 'Current' }
        },
        {
            id: 'page-4',
            type: 'linkedList',
            position: { x: 250, y: 250 },
            parentNode: 'browser-group',
            extent: 'parent',
            data: { isNull: true, label: 'Forward' }
        },

        // --- File System (Tree) ---
        {
            id: 'fs-group',
            type: 'group',
            position: { x: 450, y: 150 },
            style: { width: 500, height: 600 },
            data: { label: 'File System Hierarchy (Tree)' }
        },
        {
            id: 'fs-root',
            type: 'tree',
            position: { x: 220, y: 80 },
            parentNode: 'fs-group',
            extent: 'parent',
            data: { value: '/', variant: 'root', label: 'Root' }
        },
        {
            id: 'fs-users',
            type: 'tree',
            position: { x: 100, y: 200 },
            parentNode: 'fs-group',
            extent: 'parent',
            data: { value: 'Users', label: 'Dir' }
        },
        {
            id: 'fs-bin',
            type: 'tree',
            position: { x: 340, y: 200 },
            parentNode: 'fs-group',
            extent: 'parent',
            data: { value: 'bin', label: 'Dir' }
        },
        {
            id: 'fs-jdoe',
            type: 'tree',
            position: { x: 100, y: 320 },
            parentNode: 'fs-group',
            extent: 'parent',
            data: { value: 'jdoe', label: 'User Home' }
        },
        {
            id: 'fs-docs',
            type: 'tree',
            position: { x: 40, y: 440 },
            parentNode: 'fs-group',
            extent: 'parent',
            data: { value: 'docs', variant: 'leaf', label: 'Folder' }
        },
        {
            id: 'fs-pics',
            type: 'tree',
            position: { x: 160, y: 440 },
            parentNode: 'fs-group',
            extent: 'parent',
            data: { value: 'pics', variant: 'leaf', label: 'Folder' }
        }
    ],
    edges: [
        { id: 'e1', source: 'root', target: 'browser-group', type: 'smoothstep' },
        { id: 'e2', source: 'root', target: 'fs-group', type: 'smoothstep' },

        // Browser History Edges (Doubly Linked)
        // Increased spacing and using straight edges for cleaner look
        { id: 'bh-1', source: 'page-1', target: 'page-2', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
        { id: 'bh-2', source: 'page-2', target: 'page-1', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeDasharray: '5,5' } },
        { id: 'bh-3', source: 'page-2', target: 'page-3', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
        { id: 'bh-4', source: 'page-3', target: 'page-2', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeDasharray: '5,5' } },
        { id: 'bh-5', source: 'page-3', target: 'page-4', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },

        // File System Edges
        // Using straight edges for tree structure to avoid "snaking"
        { id: 'fs-1', source: 'fs-root', sourceHandle: 'left', target: 'fs-users', type: 'straight' },
        { id: 'fs-2', source: 'fs-root', sourceHandle: 'right', target: 'fs-bin', type: 'straight' },
        { id: 'fs-3', source: 'fs-users', sourceHandle: 'left', target: 'fs-jdoe', type: 'straight' }, // Connecting to center for now as single child
        { id: 'fs-4', source: 'fs-jdoe', sourceHandle: 'left', target: 'fs-docs', type: 'straight' },
        { id: 'fs-5', source: 'fs-jdoe', sourceHandle: 'right', target: 'fs-pics', type: 'straight' }
    ]
};
