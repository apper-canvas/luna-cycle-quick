const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const cycleService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('cycle_entry_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "flow_intensity_c"}},
          {"field": {"Name": "symptoms_c"}},
          {"field": {"Name": "mood_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "timestamp_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(entry => ({
        Id: entry.Id,
        date: entry.date_c,
        flowIntensity: entry.flow_intensity_c || 'none',
        symptoms: entry.symptoms_c ? entry.symptoms_c.split(',') : [],
        mood: entry.mood_c || '',
        notes: entry.notes_c || '',
        timestamp: entry.timestamp_c
      }));
    } catch (error) {
      console.error("Error fetching cycle entries:", error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('cycle_entry_c', id, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "flow_intensity_c"}},
          {"field": {"Name": "symptoms_c"}},
          {"field": {"Name": "mood_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "timestamp_c"}}
        ]
      });

      if (!response.success || !response.data) {
        return null;
      }

      const entry = response.data;
      return {
        Id: entry.Id,
        date: entry.date_c,
        flowIntensity: entry.flow_intensity_c || 'none',
        symptoms: entry.symptoms_c ? entry.symptoms_c.split(',') : [],
        mood: entry.mood_c || '',
        notes: entry.notes_c || '',
        timestamp: entry.timestamp_c
      };
    } catch (error) {
      console.error(`Error fetching cycle entry ${id}:`, error);
      return null;
    }
  },

  getByDateRange: async (startDate, endDate) => {
    try {
      const response = await apperClient.fetchRecords('cycle_entry_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "flow_intensity_c"}},
          {"field": {"Name": "symptoms_c"}},
          {"field": {"Name": "mood_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "timestamp_c"}}
        ],
        where: [
          {"FieldName": "date_c", "Operator": "GreaterThanOrEqualTo", "Values": [startDate]},
          {"FieldName": "date_c", "Operator": "LessThanOrEqualTo", "Values": [endDate]}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(entry => ({
        Id: entry.Id,
        date: entry.date_c,
        flowIntensity: entry.flow_intensity_c || 'none',
        symptoms: entry.symptoms_c ? entry.symptoms_c.split(',') : [],
        mood: entry.mood_c || '',
        notes: entry.notes_c || '',
        timestamp: entry.timestamp_c
      }));
    } catch (error) {
      console.error("Error fetching cycle entries by date range:", error);
      return [];
    }
  },

  getByDate: async (date) => {
    try {
      const response = await apperClient.fetchRecords('cycle_entry_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "flow_intensity_c"}},
          {"field": {"Name": "symptoms_c"}},
          {"field": {"Name": "mood_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "timestamp_c"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "EqualTo", "Values": [date]}]
      });

      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }

      const entry = response.data[0];
      return {
        Id: entry.Id,
        date: entry.date_c,
        flowIntensity: entry.flow_intensity_c || 'none',
        symptoms: entry.symptoms_c ? entry.symptoms_c.split(',') : [],
        mood: entry.mood_c || '',
        notes: entry.notes_c || '',
        timestamp: entry.timestamp_c
      };
    } catch (error) {
      console.error(`Error fetching cycle entry for date ${date}:`, error);
      return null;
    }
  },

  create: async (entryData) => {
    try {
      const payload = {
        date_c: entryData.date,
        flow_intensity_c: entryData.flowIntensity || 'none',
        symptoms_c: Array.isArray(entryData.symptoms) ? entryData.symptoms.join(',') : '',
        mood_c: entryData.mood || '',
        notes_c: entryData.notes || '',
        timestamp_c: new Date().toISOString()
      };

      const response = await apperClient.createRecord('cycle_entry_c', {
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
            date: result.data.date_c,
            flowIntensity: result.data.flow_intensity_c || 'none',
            symptoms: result.data.symptoms_c ? result.data.symptoms_c.split(',') : [],
            mood: result.data.mood_c || '',
            notes: result.data.notes_c || '',
            timestamp: result.data.timestamp_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating cycle entry:", error);
      return null;
    }
  },

  update: async (id, entryData) => {
    try {
      const payload = {
        Id: parseInt(id)
      };

      if (entryData.date) payload.date_c = entryData.date;
      if (entryData.flowIntensity !== undefined) payload.flow_intensity_c = entryData.flowIntensity;
      if (entryData.symptoms !== undefined) {
        payload.symptoms_c = Array.isArray(entryData.symptoms) ? entryData.symptoms.join(',') : '';
      }
      if (entryData.mood !== undefined) payload.mood_c = entryData.mood;
      if (entryData.notes !== undefined) payload.notes_c = entryData.notes;

      const response = await apperClient.updateRecord('cycle_entry_c', {
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
            date: result.data.date_c,
            flowIntensity: result.data.flow_intensity_c || 'none',
            symptoms: result.data.symptoms_c ? result.data.symptoms_c.split(',') : [],
            mood: result.data.mood_c || '',
            notes: result.data.notes_c || '',
            timestamp: result.data.timestamp_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error(`Error updating cycle entry ${id}:`, error);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('cycle_entry_c', {
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
      console.error(`Error deleting cycle entry ${id}:`, error);
      return false;
    }
  },

  getRecentSymptoms: async (days = 30) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

      const response = await apperClient.fetchRecords('cycle_entry_c', {
        fields: [
          {"field": {"Name": "symptoms_c"}},
          {"field": {"Name": "date_c"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "GreaterThanOrEqualTo", "Values": [cutoffDateStr]}]
      });

      if (!response.success || !response.data) {
        return {};
      }

      const symptomCounts = {};
      response.data.forEach(entry => {
        if (entry.symptoms_c) {
          const symptoms = entry.symptoms_c.split(',');
          symptoms.forEach(symptom => {
            symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
          });
        }
      });

      return symptomCounts;
    } catch (error) {
      console.error("Error fetching recent symptoms:", error);
      return {};
    }
  },

  getSymptomTrends: async (days = 90) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

      const response = await apperClient.fetchRecords('cycle_entry_c', {
        fields: [
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "symptoms_c"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "GreaterThanOrEqualTo", "Values": [cutoffDateStr]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}]
      });

      if (!response.success || !response.data) {
        return { dates: [], series: [] };
      }

      const dateMap = new Map();
      const allSymptoms = new Set();

      response.data.forEach(entry => {
        const dateStr = entry.date_c;
        if (!dateMap.has(dateStr)) {
          dateMap.set(dateStr, {});
        }
        const dayData = dateMap.get(dateStr);
        
        if (entry.symptoms_c) {
          const symptoms = entry.symptoms_c.split(',');
          symptoms.forEach(symptom => {
            allSymptoms.add(symptom);
            dayData[symptom] = (dayData[symptom] || 0) + 1;
          });
        }
      });

      const sortedDates = Array.from(dateMap.keys()).sort();
      
      const series = Array.from(allSymptoms).map(symptom => ({
        name: symptom.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        data: sortedDates.map(date => dateMap.get(date)[symptom] || 0)
      }));

      return { dates: sortedDates, series };
    } catch (error) {
      console.error("Error fetching symptom trends:", error);
      return { dates: [], series: [] };
    }
  }
};

export default cycleService;