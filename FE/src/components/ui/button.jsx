import React from "react";

/**
 * Button component chuẩn (shadcn style)
 * 
 * Props:
 * - variant: "default" | "outline" | "destructive" | "ghost"
 * - size: "default" | "sm" | "lg"
 * - disabled: true/false
 */
export const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline:
        "border border-gray-300 bg-white hover:bg-gray-100 text-gray-700",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

/**
 * Hàm gộp class tiện dụng
 */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
