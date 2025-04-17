import React from "react";
import cn from "classnames";

const Table = ({ children, className, ...props }) => (
  <div className="relative w-full overflow-auto">
    <table
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    >
      {children}
    </table>
  </div>
);

const TableHeader = ({ children, className, ...props }) => (
  <thead className={cn("[&_tr]:border-b", className)} {...props}>
    {children}
  </thead>
);

const TableBody = ({ children, className, ...props }) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>
    {children}
  </tbody>
);

const TableRow = ({ children, className, ...props }) => (
  <tr
    className={cn("border-b transition-colors hover:bg-gray-50/50", className)}
    {...props}
  >
    {children}
  </tr>
);

const TableCell = ({ children, className, ...props }) => (
  <td
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  >
    {children}
  </td>
);

export { Table, TableHeader, TableBody, TableRow, TableCell };
