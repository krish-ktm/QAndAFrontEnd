import { memo } from 'react';
import { NodeProps } from '@xyflow/react';

export const RoadmapGroupNode = memo(({ data, selected }: NodeProps) => {
    const style = (data.style as any) || {};
    const { label } = data as any;

    const bgColor = style.backgroundColor || 'rgba(241, 245, 249, 0.5)'; // Slate-100 with opacity
    const borderColor = style.borderColor || '#cbd5e1'; // Slate-300
    const textColor = style.textColor || '#475569'; // Slate-600

    return (
        <div
            className="relative w-full h-full rounded-xl transition-all duration-300"
            style={{
                backgroundColor: bgColor,
                border: `2px dashed ${selected ? '#3b82f6' : borderColor}`,
            }}
        >
            {/* Label */}
            <div className="absolute -top-8 left-0 px-2 py-1">
                <span className="text-sm font-bold uppercase tracking-wider" style={{ color: textColor }}>
                    {label}
                </span>
            </div>
        </div>
    );
});
