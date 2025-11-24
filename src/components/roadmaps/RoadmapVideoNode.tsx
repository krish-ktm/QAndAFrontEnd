import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { PlayCircle } from 'lucide-react';

export const RoadmapVideoNode = memo(({ data, selected }: NodeProps) => {
    const style = (data.style as any) || {};
    const { label, videoUrl, description } = data as any;

    const borderColor = style.borderColor || '#e2e8f0';
    const textColor = style.textColor || '#0f172a';

    // Helper to extract video ID from YouTube URL
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.split('v=')[1] || url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    };

    return (
        <div
            className="relative group flex flex-col w-80 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border"
            style={{
                borderColor: selected ? '#3b82f6' : borderColor,
                borderWidth: '1.5px'
            }}
        >
            {/* Video Header */}
            <div className="w-full aspect-video bg-gray-900 relative">
                {videoUrl ? (
                    <iframe
                        src={getEmbedUrl(videoUrl)}
                        title={label}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <PlayCircle size={48} />
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg leading-tight mb-2" style={{ color: textColor }}>
                    {label}
                </h3>
                {description && (
                    <p className="text-sm text-gray-500">{description}</p>
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
