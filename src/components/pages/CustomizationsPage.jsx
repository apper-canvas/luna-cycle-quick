import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import customizationService from '@/services/api/customizationService';
import { cn } from '@/utils/cn';

const availableIcons = [
  "Heart", "Brain", "Zap", "Battery", "Circle", "Droplet", "ArrowDown", 
  "AlertCircle", "Activity", "Wind", "Thermometer", "Cloud", "Sun", 
  "Moon", "Star", "Flame", "Sparkles", "Eye", "Smile", "Frown"
];

const availableEmojis = [
  { emoji: "😊", color: "text-success" },
  { emoji: "😐", color: "text-gray-500" },
  { emoji: "😢", color: "text-info" },
  { emoji: "😰", color: "text-warning" },
  { emoji: "⚡", color: "text-accent" },
  { emoji: "😴", color: "text-primary" },
  { emoji: "😡", color: "text-error" },
  { emoji: "🥰", color: "text-pink-500" },
  { emoji: "😎", color: "text-blue-500" },
  { emoji: "🤔", color: "text-purple-500" },
  { emoji: "😌", color: "text-green-400" },
  { emoji: "😬", color: "text-orange-500" },
  { emoji: "🤗", color: "text-yellow-500" },
  { emoji: "😔", color: "text-gray-600" },
  { emoji: "😤", color: "text-red-400" }
];

