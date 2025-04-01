import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils"; // Adjusted path relative to core

// Define toggle variants adapting button styles
const toggleVariants = cva(
  // Base styles from Button, adjusted for toggle interaction
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted hover:text-muted-foreground", // Default toggle is often transparent until active
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground', // Similar to button outline
      },
      size: {
        // Using sizes closer to Button for consistency in core
        default: "h-10 px-3", // Match Button height, adjust padding
        sm: "h-9 px-2",    // Match Button sm height
        lg: "h-11 px-4",    // Match Button lg height
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Define Toggle props by extending Radix Toggle props and VariantProps
export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

/**
 * Toggle component based on Radix UI Toggle Primitive, styled similarly to core Button.
 * Allows users to switch between two states (on/off).
 *
 * @example
 * ```tsx
 * import { Bold } from 'lucide-react'; // Example icon import
 *
 * <Toggle aria-label="Toggle bold">
 *   <Bold className="h-4 w-4" />
 * </Toggle>
 *
 * <Toggle variant="outline" size="sm">
 *   Outline Small
 * </Toggle>
 * ```
 */
const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
export default Toggle; // Added default export like Button.tsx
