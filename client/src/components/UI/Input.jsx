export const Input = ({ className, ...props }) => (
  <input
    {...props}
    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary ${className}`}
  />
);
