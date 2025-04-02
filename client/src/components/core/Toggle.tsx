import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Define toggle variants using class-variance-authority
const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-transparent border border-input hover:bg-accent hover:text-accent-foreground',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        soft: 'bg-muted hover:bg-muted/80',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Define toggle props by extending HTML button attributes
export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  defaultPressed?: boolean;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  icon?: React.ReactNode;
  label?: string;
  labelPosition?: 'left' | 'right';
}

/**
 * Toggle component that can be switched between on and off states
 * 
 * @example
 * ```tsx
 * <Toggle>Toggle me</Toggle>
 * 
 * <Toggle variant="outline" defaultPressed>
 *   Pressed by default
 * </Toggle>
 * 
 * <Toggle icon={<Icon />} pressed={isPressed} onPressedChange={setIsPressed}>
 *   With Icon
 * </Toggle>
 * 
 * <Toggle label="With Label" labelPosition="left" />
 * ```
 */
const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({
    className,
    variant,
    size,
    children,
    defaultPressed = false,
    pressed,
    onPressedChange,
    icon,
    label,
    labelPosition = 'right',
    disabled,
    ...props
  }, ref) => {
    const [internalPressed, setInternalPressed] = React.useState(defaultPressed);
    
    // Determine if component is controlled or uncontrolled
    const isControlled = pressed !== undefined;
    const isPressed = isControlled ? pressed : internalPressed;
    
    const handleClick = React.useCallback(() => {
      if (!isControlled) {
        setInternalPressed(!internalPressed);
      }
      
      onPressedChange?.(!isPressed);
    }, [isControlled, internalPressed, isPressed, onPressedChange]);
    
    // Content to display
    const content = (
      <>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </>
    );
    
    return (
      <div className="flex items-center">
        {label && labelPosition === 'left' && (
          <span className="mr-2 text-sm">{label}</span>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={isPressed}
          data-state={isPressed ? 'on' : 'off'}
          className={cn(toggleVariants({ variant, size, className }))}
          onClick={handleClick}
          ref={ref}
          disabled={disabled}
          {...props}
        >
          {content}
        </button>
        {label && labelPosition === 'right' && (
          <span className="ml-2 text-sm">{label}</span>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export { Toggle, toggleVariants };
export default Toggle;