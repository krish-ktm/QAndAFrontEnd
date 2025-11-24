import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Layers } from 'lucide-react';

export const RoadmapQueueNode = memo(({ data, selected }: NodeProps) => {
    const { label, queueType, messageCount, consumers } = data as any;

    return (
        <div className="relative group flex flex-col items-center">
            {/* Queue Visual - Horizontal Pipe/Buffer */}
            <div
                className="relative flex items-center bg-slate-800 rounded-lg p-1.5 gap-1 shadow-md border border-slate-700 min-w-[140px]"
                style={{
                    borderColor: selected ? '#3b82f6' : '#334155',
                    borderWidth: selected ? '2px' : '1px'
                }}
            >
                {/* Label Side */}
                <div className="flex flex-col items-center justify-center px-2 border-r border-slate-600 mr-1">
                    <Layers size={16} className="text-orange-400 mb-0.5" />
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">{queueType || 'QUEUE'}</span>
                </div>

                {/* Messages Visual */}
                <div className="flex-1 flex items-center gap-1 overflow-hidden px-1">
                    {[...Array(Math.min(messageCount || 3, 5))].map((_, i) => (
                        <div key={i} className="w-3 h-6 bg-orange-500 rounded-sm opacity-80 border border-orange-400 shadow-sm"></div>
                    ))}
                    {(messageCount || 0) > 5 && (
                        <span className="text-[9px] text-slate-400">+{messageCount - 5}</span>
                    )}
                </div>

                {/* Consumer Count Badge */}
                {consumers && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-slate-900 shadow-sm flex items-center gap-0.5">
                        <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                        {consumers}
                    </div>
                )}
            </div>

            {/* Label Below */}
            <div className="mt-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                {label || 'Message Queue'}
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
