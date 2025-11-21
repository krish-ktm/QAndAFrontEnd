import React from 'react';
import { Roadmap } from '../../types/api';
import { Map, GitBranch, ArrowRight } from 'lucide-react';

interface RoadmapCardProps {
    roadmap: Roadmap;
    onClick: (id: string) => void;
}

export const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap, onClick }) => {
    return (
        <div
            onClick={() => onClick(roadmap.id)}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                    {roadmap.type === 'DECISION_TREE' ? <GitBranch size={24} /> : <Map size={24} />}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${roadmap.type === 'DECISION_TREE'
                    ? 'bg-purple-50 text-purple-700 border border-purple-100'
                    : 'bg-green-50 text-green-700 border border-green-100'
                    }`}>
                    {roadmap.type === 'DECISION_TREE' ? 'Decision Tree' : 'Learning Path'}
                </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {roadmap.title}
            </h3>

            <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                {roadmap.description}
            </p>

            <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                Start Journey <ArrowRight size={16} className="ml-2" />
            </div>
        </div>
    );
};
