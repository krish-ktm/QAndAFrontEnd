import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export const RoadmapMathNode = memo(({ data, selected }: NodeProps) => {
    const { label, equation } = data as any;
    const style = (data.style as any) || {};
    const borderColor = style.borderColor || '#e2e8f0';

    return (
        <div
            className="relative group flex flex-col bg-white rounded-lg shadow-md overflow-hidden border transition-all duration-300 min-w-[200px]"
            style={{
                borderColor: selected ? '#3b82f6' : borderColor,
                borderWidth: '1.5px'
            }}
        >
            {/* Label */}
            {label && (
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {label}
                </div>
            )}

            {/* Equation */}
            <div className="p-4 flex items-center justify-center bg-white text-slate-800 text-lg">
                <Latex>{`$${equation || 'E = mc^2'}$`}</Latex>
            </div>

            {/* Handles */}
            <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="target" position={Position.Left} className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Right} className="!bg-slate-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
});
