import React from 'react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  /** Label text for the select */
  label?: string;
  /** Options for the select menu */
  options: SelectOption[];
  /** Error message to display */
  error?: string;
  /** Help text to display below the select */
  helperText?: string;
  /** Whether select should have full width of its container */
  fullWidth?: boolean;
  /** Whether select is in loading state */
  isLoading?: boolean;
  /** Custom wrapper class name */
  wrapperClassName?: string;
  /** Optional ID for the select */
  id?: string;
  /** Left icon or element */
  leftAddon?: React.ReactNode;
  /** Callback when selection changes */
  onChange?: (value: string) => void;
  /** Text to display when no option is selected */
  placeholder?: string;
}

/**
 * Select dropdown component for forms
 * 
 * @example
 * ```tsx
 * <Select 
 *   label="Country" 
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' },
 *     { value: 'mx', label: 'Mexico' }
 *   ]}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className,
    label,
    options,
    error,
    helperText,
    fullWidth = false,
    isLoading = false,
    wrapperClassName,
    id,
    disabled,
    leftAddon,
    onChange,
    placeholder,
    value,
    defaultValue,
    ...props 
  }, ref) => {
    // Generate an ID if not provided
    const selectId = id || React.useId();
    
    // Determine if select has error state
    const hasError = !!error;

    // Handle selection change
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className={cn(
        "flex flex-col space-y-2",
        fullWidth ? "w-full" : "",
        wrapperClassName
      )}>
        {label && (
          <label 
            htmlFor={selectId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        
        <div className={cn(
          "relative rounded-md shadow-sm",
          fullWidth ? "w-full" : "",
        )}>
          {leftAddon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftAddon}
            </div>
          )}

          <select
            id={selectId}
            className={cn(
              "flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              hasError ? "border-red-500 focus-visible:ring-red-500" : "",
              leftAddon ? "pl-10" : "",
              className
            )}
            disabled={disabled || isLoading}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={helperText ? `${selectId}-helper` : undefined}
            onChange={handleChange}
            value={value}
            defaultValue={defaultValue}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            {isLoading ? (
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
            ) : (
              <svg 
                className="h-5 w-5 text-gray-400" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" 
                  clipRule="evenodd" 
                />
              </svg>
            )}
          </div>
        </div>
        
        {(error || helperText) && (
          <div className="text-sm">
            {error ? (
              <p id={`${selectId}-error`} className="text-red-500">
                {error}
              </p>
            ) : helperText ? (
              <p id={`${selectId}-helper`} className="text-gray-500 dark:text-gray-400">
                {helperText}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
export default Select;