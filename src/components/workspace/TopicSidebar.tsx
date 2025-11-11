import { useState } from 'react';
import { Topic } from '../../types/api';
import { ChevronRight, BookOpen, Check } from 'lucide-react';

interface TopicSidebarProps {
  topics: Topic[];
  selectedTopicId: string;
  onSelect: (id: string) => void;
}

export const TopicSidebar = ({ topics, selectedTopicId, onSelect }: TopicSidebarProps) => {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  return (
    <aside className="hidden md:block w-60 shrink-0">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <BookOpen className="w-4 h-4" />
            Topics
          </div>
        </div>
        {topics.map((topic) => {
          const isActive = topic.id === selectedTopicId;
          const isHovered = topic.id === hoveredTopic;
          
          return (
            <div
              key={topic.id}
              className="relative"
              onMouseEnter={() => setHoveredTopic(topic.id)}
              onMouseLeave={() => setHoveredTopic(null)}
            >
              <button
                onClick={() => onSelect(topic.id)}
                className={`w-full text-left px-4 py-3 text-sm transition border-b border-gray-200 last:border-b-0 flex items-center justify-between group ${
                  isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isActive && <Check className="w-4 h-4" />}
                  {topic.name}
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  isHovered ? 'translate-x-1' : 'translate-x-0'
                } ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              </button>
              
              {/* Inline actions that appear on hover */}
              {isHovered && !isActive && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(topic.id);
                      }}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
