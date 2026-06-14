import React from "react";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg",
      secondary: "bg-gray-800 text-white hover:bg-gray-900 shadow-md hover:shadow-lg",
      outline: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm",
      ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-md",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-6 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
          "h-14 text-base tracking-wide",
          variants[variant],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="me-3 h-5 w-5 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
