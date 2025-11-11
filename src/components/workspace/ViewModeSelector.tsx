import { Rows } from 'lucide-react';

export type ViewMode = 'vertical';

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const ViewModeSelector = ({ viewMode, setViewMode }: ViewModeSelectorProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm hover:shadow transition-all">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setViewMode('vertical')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            viewMode === 'vertical'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          aria-label="List view"
          title="List view"
        >
          <Rows className="w-4 h-4" />
          <span className="hidden sm:inline text-sm font-medium">List</span>
        </button>
      </div>
    </div>
  );
};
