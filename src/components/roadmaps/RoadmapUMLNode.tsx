import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export const RoadmapUMLNode = memo(({ data, selected }: NodeProps) => {
    const { label, attributes, methods } = data as any;
    const style = (data.style as any) || {};
    const borderColor = style.borderColor || '#0f172a'; // Slate-900

    return (
        <div
            className="relative group flex flex-col bg-white shadow-md overflow-hidden border-2 w-64"
            style={{
                borderColor: selected ? '#3b82f6' : borderColor,
            }}
        >
            {/* Class Name */}
            <div className="px-3 py-2 bg-slate-100 border-b-2 border-slate-900 font-bold text-center text-slate-900">
                {label || 'ClassName'}
            </div>

            {/* Attributes */}
            {attributes && attributes.length > 0 && (
                <div className="px-3 py-2 border-b-2 border-slate-900 min-h-[40px]">
                    {attributes.map((attr: string, i: number) => (
                        <div key={i} className="text-xs text-slate-700 font-mono mb-0.5">
                            {attr}
                        </div>
                    ))}
                </div>
            )}

            {/* Methods */}
            {methods && methods.length > 0 && (
                <div className="px-3 py-2 min-h-[40px]">
                    {methods.map((method: string, i: number) => (
                        <div key={i} className="text-xs text-slate-700 font-mono mb-0.5">
                            {method}
                        </div>
                    ))}
                </div>
            )}

            {/* Handles */}
            {/* TOP */}
            <Handle type="target" position={Position.Top} id="top-target" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />
            <Handle type="source" position={Position.Top} id="top-source" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />

            {/* BOTTOM */}
            <Handle type="source" position={Position.Bottom} id="bottom-source" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />
            <Handle type="target" position={Position.Bottom} id="bottom-target" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />

            {/* LEFT */}
            <Handle type="target" position={Position.Left} id="left-target" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />
            <Handle type="source" position={Position.Left} id="left-source" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />

            {/* RIGHT */}
            <Handle type="source" position={Position.Right} id="right-source" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />
            <Handle type="target" position={Position.Right} id="right-target" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />
        </div>
    );
});
