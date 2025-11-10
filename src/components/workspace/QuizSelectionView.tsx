import { useState, useEffect } from 'react';
import { Book, ArrowRight, Tag, BarChart2, Clock, ArrowLeft } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { QuizGroup, Quiz } from '../../types/api';

interface QuizSelectionViewProps {
  productId: string;
  quizGroup: QuizGroup;
  onSelectQuiz: (quiz: Quiz, allQuizzes?: Quiz[]) => void;
  onBackToQuizGroups: () => void;
}

export const QuizSelectionView = ({ productId, quizGroup, onSelectQuiz, onBackToQuizGroups }: QuizSelectionViewProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Fetch quizzes based on selected filters
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const filters: {
          quizGroupId: string;
          level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
        } = {
          quizGroupId: quizGroup.id
        };
        
        if (selectedLevel) {
          filters.level = selectedLevel as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
        }
        
        const response = await apiService.getQuizzes(productId, filters);
        if (response.success) {
          setQuizzes(response.data.items);
        } else {
          setError(response.message || 'Failed to load quizzes');
        }
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('An error occurred while loading quizzes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, [productId, quizGroup.id, selectedLevel]);
  
  const handleSelectLevel = (level: string | null) => {
    setSelectedLevel(level);
  };
  
  // Start a quiz with all questions from this group
  const handleStartFullQuiz = () => {
    if (quizzes.length > 0) {
      // Pass all quizzes to the parent component
      onSelectQuiz(quizzes[0], quizzes);
    }
  };
  
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getDifficultyIcon = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return <BarChart2 className="w-3 h-3" />;
      case 'INTERMEDIATE':
        return <BarChart2 className="w-3 h-3" />;
      case 'ADVANCED':
        return <BarChart2 className="w-3 h-3" />;
      default:
        return <BarChart2 className="w-3 h-3" />;
    }
  };
  
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBackToQuizGroups}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Quiz Groups</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{quizGroup.name}</h1>
        <p className="text-gray-600 mb-4">{quizGroup.description}</p>
        
        {/* Start Full Quiz Button */}
        {!loading && quizzes.length > 0 && (
          <button
            onClick={handleStartFullQuiz}
            className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span className="font-medium">Start Full Quiz ({quizzes.length} Questions)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
        
        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">Quizzes</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {showFilters && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Difficulty Level</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSelectLevel(null)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    selectedLevel === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  All Levels
                </button>
                <button
                  onClick={() => handleSelectLevel('BEGINNER')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    selectedLevel === 'BEGINNER'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Beginner
                </button>
                <button
                  onClick={() => handleSelectLevel('INTERMEDIATE')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    selectedLevel === 'INTERMEDIATE'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Intermediate
                </button>
                <button
                  onClick={() => handleSelectLevel('ADVANCED')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    selectedLevel === 'ADVANCED'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-2">Error</h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && quizzes.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Quizzes Found</h3>
            <p className="text-gray-600 mb-4">
              There are no quizzes available for the selected filters.
            </p>
            <button
              onClick={() => {
                setSelectedLevel(null);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
        
        {/* Quiz List */}
        {!loading && !error && quizzes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => {
              return (
                <div
                  key={quiz.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
                  onClick={() => onSelectQuiz(quiz)}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                              quiz.level
                            )}`}
                          >
                            {getDifficultyIcon(quiz.level)} {quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase()}
                          </span>
                          
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            <Book className="w-3 h-3" /> {quizGroup.name}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-2">
                          {quiz.question}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            {quiz.companyTags.length > 0
                              ? quiz.companyTags.slice(0, 2).join(', ') +
                                (quiz.companyTags.length > 2 ? '...' : '')
                              : 'No tags'}
                          </span>
                          
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            ~2 min
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
