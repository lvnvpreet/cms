import React from 'react';
import { cn } from '../../lib/utils';

export interface SpinnerProps {
  /** Size of the spinner (small, medium, large) */
  size?: 'sm' | 'md' | 'lg';
  /** Custom class name */
  className?: string;
  /** Color variant */
  variant?: 'primary' | 'secondary' | 'white';
}

/**
 * Loading spinner component
 * 
 * @example
 * ```tsx
 * <Spinner /> // Default medium primary spinner
 * <Spinner size="sm" variant="white" /> // Small white spinner
 * <Spinner size="lg" variant="secondary" /> // Large secondary spinner
 * ```
 */
const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', className, variant = 'primary' }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8'
    };

    const variantClasses = {
      primary: 'text-primary',
      secondary: 'text-gray-600',
      white: 'text-white'
    };

    return (
      <div 
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn('inline-block', className)}
      >
        <svg
          className={cn(
            'animate-spin',
            sizeClasses[size],
            variantClasses[variant]
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export { Spinner };
export default Spinner;