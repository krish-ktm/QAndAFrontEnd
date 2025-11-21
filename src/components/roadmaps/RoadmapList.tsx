import React, { useMemo } from 'react';
import { getRoadmapsByProductId } from '../../data/roadmaps';
import { RoadmapCard } from './RoadmapCard';
import { Compass } from 'lucide-react';

interface RoadmapListProps {
    productId: string;
    onSelectRoadmap: (roadmapId: string) => void;
}

export const RoadmapList: React.FC<RoadmapListProps> = ({ productId, onSelectRoadmap }) => {
    const roadmaps = useMemo(() => getRoadmapsByProductId(productId), [productId]);

    if (roadmaps.length === 0) {
        return (
            <div className="p-6 text-center">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto">
                    <Compass className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Roadmaps Found</h3>
                    <p className="text-gray-500">There are no learning paths available for this product yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                    <Compass className="mr-3 text-blue-600" size={28} />
                    Study Roadmaps
                </h1>
                <p className="text-gray-500 text-base">
                    Choose a path to master a new skill or solve a complex problem.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roadmaps.map((roadmap) => (
                    <RoadmapCard
                        key={roadmap.id}
                        roadmap={roadmap}
                        onClick={onSelectRoadmap}
                    />
                ))}
            </div>
        </div>
    );
};
