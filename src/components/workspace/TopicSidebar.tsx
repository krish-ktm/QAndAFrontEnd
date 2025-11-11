import { Topic } from '../../types/api';

interface TopicSidebarProps {
  topics: Topic[];
  selectedTopicId: string;
  onSelect: (id: string) => void;
}

export const TopicSidebar = ({ topics, selectedTopicId, onSelect }: TopicSidebarProps) => (
  <aside className="hidden md:block w-60 shrink-0">
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {topics.map((topic) => {
        const isActive = topic.id === selectedTopicId;
        return (
          <button
            key={topic.id}
            onClick={() => onSelect(topic.id)}
            className={`w-full text-left px-4 py-3 text-sm transition border-b border-gray-200 last:border-b-0 ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
          >
            {topic.name}
          </button>
        );
      })}
    </div>
  </aside>
);
