import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shuffle, RotateCw, BookOpen, Filter } from 'lucide-react';
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
  }, [selectedTopicId, shuffleMode]);

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
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Flashcards</h1>
          </div>
          <p className="text-gray-600">Test your knowledge with interactive flashcards</p>
        </div>

        {/* Topic Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">Filter by Topic:</label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTopicId('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTopicId === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Topics ({flashcards.length})
            </button>
            {topics.map((topic) => {
              const count = flashcards.filter(fc => fc.topicId === topic.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTopicId === topic.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {topic.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Card {currentIndex + 1} of {displayFlashcards.length}
            </span>
            <span className="text-sm text-gray-600">
              {masteredCount} mastered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedTopicId}-${currentIndex}-${shuffleMode}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <FlashcardCard
                flashcard={currentFlashcard}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
                onMarkMastered={handleMarkMastered}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCw className="w-5 h-5" />
            Flip Card
          </button>

          <button
            onClick={handleShuffle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              shuffleMode
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Shuffle className="w-5 h-5" />
            {shuffleMode ? 'Shuffled' : 'Shuffle'}
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === displayFlashcards.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
