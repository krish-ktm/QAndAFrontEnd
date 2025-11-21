import React from 'react';
import { X } from 'lucide-react';
import { Node } from '@xyflow/react';

import ReactMarkdown from 'react-markdown';

interface RoadmapDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    node: Node | null;
}

export const RoadmapDrawer: React.FC<RoadmapDrawerProps> = ({ isOpen, onClose, node }) => {
    // Even if node is null, we might want to render the drawer (closed) or backdrop logic.
    // But usually if not open, we don't care.
    // However, for the transition to work, we need the drawer to exist in DOM or handle unmount.
    // Current logic: if (!node) return null;
    // This breaks the close animation if node becomes null immediately.
    // Better to keep rendering but rely on isOpen.

    const content = node?.data?.content as string || '';
    const label = node?.data?.label as string || '';

    return (
        <>
            {/* Backdrop - Click outside to close (Transparent, no GPU load) */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={onClose}
                />
            )}

            {/* Drawer Panel */}
            <div className={`
                fixed inset-y-0 right-0 w-full md:w-[480px] bg-white border-l border-gray-200 shadow-2xl transform transition-transform duration-300 z-50
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
                        <h2 className="text-2xl font-bold text-gray-900">{label}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="prose prose-blue max-w-none">
                            {content ? (
                                <ReactMarkdown>{content}</ReactMarkdown>
                            ) : (
                                <p className="text-gray-500 italic">No details available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
