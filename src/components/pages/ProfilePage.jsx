import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import Badge from "@/components/atoms/Badge";
import profileService from "@/services/api/profileService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.get();
      setProfile(data);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (key, value) => {
    setSaving(true);
    try {
      const updatedProfile = await profileService.updatePreferences({
        [key]: value
      });
      setProfile(updatedProfile);
      toast.success("Preferences updated successfully");
    } catch (err) {
      toast.error("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProfile} />;
  if (!profile) return null;

  const preferenceSections = [
    {
      title: "Notifications",
      items: [
        {
          key: "notifications",
          label: "Push Notifications",
          description: "Receive notifications for predictions and reminders",
          icon: "Bell"
        },
        {
          key: "reminders",
          label: "Daily Reminders",
          description: "Get reminders to log your daily check-in",
          icon: "Clock"
        },
        {
          key: "insights",
          label: "Health Insights",
          description: "Receive personalized health tips and insights",
          icon: "Lightbulb"
        }
      ]
    },
    {
      title: "Privacy",
      items: [
        {
          key: "privacyMode",
          label: "Privacy Mode",
          description: "Hide sensitive data on lock screen notifications",
          icon: "Lock"
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Profile & Settings
        </h1>
        <p className="text-gray-600 font-body">
          Manage your preferences and account
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 to-secondary/20 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <ApperIcon name="User" className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-900">
              Luna Cycle User
            </h2>
<p className="text-sm text-gray-600">
              Tracking since {format(new Date(profile.trackingSince), "MMMM d, yyyy")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
              <span className="text-sm text-gray-600">Avg Cycle</span>
            </div>
<p className="text-2xl font-display font-bold text-gray-900">
              {profile.averageCycleLength}
            </p>
            <p className="text-xs text-gray-500">days</p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="Clock" className="w-5 h-5 text-accent" />
              <span className="text-sm text-gray-600">Avg Period</span>
            </div>
            <p className="text-2xl font-display font-bold text-gray-900">
{profile.averagePeriodLength}
            </p>
            <p className="text-xs text-gray-500">days</p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-success" />
              <span className="text-sm text-gray-600">Last Period</span>
            </div>
            <p className="text-lg font-display font-bold text-gray-900">
{format(new Date(profile.lastPeriodStart), "MMM d")}
            </p>
            <p className="text-xs text-gray-500">{format(new Date(profile.lastPeriodStart), "yyyy")}</p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="Shield" className="w-5 h-5 text-info" />
              <span className="text-sm text-gray-600">Data Status</span>
            </div>
            <Badge variant="success">Secure</Badge>
            <p className="text-xs text-gray-500 mt-1">Local-first</p>
          </div>
        </div>
      </motion.div>

      {preferenceSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * (sectionIndex + 1) }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <h3 className="text-xl font-display font-bold text-gray-900 mb-4">
            {section.title}
          </h3>

          <div className="space-y-4">
            {section.items.map((item) => (
              <div
                key={item.key}
                className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-50/50 hover:from-secondary/10 hover:to-secondary/5 transition-all duration-200"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    <ApperIcon name={item.icon} className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Label className="mb-1">{item.label}</Label>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>

                <button
                  type="button"
onClick={() => handlePreferenceChange(item.key, !profile.preferences[item.key])}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    profile.preferences[item.key] ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      profile.preferences[item.key] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm p-6"
      >
        <h3 className="text-xl font-display font-bold text-gray-900 mb-4">
          Data Management
        </h3>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <ApperIcon name="Download" className="w-5 h-5" />
            Export My Data
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <ApperIcon name="FileText" className="w-5 h-5" />
            Privacy Policy
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <ApperIcon name="HelpCircle" className="w-5 h-5" />
            Help & Support
          </Button>

          <Button variant="ghost" className="w-full justify-start text-error hover:bg-error/5">
            <ApperIcon name="Trash2" className="w-5 h-5" />
            Delete All Data
          </Button>
        </div>
      </motion.div>

      <div className="text-center text-sm text-gray-500 py-4">
        <p>Luna Cycle v1.0.0</p>
        <p className="mt-1">Your data is stored securely and privately</p>
      </div>
    </div>
  );
};

export default ProfilePage;