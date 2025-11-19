import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shuffle, RotateCw, BookOpen, Filter, TrendingUp } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Flashcard, Topic } from '../../types/api';
import { FlashcardCard } from './FlashcardCard';
import { Dropdown } from '../ui/Dropdown';

interface FlashcardSectionMobileProps {
    productId: string;
}

export const FlashcardSectionMobile = ({ productId }: FlashcardSectionMobileProps) => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [shuffleMode, setShuffleMode] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

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
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 flex justify-center items-center h-full">
                <div className="bg-white p-6 rounded-lg shadow-md w-full">
                    <h2 className="text-lg font-bold text-red-600 mb-2">Error</h2>
                    <p className="text-sm text-gray-700">{error}</p>
                </div>
            </div>
        );
    }

    if (displayFlashcards.length === 0) {
        return (
            <div className="p-4 flex justify-center items-center h-full">
                <div className="bg-white p-6 rounded-lg shadow-md w-full text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h2 className="text-lg font-bold text-gray-900 mb-2">No Flashcards</h2>
                    <p className="text-sm text-gray-600">
                        {selectedTopicId === 'all'
                            ? "No flashcards available."
                            : "No flashcards for this topic."}
                    </p>
                </div>
            </div>
        );
    }

    const currentFlashcard = displayFlashcards[currentIndex];

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
            <div className="p-4 flex-1 flex flex-col pb-24">
                {/* Header & Controls */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold text-gray-900">Flashcards</h1>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-lg transition-colors ${showFilters || selectedTopicId !== 'all' || selectedDifficulty !== 'all'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'bg-white shadow-sm text-gray-600'
                                }`}
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>

                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="bg-white rounded-xl shadow-sm p-4 mb-4 space-y-3 overflow-hidden"
                        >
                            <Dropdown
                                options={topicOptions}
                                value={selectedTopicId}
                                onChange={setSelectedTopicId}
                                placeholder="Select Topic"
                                className="w-full"
                            />
                            <Dropdown
                                options={difficultyOptions}
                                value={selectedDifficulty}
                                onChange={setSelectedDifficulty}
                                placeholder="Select Difficulty"
                                className="w-full"
                            />
                            <button
                                onClick={handleShuffle}
                                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${shuffleMode
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <Shuffle className="w-4 h-4" />
                                {shuffleMode ? 'Shuffle On' : 'Shuffle Off'}
                            </button>
                        </motion.div>
                    )}

                    {/* Progress Bar */}
                    <div className="relative mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-[10px] text-gray-500">{currentIndex + 1} / {displayFlashcards.length}</span>
                            <span className="text-[10px] text-gray-500">{progress.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>

                {/* Flashcard Container */}
                <div className="flex-1 flex items-center justify-center mb-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${selectedTopicId}-${currentIndex}-${shuffleMode}`}
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -50, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full max-h-[400px]"
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            <FlashcardCard
                                flashcard={currentFlashcard}
                                isFlipped={isFlipped}
                                onFlip={() => setIsFlipped(!isFlipped)}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Fixed Bottom Controls */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-20 pb-safe flex gap-3">
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-xl text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium active:bg-gray-200 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium active:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                    <RotateCw className="w-5 h-5" />
                    Flip
                </button>

                <button
                    onClick={handleNext}
                    disabled={currentIndex === displayFlashcards.length - 1}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-xl text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium active:bg-gray-200 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
