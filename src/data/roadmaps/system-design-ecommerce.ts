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
            id: 'api-gateway',
            type: 'service',
            position: { x: 0, y: 100 },
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
            position: { x: 0, y: 250 },
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
            id: 'order-queue',
            type: 'queue',
            position: { x: 0, y: 400 },
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
            position: { x: -200, y: 550 },
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
            position: { x: 200, y: 550 },
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
            position: { x: -200, y: 700 },
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
            position: { x: 200, y: 700 },
            data: {
                label: 'Email Provider',
                status: 'unknown',
                techStack: ['SendGrid']
            }
        }
    ],
    edges: [
        { id: 'e1', source: 'client', target: 'api-gateway', type: 'smoothstep', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e2', source: 'api-gateway', target: 'order-service', type: 'smoothstep', animated: true, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e3', source: 'order-service', target: 'order-queue', type: 'smoothstep', animated: true, label: 'OrderPlaced', sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e4', source: 'order-queue', target: 'inventory-service', type: 'smoothstep', sourceHandle: 'left-source', targetHandle: 'top-target' },
        { id: 'e5', source: 'order-queue', target: 'notification-service', type: 'smoothstep', sourceHandle: 'right-source', targetHandle: 'top-target' },
        { id: 'e6', source: 'inventory-service', target: 'inventory-db', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, sourceHandle: 'bottom-source', targetHandle: 'top-target' },
        { id: 'e7', source: 'notification-service', target: 'email-provider', type: 'smoothstep', style: { strokeDasharray: '5,5' }, sourceHandle: 'bottom-source', targetHandle: 'top-target' }
    ]
};
