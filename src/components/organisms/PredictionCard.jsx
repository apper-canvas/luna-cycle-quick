import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import predictionService from "@/services/api/predictionService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const PredictionCard = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPrediction();
  }, []);

  const loadPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictionService.getCurrent();
      setPrediction(data);
    } catch (err) {
      setError("Failed to load predictions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading variant="card" />;
  if (error) return <Error message={error} onRetry={loadPrediction} />;
  if (!prediction) return null;

  const today = new Date();
const nextPeriod = new Date(prediction.predictedPeriodStart);
  const daysUntilPeriod = differenceInDays(nextPeriod, today);

  const getPhaseInfo = () => {
const ovulationDate = new Date(prediction.ovulationDay);
    const fertileStart = new Date(prediction.fertileWindowStart);
    const fertileEnd = new Date(prediction.fertileWindowEnd);

    if (today >= fertileStart && today <= fertileEnd) {
      return {
        phase: "Fertile Window",
        description: "High chance of conception during this period",
        color: "accent",
        icon: "Heart"
      };
    } else if (daysUntilPeriod <= 7) {
      return {
        phase: "Luteal Phase",
        description: "Your period is approaching soon",
        color: "primary",
        icon: "Moon"
      };
    } else if (daysUntilPeriod > 20) {
      return {
        phase: "Menstrual Phase",
        description: "Your period has started or just ended",
        color: "primary",
        icon: "Droplet"
      };
    } else {
      return {
        phase: "Follicular Phase",
        description: "Energy levels typically high during this phase",
        color: "secondary",
        icon: "Sun"
      };
    }
  };

  const phaseInfo = getPhaseInfo();
const confidenceColor = prediction.confidence >= 80 ? "success" : prediction.confidence >= 60 ? "warning" : "error";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/5 to-secondary/10 rounded-2xl shadow-sm p-6 space-y-6 border border-primary/10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <ApperIcon name={phaseInfo.icon} className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-gray-900">
              {phaseInfo.phase}
            </h3>
            <p className="text-sm text-gray-600 font-body">
              {phaseInfo.description}
            </p>
          </div>
        </div>
        <Badge variant={confidenceColor}>
{prediction.confidence}% Confidence
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-gray-600">Next Period</span>
          </div>
          <p className="text-2xl font-display font-bold text-gray-900">
            {daysUntilPeriod > 0 ? `${daysUntilPeriod} days` : "Today"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
{format(nextPeriod, "MMM d, yyyy")}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Heart" className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-gray-600">Ovulation</span>
          </div>
          <p className="text-2xl font-display font-bold text-gray-900">
{format(new Date(prediction.ovulationDay), "MMM d")}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Fertile: {format(new Date(prediction.fertileWindowStart), "MMM d")} - {format(new Date(prediction.fertileWindowEnd), "MMM d")}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="TrendingUp" className="w-4 h-4" />
<span>Based on {prediction.basedOnCycles} cycles</span>
        </div>
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
strokeDashoffset={`${2 * Math.PI * 28 * (1 - prediction.confidence / 100)}`}
              className="text-primary transition-all duration-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{prediction.confidence}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictionCard;