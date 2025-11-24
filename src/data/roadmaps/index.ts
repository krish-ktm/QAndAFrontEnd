import { frontendMastery } from './frontend-mastery';
import { dpProblems } from './dp-problems';
import { reactMastery } from './react-mastery';
import { pythonBasics } from './python-basics';
import { featureShowcase } from './feature-showcase';
import { microservicesArchitecture } from './microservices-architecture';
import { systemDesignEcommerce } from './system-design-ecommerce';
import { csTheoryConcepts } from './cs-theory-concepts';
import { Roadmap } from '../../types/api';

export const roadmaps: Roadmap[] = [
    frontendMastery,
    dpProblems,
    reactMastery,
    pythonBasics,
    featureShowcase,
    microservicesArchitecture,
    systemDesignEcommerce,
    csTheoryConcepts
];

export const getRoadmapById = (id: string): Roadmap | undefined => {
    return roadmaps.find(r => r.id === id);
};

export const getRoadmapsByProductId = (productId: string): Roadmap[] => {
    return roadmaps.filter(r => r.productId === productId);
};
