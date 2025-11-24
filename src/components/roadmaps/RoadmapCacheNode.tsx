import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';

export const RoadmapCacheNode = memo(({ data, selected }: NodeProps) => {
    const { label, hitRate, memoryUsage, evictionPolicy } = data as any;

    return (
        <div className="relative group flex flex-col items-center">
            {/* Box Container */}
            <div
                className="relative w-32 bg-red-50 rounded-lg border-2 transition-all duration-300 overflow-hidden shadow-sm"
                style={{
                    borderColor: selected ? '#3b82f6' : '#fca5a5', // Red-300
                    boxShadow: selected ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none'
                }}
            >
                {/* Header */}
                <div className="bg-red-100 px-2 py-1.5 flex items-center justify-between border-b border-red-200">
                    <div className="flex items-center gap-1">
                        <Zap size={14} className="text-red-500 fill-current" />
                        <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider">{label || 'Cache'}</span>
                    </div>
                    {evictionPolicy && (
                        <span className="text-[8px] font-mono text-red-600 bg-red-200/50 px-1 rounded">{evictionPolicy}</span>
                    )}
                </div>

                {/* Metrics */}
                <div className="p-2 space-y-1.5">
                    {/* Hit Rate Bar */}
                    <div className="space-y-0.5">
                        <div className="flex justify-between text-[9px] text-red-700 font-medium">
                            <span>Hit Rate</span>
                            <span>{hitRate || '0'}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-red-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: `${hitRate || 0}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Memory Usage */}
                    <div className="flex justify-between items-center text-[9px] text-red-600">
                        <span>Memory</span>
                        <span className="font-mono bg-red-100 px-1 rounded">{memoryUsage || '0MB'}</span>
                    </div>
                </div>

                {/* Handles - Inside visual container */}
                {/* TOP */}
                <Handle type="target" position={Position.Top} id="top-target" className="!bg-red-300 !w-2 !h-2 !border-0 opacity-0" />
                <Handle type="source" position={Position.Top} id="top-source" className="!bg-red-300 !w-2 !h-2 !border-0 opacity-0" />

                {/* BOTTOM */}
                <Handle type="source" position={Position.Bottom} id="bottom-source" className="!bg-red-300 !w-2 !h-2 !border-0 opacity-0" />
                <Handle type="target" position={Position.Bottom} id="bottom-target" className="!bg-red-300 !w-2 !h-2 !border-0 opacity-0" />

                {/* LEFT */}
                <Handle type="target" position={Position.Left} id="left-target" className="!bg-red-300 !w-2 !h-2 !border-0 opacity-0" />
                <Handle type="source" position={Position.Left} id="left-source" className="!bg-red-300 !w-2 !h-2 !border-0 opacity-0" />

                {/* RIGHT */}
                <Handle type="source" position={Position.Right} id="right-source" className="!bg-red-300 !w-2 !h-2 !border-0 opacity-0" />
                <Handle type="target" position={Position.Right} id="right-target" className="!bg-red-300 !w-2 !h-2 !border-0 opacity-0" />
            </div>
        </div>
    );
});
