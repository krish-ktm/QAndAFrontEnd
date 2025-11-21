import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { FileText, Github, Link as LinkIcon, Video, Download, ExternalLink } from 'lucide-react';

export const RoadmapResourceNode = memo(({ data, selected }: NodeProps) => {
    const style = (data.style as any) || {};
    const { label, resources = [] } = data as any;

    const borderColor = style.borderColor || '#e2e8f0';
    const textColor = style.textColor || '#0f172a';

    const getIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText size={16} className="text-red-500" />;
            case 'github': return <Github size={16} className="text-gray-900" />;
            case 'video': return <Video size={16} className="text-red-600" />;
            case 'download': return <Download size={16} className="text-blue-500" />;
            default: return <LinkIcon size={16} className="text-blue-400" />;
        }
    };

    return (
        <div
            className="relative group flex flex-col w-72 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border"
            style={{
                borderColor: selected ? '#3b82f6' : borderColor,
                borderWidth: '1.5px'
            }}
        >
            <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-lg leading-tight" style={{ color: textColor }}>
                    {label}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Curated Resources</p>
            </div>

            <div className="p-2">
                <div className="flex flex-col gap-1">
                    {resources.map((resource: any, index: number) => (
                        <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group/link"
                        >
                            <div className="p-2 bg-gray-100 rounded-md mr-3 group-hover/link:bg-white group-hover/link:shadow-sm transition-all">
                                {getIcon(resource.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 truncate group-hover/link:text-blue-600 transition-colors">
                                    {resource.title}
                                </p>
                                <p className="text-xs text-gray-400 capitalize">{resource.type}</p>
                            </div>
                            <ExternalLink size={12} className="text-gray-300 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                    ))}
                </div>
            </div>

            {/* Handles */}
            <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-2 !h-2 !border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
});
