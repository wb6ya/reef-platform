import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label.replace(/\s+/g, '-').toLowerCase();

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={inputId} className="text-sm font-medium text-gray-900">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";
