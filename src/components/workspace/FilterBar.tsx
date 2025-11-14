import { Building2, TrendingUp } from 'lucide-react';
import { Dropdown } from '../ui/Dropdown';

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
        <Dropdown
          options={[
            { value: 'all', label: 'All Companies' },
            ...companies.map((c) => ({ value: c, label: c }))
          ]}
          value={selectedCompany}
          onChange={onCompanyChange}
          icon={<Building2 className="w-4 h-4" />}
          placeholder="All Companies"
        />

        {/* Difficulty */}
        <Dropdown
          options={[
            { value: 'all', label: 'All Levels' },
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' }
          ]}
          value={selectedDifficulty}
          onChange={onDifficultyChange}
          icon={<TrendingUp className="w-4 h-4" />}
          placeholder="All Levels"
        />
      </div>
    </div>
  </div>
);
