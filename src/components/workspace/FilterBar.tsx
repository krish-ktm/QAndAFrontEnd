import { Topic } from '../../types/api';
import { Building2, TrendingUp, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  companies: string[];
  selectedCompany: string;
  onCompanyChange: (c: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (d: string) => void;
}

export const FilterBar = ({
  companies,
  selectedCompany,
  onCompanyChange,
  selectedDifficulty,
  onDifficultyChange,
}: FilterBarProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-700">Filters:</span>
      
      <div className="flex gap-3 flex-1">

        {/* Company */}
        <div className="relative group">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <select
            value={selectedCompany}
            onChange={(e) => onCompanyChange(e.target.value)}
            className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm hover:border-gray-400 transition-colors cursor-pointer"
          >
            <option value="all">All Companies</option>
            {companies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Difficulty */}
        <div className="relative group">
          <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <select
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm hover:border-gray-400 transition-colors cursor-pointer"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  </div>
);
