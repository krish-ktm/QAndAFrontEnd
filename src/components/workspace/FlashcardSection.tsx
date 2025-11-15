import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shuffle, RotateCw, BookOpen, Filter, TrendingUp } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Flashcard, Topic } from '../../types/api';
import { FlashcardCard } from './FlashcardCard';
import { Dropdown } from '../ui/Dropdown';

interface FlashcardSectionProps {
  productId: string;
}

export const FlashcardSection = ({ productId }: FlashcardSectionProps) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
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

  // Filter flashcards by topic and difficulty
  const filteredFlashcards = useMemo(() => {
    let filtered = flashcards;
    
    // Filter by topic
    if (selectedTopicId !== 'all') {
      filtered = filtered.filter(fc => fc.topicId === selectedTopicId);
    }
    
    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(fc => fc.difficulty.toLowerCase() === selectedDifficulty);
    }
    
    return filtered;
  }, [flashcards, selectedTopicId, selectedDifficulty]);

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
  }, [selectedTopicId, selectedDifficulty, shuffleMode]);

  // Create dropdown options for topics
  const topicOptions = useMemo(() => {
    const options = [
      { value: 'all', label: `All Topics (${flashcards.length})` }
    ];
    
    topics.forEach((topic) => {
      const count = flashcards.filter(fc => fc.topicId === topic.id).length;
      if (count > 0) {
        options.push({
          value: topic.id,
          label: `${topic.name} (${count})`
        });
      }
    });
    
    return options;
  }, [topics, flashcards]);

  // Create dropdown options for difficulty
  const difficultyOptions = useMemo(() => {
    const options = [
      { value: 'all', label: 'All Levels' },
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' }
    ];
    
    return options;
  }, []);


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

  const progress = displayFlashcards.length > 0 
    ? ((currentIndex + 1) / displayFlashcards.length) * 100 
    : 0;

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
              {/* Filters */}
              <div className="flex gap-3 flex-1">
                {/* Topic Filter */}
                <div className="min-w-64">
                  <Dropdown
                    options={topicOptions}
                    value={selectedTopicId}
                    onChange={setSelectedTopicId}
                    placeholder="Select a topic"
                    icon={<Filter className="w-4 h-4" />}
                    className="w-full"
                  />
                </div>

                {/* Difficulty Filter */}
                <div className="min-w-48">
                  <Dropdown
                    options={difficultyOptions}
                    value={selectedDifficulty}
                    onChange={setSelectedDifficulty}
                    placeholder="Select difficulty"
                    icon={<TrendingUp className="w-4 h-4" />}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Study Options */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleShuffle}
                  title="Randomize the order of flashcards for better learning"
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

              </div>

              {/* Progress */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">{currentIndex + 1}/{displayFlashcards.length}</span>
                <span className="text-blue-600 font-medium">{progress.toFixed(0)}%</span>
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

          </motion.div>
        </div>
      </div>
    </div>
  );
};
