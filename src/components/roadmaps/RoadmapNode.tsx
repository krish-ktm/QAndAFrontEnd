import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export const RoadmapNode = memo(({ data, selected }: NodeProps) => {
    const style = (data.style as any) || {};
    const shape = style.shape || 'rectangle';
    const bgColor = style.backgroundColor || '#fef3c7';
    const borderColor = style.borderColor || '#d97706';
    const textColor = style.textColor || '#111827';

    const isDiamond = shape === 'diamond';
    const isCircle = shape === 'circle';
    const isRounded = shape === 'rounded';

    // Wrapper Dimensions
    // Diamond needs a square wrapper.
    // Others can be rectangular.
    const widthClass = isDiamond || isCircle ? 'w-48 h-48' : 'w-64 h-auto min-h-[4rem]';

    return (
        <div className={`relative group flex items-center justify-center ${widthClass}`}>

            {/* SVG Shape Layer */}
            <div className="absolute inset-0 w-full h-full pointer-events-none filter drop-shadow-sm transition-all duration-200 group-hover:drop-shadow-md">
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                >
                    {isDiamond && (
                        <polygon
                            points="50,0 100,50 50,100 0,50"
                            fill={bgColor}
                            stroke={selected ? '#3b82f6' : borderColor}
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                        />
                    )}
                    {isCircle && (
                        <circle
                            cx="50" cy="50" r="49"
                            fill={bgColor}
                            stroke={selected ? '#3b82f6' : borderColor}
                            strokeWidth="1.5"
                        />
                    )}
                    {isRounded && (
                        <rect
                            x="1" y="1" width="98" height="98" rx="15" ry="15"
                            fill={bgColor}
                            stroke={selected ? '#3b82f6' : borderColor}
                            strokeWidth="1.5"
                        />
                    )}
                    {!isDiamond && !isCircle && !isRounded && (
                        <rect
                            x="1" y="1" width="98" height="98" rx="3" ry="3"
                            fill={bgColor}
                            stroke={selected ? '#3b82f6' : borderColor}
                            strokeWidth="1.5"
                        />
                    )}
                </svg>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 p-4 text-center flex flex-col items-center justify-center w-full h-full pointer-events-none">
                <h3
                    className="font-medium text-sm leading-tight"
                    style={{ color: textColor }}
                >
                    {data.label as string}
                </h3>
            </div>

            {/* Handles */}
            {/* 
                Universal Connectivity:
                We provide both Source and Target handles on all 4 sides.
                This allows any node to connect to/from any direction.
                
                IDs are structured as: "{position}-{type}" (e.g., "top-source", "top-target")
                For backward compatibility, we also keep the default IDs for the primary handles.
            */}

            {/* TOP */}
            <Handle type="target" position={Position.Top} id="top" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />
            <Handle type="source" position={Position.Top} id="top-source" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />

            {/* BOTTOM */}
            <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />
            <Handle type="target" position={Position.Bottom} id="bottom-target" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />

            {/* LEFT */}
            <Handle type="target" position={Position.Left} id="left" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />
            <Handle type="source" position={Position.Left} id="left-source" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />

            {/* RIGHT */}
            <Handle type="source" position={Position.Right} id="right" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />
            <Handle type="target" position={Position.Right} id="right-target" className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0" />
        </div>
    );
});
