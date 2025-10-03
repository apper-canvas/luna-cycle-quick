const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const predictionService = {
  getCurrent: async () => {
    try {
      const response = await apperClient.fetchRecords('cycle_prediction_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "predicted_period_start_c"}},
          {"field": {"Name": "predicted_period_end_c"}},
          {"field": {"Name": "fertile_window_start_c"}},
          {"field": {"Name": "fertile_window_end_c"}},
          {"field": {"Name": "ovulation_day_c"}},
          {"field": {"Name": "confidence_c"}},
          {"field": {"Name": "based_on_cycles_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1, "offset": 0}
      });

      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }

      const prediction = response.data[0];
      return {
        Id: prediction.Id,
        predictedPeriodStart: prediction.predicted_period_start_c,
        predictedPeriodEnd: prediction.predicted_period_end_c,
        fertileWindowStart: prediction.fertile_window_start_c,
        fertileWindowEnd: prediction.fertile_window_end_c,
        ovulationDay: prediction.ovulation_day_c,
        confidence: prediction.confidence_c || 0,
        basedOnCycles: prediction.based_on_cycles_c || 0
      };
    } catch (error) {
      console.error("Error fetching current prediction:", error);
      return null;
    }
  },

  update: async (predictionData) => {
    try {
      const currentResponse = await apperClient.fetchRecords('cycle_prediction_c', {
        fields: [{"field": {"Name": "Id"}}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1, "offset": 0}
      });

      let predictionId = null;
      if (currentResponse.success && currentResponse.data && currentResponse.data.length > 0) {
        predictionId = currentResponse.data[0].Id;
      }

      if (!predictionId) {
        return await predictionService.create(predictionData);
      }

      const payload = {
        Id: predictionId
      };

      if (predictionData.predictedPeriodStart) payload.predicted_period_start_c = predictionData.predictedPeriodStart;
      if (predictionData.predictedPeriodEnd) payload.predicted_period_end_c = predictionData.predictedPeriodEnd;
      if (predictionData.fertileWindowStart) payload.fertile_window_start_c = predictionData.fertileWindowStart;
      if (predictionData.fertileWindowEnd) payload.fertile_window_end_c = predictionData.fertileWindowEnd;
      if (predictionData.ovulationDay) payload.ovulation_day_c = predictionData.ovulationDay;
      if (predictionData.confidence !== undefined) payload.confidence_c = predictionData.confidence;
      if (predictionData.basedOnCycles !== undefined) payload.based_on_cycles_c = predictionData.basedOnCycles;

      const response = await apperClient.updateRecord('cycle_prediction_c', {
        records: [payload]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          return {
            Id: result.data.Id,
            predictedPeriodStart: result.data.predicted_period_start_c,
            predictedPeriodEnd: result.data.predicted_period_end_c,
            fertileWindowStart: result.data.fertile_window_start_c,
            fertileWindowEnd: result.data.fertile_window_end_c,
            ovulationDay: result.data.ovulation_day_c,
            confidence: result.data.confidence_c || 0,
            basedOnCycles: result.data.based_on_cycles_c || 0
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating prediction:", error);
      return null;
    }
  },

  create: async (predictionData) => {
    try {
      const payload = {
        predicted_period_start_c: predictionData.predictedPeriodStart,
        predicted_period_end_c: predictionData.predictedPeriodEnd,
        fertile_window_start_c: predictionData.fertileWindowStart,
        fertile_window_end_c: predictionData.fertileWindowEnd,
        ovulation_day_c: predictionData.ovulationDay,
        confidence_c: predictionData.confidence || 0,
        based_on_cycles_c: predictionData.basedOnCycles || 0
      };

      const response = await apperClient.createRecord('cycle_prediction_c', {
        records: [payload]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          return {
            Id: result.data.Id,
            predictedPeriodStart: result.data.predicted_period_start_c,
            predictedPeriodEnd: result.data.predicted_period_end_c,
            fertileWindowStart: result.data.fertile_window_start_c,
            fertileWindowEnd: result.data.fertile_window_end_c,
            ovulationDay: result.data.ovulation_day_c,
            confidence: result.data.confidence_c || 0,
            basedOnCycles: result.data.based_on_cycles_c || 0
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating prediction:", error);
      return null;
    }
  },

  recalculate: async (cycleEntries) => {
    const periodEntries = cycleEntries.filter(e => e.flowIntensity !== "none");
    if (periodEntries.length < 2) {
      const current = await predictionService.getCurrent();
      return current;
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
      predictedPeriodStart: nextPeriodStart.toISOString().split("T")[0],
      predictedPeriodEnd: nextPeriodEnd.toISOString().split("T")[0],
      fertileWindowStart: fertileStart.toISOString().split("T")[0],
      fertileWindowEnd: fertileEnd.toISOString().split("T")[0],
      ovulationDay: ovulationDay.toISOString().split("T")[0],
      confidence: confidence,
      basedOnCycles: cycles.length
    };

return await predictionService.update(updatedPrediction);
  }
};

export default predictionService;