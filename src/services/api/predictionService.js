import predictionsData from "../mockData/cyclePredictions.json";

let predictions = [...predictionsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const predictionService = {
  getCurrent: async () => {
    await delay(300);
    return predictions.length > 0 ? { ...predictions[0] } : null;
  },

  update: async (predictionData) => {
    await delay(400);
    if (predictions.length > 0) {
      predictions[0] = {
        ...predictions[0],
        ...predictionData
      };
      return { ...predictions[0] };
    }
    return null;
  },

  recalculate: async (cycleEntries) => {
    await delay(500);
    
    const periodEntries = cycleEntries.filter(e => e.flowIntensity !== "none");
    if (periodEntries.length < 2) {
      return predictions[0] ? { ...predictions[0] } : null;
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

    const lastPeriodStart = new Date(periodEntries[0].date);
    const nextPeriodStart = new Date(lastPeriodStart);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + avgCycleLength);

    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setDate(nextPeriodEnd.getDate() + 5);

    const ovulationDay = new Date(nextPeriodStart);
    ovulationDay.setDate(ovulationDay.getDate() - 14);

    const fertileStart = new Date(ovulationDay);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulationDay);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    const confidence = Math.min(95, 60 + (cycles.length * 5));

    const updatedPrediction = {
      Id: 1,
      predictedPeriodStart: nextPeriodStart.toISOString().split("T")[0],
      predictedPeriodEnd: nextPeriodEnd.toISOString().split("T")[0],
      fertileWindowStart: fertileStart.toISOString().split("T")[0],
      fertileWindowEnd: fertileEnd.toISOString().split("T")[0],
      ovulationDay: ovulationDay.toISOString().split("T")[0],
      confidence: confidence,
      basedOnCycles: cycles.length
    };

    predictions[0] = updatedPrediction;
    return { ...updatedPrediction };
  }
};

export default predictionService;