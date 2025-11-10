import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy, ArrowLeft } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Quiz, QuizGroup } from '../../types/api';
import { QuizSelectionView } from './QuizSelectionView';
import { QuizGroupView } from './QuizGroupView';

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
  const [view, setView] = useState<'groups' | 'quizzes' | 'active'>('groups');
  const [selectedQuizGroup, setSelectedQuizGroup] = useState<QuizGroup | null>(null);
  
  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState<LocalQuizAttempt[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Handle quiz group selection
  const handleSelectQuizGroup = (quizGroup: QuizGroup) => {
    setSelectedQuizGroup(quizGroup);
    setView('quizzes');
  };
  
  // Handle going back to quiz groups
  const handleBackToGroups = () => {
    setView('groups');
    setSelectedQuizGroup(null);
  };
  
  // Handle quiz selection
  const handleSelectQuiz = (quiz: Quiz, allQuizzes?: Quiz[]) => {
    setView('active');
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAttempts([]);
    setLoading(false);
    
    // If allQuizzes is provided, use that (for full quiz mode)
    // Otherwise, just use the single quiz
    setQuizzes(allQuizzes || [quiz]);
  };
  
  // Handle going back to quiz selection
  const handleBackToQuizzes = () => {
    setView('quizzes');
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAttempts([]);
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
    if (currentQuiz && !showResult) {
      setStartTime(Date.now());
    }
  }, [currentQuiz, currentQuizIndex, showResult]);
  
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
        setShowResult(true);
      } else {
        // Fallback to local checking if API fails
        const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
        
        const newAttempt: LocalQuizAttempt = {
          quizId: currentQuiz.id,
          selectedAnswer,
          isCorrect,
        };
        
        setAttempts([...attempts, newAttempt]);
        setShowResult(true);
        
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
      setShowResult(true);
      
      console.error('Error submitting answer:', err);
    }
  };

  const handleNext = () => {
    if (isLastQuiz) {
      return;
    }

    setCurrentQuizIndex(currentQuizIndex + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleRestart = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAttempts([]);
  };

  // Show the appropriate view based on the current state
  if (view === 'groups') {
    return <QuizGroupView productId={productId} onSelectQuizGroup={handleSelectQuizGroup} />;
  }
  
  if (view === 'quizzes' && selectedQuizGroup) {
    return (
      <QuizSelectionView 
        productId={productId} 
        quizGroup={selectedQuizGroup}
        onSelectQuiz={handleSelectQuiz} 
        onBackToQuizGroups={handleBackToGroups}
      />
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

  if (!currentQuiz) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto text-center py-12">
          <p className="text-gray-600 text-lg">Quiz not found</p>
        </div>
      </div>
    );
  }

  if (isQuizCompleted) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
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

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
                    <p className="text-sm text-gray-600">Correct</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{totalQuizzes - correctAnswers}</p>
                    <p className="text-sm text-gray-600">Incorrect</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{totalQuizzes}</p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRestart}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Restart Quiz
              </button>
            </div>
          </div>
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
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackToQuizzes}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Quiz Selection</span>
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
              const isCorrectAnswer = showResult && optionLetter === currentQuiz.correctAnswer;
              const isWrongSelection = showResult && isSelected && !isCorrectAnswer;

              return (
                <button
                  key={index}
                  onClick={() => !showResult && setSelectedAnswer(optionLetter)}
                  disabled={showResult}
                  className={`flex items-center p-4 border rounded-lg transition ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} 
                    ${isCorrectAnswer ? 'border-green-500 bg-green-50' : ''}
                    ${isWrongSelection ? 'border-red-500 bg-red-50' : ''}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 font-medium">{optionLetter}</span>
                      <span className="font-medium text-gray-900">{option}</span>
                    </div>
                    {isCorrectAnswer && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                    {isWrongSelection && <XCircle className="w-6 h-6 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                selectedAnswer === currentQuiz.correctAnswer
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {selectedAnswer === currentQuiz.correctAnswer ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`font-semibold mb-1 ${
                      selectedAnswer === currentQuiz.correctAnswer
                        ? 'text-green-900'
                        : 'text-red-900'
                    }`}
                  >
                    {selectedAnswer === currentQuiz.correctAnswer ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className="text-gray-700">{currentQuiz.explanation}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                {isLastQuiz ? 'View Results' : 'Next Question'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
