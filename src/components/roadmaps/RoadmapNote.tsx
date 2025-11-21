import { memo } from 'react';
import { NodeProps } from '@xyflow/react';

export const RoadmapNote = memo(({ data }: NodeProps) => {
    const style = (data.style as any) || {};
    const bgColor = style.backgroundColor || '#fef9c3'; // Yellow-100
    const textColor = style.textColor || '#854d0e'; // Yellow-800

    return (
        <div
            className="relative p-4 shadow-md rounded-sm transform -rotate-1 font-handwriting w-48 min-h-[4rem] flex items-center justify-center text-center"
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            {/* Sticky Note Visuals */}
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 pointer-events-none" />

            <p className="text-sm font-medium leading-snug relative z-10">
                {data.label as string}
            </p>
        </div>
    );
});
