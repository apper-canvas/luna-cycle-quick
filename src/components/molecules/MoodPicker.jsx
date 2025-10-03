import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const moods = [
  { value: "happy", emoji: "😊", label: "Happy", color: "text-success" },
  { value: "neutral", emoji: "😐", label: "Neutral", color: "text-gray-500" },
  { value: "sad", emoji: "😢", label: "Sad", color: "text-info" },
  { value: "anxious", emoji: "😰", label: "Anxious", color: "text-warning" },
  { value: "energetic", emoji: "⚡", label: "Energetic", color: "text-accent" },
  { value: "tired", emoji: "😴", label: "Tired", color: "text-primary" }
];

const MoodPicker = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {moods.map((mood) => (
        <motion.button
          key={mood.value}
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(mood.value)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
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
        </motion.button>
      ))}
    </div>
  );
};

export default MoodPicker;