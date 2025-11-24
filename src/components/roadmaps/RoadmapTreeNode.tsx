import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export const RoadmapTreeNode = memo(({ data, selected }: NodeProps) => {
    const { value, variant, label } = data as any; // variant: 'default' | 'leaf' | 'root'

    const getStyles = () => {
        if (variant === 'root') return 'bg-purple-50 border-purple-500 text-purple-900';
        if (variant === 'leaf') return 'bg-green-50 border-green-500 text-green-900';
        return 'bg-white border-slate-400 text-slate-800';
    };

    return (
        <div className="relative group flex flex-col items-center">
            {/* Label above the node */}
            {label && (
                <div className="mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {label}
                </div>
            )}

            <div
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-sm transition-all ${getStyles()}`}
                style={{
                    borderColor: selected ? '#3b82f6' : undefined,
                    boxShadow: selected ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : undefined
                }}
            >
                <span className="font-bold font-mono text-base">{value}</span>
            </div>

            {/* Handles */}
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-slate-400 !w-2.5 !h-2.5 !border-2 !border-white"
            />

            {/* BST Handles - Left and Right */}
            <Handle
                id="left"
                type="source"
                position={Position.Bottom}
                className="!bg-slate-400 !w-2.5 !h-2.5 !border-2 !border-white"
                style={{ left: '20%', bottom: 2 }}
            />
            <Handle
                id="right"
                type="source"
                position={Position.Bottom}
                className="!bg-slate-400 !w-2.5 !h-2.5 !border-2 !border-white"
                style={{ left: '80%', bottom: 2 }}
            />
        </div>
    );
});
