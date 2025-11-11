import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { QnA } from '../../types/api';
import { getDifficultyColor, formatDifficulty } from './utils/qnaUtils';

interface GridViewProps {
  qnas: QnA[];
  expandedIds: Set<string>;
  bookmarkedIds: Set<string>;
  toggleExpand: (id: string) => void;
  toggleBookmark: (id: string) => void;
}

export const GridView = ({ 
  qnas, 
  expandedIds, 
  bookmarkedIds, 
  toggleExpand, 
  toggleBookmark 
}: GridViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {qnas.map((qna: QnA) => {
        const isExpanded = expandedIds.has(qna.id);
        const isBookmarked = bookmarkedIds.has(qna.id);

        return (
          <div
            key={qna.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
          >
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-sm font-semibold text-gray-900 flex-1 line-clamp-3">
                  {qna.question}
                </h3>
                <button
                  onClick={() => toggleBookmark(qna.id)}
                  className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <Star
                    className={`w-4 h-4 ${
                      isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    getDifficultyColor(qna.level)
                  }`}
                >
                  {formatDifficulty(qna.level)}
                </span>
                {qna.companyTags.slice(0, 1).map((company: string) => (
                  <span
                    key={company}
                    className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {company}
                  </span>
                ))}
                {qna.companyTags.length > 1 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    +{qna.companyTags.length - 1}
                  </span>
                )}
              </div>

              {isExpanded && (
                <div className="mb-2 p-3 bg-gray-50 rounded-lg flex-1 overflow-auto max-h-32">
                  <p className="text-xs text-gray-700 leading-relaxed line-clamp-6">{qna.answer}</p>
                </div>
              )}

              <div className="mt-auto pt-2 border-t border-gray-100">
                <button
                  onClick={() => toggleExpand(qna.id)}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition w-full justify-center py-1"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      Hide
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      Show Answer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
