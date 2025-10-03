import { motion } from "framer-motion";

const Loading = ({ variant = "default" }) => {
  if (variant === "calendar") {
    return (
      <div className="grid grid-cols-7 gap-2 p-4">
        {[...Array(35)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.02 }}
            className="aspect-square rounded-lg bg-gradient-to-br from-secondary/30 to-primary/30"
          />
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <div className="h-6 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-lg w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-secondary/20 to-primary/20 rounded w-full" />
          <div className="h-4 bg-gradient-to-r from-secondary/20 to-primary/20 rounded w-5/6" />
          <div className="h-4 bg-gradient-to-r from-secondary/20 to-primary/20 rounded w-4/6" />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 rounded-full border-4 border-secondary border-t-primary"
      />
      <p className="text-primary/70 font-medium">Loading...</p>
    </div>
  );
};

export default Loading;