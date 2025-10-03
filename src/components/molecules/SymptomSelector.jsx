import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const defaultSymptoms = [
  { value: "cramps", label: "Cramps", icon: "Zap", isCustom: false },
  { value: "headache", label: "Headache", icon: "Brain", isCustom: false },
  { value: "fatigue", label: "Fatigue", icon: "Battery", isCustom: false },
  { value: "bloating", label: "Bloating", icon: "Circle", isCustom: false },
  { value: "tender_breasts", label: "Tender Breasts", icon: "Heart", isCustom: false },
  { value: "acne", label: "Acne", icon: "Droplet", isCustom: false },
  { value: "backache", label: "Backache", icon: "ArrowDown", isCustom: false },
  { value: "nausea", label: "Nausea", icon: "AlertCircle", isCustom: false }
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
      {allSymptoms.map((symptom) => {
        const isSelected = value.includes(symptom.value);
        return (
          <motion.button
            key={symptom.value}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleSymptom(symptom.value)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 relative",
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
            {symptom.isCustom && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                ★
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
);
}

function SymptomSelectorWrapper({ value, onChange }) {
  const [allSymptoms, setAllSymptoms] = useState(defaultSymptoms);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSymptoms() {
      try {
        const customizationService = (await import('@/services/api/customizationService')).default;
        const customSymptoms = await customizationService.getCustomSymptoms();
        const customMapped = customSymptoms.map(s => ({
          value: s.value,
          label: s.name,
          icon: s.icon,
          isCustom: true
        }));
        setAllSymptoms([...defaultSymptoms, ...customMapped]);
      } catch (error) {
        setAllSymptoms(defaultSymptoms);
      } finally {
        setLoading(false);
      }
    }
    loadSymptoms();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <SymptomSelector value={value} onChange={onChange} allSymptoms={allSymptoms} />;
}

export default SymptomSelectorWrapper;
