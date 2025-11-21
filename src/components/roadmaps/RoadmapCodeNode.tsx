import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Code } from 'lucide-react';

export const RoadmapCodeNode = memo(({ data, selected }: NodeProps) => {
    const { label, code, language } = data as any;
    const style = (data.style as any) || {};
    const borderColor = style.borderColor || '#e2e8f0';

    return (
        <div
            className="relative group flex flex-col w-80 bg-[#1e293b] rounded-lg shadow-md overflow-hidden border transition-all duration-300"
            style={{
                borderColor: selected ? '#3b82f6' : borderColor,
                borderWidth: '1.5px'
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <Code size={14} className="text-blue-400" />
                    <span className="text-xs font-medium text-slate-300">{label || 'Code Snippet'}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">{language || 'text'}</span>
            </div>

            {/* Code Block */}
            <div className="p-4 overflow-x-auto">
                <pre className="font-mono text-xs text-slate-300 leading-relaxed">
                    <code>{code || '// No code provided'}</code>
                </pre>
            </div>

            {/* Handles */}
            <Handle type="target" position={Position.Top} className="!bg-slate-600 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Bottom} className="!bg-slate-600 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="target" position={Position.Left} className="!bg-slate-600 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Right} className="!bg-slate-600 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
});
