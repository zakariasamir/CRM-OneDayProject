export const Button = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-all hover:opacity-90 ${className}`}
  >
    {children}
  </button>
);
