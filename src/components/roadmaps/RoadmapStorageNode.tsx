import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { HardDrive, Archive } from 'lucide-react';

export const RoadmapStorageNode = memo(({ data, selected }: NodeProps) => {
    const { label, storageClass, bucketName } = data as any;

    return (
        <div className="relative group flex flex-col items-center">
            {/* Visual Container - Bucket Icon */}
            <div
                className="relative w-16 h-16 transition-all duration-300 mb-1"
                style={{
                    filter: selected ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                }}
            >
                {/* Bucket SVG Background */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-amber-100 fill-current drop-shadow-sm">
                    <path d="M15,25 L25,90 C25,95 30,100 50,100 C70,100 75,95 75,90 L85,25 Z" stroke="#d97706" strokeWidth="3" />
                    <ellipse cx="50" cy="25" rx="35" ry="10" fill="#fcd34d" stroke="#d97706" strokeWidth="3" />
                </svg>

                {/* Icon Inside Bucket */}
                <div className="absolute inset-0 flex items-center justify-center pt-4">
                    <HardDrive size={24} className="text-amber-600 opacity-80" />
                </div>
            </div>

            {/* Label Outside - "Out of Box" Solution */}
            <div className="flex flex-col items-center">
                <div className="bg-white/90 border border-amber-200 px-2 py-1 rounded-md shadow-sm backdrop-blur-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 whitespace-nowrap">
                        {label || 'Storage'}
                    </span>
                </div>

                {bucketName && (
                    <span className="text-[9px] font-mono text-slate-500 mt-0.5 bg-slate-100 px-1.5 rounded text-center max-w-[100px] truncate border border-slate-200">
                        {bucketName}
                    </span>
                )}

                {storageClass && (
                    <div className="mt-1 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center gap-1 text-amber-800">
                        <Archive size={8} />
                        {storageClass}
                    </div>
                )}
            </div>

            {/* Handles - Positioned relative to the whole group, but visually attached to the bucket */}
            {/* We need to adjust positions because the height of the node has increased with the external label */}

            {/* TOP - Top of the bucket */}
            <Handle type="target" position={Position.Top} id="top-target" className="!bg-amber-400 !w-2 !h-2 !border-0 opacity-0 !top-[15px]" />
            <Handle type="source" position={Position.Top} id="top-source" className="!bg-amber-400 !w-2 !h-2 !border-0 opacity-0 !top-[15px]" />

            {/* BOTTOM - Bottom of the label area? Or bottom of bucket? 
                Let's put bottom handles at the bottom of the *bucket* so edges connect to the object, not the text.
                Bucket is 64px (h-16) high. 
            */}
            <Handle type="source" position={Position.Bottom} id="bottom-source" className="!bg-amber-400 !w-2 !h-2 !border-0 opacity-0 !top-[64px]" />
            <Handle type="target" position={Position.Bottom} id="bottom-target" className="!bg-amber-400 !w-2 !h-2 !border-0 opacity-0 !top-[64px]" />

            {/* LEFT - Middle of bucket (approx 32px down) */}
            <Handle type="target" position={Position.Left} id="left-target" className="!bg-amber-400 !w-2 !h-2 !border-0 opacity-0 !top-[32px] !left-[8px]" />
            <Handle type="source" position={Position.Left} id="left-source" className="!bg-amber-400 !w-2 !h-2 !border-0 opacity-0 !top-[32px] !left-[8px]" />

            {/* RIGHT - Middle of bucket */}
            <Handle type="source" position={Position.Right} id="right-source" className="!bg-amber-400 !w-2 !h-2 !border-0 opacity-0 !top-[32px] !right-[8px]" />
            <Handle type="target" position={Position.Right} id="right-target" className="!bg-amber-400 !w-2 !h-2 !border-0 opacity-0 !top-[32px] !right-[8px]" />
        </div>
    );
});
