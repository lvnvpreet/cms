import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Define notification variants using class-variance-authority
const notificationVariants = cva(
  'relative flex w-full items-center justify-between rounded-md border p-4 shadow-sm',
  {
    variants: {
      variant: {
        default: 'bg-background border-border',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
        error: 'bg-red-50 border-red-200 text-red-800',
      },
      size: {
        default: 'text-sm',
        sm: 'text-xs p-3',
        lg: 'text-base p-5',
      },
      hasIcon: {
        true: 'pl-12',
        false: '',
      },
      hasClose: {
        true: 'pr-12',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hasIcon: false,
      hasClose: false,
    },
  }
);

export interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  action?: React.ReactNode;
  progress?: boolean;
  progressDuration?: number;
}

/**
 * Notification component for displaying alerts, messages, and notifications
 * 
 * @example
 * ```tsx
 * <Notification 
 *   title="Success!" 
 *   description="Your changes have been saved."
 *   variant="success"
 *   icon={<CheckCircleIcon />}
 *   onClose={() => console.log('Notification closed')}
 * />
 * 
 * <Notification
 *   title="Error"
 *   description="There was a problem with your request."
 *   variant="error"
 *   autoClose={true}
 *   progress={true}
 * />
 * 
 * <Notification
 *   variant="info"
 *   description="New updates are available."
 *   action={<Button size="sm">Update Now</Button>}
 * />
 * ```
 */
const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  ({
    className,
    variant,
    size,
    icon,
    title,
    description,
    onClose,
    autoClose = false,
    autoCloseDelay = 5000,
    action,
    progress = false,
    progressDuration = 5000,
    children,
    ...props
  }, ref) => {
    const [visible, setVisible] = React.useState(true);
    const [progressValue, setProgressValue] = React.useState(100);
    const progressIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
    const autoCloseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // Handle progress bar animation
    React.useEffect(() => {
      if (visible && progress) {
        const startTime = Date.now();
        const endTime = startTime + progressDuration;
        
        progressIntervalRef.current = setInterval(() => {
          const now = Date.now();
          const remaining = Math.max(0, endTime - now);
          const percent = (remaining / progressDuration) * 100;
          
          setProgressValue(percent);
          
          if (percent <= 0) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }
          }
        }, 16);
      }
      
      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }, [visible, progress, progressDuration]);

    // Handle auto close
    React.useEffect(() => {
      if (visible && autoClose) {
        autoCloseTimeoutRef.current = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
      }
      
      return () => {
        if (autoCloseTimeoutRef.current) {
          clearTimeout(autoCloseTimeoutRef.current);
        }
      };
    }, [visible, autoClose, autoCloseDelay]);

    const handleClose = () => {
      setVisible(false);
      if (onClose) {
        onClose();
      }
    };

    if (!visible) {
      return null;
    }

    // Get appropriate icon for variant if no custom icon provided
    const variantIcon = icon || getVariantIcon(variant);
    
    return (
      <div
        ref={ref}
        className={cn(
          notificationVariants({ 
            variant, 
            size, 
            hasIcon: !!variantIcon, 
            hasClose: !!onClose 
          }),
          className
        )}
        role="alert"
        {...props}
      >
        {variantIcon && (
          <div className="absolute left-4 top-4 flex h-5 w-5">
            {variantIcon}
          </div>
        )}
        
        <div className="flex-1">
          {title && (
            <h5 className="mb-1 font-medium leading-none tracking-tight">
              {title}
            </h5>
          )}
          {description && <div className="text-sm opacity-90">{description}</div>}
          {children}
        </div>
        
        {action && <div className="ml-4 flex-shrink-0">{action}</div>}
        
        {onClose && (
          <button
            className="absolute right-4 top-4 rounded-md p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={handleClose}
            aria-label="Close notification"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        
        {progress && (
          <div className="absolute bottom-0 left-0 h-1 w-full bg-background/20">
            <div
              className="h-full bg-current transition-all duration-300 ease-linear"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        )}
      </div>
    );
  }
);

// Helper function to get the appropriate icon based on variant
function getVariantIcon(variant: string | null | undefined) {
  switch (variant) {
    case 'info':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
    case 'success':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case 'warning':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case 'error':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    default:
      return null;
  }
}

Notification.displayName = 'Notification';

export { Notification, notificationVariants };
export default Notification;