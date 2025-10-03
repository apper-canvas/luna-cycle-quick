import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  children, 
  className, 
  variant = "primary",
  size = "md",
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-gradient-to-r from-secondary to-secondary/90 text-gray-800 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    accent: "bg-gradient-to-r from-accent to-accent/90 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-primary hover:bg-secondary/20 active:bg-secondary/30",
    outline: "border-2 border-primary text-primary hover:bg-primary/5 active:bg-primary/10"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      ref={ref}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;