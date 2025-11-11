import { Star, ChevronDown, ChevronUp, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { QnA } from '../../types/api';
import { getDifficultyColor, formatDifficulty } from './utils/qnaUtils';

interface CardViewProps {
  qnas: QnA[];
  expandedIds: Set<string>;
  bookmarkedIds: Set<string>;
  toggleExpand: (id: string) => void;
  toggleBookmark: (id: string) => void;
  isLoading?: boolean;
}

export const CardView = ({ 
  qnas, 
  expandedIds, 
  bookmarkedIds, 
  toggleExpand, 
  toggleBookmark,
  isLoading = false
}: CardViewProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5">
              <div className="animate-pulse">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-600">Loading questions...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {qnas.map((qna: QnA) => {
        const isExpanded = expandedIds.has(qna.id);
        const isBookmarked = bookmarkedIds.has(qna.id);

        return (
          <div
            key={qna.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300"
          >
            <div className="p-5">
              {/* Header with question and bookmark */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Question</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 leading-snug">
                    {qna.question}
                  </h3>
                </div>
                <button
                  onClick={() => toggleBookmark(qna.id)}
                  className="flex-shrink-0 p-2 hover:bg-gray-50 rounded-lg transition group"
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 group-hover:text-yellow-400'
                    }`}
                  />
                </button>
              </div>

              {/* Tags and metadata */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${getDifficultyColor(qna.level)}`}
                >
                  {formatDifficulty(qna.level)}
                </span>
                {qna.companyTags.slice(0, 2).map((company: string) => (
                  <span
                    key={company}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                  >
                    {company}
                  </span>
                ))}
                {qna.companyTags.length > 2 && (
                  <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">
                    +{qna.companyTags.length - 2} more
                  </span>
                )}
              </div>

              {/* Answer section */}
              <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Answer</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {qna.answer}
                    </p>
                    {qna.exampleCode && (
                      <pre className="bg-gray-900 text-gray-100 text-xs p-3 rounded-lg overflow-x-auto mt-3 border border-gray-200">
                        {qna.exampleCode}
                      </pre>
                    )}
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>2 min read</span>
                </div>
                <button
                  onClick={() => toggleExpand(qna.id)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide Answer
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
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
