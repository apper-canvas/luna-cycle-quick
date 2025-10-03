import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { differenceInDays } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import profileService from "@/services/api/profileService";
import cycleService from "@/services/api/cycleService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const StatsOverview = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, entries] = await Promise.all([
        profileService.get(),
        cycleService.getAll()
      ]);

const symptoms = await cycleService.getRecentSymptoms(30);
      const mostCommonSymptom = Object.entries(symptoms).sort((a, b) => b[1] - a[1])[0];

      const moodCounts = {};
entries.forEach(entry => {
        if (entry.mood) {
          moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        }
      });
      const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

const trackingDays = differenceInDays(new Date(), new Date(profileData.trackingSince));

      setProfile(profileData);
      setStats({
        trackingDays,
        totalEntries: entries.length,
        mostCommonSymptom: mostCommonSymptom ? mostCommonSymptom[0].replace("_", " ") : "None",
        mostCommonMood: mostCommonMood ? mostCommonMood[0] : "neutral"
      });
    } catch (err) {
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading variant="card" />;
  if (error) return <Error message={error} onRetry={loadStats} />;
  if (!profile || !stats) return null;

  const statCards = [
    {
      icon: "Calendar",
      label: "Avg Cycle Length",
value: `${profile.averageCycleLength} days`,
      color: "from-primary/20 to-primary/10",
      textColor: "text-primary"
    },
    {
      icon: "Clock",
label: "Avg Period Length",
      value: `${profile.averagePeriodLength} days`,
      color: "from-accent/20 to-accent/10",
      textColor: "text-accent"
    },
    {
      icon: "TrendingUp",
      label: "Tracking Since",
      value: `${stats.trackingDays} days`,
      color: "from-success/20 to-success/10",
      textColor: "text-success"
    },
    {
      icon: "Activity",
      label: "Total Entries",
      value: stats.totalEntries,
      color: "from-info/20 to-info/10",
      textColor: "text-info"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 shadow-sm`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                <ApperIcon name={stat.icon} className={`w-5 h-5 ${stat.textColor}`} />
              </div>
              <span className="text-sm font-medium text-gray-600">{stat.label}</span>
            </div>
            <p className={`text-3xl font-display font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-warning/20 to-warning/10 flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-warning" />
            </div>
            <h3 className="text-lg font-display font-bold text-gray-900">Most Common Symptom</h3>
          </div>
          <p className="text-2xl font-display font-bold text-gray-900 capitalize">
            {stats.mostCommonSymptom}
          </p>
          <p className="text-sm text-gray-500 mt-2">Based on last 30 days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center">
              <ApperIcon name="Smile" className="w-5 h-5 text-success" />
            </div>
            <h3 className="text-lg font-display font-bold text-gray-900">Most Common Mood</h3>
          </div>
          <p className="text-2xl font-display font-bold text-gray-900 capitalize">
            {stats.mostCommonMood}
          </p>
          <p className="text-sm text-gray-500 mt-2">Overall tracking period</p>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsOverview;