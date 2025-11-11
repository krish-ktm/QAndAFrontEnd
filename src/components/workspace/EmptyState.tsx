interface EmptyStateProps {
  message?: string;
  onClearFilters?: () => void;
}

export const EmptyState = ({ 
  message = 'No questions found matching your filters',
  onClearFilters 
}: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-600 text-lg">{message}</p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};
