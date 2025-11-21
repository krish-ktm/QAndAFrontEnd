import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Node } from '@xyflow/react';
import { getRoadmapById } from '../../data/roadmaps';
import { RoadmapTreeView } from './RoadmapTreeView';
import { RoadmapDrawer } from './RoadmapDrawer';

interface RoadmapViewProps {
    roadmapId?: string;
    onBack?: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmapId, onBack }) => {
    const params = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const id = roadmapId || params.id;
    const roadmap = useMemo(() => getRoadmapById(id || ''), [id]);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/roadmaps');
        }
    };

    if (!roadmap) {
        return (
            <div className="p-8 text-center text-white">
                <h2 className="text-2xl">Roadmap not found</h2>
                <button onClick={handleBack} className="mt-4 text-blue-400 hover:underline">
                    Go back
                </button>
            </div>
        );
    }

    const handleNodeClick = (node: Node) => {
        const nodeData = node.data as any;
        const type = node.type;

        // Determine action based on type and explicit configuration
        let shouldOpenDrawer = true;

        // Default behaviors by type
        if (['video', 'checklist', 'quiz', 'resource', 'group'].includes(type || '')) {
            shouldOpenDrawer = false;
        }

        // Explicit override
        if (nodeData.clickAction === 'open-drawer') {
            shouldOpenDrawer = true;
        } else if (nodeData.clickAction === 'none') {
            shouldOpenDrawer = false;
        }

        if (shouldOpenDrawer) {
            setSelectedNode(node);
            setIsDrawerOpen(true);
        }
    };

    return (
        <div className="h-full flex flex-col relative overflow-hidden bg-gray-50">
            {/* Header */}
            <div className="px-4 py-2 border-b border-gray-200 bg-white flex items-center justify-between h-14">
                <div className="flex items-center">
                    <button
                        onClick={handleBack}
                        className="mr-3 p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-base font-bold text-gray-900 leading-none">{roadmap.title}</h1>
                        <p className="text-xs text-gray-500 mt-0.5">{roadmap.type === 'DECISION_TREE' ? 'Decision Tree' : 'Learning Path'}</p>
                    </div>
                </div>
            </div>

            {/* Graph Area */}
            <div className="flex-1 bg-gray-50 relative">
                <RoadmapTreeView roadmap={roadmap} onNodeClick={handleNodeClick} />
            </div>

            {/* Detail Drawer */}
            <RoadmapDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                node={selectedNode}
            />
        </div>
    );
};
