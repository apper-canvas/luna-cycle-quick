import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8"
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-error/20 to-error/10 flex items-center justify-center">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
          Oops!
        </h3>
        <p className="text-gray-600 font-body">{message}</p>
      </div>

      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;