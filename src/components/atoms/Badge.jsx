import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  children, 
  className,
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-gradient-to-r from-primary/20 to-primary/10 text-primary",
    secondary: "bg-gradient-to-r from-secondary/30 to-secondary/20 text-primary",
    accent: "bg-gradient-to-r from-accent/20 to-accent/10 text-accent",
    success: "bg-gradient-to-r from-success/20 to-success/10 text-success",
    warning: "bg-gradient-to-r from-warning/20 to-warning/10 text-warning",
    error: "bg-gradient-to-r from-error/20 to-error/10 text-error"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;