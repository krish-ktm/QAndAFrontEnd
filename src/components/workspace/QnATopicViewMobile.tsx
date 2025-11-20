import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ChevronRight, BookOpen } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Topic } from '../../types/api';

interface QnATopicViewMobileProps {
    productId: string;
    onSelectTopic: (topicId: string) => void;
}

export const QnATopicViewMobile = ({ productId, onSelectTopic }: QnATopicViewMobileProps) => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                setLoading(true);
                const response = await apiService.getTopics(productId);
                if (response.success) {
                    setTopics(response.data);
                } else {
                    setError(response.message || 'Failed to load topics');
                }
            } catch (err) {
                console.error('Error fetching topics:', err);
                setError('An error occurred while loading topics');
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, [productId]);

    const handleTopicClick = (topic: Topic) => {
        setSelectedTopicId(topic.id);
        // Small delay to show selection state
        setTimeout(() => {
            onSelectTopic(topic.id);
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

    if (topics.length === 0) {
        return (
            <div className="p-4">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-center">
                    <h3 className="text-sm font-medium mb-1">No Topics</h3>
                    <p className="text-sm">No topics available yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-gray-50 min-h-full">
            <div className="p-4 space-y-3 pb-6">
                {topics.map((topic, index) => (
                    <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTopicClick(topic)}
                        className={`bg-white rounded-xl p-4 border shadow-sm relative overflow-hidden transition-all ${selectedTopicId === topic.id
                            ? 'border-blue-500 ring-1 ring-blue-500 shadow-md'
                            : 'border-gray-200 active:border-blue-300'
                            }`}
                    >
                        {/* Selection Indicator Background */}
                        {selectedTopicId === topic.id && (
                            <motion.div
                                layoutId="selection"
                                className="absolute inset-0 bg-blue-50 opacity-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                            />
                        )}

                        <div className="relative z-10 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedTopicId === topic.id
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                                        {topic.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                                        <MessageSquare className="w-3 h-3" />
                                        View Questions
                                    </p>
                                </div>
                            </div>

                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${selectedTopicId === topic.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-50 text-gray-400'
                                }`}>
                                {selectedTopicId === topic.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                    <ChevronRight className="w-5 h-5" />
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
