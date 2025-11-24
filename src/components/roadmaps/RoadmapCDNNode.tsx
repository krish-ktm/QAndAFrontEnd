import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Globe, Zap } from 'lucide-react';

export const RoadmapCDNNode = memo(({ data, selected }: NodeProps) => {
    const { label, regions, latency } = data as any;

    return (
        <div className="relative group flex flex-col items-center">
            {/* Cloud Shape Container */}
            <div
                className="relative w-32 h-20 flex items-center justify-center transition-all duration-300"
                style={{
                    filter: selected ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                }}
            >
                {/* Cloud SVG Background */}
                <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full text-sky-100 fill-current drop-shadow-sm">
                    <path d="M25,50 C10,50 0,40 0,25 C0,10 15,0 30,5 C35,0 55,0 60,10 C70,0 90,5 95,20 C100,25 100,45 90,50 Z" stroke="#38bdf8" strokeWidth="2" />
                </svg>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-sky-900 mt-2">
                    <div className="flex items-center gap-1">
                        <Globe size={14} className="text-sky-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{label || 'CDN'}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        {regions && (
                            <span className="text-[9px] font-mono bg-white/80 px-1.5 rounded-full border border-sky-200">
                                {regions.length} Regions
                            </span>
                        )}
                        {latency && (
                            <div className="flex items-center gap-0.5 text-[9px] font-bold text-green-600">
                                <Zap size={8} className="fill-current" />
                                {latency}ms
                            </div>
                        )}
                    </div>
                </div>

                {/* Handles - Moved inside visual container and adjusted for Cloud shape */}
                {/* TOP - Cloud peak is around center, but irregular. Default top is fine. */}
                <Handle type="target" position={Position.Top} id="top-target" className="!bg-sky-400 !w-2 !h-2 !border-0 opacity-0" />
                <Handle type="source" position={Position.Top} id="top-source" className="!bg-sky-400 !w-2 !h-2 !border-0 opacity-0" />

                {/* BOTTOM - Cloud bottom is flat-ish. Default bottom is fine. */}
                <Handle type="source" position={Position.Bottom} id="bottom-source" className="!bg-sky-400 !w-2 !h-2 !border-0 opacity-0" />
                <Handle type="target" position={Position.Bottom} id="bottom-target" className="!bg-sky-400 !w-2 !h-2 !border-0 opacity-0" />

                {/* LEFT - Cloud left bulge is around 0-10%. */}
                <Handle type="target" position={Position.Left} id="left-target" className="!bg-sky-400 !w-2 !h-2 !border-0 opacity-0 !left-[4px]" />
                <Handle type="source" position={Position.Left} id="left-source" className="!bg-sky-400 !w-2 !h-2 !border-0 opacity-0 !left-[4px]" />

                {/* RIGHT - Cloud right bulge is around 90-100%. */}
                <Handle type="source" position={Position.Right} id="right-source" className="!bg-sky-400 !w-2 !h-2 !border-0 opacity-0 !right-[4px]" />
                <Handle type="target" position={Position.Right} id="right-target" className="!bg-sky-400 !w-2 !h-2 !border-0 opacity-0 !right-[4px]" />
            </div>
        </div>
    );
});
