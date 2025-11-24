import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export const RoadmapLinkedListNode = memo(({ data, selected }: NodeProps) => {
    const { value, isNull, label } = data as any;
    const style = (data.style as any) || {};
    const borderColor = style.borderColor || '#64748b'; // Slate-500

    return (
        <div className="relative group flex flex-col items-center">
            {/* Label above the node */}
            {label && (
                <div className="mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {label}
                </div>
            )}

            <div className="flex items-center">
                {/* Node Container */}
                <div
                    className="flex shadow-md rounded-sm overflow-hidden border-2 bg-white transition-all"
                    style={{
                        borderColor: selected ? '#3b82f6' : borderColor,
                        transform: selected ? 'scale(1.05)' : 'scale(1)'
                    }}
                >
                    {/* Data Compartment */}
                    <div className="px-3 py-2 bg-white text-slate-800 font-mono font-bold text-sm min-w-[40px] text-center border-r-2 border-slate-300 flex items-center justify-center">
                        {value || '?'}
                    </div>

                    {/* Pointer Compartment */}
                    <div className="w-10 bg-slate-100 flex items-center justify-center relative">
                        {isNull ? (
                            <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                        ) : (
                            <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
                        )}
                    </div>
                </div>

                {/* Null Visual */}
                {isNull && (
                    <div className="ml-2 flex items-center text-slate-400">
                        <div className="h-[2px] w-4 bg-slate-300"></div>
                        <div className="ml-1 font-mono text-xs font-bold">NULL</div>
                    </div>
                )}
            </div>

            {/* Handles */}
            <Handle
                type="target"
                position={Position.Left}
                className="!bg-slate-500 !w-2.5 !h-2.5 !border-2 !border-white"
            />

            {/* Source Handle - Positioned on the dot in the pointer compartment */}
            {!isNull && (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="!bg-transparent !w-3 !h-3 !border-0"
                    style={{ right: 14, top: '50%' }} // Adjusted to align with the dot
                />
            )}
        </div>
    );
});
