import insightsData from "../mockData/healthInsights.json";

let insights = [...insightsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const insightService = {
  getAll: async () => {
    await delay(300);
    return [...insights];
  },

  getByPhase: async (phase) => {
    await delay(250);
    return insights.filter(i => i.cyclePhase === phase).map(i => ({ ...i }));
  },

  getUnviewed: async () => {
    await delay(200);
    return insights.filter(i => !i.viewed).map(i => ({ ...i }));
  },

  markAsViewed: async (id) => {
    await delay(200);
    const index = insights.findIndex(i => i.Id === parseInt(id));
    if (index !== -1) {
      insights[index].viewed = true;
      return { ...insights[index] };
    }
    return null;
  },

  create: async (insightData) => {
    await delay(300);
    const newInsight = {
      Id: Math.max(...insights.map(i => i.Id), 0) + 1,
      viewed: false,
      ...insightData
    };
    insights.push(newInsight);
    return { ...newInsight };
  }
};

export default insightService;