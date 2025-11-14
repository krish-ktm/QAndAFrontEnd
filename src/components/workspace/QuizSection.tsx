import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy, ArrowLeft } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Quiz, QuizGroup } from '../../types/api';
import { QuizGroupView } from './QuizGroupView';
import { AnimatedPage } from '../ui/AnimatedPage';

interface QuizSectionProps {
  productId: string;
}

interface LocalQuizAttempt {
  quizId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

export const QuizSection = ({ productId }: QuizSectionProps) => {
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
  
  // Handle quiz selection
  const handleSelectQuiz = (quiz: Quiz, allQuizzes?: Quiz[]) => {
    setView('active');
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setAttempts([]);
    setLoading(false);
    
    // If allQuizzes is provided, use that (for full quiz mode)
    // Otherwise, just use the single quiz
    setQuizzes(allQuizzes || [quiz]);
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
    
    try {
      // Calculate time taken in seconds
      const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 30;
      
      // Submit the answer to the API
      const response = await apiService.submitQuizAnswer(productId, currentQuiz.id, {
        selectedAnswer,
        timeTaken
      });
      
      if (response.success) {
        // Create a new attempt based on API response
        const newAttempt: LocalQuizAttempt = {
          quizId: currentQuiz.id,
          selectedAnswer,
          isCorrect: response.data.isCorrect,
        };
        
        setAttempts([...attempts, newAttempt]);
        
        // Move to next question or show completion
        if (isLastQuiz) {
          // Quiz completed - will show completion page
          setCurrentQuizIndex(currentQuizIndex + 1);
        } else {
          // Move to next question
          setCurrentQuizIndex(currentQuizIndex + 1);
          setSelectedAnswer(null);
        }
      } else {
        // Fallback to local checking if API fails
        const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
        
        const newAttempt: LocalQuizAttempt = {
          quizId: currentQuiz.id,
          selectedAnswer,
          isCorrect,
        };
        
        setAttempts([...attempts, newAttempt]);
        
        // Move to next question or show completion
        if (isLastQuiz) {
          // Quiz completed - will show completion page
          setCurrentQuizIndex(currentQuizIndex + 1);
        } else {
          // Move to next question
          setCurrentQuizIndex(currentQuizIndex + 1);
          setSelectedAnswer(null);
        }
        
        console.error('API Error:', response.message);
      }
    } catch (err) {
      // Fallback to local checking if API call fails
      const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
      
      const newAttempt: LocalQuizAttempt = {
        quizId: currentQuiz.id,
        selectedAnswer,
        isCorrect,
      };
      
      setAttempts([...attempts, newAttempt]);
      
      // Move to next question or show completion
      if (isLastQuiz) {
        // Quiz completed - will show completion page
        setCurrentQuizIndex(currentQuizIndex + 1);
      } else {
        // Move to next question
        setCurrentQuizIndex(currentQuizIndex + 1);
        setSelectedAnswer(null);
      }
      
      console.error('Error submitting answer:', err);
    }
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
        <QuizGroupView productId={productId} onSelectQuizGroup={handleSelectQuizGroup} />
      </AnimatedPage>
    );
  }
  

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-2">Error</h3>
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto text-center py-12">
          <p className="text-gray-600 text-lg">No quizzes available for this product</p>
        </div>
      </div>
    );
  }

  // Check if quiz is completed FIRST, before checking currentQuiz
  if (isQuizCompleted) {
    return (
      <AnimatedPage>
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header with Score */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6 text-center">
              <div className="mb-6">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                <p className="text-gray-600">Great job on completing all the questions</p>
              </div>

              <div className="mb-8">
                <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-8 mb-4">
                  <p className="text-5xl font-bold text-white">{score}%</p>
                </div>
                <p className="text-xl text-gray-700">
                  You got <span className="font-bold text-blue-600">{correctAnswers}</span> out of{' '}
                  <span className="font-bold">{totalQuizzes}</span> correct
                </p>
              </div>

              <div className="flex justify-center gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
                  <p className="text-sm text-gray-600">Correct</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{totalQuizzes - correctAnswers}</p>
                  <p className="text-sm text-gray-600">Incorrect</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{totalQuizzes}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
            </div>

            {/* All Questions and Answers */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Review Your Answers</h3>
              
              {quizzes.map((quiz, index) => {
                const attempt = attempts.find(a => a.quizId === quiz.id);
                const isCorrect = attempt?.isCorrect || false;
                const selectedAnswer = attempt?.selectedAnswer || '';

                return (
                  <div
                    key={quiz.id}
                    className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
                      isCorrect ? 'border-green-200' : 'border-red-200'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Question {index + 1}</h3>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Incorrect
                          </>
                        )}
                      </div>
                    </div>

                    {/* Question */}
                    <p className="text-gray-900 mb-4 font-medium">{quiz.question}</p>

                    {/* Options */}
                    <div className="space-y-2 mb-4">
                      {quiz.options.map((option, optionIndex) => {
                        const optionLetter = String.fromCharCode(65 + optionIndex);
                        const isUserSelection = optionLetter === selectedAnswer;
                        const isCorrectAnswer = optionLetter === quiz.correctAnswer;

                        return (
                          <div
                            key={optionIndex}
                            className={`flex items-center p-3 rounded-lg border ${
                              isCorrectAnswer
                                ? 'bg-green-50 border-green-200'
                                : isUserSelection
                                ? 'bg-red-50 border-red-200'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium mr-3 ${
                              isCorrectAnswer
                                ? 'bg-green-200 text-green-800'
                                : isUserSelection
                                ? 'bg-red-200 text-red-800'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {optionLetter}
                            </span>
                            <span className={`flex-1 ${
                              isCorrectAnswer ? 'text-green-900 font-medium' : 
                              isUserSelection ? 'text-red-900' : 'text-gray-700'
                            }`}>
                              {option}
                            </span>
                            {isCorrectAnswer && (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            )}
                            {isUserSelection && !isCorrectAnswer && (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {quiz.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
                        <p className="text-blue-800">{quiz.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleRestart}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Restart Quiz
              </button>
              <button
                onClick={handleBackToGroups}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Quiz Groups
              </button>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (!currentQuiz) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto text-center py-12">
          <p className="text-gray-600 text-lg">Quiz not found</p>
        </div>
      </div>
    );
  }

  // Loading state for active quiz
  if (loading && quizzes.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBackToGroups}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Quiz Groups</span>
          </button>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Quiz Challenge</h1>
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuizIndex + 1} of {totalQuizzes}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentQuizIndex + 1) / totalQuizzes) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQuiz.question}</h2>

            <div className="grid grid-cols-1 gap-4 mb-6">
              {currentQuiz.options.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...
                const isSelected = selectedAnswer === optionLetter;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(optionLetter)}
                    className={`flex items-center p-4 border rounded-lg transition ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 font-medium">{optionLetter}</span>
                        <span className="font-medium text-gray-900">{option}</span>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLastQuiz ? 'Submit Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};
