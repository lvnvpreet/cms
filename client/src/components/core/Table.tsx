import React from 'react';
import { cn } from '../../lib/utils';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /** Optional custom class name for the table */
  className?: string;
  /** Whether the table has hover effects on rows */
  hover?: boolean;
  /** Whether the table has borders */
  bordered?: boolean;
  /** Whether the table is striped */
  striped?: boolean;
  /** Whether the table is compact */
  compact?: boolean;
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
export interface TableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {}
export interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {}

/**
 * Table component with various styling options
 *
 * @example
 * ```tsx
 * <Table hover bordered>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Status</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>John Doe</TableCell>
 *       <TableCell>Active</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */
const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, hover, bordered, striped, compact, ...props }, ref) => {
    return (
      <div className="w-full overflow-auto">
        <table
          ref={ref}
          className={cn(
            "w-full text-sm",
            "border-collapse",
            bordered && "border border-gray-200 dark:border-gray-700",
            compact ? "text-xs" : "text-sm",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        "bg-gray-50 dark:bg-gray-800",
        className
      )}
      {...props}
    />
  )
);

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(
        "divide-y divide-gray-200 dark:divide-gray-700",
        className
      )}
      {...props}
    />
  )
);

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "transition-colors",
        "hover:bg-gray-50 dark:hover:bg-gray-800",
        className
      )}
      {...props}
    />
  )
);

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "px-6 py-3",
        "text-left text-xs font-medium",
        "text-gray-500 dark:text-gray-400",
        "uppercase tracking-wider",
        className
      )}
      {...props}
    />
  )
);

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "px-6 py-4",
        "whitespace-nowrap",
        "text-gray-900 dark:text-gray-100",
        className
      )}
      {...props}
    />
  )
);

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableHead.displayName = 'TableHead';
TableCell.displayName = 'TableCell';

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
};

export default Table;