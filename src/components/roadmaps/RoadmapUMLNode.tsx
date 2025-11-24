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
            <div className="px-3 py-2 border-b-2 border-slate-900 min-h-[40px]">
                {attributes && attributes.length > 0 ? (
                    attributes.map((attr: string, i: number) => (
                        <div key={i} className="text-xs text-slate-700 font-mono mb-0.5">
                            {attr}
                        </div>
                    ))
                ) : (
                    <div className="text-xs text-slate-400 italic">No attributes</div>
                )}
            </div>

            {/* Methods */}
            <div className="px-3 py-2 min-h-[40px]">
                {methods && methods.length > 0 ? (
                    methods.map((method: string, i: number) => (
                        <div key={i} className="text-xs text-slate-700 font-mono mb-0.5">
                            {method}
                        </div>
                    ))
                ) : (
                    <div className="text-xs text-slate-400 italic">No methods</div>
                )}
            </div>

            {/* Handles */}
            <Handle type="target" position={Position.Top} className="!bg-slate-900 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Bottom} className="!bg-slate-900 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="target" position={Position.Left} className="!bg-slate-900 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Right} className="!bg-slate-900 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
});
