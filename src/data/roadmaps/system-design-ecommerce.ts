import { Roadmap } from '../../types/api';
import { MarkerType } from '@xyflow/react';

export const systemDesignEcommerce: Roadmap = {
    id: 'system-design-ecommerce',
    productId: '2', // System Design Product
    title: 'E-commerce Order System',
    description: 'A real-world system design for handling high-scale e-commerce orders using microservices.',
    type: 'LEARNING_PATH',
    nodes: [
        {
            id: 'client',
            type: 'start',
            position: { x: 0, y: 0 },
            data: { label: 'Web/Mobile Client' }
        },
        {
            id: 'cdn',
            type: 'cdn',
            position: { x: 0, y: 80 },
            data: {
                label: 'Global CDN',
                regions: ['US', 'EU', 'APAC'],
                latency: 25
            }
        },
        {
            id: 'lb',
            type: 'loadBalancer',
            position: { x: 0, y: 180 },
            data: {
                label: 'API Gateway LB',
                algorithm: 'Round Robin',
                connections: 1250
            }
        },
        {
            id: 'api-gateway',
            type: 'service',
            position: { x: 0, y: 280 },
            data: {
                label: 'API Gateway',
                status: 'healthy',
                language: 'Go',
                endpoints: ['POST /checkout', 'GET /orders'],
                techStack: ['Kong', 'RateLimiter']
            }
        },
        {
            id: 'order-service',
            type: 'service',
            position: { x: 0, y: 450 },
            data: {
                label: 'Order Service',
                status: 'healthy',
                language: 'Java',
                version: 'v2.4.0',
                endpoints: ['Internal gRPC'],
                techStack: ['Spring Boot']
            }
        },
        {
            id: 'order-cache',
            type: 'cache',
            position: { x: 250, y: 450 },
            data: {
                label: 'Order Cache',
                hitRate: 85,
                memoryUsage: '2.4GB',
                evictionPolicy: 'LRU'
            }
        },
        {
            id: 'order-queue',
            type: 'queue',
            position: { x: 0, y: 600 },
            data: {
                label: 'Order Events',
                queueType: 'Kafka',
                messageCount: 450,
                consumers: 3
            }
        },
        {
            id: 'inventory-service',
            type: 'service',
            position: { x: -200, y: 750 },
            data: {
                label: 'Inventory Service',
                status: 'healthy',
                language: 'Node.js',
                techStack: ['Express']
            }
        },
        {
            id: 'notification-service',
            type: 'service',
            position: { x: 200, y: 750 },
            data: {
                label: 'Notification Service',
                status: 'healthy',
                language: 'Python',
                techStack: ['FastAPI']
            }
        },
        {
            id: 'inventory-db',
            type: 'database',
            position: { x: -200, y: 900 },
            data: {
                label: 'Inventory DB',
                dbType: 'PostgreSQL',
                connectionStatus: 'active',
                shards: 4
            }
        },
        {
            id: 'email-provider',
            type: 'service',
            position: { x: 200, y: 900 },
            data: {
                label: 'Email Provider',
                status: 'unknown',
                techStack: ['SendGrid']
            }
        },
        {
            id: 'assets-storage',
            type: 'storage',
            position: { x: -300, y: 80 },
            data: {
                label: 'Static Assets',
                storageClass: 'Standard',
                bucketName: 'ecom-assets'
            }
        }
    ],
    edges: [
        { id: 'e1', source: 'client', target: 'cdn', type: 'smoothstep', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e1-assets', source: 'cdn', target: 'assets-storage', type: 'smoothstep', style: { strokeDasharray: '5,5' }, sourceHandle: 'left-source', targetHandle: 'right-target' },
        { id: 'e2', source: 'cdn', target: 'lb', type: 'smoothstep', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e3', source: 'lb', target: 'api-gateway', type: 'smoothstep', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e4', source: 'api-gateway', target: 'order-service', type: 'smoothstep', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e4-cache', source: 'order-service', target: 'order-cache', type: 'smoothstep', label: 'Read/Write', sourceHandle: 'right-source', targetHandle: 'left-target' },
        { id: 'e5', source: 'order-service', target: 'order-queue', type: 'smoothstep', animated: true, label: 'OrderPlaced', sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e6', source: 'order-queue', target: 'inventory-service', type: 'smoothstep', sourceHandle: 'left-source', targetHandle: 'top-target' },
        { id: 'e7', source: 'order-queue', target: 'notification-service', type: 'smoothstep', sourceHandle: 'right-source', targetHandle: 'top-target' },
        { id: 'e8', source: 'inventory-service', target: 'inventory-db', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e9', source: 'notification-service', target: 'email-provider', type: 'smoothstep', style: { strokeDasharray: '5,5' }, sourceHandle: 'bottom-source', targetHandle: 'top-target' }
    ]
};
