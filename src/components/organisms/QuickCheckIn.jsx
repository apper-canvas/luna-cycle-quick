import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import FlowSelector from "@/components/molecules/FlowSelector";
import MoodPicker from "@/components/molecules/MoodPicker";
import SymptomSelector from "@/components/molecules/SymptomSelector";
import cycleService from "@/services/api/cycleService";
import aiAnalysisService from "@/services/api/aiAnalysisService";
const QuickCheckIn = ({ onComplete, existingEntry = null }) => {
  const [flowIntensity, setFlowIntensity] = useState("none");
  const [mood, setMood] = useState("neutral");
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingEntry) {
setFlowIntensity(existingEntry.flowIntensity);
      setMood(existingEntry.mood);
      setSymptoms(existingEntry.symptoms || []);
      setNotes(existingEntry.notes || "");
    }
  }, [existingEntry]);

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const entryData = {
        date: format(new Date(), "yyyy-MM-dd"),
        flowIntensity,
        mood,
        symptoms,
        notes
      };

      let savedEntry;
      if (existingEntry) {
        savedEntry = await cycleService.update(existingEntry.Id, entryData);
        toast.success("Check-in updated successfully!");
      } else {
        savedEntry = await cycleService.create(entryData);
        toast.success("Check-in saved successfully!");
      }

      // Trigger AI analysis after successful check-in save
      if (savedEntry && savedEntry.Id) {
        try {
          const analysisResult = await aiAnalysisService.invokeAnalysis({
            ...entryData,
            checkInId: savedEntry.Id
          });

          if (analysisResult && analysisResult.analysis) {
            // Save analysis to database
            await aiAnalysisService.create({
              analysisResult: analysisResult.analysis,
              checkInId: savedEntry.Id,
              userProfileId: null
            });

            toast.success("Check-in analyzed! View insights on Today page.", {
              autoClose: 5000
            });
          }
        } catch (analysisError) {
          console.error("AI analysis failed:", analysisError);
        }
      }

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast.error("Failed to save check-in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm p-6 space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <ApperIcon name="Edit3" className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900">
            {existingEntry ? "Update Check-In" : "Quick Check-In"}
          </h2>
          <p className="text-sm text-gray-500 font-body">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Flow Intensity</Label>
          <FlowSelector value={flowIntensity} onChange={setFlowIntensity} />
        </div>

        <div>
          <Label>How are you feeling?</Label>
          <MoodPicker value={mood} onChange={setMood} />
        </div>

        <div>
          <Label>Symptoms (Optional)</Label>
          <SymptomSelector value={symptoms} onChange={setSymptoms} />
        </div>

        <div>
          <Label>Notes (Optional)</Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all duration-200 resize-none bg-white"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        variant="primary" 
        size="lg" 
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <ApperIcon name="Loader2" className="w-5 h-5" />
            </motion.div>
            Saving...
          </>
        ) : (
          <>
            <ApperIcon name="Check" className="w-5 h-5" />
            {existingEntry ? "Update Check-In" : "Save Check-In"}
          </>
        )}
      </Button>
    </motion.form>
  );
};

export default QuickCheckIn;