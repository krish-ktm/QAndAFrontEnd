import { QnA } from '../../types/api';
import { QnACard } from './QnACard';

interface VerticalViewProps {
  qnas: QnA[];
  expandedIds: Set<string>;
  bookmarkedIds: Set<string>;
  toggleExpand: (id: string) => void;
  toggleBookmark: (id: string) => void;
}

export const VerticalView = ({ 
  qnas, 
  expandedIds, 
  bookmarkedIds, 
  toggleExpand, 
  toggleBookmark 
}: VerticalViewProps) => {
  return (
    <div className="space-y-4">
      {qnas.map((qna: QnA) => {
        const isExpanded = expandedIds.has(qna.id);
        const isBookmarked = bookmarkedIds.has(qna.id);

        return (
          <QnACard
            key={qna.id}
            qna={qna}
            isExpanded={isExpanded}
            isBookmarked={isBookmarked}
            toggleExpand={toggleExpand}
            toggleBookmark={toggleBookmark}
          />
        );
      })}
    </div>
  );
};
