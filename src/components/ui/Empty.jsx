import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Calendar",
  title = "No data yet", 
  message = "Start tracking to see your insights",
  action,
  actionLabel = "Get Started"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary/30 to-primary/20 flex items-center justify-center">
        <ApperIcon name={icon} className="w-10 h-10 text-primary" />
      </div>
      
      <div className="text-center max-w-sm">
        <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 font-body">{message}</p>
      </div>

      {action && (
        <Button onClick={action} variant="primary" size="lg">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;