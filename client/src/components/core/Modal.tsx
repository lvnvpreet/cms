import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text for the input */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Help text to display below the input */
  helperText?: string;
  /** Left icon or element */
  leftAddon?: React.ReactNode;
  /** Right icon or element */
  rightAddon?: React.ReactNode;
  /** Whether input should have full width of its container */
  fullWidth?: boolean;
  /** Whether input is in loading state */
  isLoading?: boolean;
  /** Custom wrapper class name */
  wrapperClassName?: string;
  /** Optional ID for the input */
  id?: string;
}

/**
 * Input component for forms
 * 
 * @example
 * ```tsx
 * <Input 
 *   label="Email" 
 *   placeholder="Enter your email"
 *   type="email"
 *   error={errors.email}
 *   helperText="We'll never share your email."
 * />
 * 
 * <Input
 *   label="Search"
 *   leftAddon={<SearchIcon />}
 *   rightAddon={<Button size="sm">Go</Button>}
 * />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className,
    type = 'text',
    label,
    error,
    helperText,
    leftAddon,
    rightAddon,
    fullWidth = false,
    isLoading = false,
    wrapperClassName,
    id,
    disabled,
    ...props 
  }, ref) => {
    // Generate an ID if not provided
    const inputId = id || React.useId();
    
    // Determine if input has error state
    const hasError = !!error;

    return (
      <div className={cn(
        "flex flex-col space-y-2",
        fullWidth ? "w-full" : "",
        wrapperClassName
      )}>
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        
        <div className={cn(
          "flex relative rounded-md shadow-sm",
          fullWidth ? "w-full" : "",
        )}>
          {leftAddon && (
            <div className="flex items-center pl-3 pr-2 border border-r-0 border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 rounded-l-md">
              {leftAddon}
            </div>
          )}
          
          <input
            type={type}
            id={inputId}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              hasError ? "border-red-500 focus-visible:ring-red-500" : "",
              leftAddon ? "rounded-l-none" : "",
              rightAddon ? "rounded-r-none" : "",
              className
            )}
            disabled={disabled || isLoading}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            ref={ref}
            {...props}
          />
          
          {rightAddon && (
            <div className="flex items-center pl-2 pr-3 border border-l-0 border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 rounded-r-md">
              {rightAddon}
            </div>
          )}
          
          {isLoading && (
            <div className="absolute inset-y-0 right-3 flex items-center">
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
        
        {(error || helperText) && (
          <div className="text-sm">
            {error ? (
              <p id={`${inputId}-error`} className="text-red-500">
                {error}
              </p>
            ) : helperText ? (
              <p id={`${inputId}-helper`} className="text-gray-500 dark:text-gray-400">
                {helperText}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export default Input;