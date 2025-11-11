import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { QnA } from '../../types/api';

interface QnACardVerticalProps {
  qna: QnA;
  isExpanded: boolean;
  toggleExpand: (id: string) => void;
  isBookmarked: boolean;
  toggleBookmark: (id: string) => void;
  getDifficultyColor: (level: string) => string;
}

export const QnACardVertical = ({
  qna,
  isExpanded,
  toggleExpand,
  isBookmarked,
  toggleBookmark,
  getDifficultyColor,
}: QnACardVerticalProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-300">
    <div className="p-6 relative">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">{qna.question}</h3>
        <button onClick={() => toggleBookmark(qna.id)} className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition">
          <Star className={`w-5 h-5 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(qna.level)}`}>{qna.level.charAt(0) + qna.level.slice(1).toLowerCase()}</span>
        {qna.companyTags.map((company) => (
          <span key={company} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
            {company}
          </span>
        ))}
      </div>

      {isExpanded && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{qna.answer}</p>
          {qna.exampleCode && (
            <pre className="bg-gray-800 text-gray-100 text-sm p-4 rounded-lg overflow-x-auto">{qna.exampleCode}</pre>
          )}
        </div>
      )}

      <button onClick={() => toggleExpand(qna.id)} className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition">
        {isExpanded ? (
          <>
            <ChevronUp className="w-5 h-5" /> Hide Answer
          </>
        ) : (
          <>
            <ChevronDown className="w-5 h-5" /> Show Answer
          </>
        )}
      </button>
    </div>
  </div>
);
