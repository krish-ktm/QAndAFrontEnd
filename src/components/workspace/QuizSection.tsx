import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { mockQuizzes, Quiz } from '../../data/mockData';

interface QuizSectionProps {
  productId: string;
}

interface QuizAttempt {
  quizId: string;
  selectedAnswer: number;
  isCorrect: boolean;
}

export const QuizSection = ({ productId }: QuizSectionProps) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  const productQuizzes = mockQuizzes.filter((quiz) => quiz.productId === productId);
  const currentQuiz = productQuizzes[currentQuizIndex];
  const isLastQuiz = currentQuizIndex === productQuizzes.length - 1;
  const isQuizCompleted = attempts.length === productQuizzes.length;

  const correctAnswers = attempts.filter((a) => a.isCorrect).length;
  const totalQuizzes = productQuizzes.length;
  const score = totalQuizzes > 0 ? Math.round((correctAnswers / totalQuizzes) * 100) : 0;

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
    setAttempts([
      ...attempts,
      {
        quizId: currentQuiz.id,
        selectedAnswer,
        isCorrect,
      },
    ]);
    setShowResult(true);
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

  if (!currentQuiz || productQuizzes.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto text-center py-12">
          <p className="text-gray-600 text-lg">No quizzes available for this product</p>
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

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
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

          <div className="space-y-3 mb-6">
            {currentQuiz.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuiz.correctAnswer;
              const showCorrectAnswer = showResult && isCorrect;
              const showIncorrectAnswer = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => !showResult && setSelectedAnswer(index)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    showCorrectAnswer
                      ? 'border-green-500 bg-green-50'
                      : showIncorrectAnswer
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option}</span>
                    {showCorrectAnswer && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                    {showIncorrectAnswer && <XCircle className="w-6 h-6 text-red-600" />}
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
