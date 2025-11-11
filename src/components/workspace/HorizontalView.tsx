import { useRef } from 'react';
import { Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { QnA } from '../../types/api';
import { getDifficultyColor, formatDifficulty } from './utils/qnaUtils';

interface HorizontalViewProps {
  qnas: QnA[];
  expandedIds: Set<string>;
  bookmarkedIds: Set<string>;
  toggleExpand: (id: string) => void;
  toggleBookmark: (id: string) => void;
  currentItemIndex: number;
  setCurrentItemIndex: (index: number) => void;
}

export const HorizontalView = ({ 
  qnas, 
  expandedIds, 
  bookmarkedIds, 
  toggleExpand, 
  toggleBookmark,
  currentItemIndex,
  setCurrentItemIndex
}: HorizontalViewProps) => {
  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    const newIndex = Math.max(0, currentItemIndex - 1);
    setCurrentItemIndex(newIndex);
    if (horizontalScrollRef.current) {
      const cardWidth = horizontalScrollRef.current.scrollWidth / qnas.length;
      horizontalScrollRef.current.scrollTo({
        left: cardWidth * newIndex,
        behavior: 'smooth',
      });
    }
  };

  const handleNext = () => {
    const newIndex = Math.min(qnas.length - 1, currentItemIndex + 1);
    setCurrentItemIndex(newIndex);
    if (horizontalScrollRef.current) {
      const cardWidth = horizontalScrollRef.current.scrollWidth / qnas.length;
      horizontalScrollRef.current.scrollTo({
        left: cardWidth * newIndex,
        behavior: 'smooth',
      });
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentItemIndex(index);
    if (horizontalScrollRef.current) {
      const cardWidth = horizontalScrollRef.current.scrollWidth / qnas.length;
      horizontalScrollRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      <div 
        ref={horizontalScrollRef}
        className="flex overflow-hidden snap-x snap-mandatory py-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {qnas.map((qna: QnA, index: number) => {
          const isExpanded = expandedIds.has(qna.id);
          const isBookmarked = bookmarkedIds.has(qna.id);
          return (
            <div key={qna.id} className="flex-shrink-0 w-full snap-center px-4">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-gray-300 transition-all duration-300 h-full">
                <div className="p-6 sm:p-8 h-full">
                  <div
                    className="relative h-full"
                    style={{
                      transform: isExpanded ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.6s',
                    }}
                  >
                    <div
                      className="absolute inset-0 flex flex-col bg-gradient-to-br from-white to-gray-50 rounded-xl"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <h3 className="text-xl font-semibold text-gray-900 flex-1">
                          {qna.question}
                        </h3>
                        <button
                          onClick={() => toggleBookmark(qna.id)}
                          className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Star
                            className={`w-5 h-5 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                          />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(qna.level)}`}
                        >
                          {formatDifficulty(qna.level)}
                        </span>
                        {qna.companyTags.map((company: string) => (
                          <span
                            key={company}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto pt-2 flex justify-between items-center">
                        <button
                          onClick={() => toggleExpand(qna.id)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
                        >
                          <ChevronDown className="w-5 h-5" />
                          Show Answer
                        </button>
                        <div className="text-sm text-gray-500">
                          {index + 1} of {qnas.length}
                        </div>
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 flex flex-col bg-white rounded-xl p-2"
                      style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-base font-semibold text-gray-900 flex-1">
                          Answer
                        </h3>
                        <button
                          onClick={() => toggleBookmark(qna.id)}
                          className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Star
                            className={`w-5 h-5 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                          />
                        </button>
                      </div>
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg flex-1 overflow-auto">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{qna.answer}</p>
                        {qna.exampleCode && (
                          <pre className="bg-gray-900 text-gray-100 text-sm p-4 rounded-lg overflow-x-auto mt-4">
                            {qna.exampleCode}
                          </pre>
                        )}
                      </div>
                      <div className="mt-auto pt-2 flex justify-start">
                        <button
                          onClick={() => toggleExpand(qna.id)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
                        >
                          <ChevronUp className="w-5 h-5" />
                          Hide Answer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Navigation buttons */}
      <button
        onClick={handlePrevious}
        disabled={currentItemIndex === 0}
        className="hidden sm:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur shadow ring-1 ring-gray-200 hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Previous question"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={handleNext}
        disabled={currentItemIndex === qnas.length - 1}
        className="hidden sm:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur shadow ring-1 ring-gray-200 hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Next question"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>
      
      {/* Progress bar and navigation */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="w-full max-w-md h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${qnas.length ? ((currentItemIndex + 1) / qnas.length) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentItemIndex === 0}
            className="px-5 py-2 bg-white border border-gray-300 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Previous question"
          >
            Previous
          </button>
          <div className="flex gap-2 bg-white py-2 px-4 rounded-lg shadow-sm border border-gray-100">
            {qnas.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentItemIndex === index ? 'bg-gray-800 scale-125' : 'bg-gray-200 hover:bg-gray-300'}`}
                aria-label={`Go to question ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={currentItemIndex === qnas.length - 1}
            className="px-5 py-2 bg-white border border-gray-300 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Next question"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
