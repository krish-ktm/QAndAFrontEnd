import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Network, ArrowLeftRight } from 'lucide-react';

export const RoadmapLoadBalancerNode = memo(({ data, selected }: NodeProps) => {
    const { label, algorithm, connections } = data as any;

    return (
        <div className="relative group flex flex-col items-center">
            {/* Hexagon Shape Container - Made Wider (w-40) */}
            <div
                className="relative w-40 h-24 flex items-center justify-center transition-all duration-300"
                style={{
                    filter: selected ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                }}
            >
                {/* Hexagon SVG Background - Stretched horizontally */}
                <svg viewBox="0 0 140 100" className="absolute inset-0 w-full h-full text-slate-800 fill-current drop-shadow-sm">
                    {/* Adjusted path for a wider hexagon */}
                    <path d="M20 0 L120 0 L140 50 L120 100 L20 100 L0 50 Z" stroke="#475569" strokeWidth="2" />
                </svg>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-slate-200 w-full px-6">
                    <Network size={20} className="text-blue-400 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight w-full truncate">{label || 'Load Balancer'}</span>

                    <div className="flex items-center gap-1 mt-1 bg-slate-900/50 px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-400 border border-slate-700/50">
                        <ArrowLeftRight size={8} />
                        <span>{algorithm || 'Round Robin'}</span>
                    </div>
                </div>

                {/* Connection Count Badge */}
                {connections && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-slate-900 shadow-sm z-20">
                        {connections}
                    </div>
                )}

                {/* Handles - Moved inside visual container and adjusted for Hexagon shape */}
                {/* TOP - At 0% y */}
                <Handle type="target" position={Position.Top} id="top-target" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0" />
                <Handle type="source" position={Position.Top} id="top-source" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0" />

                {/* BOTTOM - At 100% y */}
                <Handle type="source" position={Position.Bottom} id="bottom-source" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0" />
                <Handle type="target" position={Position.Bottom} id="bottom-target" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0" />

                {/* LEFT - Adjusted to ~7% to match hexagon edge */}
                <Handle type="target" position={Position.Left} id="left-target" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 !left-[2px]" />
                <Handle type="source" position={Position.Left} id="left-source" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 !left-[2px]" />

                {/* RIGHT - Adjusted to ~93% to match hexagon edge */}
                <Handle type="source" position={Position.Right} id="right-source" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 !right-[2px]" />
                <Handle type="target" position={Position.Right} id="right-target" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 !right-[2px]" />
            </div>
        </div>
    );
});
