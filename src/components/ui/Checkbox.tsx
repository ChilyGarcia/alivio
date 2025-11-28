import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  className?: string;
  labelClassName?: string;
}

export function Checkbox({
  id,
  label,
  className = "",
  labelClassName = "text-sm text-gray-600",
  ...props
}: CheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={id}
          className={`peer h-4 w-4 appearance-none rounded border-2 border-primary bg-white checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0 ${className}`}
          {...props}
        />
        <svg
          className="pointer-events-none absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white peer-checked:block"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
      )}
    </div>
  );
}
