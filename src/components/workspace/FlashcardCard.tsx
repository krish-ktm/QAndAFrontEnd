import { motion } from 'framer-motion';
import { Flashcard } from '../../types/api';
import { RotateCw, Clock, Eye } from 'lucide-react';

interface FlashcardCardProps {
  flashcard: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

const cardVariants = {
  front: {
    rotateY: 0,
    scale: 1,
  },
  back: {
    rotateY: 180,
    scale: 1,
  },
};

const cardTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

export const FlashcardCard = ({ flashcard, isFlipped, onFlip }: FlashcardCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'advanced':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="relative w-full h-64 sm:h-80 perspective-1000">
      <motion.div
        className="relative w-full h-full cursor-pointer"
        variants={cardVariants}
        animate={isFlipped ? 'back' : 'front'}
        transition={cardTransition}
        style={{ transformStyle: 'preserve-3d' }}
        onClick={onFlip}
      >
        {/* Front of card */}
        <motion.div
          className="absolute inset-0 bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(flashcard.difficulty)}`}>
              {flashcard.difficulty}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title="Flip card"
            >
              <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2 sm:mb-3">
                <Eye className="w-3 h-3 text-blue-500" />
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Question</div>
              </div>
              <p className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed">
                {flashcard.front}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-600 font-medium">{flashcard.category}</span>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span className="hidden sm:inline">Click to flip</span>
              <span className="sm:hidden">Tap</span>
            </div>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-xl shadow-lg border border-teal-200 p-4 sm:p-6 flex flex-col"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(flashcard.difficulty)}`}>
              {flashcard.difficulty}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
              className="p-1.5 sm:p-2 text-teal-400 hover:text-teal-600 hover:bg-white/50 rounded-lg transition-all duration-200"
              title="Flip card"
            >
              <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2 sm:mb-3">
                <Eye className="w-3 h-3 text-teal-600" />
                <div className="text-xs text-teal-600 font-semibold uppercase tracking-wide">Answer</div>
              </div>
              <p className="text-base sm:text-lg font-medium text-gray-900 leading-relaxed">
                {flashcard.back}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-teal-100">
            <span className="text-xs text-teal-700 font-semibold">{flashcard.category}</span>
            <div className="flex items-center gap-1.5 text-xs text-teal-600">
              <Clock className="w-3 h-3" />
              <span className="hidden sm:inline">Click to flip back</span>
              <span className="sm:hidden">Tap</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