function CustomizationsPage() {
  const [activeTab, setActiveTab] = useState('symptoms');
  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [customMoods, setCustomMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState(null);
  const [editingMood, setEditingMood] = useState(null);
  
  const [symptomForm, setSymptomForm] = useState({ name: '', icon: 'Heart' });
  const [moodForm, setMoodForm] = useState({ name: '', emoji: '😊', color: 'text-success' });

  useEffect(() => {
    loadCustomizations();
  }, []);

  async function loadCustomizations() {
    try {
      setLoading(true);
      const [symptoms, moods] = await Promise.all([
        customizationService.getCustomSymptoms(),
        customizationService.getCustomMoods()
      ]);
      setCustomSymptoms(symptoms);
      setCustomMoods(moods);
    } catch (error) {
      toast.error('Failed to load customizations');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSymptom(e) {
    e.preventDefault();
    if (!symptomForm.name.trim()) {
      toast.error('Please enter a symptom name');
      return;
    }

    try {
      if (editingSymptom) {
        await customizationService.updateCustomSymptom(editingSymptom.Id, symptomForm);
        toast.success('Symptom updated successfully');
      } else {
        await customizationService.createCustomSymptom(symptomForm);
        toast.success('Custom symptom added successfully');
      }
      await loadCustomizations();
      resetSymptomForm();
    } catch (error) {
      toast.error('Failed to save symptom');
    }
  }

  async function handleSaveMood(e) {
    e.preventDefault();
    if (!moodForm.name.trim()) {
      toast.error('Please enter a mood name');
      return;
    }

    try {
      if (editingMood) {
        await customizationService.updateCustomMood(editingMood.Id, moodForm);
        toast.success('Mood updated successfully');
      } else {
        await customizationService.createCustomMood(moodForm);
        toast.success('Custom mood added successfully');
      }
      await loadCustomizations();
      resetMoodForm();
    } catch (error) {
      toast.error('Failed to save mood');
    }
  }

  async function handleDeleteSymptom(id) {
    if (confirm('Are you sure you want to delete this custom symptom?')) {
      try {
        await customizationService.deleteCustomSymptom(id);
        toast.success('Symptom deleted successfully');
        await loadCustomizations();
      } catch (error) {
        toast.error('Failed to delete symptom');
      }
    }
  }

  async function handleDeleteMood(id) {
    if (confirm('Are you sure you want to delete this custom mood?')) {
      try {
        await customizationService.deleteCustomMood(id);
        toast.success('Mood deleted successfully');
        await loadCustomizations();
      } catch (error) {
        toast.error('Failed to delete mood');
      }
    }
  }

function startEditSymptom(symptom) {
    setEditingSymptom(symptom);
    setSymptomForm({ name: symptom.name, icon: symptom.icon });
    setShowSymptomForm(true);
  }

function startEditMood(mood) {
    setEditingMood(mood);
    setMoodForm({ name: mood.name, emoji: mood.emoji, color: mood.color });
    setShowMoodForm(true);
  }

  function resetSymptomForm() {
    setSymptomForm({ name: '', icon: 'Heart' });
    setEditingSymptom(null);
    setShowSymptomForm(false);
  }

  function resetMoodForm() {
    setMoodForm({ name: '', emoji: '😊', color: 'text-success' });
    setEditingMood(null);
    setShowMoodForm(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-to-br from-primary to-secondary p-6 text-white">
        <h1 className="text-2xl font-display font-bold mb-2">Customizations</h1>
        <p className="text-white/90 text-sm">Personalize your tracking experience</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('symptoms')}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200",
              activeTab === 'symptoms'
                ? "bg-gradient-to-br from-primary/10 to-secondary/10 text-primary"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            Symptoms
          </button>
          <button
            onClick={() => setActiveTab('moods')}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200",
              activeTab === 'moods'
                ? "bg-gradient-to-br from-primary/10 to-secondary/10 text-primary"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            Moods
          </button>
        </div>

        {activeTab === 'symptoms' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-semibold text-gray-800">
                Custom Symptoms ({customSymptoms.length})
              </h2>
              <Button
                onClick={() => setShowSymptomForm(!showSymptomForm)}
                size="sm"
                className="gap-2"
              >
                <ApperIcon name={showSymptomForm ? "X" : "Plus"} size={16} />
                {showSymptomForm ? "Cancel" : "Add"}
              </Button>
            </div>

            <AnimatePresence>
              {showSymptomForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <form onSubmit={handleSaveSymptom} className="space-y-4">
                    <div>
                      <Label>Symptom Name</Label>
                      <Input
                        value={symptomForm.name}
                        onChange={(e) => setSymptomForm({ ...symptomForm, name: e.target.value })}
                        placeholder="e.g., Joint Pain, Dizziness"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Icon</Label>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {availableIcons.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => setSymptomForm({ ...symptomForm, icon })}
                            className={cn(
                              "p-3 rounded-lg border-2 transition-all duration-200",
                              symptomForm.icon === icon
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <ApperIcon 
                              name={icon} 
                              className={cn(
                                "w-5 h-5 mx-auto",
                                symptomForm.icon === icon ? "text-primary" : "text-gray-400"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingSymptom ? "Update" : "Add"} Symptom
                      </Button>
                      {editingSymptom && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={resetSymptomForm}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {customSymptoms.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <ApperIcon name="Plus" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No custom symptoms yet</p>
                  <p className="text-sm text-gray-400 mt-1">Add symptoms unique to your experience</p>
                </div>
              ) : (
                customSymptoms.map((symptom) => (
                  <motion.div
key={symptom.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
                  >
<div className="p-2 bg-primary/5 rounded-lg">
                      <ApperIcon name={symptom.icon} className="w-5 h-5 text-primary" />
                    </div>
<span className="flex-1 font-medium text-gray-800">{symptom.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditSymptom(symptom)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Edit" size={18} className="text-gray-600" />
                      </button>
                      <button
onClick={() => handleDeleteSymptom(symptom.Id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Trash2" size={18} className="text-error" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'moods' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-semibold text-gray-800">
                Custom Moods ({customMoods.length})
              </h2>
              <Button
                onClick={() => setShowMoodForm(!showMoodForm)}
                size="sm"
                className="gap-2"
              >
                <ApperIcon name={showMoodForm ? "X" : "Plus"} size={16} />
                {showMoodForm ? "Cancel" : "Add"}
              </Button>
            </div>

            <AnimatePresence>
              {showMoodForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <form onSubmit={handleSaveMood} className="space-y-4">
                    <div>
                      <Label>Mood Name</Label>
                      <Input
                        value={moodForm.name}
                        onChange={(e) => setMoodForm({ ...moodForm, name: e.target.value })}
                        placeholder="e.g., Peaceful, Motivated"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Emoji</Label>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {availableEmojis.map(({ emoji, color }) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setMoodForm({ ...moodForm, emoji, color })}
                            className={cn(
                              "p-3 rounded-lg border-2 transition-all duration-200 text-2xl",
                              moodForm.emoji === emoji
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingMood ? "Update" : "Add"} Mood
                      </Button>
                      {editingMood && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={resetMoodForm}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {customMoods.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <ApperIcon name="Plus" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No custom moods yet</p>
                  <p className="text-sm text-gray-400 mt-1">Add moods that match your feelings</p>
                </div>
              ) : (
                customMoods.map((mood) => (
                  <motion.div
key={mood.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
                  >
<span className="text-3xl">{mood.emoji}</span>
                    <span className={cn("flex-1 font-medium", mood.color)}>{mood.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditMood(mood)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Edit" size={18} className="text-gray-600" />
                      </button>
                      <button
onClick={() => handleDeleteMood(mood.Id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Trash2" size={18} className="text-error" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomizationsPage;