import React from 'react';
import { cn } from '../../lib/utils';

export interface TabsProps {
  /** Array of tab items */
  items: {
    label: string;
    value: string;
    disabled?: boolean;
  }[];
  /** Currently selected tab value */
  value: string;
  /** Callback when tab changes */
  onChange: (value: string) => void;
  /** Optional className for the tabs container */
  className?: string;
  /** Optional className for individual tabs */
  tabClassName?: string;
}

/**
 * Tabs component for switching between different views
 * 
 * @example
 * ```tsx
 * const [activeTab, setActiveTab] = useState('tab1');
 * 
 * <Tabs
 *   items={[
 *     { label: 'Tab 1', value: 'tab1' },
 *     { label: 'Tab 2', value: 'tab2' },
 *     { label: 'Tab 3', value: 'tab3', disabled: true }
 *   ]}
 *   value={activeTab}
 *   onChange={setActiveTab}
 * />
 * ```
 */
const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ items, value, onChange, className, tabClassName }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex space-x-1 rounded-lg bg-gray-100 p-1",
          "dark:bg-gray-800",
          className
        )}
        role="tablist"
      >
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => !item.disabled && onChange(item.value)}
            role="tab"
            aria-selected={value === item.value}
            aria-disabled={item.disabled}
            disabled={item.disabled}
            className={cn(
              "flex-1 px-3 py-1.5 text-sm font-medium rounded-md",
              "transition-all duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
              value === item.value
                ? "bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
              item.disabled && "opacity-50 cursor-not-allowed",
              tabClassName
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

export { Tabs };
export default Tabs;