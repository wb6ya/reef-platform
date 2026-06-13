import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-green-700 text-white hover:bg-green-800 shadow-sm hover:shadow-md": variant === "primary",
            "bg-amber-700 text-white hover:bg-amber-800 shadow-sm hover:shadow-md": variant === "secondary",
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50": variant === "outline",
            "bg-transparent text-gray-700 hover:bg-gray-100": variant === "ghost",
            "bg-red-50 text-red-600 hover:bg-red-100": variant === "destructive",
          },
          {
            "h-9 px-3 text-sm": size === "sm",
            "h-11 px-4 text-base": size === "md", // Default h-11 for 44px mobile touch target
            "h-14 px-6 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
