import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shuffle, RotateCw, BookOpen, Filter, ChevronDown, Play, Pause, X, Check } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Flashcard, Topic } from '../../types/api';
import { FlashcardCard } from './FlashcardCard';

interface FlashcardSectionProps {
  productId: string;
}

export const FlashcardSection = ({ productId }: FlashcardSectionProps) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Fetch topics for the product
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await apiService.getTopics(productId);
        if (response.success) {
          setTopics(response.data);
        } else {
          setError(response.message || 'Failed to load topics');
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('An error occurred while loading topics');
      }
    };
    
    fetchTopics();
  }, [productId]);

  // Fetch flashcards for the product
  useEffect(() => {
    const fetchFlashcards = async () => {
      setLoading(true);
      try {
        const response = await apiService.getFlashcards(productId);
        if (response.success) {
          setFlashcards(response.data);
        } else {
          setError(response.message || 'Failed to load flashcards');
        }
      } catch (err) {
        console.error('Error fetching flashcards:', err);
        setError('An error occurred while loading flashcards');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlashcards();
  }, [productId]);

  // Filter flashcards by topic
  const filteredFlashcards = useMemo(() => {
    if (selectedTopicId === 'all') {
      return flashcards;
    }
    return flashcards.filter(fc => fc.topicId === selectedTopicId);
  }, [flashcards, selectedTopicId]);

  // Apply shuffle if enabled
  const displayFlashcards = useMemo(() => {
    if (!shuffleMode) {
      return filteredFlashcards;
    }
    // Create a shuffled copy
    const shuffled = [...filteredFlashcards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [filteredFlashcards, shuffleMode]);

  // Reset to first card when filters change
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsAutoPlaying(false);
  }, [selectedTopicId, shuffleMode]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && displayFlashcards.length > 0) {
      const interval = setInterval(() => {
        if (isFlipped) {
          // Move to next card if currently showing answer
          if (currentIndex < displayFlashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
          } else {
            // Stop at the end
            setIsAutoPlaying(false);
          }
        } else {
          // Flip to show answer
          setIsFlipped(true);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, currentIndex, isFlipped, displayFlashcards.length]);

  const handleNext = () => {
    if (currentIndex < displayFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    setShuffleMode(!shuffleMode);
  };

  const handleMarkMastered = (id: string, mastered: boolean) => {
    setFlashcards(prev => 
      prev.map(fc => 
        fc.id === id ? { ...fc, mastered } : fc
      )
    );
  };

  const progress = displayFlashcards.length > 0 
    ? ((currentIndex + 1) / displayFlashcards.length) * 100 
    : 0;

  const masteredCount = displayFlashcards.filter(fc => fc.mastered).length;
  const accuracy = displayFlashcards.length > 0 ? (masteredCount / displayFlashcards.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (displayFlashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Flashcards Available</h2>
          <p className="text-gray-600">
            {selectedTopicId === 'all' 
              ? "There are no flashcards for this product yet."
              : "There are no flashcards for this topic yet."}
          </p>
        </div>
      </div>
    );
  }

  const currentFlashcard = displayFlashcards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Simple Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Flashcards</h1>
            </div>
            <p className="text-gray-600">Master your knowledge with interactive learning</p>
          </motion.div>

          {/* Simple Controls Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Topic Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="pl-10 pr-8 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
                >
                  <option value="all">All Topics ({flashcards.length})</option>
                  {topics.map((topic) => {
                    const count = flashcards.filter(fc => fc.topicId === topic.id).length;
                    if (count === 0) return null;
                    return (
                      <option key={topic.id} value={topic.id}>
                        {topic.name} ({count})
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>

              {/* Study Options */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleShuffle}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    shuffleMode
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Shuffle className="w-3 h-3" />
                  {shuffleMode ? 'Shuffled' : 'Shuffle'}
                </motion.button>

                <motion.button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isAutoPlaying
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {isAutoPlaying ? 'Pause' : 'Auto Play'}
                </motion.button>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">{currentIndex + 1}/{displayFlashcards.length}</span>
                <span className="text-green-600 font-medium">{masteredCount} mastered</span>
                <span className="text-blue-600 font-medium">{accuracy.toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>
          {/* Progress Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">{progress.toFixed(0)}% Complete</span>
                <span className="text-xs text-gray-500">{currentIndex + 1} of {displayFlashcards.length}</span>
              </div>
            </div>
          </motion.div>

          {/* Flashcard Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedTopicId}-${currentIndex}-${shuffleMode}`}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.9 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <FlashcardCard
                  flashcard={currentFlashcard}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(!isFlipped)}
                  onMarkMastered={handleMarkMastered}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4"
          >
            <motion.button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
              whileHover={{ scale: currentIndex === 0 ? 1 : 1.05 }}
              whileTap={{ scale: currentIndex === 0 ? 1 : 0.95 }}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </motion.button>

            <motion.button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCw className="w-4 h-4" />
              Flip Card
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={currentIndex === displayFlashcards.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
              whileHover={{ scale: currentIndex === displayFlashcards.length - 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentIndex === displayFlashcards.length - 1 ? 1 : 0.95 }}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </motion.button>

            {/* Quick Master/Unmaster */}
            <motion.button
              onClick={() => {
                handleMarkMastered(currentFlashcard.id, !currentFlashcard.mastered);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentFlashcard.mastered
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentFlashcard.mastered ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              {currentFlashcard.mastered ? 'Unmark' : 'Master'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
