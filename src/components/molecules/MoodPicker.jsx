import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

const defaultMoods = [
  { value: "happy", emoji: "😊", label: "Happy", color: "text-success", isCustom: false },
  { value: "neutral", emoji: "😐", label: "Neutral", color: "text-gray-500", isCustom: false },
  { value: "sad", emoji: "😢", label: "Sad", color: "text-info", isCustom: false },
  { value: "anxious", emoji: "😰", label: "Anxious", color: "text-warning", isCustom: false },
  { value: "energetic", emoji: "⚡", label: "Energetic", color: "text-accent", isCustom: false },
  { value: "tired", emoji: "😴", label: "Tired", color: "text-primary", isCustom: false }
];

const MoodPicker = ({ value, onChange, allMoods }) => {
  return (
<div className="grid grid-cols-3 gap-3">
      {allMoods.map((mood) => (
        <motion.button
          key={mood.value}
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(mood.value)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 relative",
            value === mood.value 
              ? "border-primary bg-gradient-to-br from-primary/5 to-secondary/5 shadow-md" 
              : "border-gray-200 hover:border-gray-300 bg-white"
          )}
        >
          <span className="text-3xl">{mood.emoji}</span>
          <span className={cn(
            "text-sm font-medium",
            value === mood.value ? mood.color : "text-gray-600"
          )}>
            {mood.label}
          </span>
          {mood.isCustom && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
              ★
            </span>
          )}
        </motion.button>
      ))}
    </div>
);
}

function MoodPickerWrapper({ value, onChange }) {
  const [allMoods, setAllMoods] = useState(defaultMoods);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMoods() {
      try {
        const customizationService = (await import('@/services/api/customizationService')).default;
        const customMoods = await customizationService.getCustomMoods();
        const customMapped = customMoods.map(m => ({
          value: m.value,
          emoji: m.emoji,
          label: m.name,
          color: m.color,
          isCustom: true
        }));
        setAllMoods([...defaultMoods, ...customMapped]);
      } catch (error) {
        setAllMoods(defaultMoods);
      } finally {
        setLoading(false);
      }
    }
    loadMoods();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <MoodPicker value={value} onChange={onChange} allMoods={allMoods} />;
}

export default MoodPickerWrapper;