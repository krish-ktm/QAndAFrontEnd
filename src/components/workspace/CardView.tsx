import { ChevronDown, ChevronUp, Clock, Loader2, Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="space-y-3 sm:space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4">
              <div className="animate-pulse">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <div className="h-5 w-14 bg-gray-200 rounded-full"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-center py-6 sm:py-8">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-600 font-medium">Loading questions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {qnas.map((qna: QnA) => {
        const isExpanded = expandedIds.has(qna.id);
        const isBookmarked = bookmarkedIds.has(qna.id);

        return (
          <div
            key={qna.id}
            className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer"
            onClick={() => toggleExpand(qna.id)}
          >
            <div className="p-4">
              {/* Header with status indicator and bookmark */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:block">Question</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug group-hover:text-blue-900 transition-colors">
                    {qna.question}
                  </h3>
                </div>
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

              {/* Tags and metadata */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getDifficultyColor(qna.level)}`}
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

              {/* Answer section */}
              {/* Answer section */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                    style={{ willChange: 'height, opacity' }}
                  >
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Eye className="w-3 h-3 text-blue-500" />
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Answer</span>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg p-3 border border-gray-100">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {qna.answer}
                        </p>
                        {qna.exampleCode && (
                          <pre className="bg-gray-900 text-gray-100 text-xs p-3 rounded-lg overflow-x-auto mt-3 border border-gray-200 font-mono">
                            {qna.exampleCode}
                          </pre>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action button */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
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
      })}
    </div>
  );
};
