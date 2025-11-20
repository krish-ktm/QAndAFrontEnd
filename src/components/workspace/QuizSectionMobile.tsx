import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../../services/apiService';
import { Quiz, QuizGroup } from '../../types/api';
import { QuizGroupViewMobile } from './QuizGroupViewMobile';
import { AnimatedPage } from '../ui/AnimatedPage';

interface QuizSectionMobileProps {
    productId: string;
    view: 'groups' | 'active';
    onViewChange: (view: 'groups' | 'active') => void;
}

interface LocalQuizAttempt {
    quizId: string;
    selectedAnswer: string;
    isCorrect: boolean;
}

export const QuizSectionMobile = ({ productId, view, onViewChange }: QuizSectionMobileProps) => {
    // Quiz state
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [attempts, setAttempts] = useState<LocalQuizAttempt[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Handle quiz group selection - directly start quizzes for the selected group
    const handleSelectQuizGroup = async (quizGroup: QuizGroup) => {
        try {
            setLoading(true);
            onViewChange('active'); // Switch view immediately to trigger transition
            const response = await apiService.getQuizzes(productId, { quizGroupId: quizGroup.id });
            if (response.success) {
                setQuizzes(response.data.items);
                setCurrentQuizIndex(0);
                setSelectedAnswer(null);
                setAttempts([]);
            } else {
                setError(response.message || 'Failed to load quizzes');
                onViewChange('groups'); // Go back to groups on error
            }
        } catch (err) {
            console.error('Error fetching quizzes for group:', err);
            setError('An error occurred while loading quizzes');
            onViewChange('groups'); // Go back to groups on error
        } finally {
            setLoading(false);
        }
    };

    // Handle going back to quiz groups
    const handleBackToGroups = () => {
        setLoading(true); // Add loading state for smoother transition
        setTimeout(() => {
            onViewChange('groups');
            setQuizzes([]);
            setCurrentQuizIndex(0);
            setSelectedAnswer(null);
            setAttempts([]);
            setError(null);
            setLoading(false);
        }, 150); // Small delay for smooth transition
    };

    const currentQuiz = quizzes[currentQuizIndex];
    const isLastQuiz = currentQuizIndex === quizzes.length - 1;
    const isQuizCompleted = attempts.length === quizzes.length;

    const correctAnswers = attempts.filter((a) => a.isCorrect).length;
    const totalQuizzes = quizzes.length;
    const score = totalQuizzes > 0 ? Math.round((correctAnswers / totalQuizzes) * 100) : 0;

    // Track time taken to answer
    const [startTime, setStartTime] = useState<number | null>(null);

    // Set start time when a new quiz is loaded
    useEffect(() => {
        if (currentQuiz) {
            setStartTime(Date.now());
        }
    }, [currentQuiz, currentQuizIndex]);

    const handleSubmit = async () => {
        if (selectedAnswer === null || !currentQuiz) return;

        // Advance UI immediately for smooth transition
        const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
        const newAttempt: LocalQuizAttempt = {
            quizId: currentQuiz.id,
            selectedAnswer,
            isCorrect,
        };
        setAttempts([...attempts, newAttempt]);

        if (isLastQuiz) {
            setCurrentQuizIndex(currentQuizIndex + 1);
        } else {
            setCurrentQuizIndex(currentQuizIndex + 1);
            setSelectedAnswer(null);
        }

        // Submit in background (no await) to avoid blocking UI
        (async () => {
            try {
                const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 30;
                await apiService.submitQuizAnswer(productId, currentQuiz.id, {
                    selectedAnswer,
                    timeTaken,
                });
            } catch (err) {
                console.error('Error submitting answer:', err);
            }
        })();
    };

    const handleRestart = () => {
        setCurrentQuizIndex(0);
        setSelectedAnswer(null);
        setAttempts([]);
    };

    // Show the appropriate view based on the current state
    if (view === 'groups') {
        return (
            <AnimatedPage>
                <div className="h-full">
                    <QuizGroupViewMobile productId={productId} onSelectQuizGroup={handleSelectQuizGroup} />
                </div>
            </AnimatedPage>
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
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <div className="p-4 text-center py-12">
                <p className="text-gray-600">No quizzes available for this product</p>
            </div>
        );
    }

    // Check if quiz is completed FIRST, before checking currentQuiz
    if (isQuizCompleted) {
        return (
            <AnimatedPage>
                <div className="flex flex-col h-full bg-gray-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex-1 overflow-y-auto p-4 pb-32"
                    >
                        {/* Header with Score */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-4 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                            <div className="mb-6 relative">
                                <div className="absolute inset-0 bg-yellow-100 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3 relative z-10 drop-shadow-sm" />
                                <h2 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">Quiz Complete!</h2>
                                <p className="text-sm text-gray-500 font-medium">You've mastered this topic!</p>
                            </div>

                            <div className="mb-6">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full shadow-xl shadow-blue-500/30 mb-3 ring-4 ring-blue-50">
                                    <p className="text-4xl font-black text-white tracking-tighter">{score}%</p>
                                </div>
                                <p className="text-gray-600 font-medium text-base">
                                    <span className="font-bold text-blue-600 text-lg">{correctAnswers}</span> <span className="text-gray-400">/</span> <span className="font-bold text-gray-900 text-lg">{totalQuizzes}</span> correct
                                </p>
                            </div>

                            <div className="flex justify-center gap-3">
                                <div className="text-center bg-green-50 p-3 rounded-xl min-w-[90px] border border-green-100">
                                    <p className="text-xl font-black text-green-600 mb-0.5">{correctAnswers}</p>
                                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Correct</p>
                                </div>
                                <div className="text-center bg-red-50 p-3 rounded-xl min-w-[90px] border border-red-100">
                                    <p className="text-xl font-black text-red-600 mb-0.5">{totalQuizzes - correctAnswers}</p>
                                    <p className="text-[10px] font-bold text-red-700 uppercase tracking-wide">Incorrect</p>
                                </div>
                            </div>
                        </div>

                        {/* All Questions and Answers */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 px-1">Review Answers</h3>

                            {quizzes.map((quiz, index) => {
                                const attempt = attempts.find(a => a.quizId === quiz.id);
                                const isCorrect = attempt?.isCorrect || false;
                                const selectedAnswer = attempt?.selectedAnswer || '';

                                return (
                                    <div
                                        key={quiz.id}
                                        className={`bg-white rounded-2xl shadow-sm border-2 p-5 ${isCorrect ? 'border-green-100' : 'border-red-100'
                                            }`}
                                    >
                                        {/* Question Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Question {index + 1}</h3>
                                            </div>
                                            {isCorrect ? (
                                                <div className="bg-green-100 p-1.5 rounded-full">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                </div>
                                            ) : (
                                                <div className="bg-red-100 p-1.5 rounded-full">
                                                    <XCircle className="w-5 h-5 text-red-600" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Question */}
                                        <p className="text-gray-900 mb-4 text-base font-bold leading-snug">{quiz.question}</p>

                                        {/* Options */}
                                        <div className="space-y-2.5 mb-4">
                                            {quiz.options.map((option, optionIndex) => {
                                                const optionLetter = String.fromCharCode(65 + optionIndex);
                                                const isUserSelection = optionLetter === selectedAnswer;
                                                const isCorrectAnswer = optionLetter === quiz.correctAnswer;

                                                return (
                                                    <div
                                                        key={optionIndex}
                                                        className={`flex items-center p-3 rounded-xl border text-sm font-medium transition-colors ${isCorrectAnswer
                                                            ? 'bg-green-50 border-green-200'
                                                            : isUserSelection
                                                                ? 'bg-red-50 border-red-200'
                                                                : 'bg-gray-50 border-gray-100 text-gray-500'
                                                            }`}
                                                    >
                                                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 flex-shrink-0 ${isCorrectAnswer
                                                            ? 'bg-green-200 text-green-800'
                                                            : isUserSelection
                                                                ? 'bg-red-200 text-red-800'
                                                                : 'bg-gray-200 text-gray-500'
                                                            }`}>
                                                            {optionLetter}
                                                        </span>
                                                        <span className={`flex-1 ${isCorrectAnswer ? 'text-green-900 font-bold' :
                                                            isUserSelection ? 'text-red-900 font-bold' : ''
                                                            }`}>
                                                            {option}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Explanation */}
                                        {quiz.explanation && (
                                            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                                    <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wide">Explanation</h4>
                                                </div>
                                                <p className="text-blue-800 text-sm leading-relaxed">{quiz.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Action Buttons - Fixed Bottom */}
                    <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 flex gap-4 z-40 pb-safe shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
                        <button
                            onClick={handleRestart}
                            className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-base shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Restart
                        </button>
                        <button
                            onClick={handleBackToGroups}
                            className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2 text-base active:scale-[0.98]"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </button>
                    </div>
                </div>
            </AnimatedPage >
        );
    }

    if (!currentQuiz) {
        return (
            <div className="p-4 text-center py-12">
                <p className="text-gray-600">Quiz not found</p>
            </div>
        );
    }

    // Loading state for active quiz
    if (loading && quizzes.length === 0) {
        return (
            <div className="p-4 text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-sm">Loading quiz...</p>
            </div>
        );
    }

    return (
        <AnimatedPage>
            <div className="flex flex-col h-full bg-gray-50">
                {/* Status Bar */}
                <div className="px-4 py-3 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] z-10">
                    <div className="flex items-end justify-between mb-2">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progress</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-blue-600 leading-none">
                                {currentQuizIndex + 1}
                                <span className="text-xs text-gray-400 font-medium ml-1">/ {totalQuizzes}</span>
                            </span>
                        </div>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                            style={{ width: `${((currentQuizIndex + 1) / totalQuizzes) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 pb-32">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuizIndex}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 will-change-transform"
                        >
                            <h2 className="text-lg font-bold text-gray-900 leading-snug mb-4">{currentQuiz.question}</h2>

                            <div className="grid grid-cols-1 gap-2.5">
                                {currentQuiz.options.map((option, index) => {
                                    const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...
                                    const isSelected = selectedAnswer === optionLetter;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedAnswer(optionLetter)}
                                            className={`flex items-center p-3 border-2 rounded-xl transition-all duration-200 text-left relative overflow-hidden group ${isSelected
                                                ? 'border-blue-500 bg-blue-50/50 shadow-blue-100'
                                                : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3 w-full relative z-10">
                                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 text-xs font-bold transition-all duration-200 ${isSelected
                                                    ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30'
                                                    : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                                                    }`}>
                                                    {optionLetter}
                                                </span>
                                                <span className={`font-medium text-sm pt-0.5 transition-colors ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                                                    {option}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Fixed Bottom Button */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-40 pb-safe shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3.5 rounded-xl font-bold text-base hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 active:scale-[0.98] transform disabled:shadow-none"
                    >
                        {isLastQuiz ? 'Submit Quiz' : 'Next Question'}
                    </button>
                </div>
            </div>
        </AnimatedPage>
    );
};
