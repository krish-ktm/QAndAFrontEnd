import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export const RoadmapArrayNode = memo(({ data, selected }: NodeProps) => {
    const { label, items, highlightIndices } = data as any;
    const style = (data.style as any) || {};
    const borderColor = style.borderColor || '#cbd5e1';

    return (
        <div className="relative group flex flex-col">
            {/* Label */}
            {label && (
                <div className="mb-1 text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                    {label}
                </div>
            )}

            {/* Array Visual */}
            <div
                className="flex shadow-sm rounded-md overflow-hidden border bg-white"
                style={{
                    borderColor: selected ? '#3b82f6' : borderColor,
                    borderWidth: selected ? '2px' : '1px'
                }}
            >
                {items && items.length > 0 ? (
                    items.map((item: string, index: number) => {
                        const isHighlighted = highlightIndices?.includes(index);
                        return (
                            <div key={index} className="flex flex-col border-r border-slate-200 last:border-r-0">
                                {/* Index */}
                                <div className="bg-slate-50 text-[9px] text-slate-400 text-center py-0.5 border-b border-slate-100 font-mono">
                                    {index}
                                </div>
                                {/* Value */}
                                <div
                                    className={`px-3 py-2 text-sm font-mono text-center min-w-[40px] transition-colors ${isHighlighted ? 'bg-yellow-100 text-yellow-800 font-bold' : 'text-slate-700'}`}
                                >
                                    {item}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="px-4 py-2 text-xs text-slate-400 italic">Empty Array</div>
                )}
            </div>

            {/* Handles */}
            <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
});
