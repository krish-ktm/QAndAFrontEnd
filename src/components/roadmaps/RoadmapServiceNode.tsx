import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Server } from 'lucide-react';

export const RoadmapServiceNode = memo(({ data, selected }: NodeProps) => {
    const { label, language, endpoints, status, version, techStack } = data as any;
    const style = (data.style as any) || {};
    const borderColor = style.borderColor || '#e2e8f0';

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'bg-green-500';
            case 'degraded': return 'bg-yellow-500';
            case 'down': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div
            className="relative group flex flex-col w-64 bg-white rounded-lg shadow-md overflow-hidden border transition-all duration-300"
            style={{
                borderColor: selected ? '#3b82f6' : borderColor,
                borderWidth: '1.5px'
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded-md">
                        <Server size={14} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{label || 'Service'}</span>
                </div>
                {language && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded">
                        {language}
                    </span>
                )}
            </div>

            {/* Body - Endpoints */}
            <div className="p-3 space-y-2">
                {endpoints && endpoints.length > 0 ? (
                    <div className="space-y-1">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Endpoints</p>
                        {endpoints.map((ep: string, i: number) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                <span className={`w-1.5 h-1.5 rounded-full ${ep.startsWith('GET') ? 'bg-green-400' : ep.startsWith('POST') ? 'bg-blue-400' : 'bg-orange-400'}`}></span>
                                {ep}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-xs text-slate-400 italic text-center py-2">No endpoints defined</div>
                )}

                {/* Tech Stack Badges */}
                {techStack && techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-slate-100">
                        {techStack.map((tech: string, i: number) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200">
                                {tech}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500">
                <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(status)} animate-pulse`}></span>
                    <span className="capitalize">{status || 'Unknown'}</span>
                </div>
                <span className="font-mono opacity-75">v{version || '1.0.0'}</span>
            </div>

            {/* Handles */}
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
    );
});
