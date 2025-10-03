import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className,
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200",
        "bg-white text-gray-900 placeholder:text-gray-400",
        "focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none",
        error && "border-error focus:border-error focus:ring-error/10",
        !error && "border-gray-200 hover:border-gray-300",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;