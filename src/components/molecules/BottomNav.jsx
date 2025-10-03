import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const navItems = [
  { to: "/", label: "Today", icon: "Home" },
  { to: "/calendar", label: "Calendar", icon: "Calendar" },
  { to: "/insights", label: "Insights", icon: "TrendingUp" },
  { to: "/profile", label: "Profile", icon: "User" }
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden">
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[70px]",
              isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
            )}
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ApperIcon name={item.icon} className="w-6 h-6" />
                </motion.div>
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;