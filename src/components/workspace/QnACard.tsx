import { ChevronDown, ChevronUp, Clock, Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import { QnA } from '../../types/api';
import { getDifficultyColor, formatDifficulty } from './utils/qnaUtils';

interface QnACardProps {
  qna: QnA;
  isExpanded: boolean;
  isBookmarked: boolean;
  toggleExpand: (id: string) => void;
  toggleBookmark: (id: string) => void;
}

export const QnACard = ({ qna, isExpanded, isBookmarked, toggleExpand, toggleBookmark }: QnACardProps) => {
  return (
    <div
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer"
      onClick={() => toggleExpand(qna.id)}
    >
      <div className="p-4 relative">
        {/* Status indicator */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:block">Question</span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 mt-3 mb-3">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex-1 leading-snug group-hover:text-blue-900 transition-colors">
            {qna.question}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(qna.id);
            }}
            className="flex-shrink-0 p-1.5 hover:bg-blue-50 rounded-lg transition-all duration-200 group/btn"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-blue-600" />
            ) : (
              <Bookmark className="w-4 h-4 text-gray-400 group-hover/btn:text-blue-600 transition-colors" />
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getDifficultyColor(
              qna.level
            )}`}
          >
            {formatDifficulty(qna.level)}
          </span>
          {qna.companyTags.slice(0, 2).map((company: string) => (
            <span
              key={company}
              className="px-2 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100 hover:border-blue-200 transition-colors"
            >
              {company}
            </span>
          ))}
          {qna.companyTags.length > 2 && (
            <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">
              +{qna.companyTags.length - 2} more
            </span>
          )}
        </div>

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
        >
          <div className="overflow-hidden">
            <div className="mb-3 p-3 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg border border-gray-100 space-y-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Eye className="w-3 h-3 text-blue-500" />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Answer</span>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{qna.answer}</p>
              {qna.exampleCode && (
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 text-xs p-3 rounded-lg overflow-x-auto border border-gray-200 font-mono">
                    {qna.exampleCode}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span className="hidden sm:inline">2 min read</span>
            <span className="sm:hidden">2m</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3" />
                <span className="hidden sm:inline">Hide Answer</span>
                <span className="sm:hidden">Hide</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                <span className="hidden sm:inline">Show Answer</span>
                <span className="sm:hidden">Show</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
