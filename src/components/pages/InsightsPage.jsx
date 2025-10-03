import { motion } from "framer-motion";
import InsightsFeed from "@/components/organisms/InsightsFeed";
import StatsOverview from "@/components/organisms/StatsOverview";

const InsightsPage = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Health Insights
        </h1>
        <p className="text-gray-600 font-body">
          Personalized recommendations and patterns
        </p>
      </motion.div>

      <StatsOverview />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
          Your Insights
        </h2>
        <InsightsFeed />
      </motion.div>
    </div>
  );
};

export default InsightsPage;