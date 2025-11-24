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
            {/* TOP */}
            <Handle type="target" position={Position.Top} id="top-target" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Top} id="top-source" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* BOTTOM */}
            <Handle type="source" position={Position.Bottom} id="bottom-source" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="target" position={Position.Bottom} id="bottom-target" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* LEFT */}
            <Handle type="target" position={Position.Left} id="left-target" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Left} id="left-source" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* RIGHT */}
            <Handle type="source" position={Position.Right} id="right-source" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="target" position={Position.Right} id="right-target" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
});
