// Utility functions for QnA components

/**
 * Returns the appropriate color class for a difficulty level
 */
export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'intermediate':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'advanced':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

/**
 * Formats a difficulty level string (capitalizes first letter)
 */
export const formatDifficulty = (difficulty: string) => {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
};
