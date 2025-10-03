import customSymptomsData from "../mockData/customSymptoms.json";
import customMoodsData from "../mockData/customMoods.json";

let customSymptoms = [...customSymptomsData];
let customMoods = [...customMoodsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const customizationService = {
  getCustomSymptoms: async () => {
    await delay(200);
    return [...customSymptoms].sort((a, b) => a.name.localeCompare(b.name));
  },

  getCustomMoods: async () => {
    await delay(200);
    return [...customMoods].sort((a, b) => a.name.localeCompare(b.name));
  },

  createCustomSymptom: async (symptomData) => {
    await delay(200);
    const newSymptom = {
      Id: Math.max(...customSymptoms.map(s => s.Id), 0) + 1,
      value: symptomData.name.toLowerCase().replace(/\s+/g, '_'),
      name: symptomData.name,
      icon: symptomData.icon,
      isCustom: true
    };
    customSymptoms.push(newSymptom);
    return { ...newSymptom };
  },

  createCustomMood: async (moodData) => {
    await delay(200);
    const newMood = {
      Id: Math.max(...customMoods.map(m => m.Id), 0) + 1,
      value: moodData.name.toLowerCase().replace(/\s+/g, '_'),
      name: moodData.name,
      emoji: moodData.emoji,
      color: moodData.color,
      isCustom: true
    };
    customMoods.push(newMood);
    return { ...newMood };
  },

  updateCustomSymptom: async (id, symptomData) => {
    await delay(200);
    const index = customSymptoms.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      customSymptoms[index] = {
        ...customSymptoms[index],
        name: symptomData.name,
        icon: symptomData.icon,
        value: symptomData.name.toLowerCase().replace(/\s+/g, '_')
      };
      return { ...customSymptoms[index] };
    }
    return null;
  },

  updateCustomMood: async (id, moodData) => {
    await delay(200);
    const index = customMoods.findIndex(m => m.Id === parseInt(id));
    if (index !== -1) {
      customMoods[index] = {
        ...customMoods[index],
        name: moodData.name,
        emoji: moodData.emoji,
        color: moodData.color,
        value: moodData.name.toLowerCase().replace(/\s+/g, '_')
      };
      return { ...customMoods[index] };
    }
    return null;
  },

  deleteCustomSymptom: async (id) => {
    await delay(200);
    const index = customSymptoms.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      customSymptoms.splice(index, 1);
      return true;
    }
    return false;
  },

  deleteCustomMood: async (id) => {
    await delay(200);
    const index = customMoods.findIndex(m => m.Id === parseInt(id));
    if (index !== -1) {
      customMoods.splice(index, 1);
      return true;
    }
    return false;
  }
};

export default customizationService;