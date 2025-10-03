const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const aiAnalysisService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('ai_analysis_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "analysis_result_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "user_profile_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(analysis => ({
        Id: analysis.Id,
        name: analysis.Name || '',
        analysisResult: analysis.analysis_result_c || '',
        checkInId: analysis.check_in_c?.Id || null,
        checkInName: analysis.check_in_c?.Name || '',
        userProfileId: analysis.user_profile_c?.Id || null,
        userProfileName: analysis.user_profile_c?.Name || '',
        createdOn: analysis.CreatedOn || ''
      }));
    } catch (error) {
      console.error("Error fetching AI analyses:", error);
      return [];
    }
  },

  getByCheckInId: async (checkInId) => {
    try {
      const response = await apperClient.fetchRecords('ai_analysis_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "analysis_result_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "user_profile_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "check_in_c", "Operator": "EqualTo", "Values": [parseInt(checkInId)]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const analysis = response.data[0];
      return {
        Id: analysis.Id,
        name: analysis.Name || '',
        analysisResult: analysis.analysis_result_c || '',
        checkInId: analysis.check_in_c?.Id || null,
        checkInName: analysis.check_in_c?.Name || '',
        userProfileId: analysis.user_profile_c?.Id || null,
        userProfileName: analysis.user_profile_c?.Name || '',
        createdOn: analysis.CreatedOn || ''
      };
    } catch (error) {
      console.error(`Error fetching AI analysis for check-in ${checkInId}:`, error);
      return null;
    }
  },

  getByUserId: async (userId) => {
    try {
      const response = await apperClient.fetchRecords('ai_analysis_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "analysis_result_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "user_profile_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "user_profile_c", "Operator": "EqualTo", "Values": [parseInt(userId)]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(analysis => ({
        Id: analysis.Id,
        name: analysis.Name || '',
        analysisResult: analysis.analysis_result_c || '',
        checkInId: analysis.check_in_c?.Id || null,
        checkInName: analysis.check_in_c?.Name || '',
        userProfileId: analysis.user_profile_c?.Id || null,
        userProfileName: analysis.user_profile_c?.Name || '',
        createdOn: analysis.CreatedOn || ''
      }));
    } catch (error) {
      console.error(`Error fetching AI analyses for user ${userId}:`, error);
      return [];
    }
  },

  create: async (analysisData) => {
    try {
      const payload = {
        analysis_result_c: analysisData.analysisResult || '',
        check_in_c: analysisData.checkInId ? parseInt(analysisData.checkInId) : null,
        user_profile_c: analysisData.userProfileId ? parseInt(analysisData.userProfileId) : null
      };

      const response = await apperClient.createRecord('ai_analysis_c', {
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
            name: result.data.Name || '',
            analysisResult: result.data.analysis_result_c || '',
            checkInId: result.data.check_in_c?.Id || null,
            checkInName: result.data.check_in_c?.Name || '',
            userProfileId: result.data.user_profile_c?.Id || null,
            userProfileName: result.data.user_profile_c?.Name || '',
            createdOn: result.data.CreatedOn || ''
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating AI analysis:", error);
      return null;
    }
  },

  invokeAnalysis: async (checkInData) => {
    try {
      const result = await apperClient.functions.invoke(import.meta.env.VITE_ANALYZE_CHECK_IN, {
        body: JSON.stringify({
          flowIntensity: checkInData.flowIntensity,
          mood: checkInData.mood,
          symptoms: checkInData.symptoms || [],
          notes: checkInData.notes || '',
          date: checkInData.date
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!result.success) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_ANALYZE_CHECK_IN}. The response body is: ${JSON.stringify(result)}.`);
        return null;
      }

      return result.data;
    } catch (error) {
      console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_ANALYZE_CHECK_IN}. The error is: ${error.message}`);
      return null;
    }
  }
};

export default aiAnalysisService;