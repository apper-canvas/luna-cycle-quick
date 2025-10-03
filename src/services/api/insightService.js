const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const insightService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('health_insight_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "cycle_phase_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "viewed_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(insight => ({
        Id: insight.Id,
        type: insight.type_c || '',
        category: insight.category_c || '',
        message: insight.message_c || '',
        cyclePhase: insight.cycle_phase_c || '',
        priority: insight.priority_c || '',
        viewed: insight.viewed_c || false
      }));
    } catch (error) {
      console.error("Error fetching health insights:", error);
      return [];
    }
  },

  getByPhase: async (phase) => {
    try {
      const response = await apperClient.fetchRecords('health_insight_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "cycle_phase_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "viewed_c"}}
        ],
        where: [{"FieldName": "cycle_phase_c", "Operator": "EqualTo", "Values": [phase]}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(insight => ({
        Id: insight.Id,
        type: insight.type_c || '',
        category: insight.category_c || '',
        message: insight.message_c || '',
        cyclePhase: insight.cycle_phase_c || '',
        priority: insight.priority_c || '',
        viewed: insight.viewed_c || false
      }));
    } catch (error) {
      console.error("Error fetching insights by phase:", error);
      return [];
    }
  },

  getUnviewed: async () => {
    try {
      const response = await apperClient.fetchRecords('health_insight_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "cycle_phase_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "viewed_c"}}
        ],
        where: [{"FieldName": "viewed_c", "Operator": "EqualTo", "Values": [false]}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(insight => ({
        Id: insight.Id,
        type: insight.type_c || '',
        category: insight.category_c || '',
        message: insight.message_c || '',
        cyclePhase: insight.cycle_phase_c || '',
        priority: insight.priority_c || '',
        viewed: insight.viewed_c || false
      }));
    } catch (error) {
      console.error("Error fetching unviewed insights:", error);
      return [];
    }
  },

  markAsViewed: async (id) => {
    try {
      const response = await apperClient.updateRecord('health_insight_c', {
        records: [{
          Id: parseInt(id),
          viewed_c: true
        }]
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
            type: result.data.type_c || '',
            category: result.data.category_c || '',
            message: result.data.message_c || '',
            cyclePhase: result.data.cycle_phase_c || '',
            priority: result.data.priority_c || '',
            viewed: result.data.viewed_c || false
          };
        }
      }

      return null;
    } catch (error) {
      console.error(`Error marking insight ${id} as viewed:`, error);
      return null;
    }
  },

  create: async (insightData) => {
    try {
      const payload = {
        type_c: insightData.type || '',
        category_c: insightData.category || '',
        message_c: insightData.message || '',
        cycle_phase_c: insightData.cyclePhase || '',
        priority_c: insightData.priority || '',
        viewed_c: false
      };

      const response = await apperClient.createRecord('health_insight_c', {
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
            type: result.data.type_c || '',
            category: result.data.category_c || '',
            message: result.data.message_c || '',
            cyclePhase: result.data.cycle_phase_c || '',
            priority: result.data.priority_c || '',
            viewed: result.data.viewed_c || false
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating health insight:", error);
      return null;
    }
  }
};

export default insightService;