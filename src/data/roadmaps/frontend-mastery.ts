import { Roadmap } from '../../types/api';

export const frontendMastery: Roadmap = {
    id: 'frontend-mastery',
    productId: '1',
    title: 'Frontend Interview Masterclass',
    description: 'A complete guide to cracking frontend interviews, from HTML/CSS to Advanced React and System Design.',
    type: 'LEARNING_PATH',
    nodes: [
        {
            id: '1',
            type: 'start',
            position: { x: 250, y: 0 },
            data: {
                label: 'Start Here',
                content: '# Welcome to Frontend Mastery\n\nThis path will take you through everything you need to know to ace your frontend interviews.\n\n**Prerequisites:**\n- Basic JavaScript knowledge\n- A code editor (VS Code recommended)',
                style: { shape: 'rounded', backgroundColor: '#fef3c7', borderColor: '#d97706' }
            }
        },
        {
            id: 'note-start',
            type: 'note',
            position: { x: 50, y: 0 },
            data: {
                label: '💡 Tip: Consistency is key! Study 1 hour every day.',
                style: { backgroundColor: '#fef9c3', textColor: '#854d0e' }
            }
        },
        {
            id: '2',
            type: 'milestone',
            position: { x: 250, y: 150 },
            data: {
                label: 'HTML & CSS Fundamentals',
                content: '# HTML & CSS\n\nDon\'t overlook the basics! Interviewers love to ask about:\n\n- Semantic HTML\n- Box Model\n- Flexbox vs Grid\n- CSS Specificity\n\n**Recommended Practice:**\nBuild a responsive landing page.',
                style: { shape: 'rectangle', backgroundColor: '#e0f2fe', borderColor: '#0284c7' }
            }
        },
        {
            id: '3',
            type: 'milestone',
            position: { x: 250, y: 300 },
            data: {
                label: 'JavaScript Deep Dive',
                content: '# JavaScript Core\n\nMastering JS is non-negotiable.\n\n**Key Topics:**\n- Closures\n- Prototypal Inheritance\n- Event Loop\n- Promises & Async/Await\n- `this` keyword',
                style: { shape: 'rectangle', backgroundColor: '#fef9c3', borderColor: '#ca8a04' }
            }
        },
        {
            id: 'decision-framework',
            type: 'decision',
            position: { x: 250, y: 450 },
            data: {
                label: 'Choose a Framework',
                content: '# Framework Selection\n\nBoth React and Vue are excellent choices. React is more popular in the US, while Vue is strong in Asia and among PHP developers.',
                style: { shape: 'diamond', backgroundColor: '#f0f9ff', borderColor: '#0ea5e9', textColor: '#0369a1' }
            }
        },
        {
            id: 'react-path',
            type: 'milestone',
            position: { x: 400, y: 600 },
            data: {
                label: 'React Ecosystem',
                content: '# React Ecosystem\n\n- Redux/Zustand\n- React Router\n- Next.js',
                style: { shape: 'rectangle', backgroundColor: '#eff6ff', borderColor: '#3b82f6' }
            }
        },
        {
            id: 'vue-path',
            type: 'milestone',
            position: { x: 100, y: 600 },
            data: {
                label: 'Vue Ecosystem',
                content: '# Vue Ecosystem\n\n- Vuex/Pinia\n- Vue Router\n- Nuxt.js',
                style: { shape: 'rectangle', backgroundColor: '#ecfdf5', borderColor: '#10b981' }
            }
        },
        {
            id: '5',
            type: 'end',
            position: { x: 250, y: 750 },
            data: {
                label: 'System Design & Optimization',
                content: '# Frontend System Design\n\nLearn to design scalable applications.\n\n**Topics:**\n- Performance Optimization\n- Caching Strategies\n- Security\n- API Design',
                style: { shape: 'rounded', backgroundColor: '#dcfce7', borderColor: '#16a34a' }
            }
        }
    ],
    edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e-note-1', source: 'note-start', target: '1', style: { strokeDasharray: '5,5', stroke: '#fbbf24' } },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-decision', source: '3', target: 'decision-framework' },

        // Decision Branches
        {
            id: 'e-decision-react',
            source: 'decision-framework',
            target: 'react-path',
            sourceHandle: 'right',
            label: 'React (Popular)',
            style: { stroke: '#3b82f6' }
        },
        {
            id: 'e-decision-vue',
            source: 'decision-framework',
            target: 'vue-path',
            sourceHandle: 'left',
            label: 'Vue (Easy)',
            style: { stroke: '#10b981' }
        },

        // Reconverge
        { id: 'e-react-5', source: 'react-path', target: '5' },
        { id: 'e-vue-5', source: 'vue-path', target: '5' }
    ]
};
