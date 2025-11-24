import { Roadmap } from '../../types/api';
import { MarkerType } from '@xyflow/react';

export const microservicesArchitecture: Roadmap = {
    id: 'microservices-architecture',
    productId: '1',
    title: 'Microservices Architecture Pattern',
    description: 'A comprehensive guide to designing scalable microservices, featuring API Gateways, Event Buses, and Polyglot Persistence.',
    type: 'DECISION_TREE',
    nodes: [
        // Clients
        {
            id: 'client-web',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
                label: 'Web Client',
                content: 'React/Next.js Application',
                style: { shape: 'rounded', backgroundColor: '#e0f2fe', borderColor: '#0ea5e9' }
            }
        },
        {
            id: 'client-mobile',
            type: 'start',
            position: { x: 300, y: 0 },
            data: {
                label: 'Mobile App',
                content: 'iOS & Android (Flutter/React Native)',
                style: { shape: 'rounded', backgroundColor: '#e0f2fe', borderColor: '#0ea5e9' }
            }
        },

        // API Gateway
        {
            id: 'api-gateway',
            type: 'decision',
            position: { x: 150, y: 150 },
            data: {
                label: 'API Gateway',
                content: '# API Gateway\n\nEntry point for all clients.\n\n- Routing\n- Authentication\n- Rate Limiting',
                style: { shape: 'diamond', backgroundColor: '#f0f9ff', borderColor: '#0284c7' }
            }
        },

        // Services
        {
            id: 'auth-service',
            type: 'milestone',
            position: { x: -150, y: 300 },
            data: {
                label: 'Auth Service',
                content: 'Handles User Identity & Access Management (IAM).',
                style: { shape: 'rectangle', backgroundColor: '#fff7ed', borderColor: '#ea580c' }
            }
        },
        {
            id: 'order-service',
            type: 'milestone',
            position: { x: 150, y: 300 },
            data: {
                label: 'Order Service',
                content: 'Manages order processing and fulfillment.',
                style: { shape: 'rectangle', backgroundColor: '#f0fdf4', borderColor: '#16a34a' }
            }
        },
        {
            id: 'payment-service',
            type: 'milestone',
            position: { x: 450, y: 300 },
            data: {
                label: 'Payment Service',
                content: 'Processes payments via Stripe/PayPal.',
                style: { shape: 'rectangle', backgroundColor: '#f0fdf4', borderColor: '#16a34a' }
            }
        },

        // Databases
        {
            id: 'auth-db',
            type: 'milestone',
            position: { x: -150, y: 450 },
            data: {
                label: 'PostgreSQL (Users)',
                content: 'Relational DB for user data.',
                style: { shape: 'circle', backgroundColor: '#f1f5f9', borderColor: '#64748b' }
            }
        },
        {
            id: 'order-db',
            type: 'milestone',
            position: { x: 150, y: 450 },
            data: {
                label: 'MongoDB (Orders)',
                content: 'NoSQL DB for flexible order documents.',
                style: { shape: 'circle', backgroundColor: '#f1f5f9', borderColor: '#64748b' }
            }
        },

        // Event Bus
        {
            id: 'event-bus',
            type: 'decision',
            position: { x: 150, y: 600 },
            data: {
                label: 'Event Bus (Kafka)',
                content: 'Asynchronous messaging for decoupling services.',
                style: { shape: 'rounded', backgroundColor: '#faf5ff', borderColor: '#9333ea' }
            }
        },

        // External Services
        {
            id: 'email-service',
            type: 'milestone',
            position: { x: 450, y: 600 },
            data: {
                label: 'Notification Service',
                content: 'Sends emails/SMS on events.',
                style: { shape: 'rectangle', backgroundColor: '#fff1f2', borderColor: '#e11d48' }
            }
        },

        // Note
        {
            id: 'note-1',
            type: 'note',
            position: { x: -300, y: 150 },
            data: {
                label: '💡 Tip: Use floating edges for loose coupling!',
                style: { backgroundColor: '#fef9c3', textColor: '#854d0e' }
            }
        }
    ],
    edges: [
        // Client to Gateway (Floating for visual appeal)
        {
            id: 'e-web-gateway',
            source: 'client-web',
            target: 'api-gateway',
            type: 'floating',
            label: 'HTTPS',
            style: { stroke: '#64748b', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }
        },
        {
            id: 'e-mobile-gateway',
            source: 'client-mobile',
            target: 'api-gateway',
            type: 'floating',
            label: 'HTTPS',
            style: { stroke: '#64748b', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }
        },

        // Gateway to Services (Smoothstep - standard flow)
        {
            id: 'e-gateway-auth',
            source: 'api-gateway',
            target: 'auth-service',
            type: 'smoothstep',
            label: 'Auth',
            style: { stroke: '#0ea5e9', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#0ea5e9' },
            sourceHandle: 'left-source',
            targetHandle: 'top-target'
        },
        {
            id: 'e-gateway-order',
            source: 'api-gateway',
            target: 'order-service',
            type: 'smoothstep',
            label: 'Proxy',
            style: { stroke: '#0ea5e9', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#0ea5e9' },
            sourceHandle: 'bottom-source',
            targetHandle: 'top-target'
        },
        {
            id: 'e-gateway-payment',
            source: 'api-gateway',
            target: 'payment-service',
            type: 'smoothstep',
            label: 'Proxy',
            style: { stroke: '#0ea5e9', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#0ea5e9' },
            sourceHandle: 'right-source',
            targetHandle: 'top-target'
        },

        // Services to DB (Step - rigid connection)
        {
            id: 'e-auth-db',
            source: 'auth-service',
            target: 'auth-db',
            type: 'step',
            style: { stroke: '#ea580c', strokeWidth: 2, strokeDasharray: '5,5' },
            markerEnd: { type: MarkerType.Arrow, color: '#ea580c' },
            sourceHandle: 'bottom-source',
            targetHandle: 'top-target'
        },
        {
            id: 'e-order-db',
            source: 'order-service',
            target: 'order-db',
            type: 'step',
            style: { stroke: '#16a34a', strokeWidth: 2, strokeDasharray: '5,5' },
            markerEnd: { type: MarkerType.Arrow, color: '#16a34a' },
            sourceHandle: 'bottom-source',
            targetHandle: 'top-target'
        },

        // Inter-service via Event Bus (Straight - direct logic)
        {
            id: 'e-order-bus',
            source: 'order-service',
            target: 'event-bus',
            type: 'straight',
            label: 'OrderCreated',
            style: { stroke: '#9333ea', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#9333ea' },
            sourceHandle: 'bottom-source',
            targetHandle: 'top-target'
        },
        {
            id: 'e-bus-email',
            source: 'event-bus',
            target: 'email-service',
            type: 'straight',
            label: 'Consume',
            style: { stroke: '#9333ea', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#9333ea' },
            sourceHandle: 'right-source',
            targetHandle: 'left-target'
        },

        // Note connection
        {
            id: 'e-note-gateway',
            source: 'note-1',
            target: 'api-gateway',
            type: 'floating',
            style: { stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '3,3' }
        }
    ]
};
