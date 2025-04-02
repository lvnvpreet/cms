import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Define input variants using class-variance-authority
const inputVariants = cva(
  'flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        filled: 'bg-secondary/50 border-secondary/30',
        outline: 'border-2',
        ghost: 'border-transparent bg-transparent hover:bg-accent/20',
      },
      size: {
        default: 'h-10',
        sm: 'h-8 px-2 py-1 text-xs',
        lg: 'h-12 px-4 py-3 text-base',
      },
      state: {
        default: '',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-success focus-visible:ring-success',
        warning: 'border-warning focus-visible:ring-warning',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

/**
 * Input component with various styles and sizes
 * 
 * @example
 * ```tsx
 * <Input placeholder="Enter your name" />
 * 
 * <Input 
 *   variant="filled" 
 *   size="lg" 
 *   leftIcon={<UserIcon />} 
 *   placeholder="Username" 
 * />
 * 
 * <Input 
 *   state="error" 
 *   error="This field is required" 
 *   placeholder="Email address" 
 * />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant,
    size,
    state,
    leftIcon,
    rightIcon,
    error,
    helperText,
    containerClassName,
    ...props
  }, ref) => {
    // If there's an error, override the state prop
    const inputState = error ? 'error' : state;
    
    return (
      <div className={cn('space-y-1', containerClassName)}>
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <input
            className={cn(
              inputVariants({ variant, size, state: inputState }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 flex items-center pointer-events-none text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={cn(
            'text-xs',
            error ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
export default Input;