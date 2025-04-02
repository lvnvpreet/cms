import React from 'react';
import { cn } from '../../lib/utils';

export interface RadioButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Label text for the radio button */
  label?: string;
  /** Help text to display next to the radio button */
  helperText?: string;
  /** Error message to display */
  error?: string;
  /** Whether radio is in loading state */
  isLoading?: boolean;
  /** Callback when radio changes */
  onChange?: (checked: boolean) => void;
  /** Custom wrapper class name */
  wrapperClassName?: string;
}

/**
 * RadioButton component for forms
 * 
 * @example
 * ```tsx
 * <RadioButton 
 *   name="options"
 *   label="Option 1" 
 *   onChange={(checked) => console.log(checked)} 
 * />
 * 
 * <RadioButton 
 *   name="options"
 *   label="Option 2"
 *   defaultChecked
 *   helperText="Additional information"
 * />
 * ```
 */
const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ 
    className,
    label,
    helperText,
    error,
    isLoading = false,
    onChange,
    disabled,
    wrapperClassName,
    id,
    ...props 
  }, ref) => {
    // Generate an ID if not provided
    const radioId = id || React.useId();

    // Handle radio change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.checked);
      }
    };

    return (
      <div className={cn(
        "flex items-start space-x-2",
        wrapperClassName
      )}>
        <div className="flex items-center h-5">
          <input
            type="radio"
            id={radioId}
            className={cn(
              "h-4 w-4 border-gray-300 text-primary focus:ring-primary",
              "dark:border-gray-600 dark:bg-gray-700",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-red-500" : "",
              className
            )}
            disabled={disabled || isLoading}
            onChange={handleChange}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              helperText 
                ? `${radioId}-helper` 
                : error 
                ? `${radioId}-error` 
                : undefined
            }
            ref={ref}
            {...props}
          />
          {isLoading && (
            <div className="absolute ml-4">
              <svg 
                className="animate-spin h-4 w-4 text-primary" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" cy="12" r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
        </div>

        {(label || helperText || error) && (
          <div className="text-sm">
            {label && (
              <label 
                htmlFor={radioId}
                className={cn(
                  "font-medium text-gray-700 dark:text-gray-300",
                  disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                )}
              >
                {label}
              </label>
            )}
            
            {helperText && (
              <p 
                id={`${radioId}-helper`} 
                className="mt-1 text-gray-500 dark:text-gray-400"
              >
                {helperText}
              </p>
            )}
            
            {error && (
              <p 
                id={`${radioId}-error`} 
                className="mt-1 text-red-500"
              >
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

RadioButton.displayName = 'RadioButton';

export { RadioButton };
export default RadioButton;