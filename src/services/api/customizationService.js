const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const customizationService = {
  getCustomSymptoms: async () => {
    try {
      const response = await apperClient.fetchRecords('custom_symptom_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "is_custom_c"}}
        ],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(symptom => ({
        Id: symptom.Id,
        value: symptom.value_c || '',
        name: symptom.name_c || '',
        icon: symptom.icon_c || 'Heart',
        isCustom: symptom.is_custom_c ?? true
      }));
    } catch (error) {
      console.error("Error fetching custom symptoms:", error);
      return [];
    }
  },

  getCustomMoods: async () => {
    try {
      const response = await apperClient.fetchRecords('custom_mood_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "emoji_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "is_custom_c"}}
        ],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(mood => ({
        Id: mood.Id,
        value: mood.value_c || '',
        name: mood.name_c || '',
        emoji: mood.emoji_c || '😊',
        color: mood.color_c || 'text-gray-800',
        isCustom: mood.is_custom_c ?? true
      }));
    } catch (error) {
      console.error("Error fetching custom moods:", error);
      return [];
    }
  },

  createCustomSymptom: async (symptomData) => {
    try {
      const payload = {
        value_c: symptomData.name.toLowerCase().replace(/\s+/g, '_'),
        name_c: symptomData.name,
        icon_c: symptomData.icon || 'Heart',
        is_custom_c: true
      };

      const response = await apperClient.createRecord('custom_symptom_c', {
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
            value: result.data.value_c || '',
            name: result.data.name_c || '',
            icon: result.data.icon_c || 'Heart',
            isCustom: result.data.is_custom_c ?? true
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating custom symptom:", error);
      return null;
    }
  },

  createCustomMood: async (moodData) => {
    try {
      const payload = {
        value_c: moodData.name.toLowerCase().replace(/\s+/g, '_'),
        name_c: moodData.name,
        emoji_c: moodData.emoji || '😊',
        color_c: moodData.color || 'text-gray-800',
        is_custom_c: true
      };

      const response = await apperClient.createRecord('custom_mood_c', {
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
            value: result.data.value_c || '',
            name: result.data.name_c || '',
            emoji: result.data.emoji_c || '😊',
            color: result.data.color_c || 'text-gray-800',
            isCustom: result.data.is_custom_c ?? true
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating custom mood:", error);
      return null;
    }
  },

  updateCustomSymptom: async (id, symptomData) => {
    try {
      const payload = {
        Id: parseInt(id),
        name_c: symptomData.name,
        icon_c: symptomData.icon,
        value_c: symptomData.name.toLowerCase().replace(/\s+/g, '_')
      };

      const response = await apperClient.updateRecord('custom_symptom_c', {
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
            value: result.data.value_c || '',
            name: result.data.name_c || '',
            icon: result.data.icon_c || 'Heart',
            isCustom: result.data.is_custom_c ?? true
          };
        }
      }

      return null;
    } catch (error) {
      console.error(`Error updating custom symptom ${id}:`, error);
      return null;
    }
  },

  updateCustomMood: async (id, moodData) => {
    try {
      const payload = {
        Id: parseInt(id),
        name_c: moodData.name,
        emoji_c: moodData.emoji,
        color_c: moodData.color,
        value_c: moodData.name.toLowerCase().replace(/\s+/g, '_')
      };

      const response = await apperClient.updateRecord('custom_mood_c', {
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
            value: result.data.value_c || '',
            name: result.data.name_c || '',
            emoji: result.data.emoji_c || '😊',
            color: result.data.color_c || 'text-gray-800',
            isCustom: result.data.is_custom_c ?? true
          };
        }
      }

      return null;
    } catch (error) {
      console.error(`Error updating custom mood ${id}:`, error);
      return null;
    }
  },

  deleteCustomSymptom: async (id) => {
    try {
      const response = await apperClient.deleteRecord('custom_symptom_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        return response.results[0].success;
      }

      return false;
    } catch (error) {
      console.error(`Error deleting custom symptom ${id}:`, error);
      return false;
    }
  },

  deleteCustomMood: async (id) => {
    try {
      const response = await apperClient.deleteRecord('custom_mood_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        return response.results[0].success;
      }

      return false;
    } catch (error) {
      console.error(`Error deleting custom mood ${id}:`, error);
return false;
    }
  }
};

export default customizationService;