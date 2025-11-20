import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Clock, Play } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { QuizGroup } from '../../types/api';
import { getDifficultyColor, formatDifficulty } from './utils/qnaUtils';

interface QuizGroupViewMobileProps {
    productId: string;
    onSelectQuizGroup: (quizGroup: QuizGroup) => void;
}

export const QuizGroupViewMobile = ({ productId, onSelectQuizGroup }: QuizGroupViewMobileProps) => {
    const [quizGroups, setQuizGroups] = useState<QuizGroup[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizGroups = async () => {
            try {
                setLoading(true);
                const response = await apiService.getQuizGroups(productId);
                if (response.success) {
                    setQuizGroups(response.data);
                } else {
                    setError(response.message || 'Failed to load quiz groups');
                }
            } catch (err) {
                console.error('Error fetching quiz groups:', err);
                setError('An error occurred while loading quiz groups');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizGroups();
    }, [productId]);

    const handleQuizGroupClick = (quizGroup: QuizGroup) => {
        setSelectedGroupId(quizGroup.id);
        // Small delay to show selection state
        setTimeout(() => {
            onSelectQuizGroup(quizGroup);
        }, 200);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12 h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    <h3 className="text-sm font-medium mb-1">Error</h3>
                    <p className="text-sm">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (quizGroups.length === 0) {
        return (
            <div className="p-4">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-center">
                    <h3 className="text-sm font-medium mb-1">No Quiz Groups</h3>
                    <p className="text-sm">No quizzes available yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-gray-50 min-h-full">
            <div className="p-4 space-y-3 pb-6">
                {quizGroups.map((quizGroup, index) => (
                    <motion.div
                        key={quizGroup.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuizGroupClick(quizGroup)}
                        className={`bg-white rounded-xl p-4 border shadow-sm relative overflow-hidden transition-all ${selectedGroupId === quizGroup.id
                            ? 'border-blue-500 ring-1 ring-blue-500 shadow-md'
                            : 'border-gray-200 active:border-blue-300'
                            }`}
                    >
                        {/* Selection Indicator Background */}
                        {selectedGroupId === quizGroup.id && (
                            <div
                                className="absolute inset-0 bg-blue-50 opacity-50 transition-opacity duration-200"
                            />
                        )}

                        <div className="relative z-10 flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 mb-1">
                                    <h2 className="text-base font-bold text-gray-900 line-clamp-2">
                                        {quizGroup.name}
                                    </h2>
                                </div>

                                <p className="text-sm text-gray-500 line-clamp-2 mb-3 font-medium">
                                    {quizGroup.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 font-medium">
                                    {quizGroup.level && (
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getDifficultyColor(quizGroup.level)}`}>
                                            {formatDifficulty(quizGroup.level)}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {quizGroup.estimatedDuration ? `${quizGroup.estimatedDuration}m` : '-'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Book className="w-3 h-3" />
                                        Quiz
                                    </span>
                                </div>
                            </div>

                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${selectedGroupId === quizGroup.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'bg-gray-100 text-gray-400'
                                }`}>
                                {selectedGroupId === quizGroup.id ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
