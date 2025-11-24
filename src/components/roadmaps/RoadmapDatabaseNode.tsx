import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Database } from 'lucide-react';

export const RoadmapDatabaseNode = memo(({ data, selected }: NodeProps) => {
    const { label, dbType, connectionStatus, shards } = data as any;

    return (
        <div className="relative group flex flex-col items-center">
            {/* Cylinder Shape Container */}
            <div
                className="relative w-24 h-28 transition-all duration-300"
                style={{
                    filter: selected ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                }}
            >
                {/* Cylinder Top */}
                <div className="absolute top-0 w-full h-8 bg-slate-200 rounded-[50%] border border-slate-400 z-20 flex items-center justify-center">
                    <div className="w-20 h-4 bg-slate-100 rounded-[50%] opacity-50"></div>
                </div>

                {/* Cylinder Body */}
                <div className="absolute top-4 w-full h-20 bg-slate-100 border-x border-b border-slate-400 rounded-b-[20px] z-10 flex flex-col items-center justify-center pt-2 gap-1">
                    <Database size={20} className="text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-700 text-center px-1 leading-tight">{label || 'DB'}</span>
                    <span className="text-[9px] font-mono text-slate-500 bg-slate-200 px-1.5 rounded-full">{dbType || 'SQL'}</span>
                </div>

                {/* Connection Status Indicator */}
                <div className={`absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full border border-white z-30 ${connectionStatus === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>

                {/* Handles - Moved inside the visual container */}
                {/* TOP */}
                <Handle type="target" position={Position.Top} id="top-target" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0" />
                <Handle type="source" position={Position.Top} id="top-source" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0" />

                {/* BOTTOM */}
                <Handle type="source" position={Position.Bottom} id="bottom-source" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0" />
                <Handle type="target" position={Position.Bottom} id="bottom-target" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0" />

                {/* LEFT */}
                <Handle type="target" position={Position.Left} id="left-target" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0" />
                <Handle type="source" position={Position.Left} id="left-source" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0" />

                {/* RIGHT */}
                <Handle type="source" position={Position.Right} id="right-source" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0" />
                <Handle type="target" position={Position.Right} id="right-target" className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0" />
            </div>

            {/* Shards/Replicas Indicator */}
            {shards && shards > 1 && (
                <div className="absolute -right-8 top-8 flex flex-col gap-1">
                    {[...Array(Math.min(shards, 3))].map((_, i) => (
                        <div key={i} className="w-4 h-1.5 bg-slate-300 rounded-full border border-slate-400"></div>
                    ))}
                    <span className="text-[9px] text-slate-400 font-mono ml-1">x{shards}</span>
                </div>
            )}
        </div>
    );
});
