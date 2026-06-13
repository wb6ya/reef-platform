import * as React from "react";
import { cn } from "@/utils/cn";

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    const selectId = id || label.replace(/\s+/g, '-').toLowerCase();

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={selectId} className="text-sm font-medium text-gray-900">
          {label}
        </label>
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        >
          <option value="" disabled hidden>
            اختر... / Select...
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
