import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ExternalLink } from 'lucide-react';

export const RoadmapInfoNode = memo(({ data, selected }: NodeProps) => {
    const style = (data.style as any) || {};
    const { label, subLabel, image, tags, items, link } = data as any;

    const bgColor = style.backgroundColor || '#ffffff';
    const borderColor = style.borderColor || '#e2e8f0';
    const textColor = style.textColor || '#0f172a';

    return (
        <div
            className="relative group flex flex-col w-72 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border"
            style={{
                borderColor: selected ? '#3b82f6' : borderColor,
                borderWidth: '1.5px'
            }}
        >
            {/* Optional Header Image */}
            {image && (
                <div className="w-full h-32 overflow-hidden bg-gray-100">
                    <img src={image} alt={label} className="w-full h-full object-cover" />
                </div>
            )}

            <div className="p-5">
                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag: any, index: number) => (
                            <span
                                key={index}
                                className="px-2 py-0.5 text-xs font-medium rounded-full"
                                style={{
                                    backgroundColor: tag.color ? `${tag.color}20` : '#f1f5f9',
                                    color: tag.color || '#64748b'
                                }}
                            >
                                {tag.text}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title & Subtitle */}
                <h3 className="font-bold text-lg leading-tight mb-1" style={{ color: textColor }}>
                    {label}
                </h3>
                {subLabel && (
                    <p className="text-sm text-gray-500 mb-4">{subLabel}</p>
                )}

                {/* Content Items */}
                {items && items.length > 0 && (
                    <ul className="space-y-2 mb-4">
                        {items.map((item: string, index: number) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Action Link */}
                {link && (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mt-2"
                    >
                        Learn more <ExternalLink size={12} className="ml-1" />
                    </a>
                )}
            </div>

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
