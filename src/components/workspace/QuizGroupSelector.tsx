import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { QuizGroup } from '../../types/api';

interface QuizGroupSelectorProps {
  productId: string;
  selectedQuizGroupId: string | null;
  onSelectQuizGroup: (quizGroupId: string | null) => void;
}

export const QuizGroupSelector = ({
  productId,
  selectedQuizGroupId,
  onSelectQuizGroup,
}: QuizGroupSelectorProps) => {
  const [quizGroups, setQuizGroups] = useState<QuizGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizGroups = async () => {
      try {
        setLoading(true);
        const response = await apiService.getQuizGroups(productId);
        if (response.success) {
          setQuizGroups(response.data);
          // If there's no selected quiz group and we have quiz groups, select the first one
          if (!selectedQuizGroupId && response.data.length > 0) {
            onSelectQuizGroup(response.data[0].id);
          }
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
  }, [productId, selectedQuizGroupId, onSelectQuizGroup]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (quizGroups.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
        <p className="text-sm">No quiz groups available for this product.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Quiz Groups</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectQuizGroup(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            selectedQuizGroupId === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All Quizzes
        </button>
        
        {quizGroups.map((group) => (
          <button
            key={group.id}
            onClick={() => onSelectQuizGroup(group.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedQuizGroupId === group.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {group.name}
          </button>
        ))}
      </div>
    </div>
  );
};
