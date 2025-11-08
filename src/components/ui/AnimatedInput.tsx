import { motion } from 'framer-motion';
import { InputHTMLAttributes, forwardRef } from 'react';

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <motion.div
          initial={{ scale: 0.98 }}
          whileFocus={{ scale: 1 }}
          whileTap={{ scale: 0.99 }}
          className="relative"
        >
          <input
            ref={ref}
            id={id}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${className} ${
              error ? 'border-red-500' : ''
            }`}
            {...props}
          />
        </motion.div>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-600 text-sm"
          >
            {error}
          </motion.div>
        )}
      </div>
    );
  }
);
