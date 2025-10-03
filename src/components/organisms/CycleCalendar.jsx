import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import cycleService from "@/services/api/cycleService";
import predictionService from "@/services/api/predictionService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const CycleCalendar = ({ onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [currentMonth]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [entriesData, predictionData] = await Promise.all([
        cycleService.getAll(),
        predictionService.getCurrent()
      ]);
      setEntries(entriesData);
      setPrediction(predictionData);
    } catch (err) {
      setError("Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  const getDayData = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const entry = entries.find(e => e.date === dateStr);
    
    let phase = null;
    let isPredicted = false;

    if (prediction) {
      const currentDate = new Date(dateStr);
      const periodStart = new Date(prediction.predictedPeriodStart);
      const periodEnd = new Date(prediction.predictedPeriodEnd);
      const fertileStart = new Date(prediction.fertileWindowStart);
      const fertileEnd = new Date(prediction.fertileWindowEnd);
      const ovulation = new Date(prediction.ovulationDay);

      if (currentDate >= periodStart && currentDate <= periodEnd) {
        phase = "menstrual";
        isPredicted = true;
      } else if (isSameDay(currentDate, ovulation)) {
        phase = "ovulation";
        isPredicted = true;
      } else if (currentDate >= fertileStart && currentDate <= fertileEnd) {
        phase = "fertile";
        isPredicted = true;
      }
    }

    return { entry, phase, isPredicted };
  };

  const getPhaseColor = (phase, isPredicted) => {
    if (isPredicted) {
      switch (phase) {
        case "menstrual":
          return "bg-gradient-to-br from-primary/30 to-primary/20 border-primary/40";
        case "ovulation":
          return "bg-gradient-to-br from-accent/30 to-accent/20 border-accent/40";
        case "fertile":
          return "bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30";
        default:
          return "";
      }
    }
    return "";
  };

  const getFlowDots = (intensity) => {
    const counts = { light: 1, medium: 2, heavy: 4 };
    return counts[intensity] || 0;
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) return <Loading variant="calendar" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          >
            <ApperIcon name="ChevronLeft" className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          >
            <ApperIcon name="ChevronRight" className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          const { entry, phase, isPredicted } = getDayData(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateSelect && onDateSelect(day)}
              className={cn(
                "aspect-square rounded-xl border-2 p-2 transition-all duration-200 relative",
                isCurrentMonth ? "text-gray-900" : "text-gray-400",
                isCurrentDay && "ring-2 ring-primary ring-offset-2",
                isPredicted && getPhaseColor(phase, isPredicted),
                !isPredicted && entry && "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20",
                !isPredicted && !entry && "border-gray-100 hover:border-gray-200 bg-white"
              )}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className={cn(
                  "text-sm font-medium mb-1",
                  isCurrentDay && "text-primary font-bold"
                )}>
                  {format(day, "d")}
                </span>
                
                {entry && entry.flowIntensity !== "none" && (
                  <div className="flex gap-0.5">
                    {[...Array(getFlowDots(entry.flowIntensity))].map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-accent" />
                    ))}
                  </div>
                )}

                {isPredicted && !entry && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-primary/30 to-primary/20 border-2 border-primary/40" />
          <span className="text-xs text-gray-600">Predicted Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-accent/30 to-accent/20 border-2 border-accent/40" />
          <span className="text-xs text-gray-600">Fertile Window</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent" />
            ))}
          </div>
          <span className="text-xs text-gray-600">Logged Period</span>
        </div>
      </div>
    </div>
  );
};

export default CycleCalendar;