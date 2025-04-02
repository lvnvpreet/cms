import React from 'react';
import { cn } from '../../lib/utils';

export interface TooltipProps {
  /** Content to show in the tooltip */
  content: React.ReactNode;
  /** Child element that triggers the tooltip */
  children: React.ReactNode;
  /** Position of the tooltip */
  position?: 'top' | 'right' | 'bottom' | 'left';
  /** Delay before showing tooltip (ms) */
  delay?: number;
  /** Custom className for the tooltip */
  className?: string;
}

/**
 * Tooltip component for showing additional information on hover
 * 
 * @example
 * ```tsx
 * <Tooltip content="Delete item" position="top">
 *   <button>🗑️</button>
 * </Tooltip>
 * ```
 */
const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, children, position = 'top', delay = 200, className }, ref) => {
    const [show, setShow] = React.useState(false);
    const timer = React.useRef<NodeJS.Timeout | undefined>(undefined);

    const handleMouseEnter = () => {
      timer.current = setTimeout(() => {
        setShow(true);
      }, delay);
    };

    const handleMouseLeave = () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      setShow(false);
    };

    const positionClasses = {
      top: '-translate-x-1/2 -translate-y-full left-1/2 bottom-[calc(100%+5px)]',
      right: 'translate-y-1/2 top-1/2 left-[calc(100%+5px)]',
      bottom: '-translate-x-1/2 translate-y-full left-1/2 top-[calc(100%+5px)]',
      left: 'translate-y-1/2 top-1/2 right-[calc(100%+5px)]'
    };

    const arrowPositionClasses = {
      top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent',
      right: 'left-[-4px] top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent',
      bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent',
      left: 'right-[-4px] top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent'
    };

    return (
      <div 
        ref={ref}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        {show && (
          <div
            role="tooltip"
            className={cn(
              "absolute z-50",
              "px-2 py-1",
              "text-sm text-white",
              "bg-gray-900 dark:bg-gray-700",
              "rounded shadow-lg",
              "transition-opacity duration-200",
              positionClasses[position],
              className
            )}
          >
            {content}
            <div 
              className={cn(
                "absolute w-0 h-0",
                "border-4",
                arrowPositionClasses[position]
              )} 
            />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export { Tooltip };
export default Tooltip;