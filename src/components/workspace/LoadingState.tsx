interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = 'Loading Q&A content...' }: LoadingStateProps) => {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};
