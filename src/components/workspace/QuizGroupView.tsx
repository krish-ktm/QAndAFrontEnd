import { useState, useEffect } from 'react';
import { Book, ArrowRight, BarChart2, Clock } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { QuizGroup } from '../../types/api';

interface QuizGroupViewProps {
  productId: string;
  onSelectQuizGroup: (quizGroup: QuizGroup) => void;
}

export const QuizGroupView = ({ productId, onSelectQuizGroup }: QuizGroupViewProps) => {
  const [quizGroups, setQuizGroups] = useState<QuizGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
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
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
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
    );
  }
  
  if (quizGroups.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-2">No Quiz Groups</h3>
        <p>There are no quiz groups available for this product.</p>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Select a Quiz Group</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizGroups.map((quizGroup) => (
            <div
              key={quizGroup.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
              onClick={() => onSelectQuizGroup(quizGroup)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {quizGroup.name}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {quizGroup.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <Book className="w-4 h-4" />
                        Quiz Group
                      </span>
                      
                      <span className="inline-flex items-center gap-1">
                        <BarChart2 className="w-4 h-4" />
                        Mixed Difficulty
                      </span>
                      
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        ~15 min
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
