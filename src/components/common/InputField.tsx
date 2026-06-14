import React, { useId } from "react";
import { cn } from "@/utils/cn";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const fallbackId = useId();
    const inputId = id ?? fallbackId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col w-full">
        <label htmlFor={inputId} className="font-semibold text-gray-700 text-sm flex items-center mb-2">
          {label}
          {props.required && <span className="text-red-500 ms-1" aria-hidden="true">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-14 w-full rounded-xl border px-4 text-base font-medium text-gray-900 placeholder:text-gray-400 bg-white shadow-sm focus:outline-none focus:ring-2 transition-all duration-200",
            error 
              ? "border-red-300 focus:border-transparent focus:ring-red-500 bg-red-50/50" 
              : "border-gray-200 focus:border-transparent focus:ring-green-600 hover:border-gray-300",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-red-500 font-medium text-sm mt-1.5 flex items-center gap-1">
            <span aria-hidden="true">⚠️</span> {error}
          </p>
        )}
      </div>
    );
  }
);
InputField.displayName = "InputField";

