import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import CycleCalendar from "@/components/organisms/CycleCalendar";
import QuickCheckIn from "@/components/organisms/QuickCheckIn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import cycleService from "@/services/api/cycleService";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDateSelect = async (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const entry = await cycleService.getByDate(dateStr);
    setSelectedDate(date);
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedDate(null);
    setSelectedEntry(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Cycle Calendar
          </h1>
          <p className="text-gray-600 font-body">
            Track your cycle and view predictions
          </p>
        </div>
      </motion.div>

      <CycleCalendar key={refreshKey} onDateSelect={handleDateSelect} />

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleModalClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-display font-bold text-gray-900">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </h2>
              <Button variant="ghost" size="sm" onClick={handleModalClose}>
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              <QuickCheckIn
                existingEntry={selectedEntry}
                onComplete={handleModalClose}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CalendarPage;