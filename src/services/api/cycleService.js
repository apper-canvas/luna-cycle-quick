import cycleEntriesData from "../mockData/cycleEntries.json";

let cycleEntries = [...cycleEntriesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const cycleService = {
  getAll: async () => {
    await delay(300);
    return [...cycleEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getById: async (id) => {
    await delay(200);
    const entry = cycleEntries.find(e => e.Id === parseInt(id));
    return entry ? { ...entry } : null;
  },

  getByDateRange: async (startDate, endDate) => {
    await delay(250);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return cycleEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    }).map(e => ({ ...e }));
  },

  getByDate: async (date) => {
    await delay(200);
    const entry = cycleEntries.find(e => e.date === date);
    return entry ? { ...entry } : null;
  },

  create: async (entryData) => {
    await delay(300);
    const newEntry = {
      Id: Math.max(...cycleEntries.map(e => e.Id), 0) + 1,
      ...entryData,
      timestamp: new Date().toISOString()
    };
    cycleEntries.push(newEntry);
    return { ...newEntry };
  },

  update: async (id, entryData) => {
    await delay(300);
    const index = cycleEntries.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      cycleEntries[index] = {
        ...cycleEntries[index],
        ...entryData,
        Id: parseInt(id)
      };
      return { ...cycleEntries[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay(250);
    const index = cycleEntries.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      cycleEntries.splice(index, 1);
      return true;
    }
    return false;
  },

  getRecentSymptoms: async (days = 30) => {
    await delay(200);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentEntries = cycleEntries.filter(entry => 
      new Date(entry.date) >= cutoffDate
    );

    const symptomCounts = {};
    recentEntries.forEach(entry => {
      entry.symptoms.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    });

return symptomCounts;
  },

  getSymptomTrends: async (days = 90) => {
    await delay(200);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentEntries = cycleEntries.filter(entry => 
      new Date(entry.date) >= cutoffDate
    );

    const dateMap = new Map();
    recentEntries.forEach(entry => {
      const dateStr = entry.date;
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, {});
      }
      const dayData = dateMap.get(dateStr);
      entry.symptoms.forEach(symptom => {
        dayData[symptom] = (dayData[symptom] || 0) + 1;
      });
    });

    const allSymptoms = new Set();
    recentEntries.forEach(entry => {
      entry.symptoms.forEach(symptom => allSymptoms.add(symptom));
    });

    const sortedDates = Array.from(dateMap.keys()).sort();
    
    const series = Array.from(allSymptoms).map(symptom => ({
      name: symptom.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      data: sortedDates.map(date => dateMap.get(date)[symptom] || 0)
    }));

    return { dates: sortedDates, series };
  }
};

export default cycleService;