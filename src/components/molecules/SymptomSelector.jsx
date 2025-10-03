import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const symptoms = [
  { value: "cramps", label: "Cramps", icon: "Zap" },
  { value: "headache", label: "Headache", icon: "Brain" },
  { value: "fatigue", label: "Fatigue", icon: "Battery" },
  { value: "bloating", label: "Bloating", icon: "Circle" },
  { value: "tender_breasts", label: "Tender Breasts", icon: "Heart" },
  { value: "acne", label: "Acne", icon: "Droplet" },
  { value: "backache", label: "Backache", icon: "ArrowDown" },
  { value: "nausea", label: "Nausea", icon: "AlertCircle" }
];

const SymptomSelector = ({ value = [], onChange }) => {
  const toggleSymptom = (symptom) => {
    if (value.includes(symptom)) {
      onChange(value.filter(s => s !== symptom));
    } else {
      onChange([...value, symptom]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {symptoms.map((symptom) => {
        const isSelected = value.includes(symptom.value);
        return (
          <motion.button
            key={symptom.value}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleSymptom(symptom.value)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200",
              isSelected 
                ? "border-primary bg-gradient-to-br from-primary/5 to-secondary/5 shadow-md" 
                : "border-gray-200 hover:border-gray-300 bg-white"
            )}
          >
            <ApperIcon 
              name={symptom.icon} 
              className={cn(
                "w-5 h-5",
                isSelected ? "text-primary" : "text-gray-400"
              )}
            />
            <span className={cn(
              "text-sm font-medium flex-1 text-left",
              isSelected ? "text-primary" : "text-gray-600"
            )}>
              {symptom.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default SymptomSelector;