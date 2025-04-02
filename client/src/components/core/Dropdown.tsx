import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Define dropdown variants using class-variance-authority
const dropdownVariants = cva(
  'relative inline-block w-full',
  {
    variants: {
      variant: {
        default: '',
        bordered: 'border border-input rounded-md p-1',
        elevated: 'shadow-md rounded-md',
      },
      size: {
        default: '',
        sm: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Define button trigger variants
const triggerVariants = cva(
  'flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        ghost: 'border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground',
        outline: 'border-2',
      },
      size: {
        default: 'h-10',
        sm: 'h-8 text-xs px-2 py-1',
        lg: 'h-12 text-base px-4 py-3',
      },
      open: {
        true: 'border-primary',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      open: false,
    },
  }
);

// Define menu variants
const menuVariants = cva(
  'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
  {
    variants: {
      position: {
        bottom: 'top-full mt-1',
        top: 'bottom-full mb-1',
        left: 'right-full mr-1',
        right: 'left-full ml-1',
      },
      size: {
        default: '',
        sm: 'text-xs',
        lg: 'text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      position: 'bottom',
      size: 'default',
      fullWidth: false,
    },
  }
);

// Define dropdown item variants
const itemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        destructive: 'text-destructive hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground',
      },
      active: {
        true: 'bg-accent text-accent-foreground',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      active: false,
    },
  }
);

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof dropdownVariants> {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  menuPosition?: 'bottom' | 'top' | 'left' | 'right';
  triggerVariant?: 'default' | 'ghost' | 'outline';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

/**
 * Dropdown component with various styles and options
 * 
 * @example
 * ```tsx
 * const options = [
 *   { value: 'apple', label: 'Apple' },
 *   { value: 'banana', label: 'Banana' },
 *   { value: 'orange', label: 'Orange' }
 * ];
 * 
 * <Dropdown 
 *   options={options} 
 *   placeholder="Select a fruit" 
 *   onChange={(value) => console.log(value)} 
 * />
 * 
 * <Dropdown 
 *   variant="bordered"
 *   size="lg"
 *   options={optionsWithIcons}
 *   value={selectedValue}
 *   onChange={handleChange}
 *   label="Choose an option"
 *   icon={<ArrowDownIcon />}
 * />
 * ```
 */
const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({
    className,
    variant,
    size,
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    error,
    helperText,
    menuPosition = 'bottom',
    triggerVariant = 'default',
    fullWidth = false,
    icon,
    label,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close the dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Update internal state when value prop changes
    React.useEffect(() => {
      setSelectedValue(value);
    }, [value]);

    const toggleDropdown = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    const handleSelect = (option: DropdownOption) => {
      if (option.disabled) return;
      
      setSelectedValue(option.value);
      onChange?.(option.value);
      setIsOpen(false);
    };

    // Find the selected option
    const selectedOption = options.find(option => option.value === selectedValue);
    
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        
        <div
          ref={mergeRefs(ref, dropdownRef)}
          className={cn(dropdownVariants({ variant, size }), className)}
          {...props}
        >
          <button
            type="button"
            onClick={toggleDropdown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            disabled={disabled}
            className={cn(
              triggerVariants({ 
                variant: triggerVariant, 
                size, 
                open: isOpen 
              })
            )}
          >
            <span className="flex-1 text-left truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="ml-2 h-4 w-4 shrink-0 opacity-50">
              {icon || (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              )}
            </span>
          </button>
          
          {isOpen && (
            <div
              className={cn(
                menuVariants({ 
                  position: menuPosition, 
                  size, 
                  fullWidth 
                })
              )}
              role="listbox"
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    itemVariants({ 
                      active: option.value === selectedValue, 
                      variant: 'default' 
                    }),
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  role="option"
                  aria-selected={option.value === selectedValue}
                  tabIndex={option.disabled ? -1 : 0}
                  onClick={() => handleSelect(option)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(option);
                    }
                  }}
                >
                  {option.icon && (
                    <span className="mr-2">{option.icon}</span>
                  )}
                  {option.label}
                </div>
              ))}
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

// Helper function to merge refs
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

Dropdown.displayName = 'Dropdown';

export { Dropdown, dropdownVariants, triggerVariants, menuVariants, itemVariants };
export default Dropdown;