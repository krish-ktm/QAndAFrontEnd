import { motion } from 'framer-motion';
import { Flashcard } from '../../types/api';
import { RotateCw, Check, X } from 'lucide-react';

interface FlashcardCardProps {
  flashcard: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  onMarkMastered: (id: string, mastered: boolean) => void;
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

export const FlashcardCard = ({ flashcard, isFlipped, onFlip, onMarkMastered }: FlashcardCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="relative w-full h-96 perspective-1000">
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
          className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-8 flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-start justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(flashcard.difficulty)}`}>
              {flashcard.difficulty}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Flip card"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-3 font-medium">Question</div>
              <p className="text-xl font-semibold text-gray-900 leading-relaxed">
                {flashcard.front}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">{flashcard.category}</span>
            <div className="text-xs text-gray-400">Click to flip</div>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl border border-blue-200 p-8 flex flex-col"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(flashcard.difficulty)}`}>
              {flashcard.difficulty}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
              className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
              title="Flip card"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm text-blue-600 mb-3 font-medium">Answer</div>
              <p className="text-xl font-medium text-gray-900 leading-relaxed">
                {flashcard.back}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-blue-100">
            <span className="text-sm text-blue-600 font-medium">{flashcard.category}</span>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkMastered(flashcard.id, false);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  !flashcard.mastered 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                title="Mark as not mastered"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkMastered(flashcard.id, true);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  flashcard.mastered 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                title="Mark as mastered"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
