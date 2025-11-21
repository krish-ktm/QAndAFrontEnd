import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CheckSquare, Square } from 'lucide-react';

export const RoadmapChecklistNode = memo(({ data, selected }: NodeProps) => {
    const style = (data.style as any) || {};
    const { label, items = [] } = data as any;

    const borderColor = style.borderColor || '#e2e8f0';
    const textColor = style.textColor || '#0f172a';

    // Local state for checklist items (visual only for now)
    const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

    const toggleItem = (index: number) => {
        setCheckedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const progress = Math.round((Object.values(checkedItems).filter(Boolean).length / items.length) * 100) || 0;

    return (
        <div
            className="relative group flex flex-col w-72 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border"
            style={{
                borderColor: selected ? '#3b82f6' : borderColor,
                borderWidth: '1.5px'
            }}
        >
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-lg leading-tight" style={{ color: textColor }}>
                    {label}
                </h3>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="mt-1 text-xs text-gray-500 text-right">{progress}% Complete</div>
            </div>

            <div className="p-4">
                <ul className="space-y-3">
                    {items.map((item: string, index: number) => {
                        const isChecked = checkedItems[index];
                        return (
                            <li
                                key={index}
                                className="flex items-start cursor-pointer group/item"
                                onClick={() => toggleItem(index)}
                            >
                                <div className={`mt-0.5 mr-3 transition-colors ${isChecked ? 'text-blue-500' : 'text-gray-300 group-hover/item:text-gray-400'}`}>
                                    {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                                </div>
                                <span className={`text-sm transition-colors ${isChecked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                    {item}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Handles */}
            <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
});
