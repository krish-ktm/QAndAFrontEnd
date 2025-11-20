import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X, BookOpen } from 'lucide-react';
import { Topic } from '../../types/api';

interface TopicSelectorMobileProps {
    topics: Topic[];
    selectedTopicId: string;
    onSelectTopic: (topicId: string) => void;
}

export const TopicSelectorMobile = ({ topics, selectedTopicId, onSelectTopic }: TopicSelectorMobileProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedTopic = topics.find(t => t.id === selectedTopicId);

    const handleSelect = (topicId: string) => {
        onSelectTopic(topicId);
        setIsOpen(false);
    };

    return (
        <>
            {/* Sticky Header Trigger */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-white active:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="text-left min-w-0">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Current Topic</p>
                            <h2 className="text-sm font-bold text-gray-900 truncate">
                                {selectedTopic?.name || 'Select Topic'}
                            </h2>
                        </div>
                    </div>
                    <div className="bg-gray-100 p-1.5 rounded-full text-gray-500">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </button>
            </div>

            {/* Bottom Sheet Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        />

                        {/* Sheet */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] flex flex-col shadow-xl"
                        >
                            {/* Sheet Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Select Topic</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Topic List */}
                            <div className="overflow-y-auto p-4 space-y-2 pb-safe">
                                {topics.map((topic) => {
                                    const isSelected = selectedTopicId === topic.id;
                                    return (
                                        <button
                                            key={topic.id}
                                            onClick={() => handleSelect(topic.id)}
                                            className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${isSelected
                                                ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200'
                                                : 'bg-gray-50 border-transparent text-gray-700 hover:bg-gray-100'
                                                } border`}
                                        >
                                            <span className="font-bold text-sm text-left">{topic.name}</span>
                                            {isSelected && (
                                                <div className="bg-blue-200 p-1 rounded-full">
                                                    <Check className="w-3 h-3 text-blue-700" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
