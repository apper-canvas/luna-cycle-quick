import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const flowOptions = [
  { value: "none", label: "None", dots: 0, color: "bg-gray-200" },
  { value: "light", label: "Light", dots: 1, color: "bg-accent/30" },
  { value: "medium", label: "Medium", dots: 2, color: "bg-accent/60" },
  { value: "heavy", label: "Heavy", dots: 4, color: "bg-accent" }
];

const FlowSelector = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {flowOptions.map((option) => (
        <motion.button
          key={option.value}
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
            value === option.value 
              ? "border-primary bg-gradient-to-br from-primary/5 to-secondary/5 shadow-md" 
              : "border-gray-200 hover:border-gray-300 bg-white"
          )}
        >
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  i < option.dots ? option.color : "bg-gray-200"
                )}
              />
            ))}
          </div>
          <span className={cn(
            "text-sm font-medium",
            value === option.value ? "text-primary" : "text-gray-600"
          )}>
            {option.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default FlowSelector;