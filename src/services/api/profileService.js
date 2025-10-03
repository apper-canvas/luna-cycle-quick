import profileData from "../mockData/userProfile.json";

let userProfile = { ...profileData };

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const profileService = {
  get: async () => {
    await delay(250);
    return { ...userProfile };
  },

  update: async (updates) => {
    await delay(300);
    userProfile = {
      ...userProfile,
      ...updates
    };
    return { ...userProfile };
  },

  updatePreferences: async (preferences) => {
    await delay(250);
    userProfile.preferences = {
      ...userProfile.preferences,
      ...preferences
    };
    return { ...userProfile };
  },

  calculateStats: async (cycleEntries) => {
    await delay(300);
    
    const periodEntries = cycleEntries.filter(e => e.flowIntensity !== "none");
    if (periodEntries.length === 0) {
      return { ...userProfile };
    }

    const cycles = [];
    let currentCycle = [periodEntries[0]];
    
    for (let i = 1; i < periodEntries.length; i++) {
      const prevDate = new Date(periodEntries[i - 1].date);
      const currDate = new Date(periodEntries[i].date);
      const daysDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 10) {
        cycles.push(currentCycle);
        currentCycle = [periodEntries[i]];
      } else {
        currentCycle.push(periodEntries[i]);
      }
    }
    cycles.push(currentCycle);

    const periodLengths = cycles.map(cycle => cycle.length);
    const avgPeriodLength = periodLengths.length > 0
      ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
      : 5;

    const cycleLengths = [];
    for (let i = 0; i < cycles.length - 1; i++) {
      const start = new Date(cycles[i][0].date);
      const nextStart = new Date(cycles[i + 1][0].date);
      const length = Math.floor((nextStart - start) / (1000 * 60 * 60 * 24));
      cycleLengths.push(length);
    }

    const avgCycleLength = cycleLengths.length > 0
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
      : 28;

    userProfile.averageCycleLength = avgCycleLength;
    userProfile.averagePeriodLength = avgPeriodLength;
    userProfile.lastPeriodStart = periodEntries[0].date;

    return { ...userProfile };
  }
};

export default profileService;