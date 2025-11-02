import React from "react";

// ✅ Tự định nghĩa hàm cn() tại đây
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Card UI component (chuẩn shadcn style)
 * Dùng để bao khối nội dung có header, content, footer.
 */

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "border-b border-gray-100 px-4 py-3 font-semibold text-gray-700",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-4 text-gray-700", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "border-t border-gray-100 px-4 py-3 flex justify-end items-center",
        className
      )}
      {...props}
    />
  );
}
