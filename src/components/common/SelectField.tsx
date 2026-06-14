import React, { useId } from "react";
import { cn } from "@/utils/cn";

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string | number }[];
  error?: string;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, className, id, ...props }, ref) => {
    const fallbackId = useId();
    const inputId = id ?? fallbackId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col w-full">
        <label htmlFor={inputId} className="font-semibold text-gray-700 text-sm flex items-center mb-2">
          {label}
          {props.required && <span className="text-red-500 ms-1" aria-hidden="true">*</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "h-14 w-full appearance-none rounded-xl border px-4 pe-12 text-base font-medium text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 transition-all duration-200",
              error 
                ? "border-red-300 focus:border-transparent focus:ring-red-500 bg-red-50/50" 
                : "border-gray-200 focus:border-transparent focus:ring-green-600 hover:border-gray-300",
              className
            )}
            {...props}
          >
            <option value="" disabled className="text-gray-400">
              اختر (Select...)
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-gray-900">
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom Chevron ensuring RTL directional compliance */}
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-4 text-gray-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p id={errorId} className="text-red-500 font-medium text-sm mt-1.5 flex items-center gap-1">
            <span aria-hidden="true">⚠️</span> {error}
          </p>
        )}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";
