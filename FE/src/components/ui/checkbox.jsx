import React from "react";

/**
 * Checkbox UI (nhỏ gọn, dễ tái sử dụng)
 * Props: checked, onChange, label
 */
export const Checkbox = React.forwardRef(
  ({ checked = false, onCheckedChange, disabled = false, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        disabled={disabled}
        onChange={(e) =>
          onCheckedChange ? onCheckedChange(e.target.checked) : null
        }
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";
