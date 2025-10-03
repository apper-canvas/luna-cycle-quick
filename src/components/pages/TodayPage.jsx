import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import QuickCheckIn from "@/components/organisms/QuickCheckIn";
import PredictionCard from "@/components/organisms/PredictionCard";
import insightService from "@/services/api/insightService";
import cycleService from "@/services/api/cycleService";
import aiAnalysisService from "@/services/api/aiAnalysisService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
const TodayPage = () => {
  const [todayEntry, setTodayEntry] = useState(null);
  const [todayInsight, setTodayInsight] = useState(null);
  const [todayAnalysis, setTodayAnalysis] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadTodayData();
  }, [refreshKey]);

  const loadTodayData = async () => {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const entry = await cycleService.getByDate(today);
      setTodayEntry(entry);

      if (entry && entry.Id) {
        const analysis = await aiAnalysisService.getByCheckInId(entry.Id);
        setTodayAnalysis(analysis);
      }

      const insights = await insightService.getUnviewed();
      if (insights.length > 0) {
        setTodayInsight(insights[0]);
      }
    } catch (error) {
      console.error("Failed to load today's data:", error);
    }
  };

  const handleCheckInComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
          {format(new Date(), "EEEE")}
        </h1>
        <p className="text-lg text-gray-600 font-body">
          {format(new Date(), "MMMM d, yyyy")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickCheckIn 
          existingEntry={todayEntry} 
          onComplete={handleCheckInComplete}
        />
        <PredictionCard key={refreshKey} />
      </div>

{todayAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Brain" className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-display font-bold text-gray-900">
                  AI Health Insights
                </h3>
                <Badge variant="primary">Personalized</Badge>
              </div>
              <p className="text-gray-800 font-body leading-relaxed whitespace-pre-line">
                {todayAnalysis.analysisResult}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {todayInsight && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-info/10 to-primary/10 rounded-2xl p-6 border border-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Lightbulb" className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-display font-bold text-gray-900">
                  Today's Tip
                </h3>
                <Badge variant="primary">
                  {todayInsight.category.charAt(0).toUpperCase() + todayInsight.category.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-800 font-body leading-relaxed">
                {todayInsight.message}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TodayPage;