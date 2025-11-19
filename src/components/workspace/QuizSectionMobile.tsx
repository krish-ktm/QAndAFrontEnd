import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy, ArrowLeft } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Quiz, QuizGroup } from '../../types/api';
import { QuizGroupViewMobile } from './QuizGroupViewMobile';
import { AnimatedPage } from '../ui/AnimatedPage';

interface QuizSectionMobileProps {
    productId: string;
}

interface LocalQuizAttempt {
    quizId: string;
    selectedAnswer: string;
    isCorrect: boolean;
}

export const QuizSectionMobile = ({ productId }: QuizSectionMobileProps) => {
    // Flow state
    const [view, setView] = useState<'groups' | 'active'>('groups');
    const [selectedQuizGroup, setSelectedQuizGroup] = useState<QuizGroup | null>(null);

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
            setView('active'); // Switch view immediately to trigger transition
            const response = await apiService.getQuizzes(productId, { quizGroupId: quizGroup.id });
            if (response.success) {
                setSelectedQuizGroup(quizGroup);
                setQuizzes(response.data.items);
                setCurrentQuizIndex(0);
                setSelectedAnswer(null);
                setAttempts([]);
            } else {
                setError(response.message || 'Failed to load quizzes');
                setView('groups'); // Go back to groups on error
            }
        } catch (err) {
            console.error('Error fetching quizzes for group:', err);
            setError('An error occurred while loading quizzes');
            setView('groups'); // Go back to groups on error
        } finally {
            setLoading(false);
        }
    };

    // Handle going back to quiz groups
    const handleBackToGroups = () => {
        setLoading(true); // Add loading state for smoother transition
        setTimeout(() => {
            setView('groups');
            setSelectedQuizGroup(null);
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
                <div className="p-4">
                    {/* Header with Score */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 text-center">
                        <div className="mb-6">
                            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">Quiz Complete!</h2>
                            <p className="text-sm text-gray-600">Great job!</p>
                        </div>

                        <div className="mb-6">
                            <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-6 mb-3">
                                <p className="text-4xl font-bold text-white">{score}%</p>
                            </div>
                            <p className="text-gray-700">
                                <span className="font-bold text-blue-600">{correctAnswers}</span> / <span className="font-bold">{totalQuizzes}</span> correct
                            </p>
                        </div>

                        <div className="flex justify-center gap-4 mb-4">
                            <div className="text-center bg-green-50 p-2 rounded-lg min-w-[80px]">
                                <p className="text-xl font-bold text-green-600">{correctAnswers}</p>
                                <p className="text-xs text-gray-600">Correct</p>
                            </div>
                            <div className="text-center bg-red-50 p-2 rounded-lg min-w-[80px]">
                                <p className="text-xl font-bold text-red-600">{totalQuizzes - correctAnswers}</p>
                                <p className="text-xs text-gray-600">Incorrect</p>
                            </div>
                        </div>
                    </div>

                    {/* All Questions and Answers */}
                    <div className="space-y-4 pb-20">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Review Answers</h3>

                        {quizzes.map((quiz, index) => {
                            const attempt = attempts.find(a => a.quizId === quiz.id);
                            const isCorrect = attempt?.isCorrect || false;
                            const selectedAnswer = attempt?.selectedAnswer || '';

                            return (
                                <div
                                    key={quiz.id}
                                    className={`bg-white rounded-xl shadow-sm border p-4 ${isCorrect ? 'border-green-200' : 'border-red-200'
                                        }`}
                                >
                                    {/* Question Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <h3 className="text-sm font-semibold text-gray-900">Question {index + 1}</h3>
                                        </div>
                                        {isCorrect ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-600" />
                                        )}
                                    </div>

                                    {/* Question */}
                                    <p className="text-gray-900 mb-3 text-sm font-medium">{quiz.question}</p>

                                    {/* Options */}
                                    <div className="space-y-2 mb-3">
                                        {quiz.options.map((option, optionIndex) => {
                                            const optionLetter = String.fromCharCode(65 + optionIndex);
                                            const isUserSelection = optionLetter === selectedAnswer;
                                            const isCorrectAnswer = optionLetter === quiz.correctAnswer;

                                            return (
                                                <div
                                                    key={optionIndex}
                                                    className={`flex items-center p-2 rounded-lg border text-sm ${isCorrectAnswer
                                                        ? 'bg-green-50 border-green-200'
                                                        : isUserSelection
                                                            ? 'bg-red-50 border-red-200'
                                                            : 'bg-gray-50 border-gray-200'
                                                        }`}
                                                >
                                                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium mr-2 flex-shrink-0 ${isCorrectAnswer
                                                        ? 'bg-green-200 text-green-800'
                                                        : isUserSelection
                                                            ? 'bg-red-200 text-red-800'
                                                            : 'bg-gray-200 text-gray-600'
                                                        }`}>
                                                        {optionLetter}
                                                    </span>
                                                    <span className={`flex-1 ${isCorrectAnswer ? 'text-green-900 font-medium' :
                                                        isUserSelection ? 'text-red-900' : 'text-gray-700'
                                                        }`}>
                                                        {option}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation */}
                                    {quiz.explanation && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                                            <h4 className="font-semibold text-blue-900 mb-1 text-xs">Explanation:</h4>
                                            <p className="text-blue-800 text-xs">{quiz.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Buttons - Fixed Bottom */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex gap-3 z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <button
                            onClick={handleRestart}
                            className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Restart
                        </button>
                        <button
                            onClick={handleBackToGroups}
                            className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    </div>
                </div>
            </AnimatedPage>
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
            <div className="flex flex-col h-full">
                <div className="p-4 pb-0">
                    {/* Back Button */}
                    <button
                        onClick={handleBackToGroups}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium">Back to Groups</span>
                    </button>

                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-xl font-bold text-gray-900">Quiz Challenge</h1>
                            <span className="text-xs font-medium text-gray-600">
                                {currentQuizIndex + 1} / {totalQuizzes}
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuizIndex + 1) / totalQuizzes) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 pt-0 pb-24">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">{currentQuiz.question}</h2>

                        <div className="grid grid-cols-1 gap-3 mb-4">
                            {currentQuiz.options.map((option, index) => {
                                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...
                                const isSelected = selectedAnswer === optionLetter;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedAnswer(optionLetter)}
                                        className={`flex items-center p-4 border rounded-xl transition-all text-left relative overflow-hidden ${isSelected
                                            ? 'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500'
                                            : 'border-gray-200 active:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4 w-full relative z-10">
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 text-sm font-bold transition-colors ${isSelected
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {optionLetter}
                                            </span>
                                            <span className={`font-medium text-base pt-1 ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                                                {option}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Fixed Bottom Button */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 active:scale-[0.98] transform"
                    >
                        {isLastQuiz ? 'Submit Quiz' : 'Next Question'}
                    </button>
                </div>
            </div>
        </AnimatedPage>
    );
};
