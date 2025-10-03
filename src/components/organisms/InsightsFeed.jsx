import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import insightService from "@/services/api/insightService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const InsightsFeed = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await insightService.getAll();
      setInsights(data);
    } catch (err) {
      setError("Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type, category) => {
    if (type === "alert") return "AlertCircle";
    if (type === "pattern") return "TrendingUp";
    
    switch (category) {
      case "nutrition": return "Apple";
      case "exercise": return "Dumbbell";
      case "mood": return "Smile";
      case "symptom": return "Activity";
      default: return "Info";
    }
  };

  const getInsightColor = (priority) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "info";
      default: return "default";
    }
  };

  if (loading) return <Loading variant="card" />;
  if (error) return <Error message={error} onRetry={loadInsights} />;
  if (insights.length === 0) {
    return <Empty icon="Lightbulb" title="No insights yet" message="Keep logging your data to receive personalized health insights" />;
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <motion.div
          key={insight.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
              <ApperIcon name={getInsightIcon(insight.type, insight.category)} className="w-6 h-6 text-primary" />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={getInsightColor(insight.priority)}>
                  {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                </Badge>
                <Badge variant="secondary">
                  {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
                </Badge>
              </div>
              
              <p className="text-gray-800 font-body leading-relaxed">
                {insight.message}
              </p>
              
              {!insight.viewed && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={async () => {
                    await insightService.markAsViewed(insight.Id);
                    loadInsights();
                  }}
                >
                  <ApperIcon name="Check" className="w-4 h-4" />
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default InsightsFeed;