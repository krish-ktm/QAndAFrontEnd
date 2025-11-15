import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  icon
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (!disabled) {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 pr-10 bg-white border border-gray-300 rounded-lg
          flex items-center gap-3 text-sm font-medium text-left
          transition-all duration-200 cursor-pointer
          hover:border-gray-400 hover:shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'}
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : ''}
        `}
      >
        {icon && (
          <span className="flex-shrink-0 text-gray-400">
            {icon}
          </span>
        )}
        
        <span className={`
          flex-1 truncate
          ${value ? 'text-gray-900' : 'text-gray-500'}
        `}>
          {displayValue}
        </span>
        
        <span className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      {isOpen && (
        <div className={`
          absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl
          shadow-lg overflow-hidden
          ${isOpen ? 'ring-1 ring-blue-500 ring-opacity-20' : ''}
        `}>
          <div className="py-1 max-h-60 overflow-y-auto scrollbar-hide">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                disabled={option.disabled}
                className={`
                  w-full px-4 py-2.5 text-left text-sm flex items-center gap-3
                  transition-all duration-150 cursor-pointer
                  ${option.disabled 
                    ? 'opacity-50 cursor-not-allowed text-gray-400' 
                    : 'hover:bg-blue-50 hover:text-blue-700'
                  }
                  ${value === option.value 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700'
                  }
                `}
              >
                <span className="flex-1 truncate min-w-0">
                  {option.label}
                </span>
                
                {value === option.value && (
                  <span className="flex-shrink-0">
                    <Check className="w-4 h-4 text-blue-600" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
