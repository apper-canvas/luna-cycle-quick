const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const profileService = {
  get: async () => {
    try {
      const response = await apperClient.fetchRecords('user_profile_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "average_cycle_length_c"}},
          {"field": {"Name": "average_period_length_c"}},
          {"field": {"Name": "tracking_since_c"}},
          {"field": {"Name": "last_period_start_c"}},
          {"field": {"Name": "preferences_notifications_c"}},
          {"field": {"Name": "preferences_reminders_c"}},
          {"field": {"Name": "preferences_insights_c"}},
          {"field": {"Name": "preferences_privacy_mode_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1, "offset": 0}
      });

      if (!response.success || !response.data || response.data.length === 0) {
        return await profileService.createDefault();
      }

      const profile = response.data[0];
      return {
        Id: profile.Id,
        averageCycleLength: profile.average_cycle_length_c || 28,
        averagePeriodLength: profile.average_period_length_c || 5,
        trackingSince: profile.tracking_since_c || new Date().toISOString().split('T')[0],
        lastPeriodStart: profile.last_period_start_c || new Date().toISOString().split('T')[0],
        preferences: {
          notifications: profile.preferences_notifications_c ?? true,
          reminders: profile.preferences_reminders_c ?? true,
          insights: profile.preferences_insights_c ?? true,
          privacyMode: profile.preferences_privacy_mode_c ?? false
        }
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  },

  createDefault: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const payload = {
        average_cycle_length_c: 28,
        average_period_length_c: 5,
        tracking_since_c: today,
        last_period_start_c: today,
        preferences_notifications_c: true,
        preferences_reminders_c: true,
        preferences_insights_c: true,
        preferences_privacy_mode_c: false
      };

      const response = await apperClient.createRecord('user_profile_c', {
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
            averageCycleLength: result.data.average_cycle_length_c || 28,
            averagePeriodLength: result.data.average_period_length_c || 5,
            trackingSince: result.data.tracking_since_c,
            lastPeriodStart: result.data.last_period_start_c,
            preferences: {
              notifications: result.data.preferences_notifications_c ?? true,
              reminders: result.data.preferences_reminders_c ?? true,
              insights: result.data.preferences_insights_c ?? true,
              privacyMode: result.data.preferences_privacy_mode_c ?? false
            }
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating default profile:", error);
      return null;
    }
  },

  update: async (updates) => {
    try {
      const currentProfile = await profileService.get();
      if (!currentProfile || !currentProfile.Id) {
        return null;
      }

      const payload = {
        Id: currentProfile.Id
      };

      if (updates.averageCycleLength !== undefined) payload.average_cycle_length_c = updates.averageCycleLength;
      if (updates.averagePeriodLength !== undefined) payload.average_period_length_c = updates.averagePeriodLength;
      if (updates.trackingSince !== undefined) payload.tracking_since_c = updates.trackingSince;
      if (updates.lastPeriodStart !== undefined) payload.last_period_start_c = updates.lastPeriodStart;

      const response = await apperClient.updateRecord('user_profile_c', {
        records: [payload]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return await profileService.get();
    } catch (error) {
      console.error("Error updating profile:", error);
      return null;
    }
  },

  updatePreferences: async (preferences) => {
    try {
      const currentProfile = await profileService.get();
      if (!currentProfile || !currentProfile.Id) {
        return null;
      }

      const payload = {
        Id: currentProfile.Id
      };

      if (preferences.notifications !== undefined) payload.preferences_notifications_c = preferences.notifications;
      if (preferences.reminders !== undefined) payload.preferences_reminders_c = preferences.reminders;
      if (preferences.insights !== undefined) payload.preferences_insights_c = preferences.insights;
      if (preferences.privacyMode !== undefined) payload.preferences_privacy_mode_c = preferences.privacyMode;

      const response = await apperClient.updateRecord('user_profile_c', {
        records: [payload]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return await profileService.get();
    } catch (error) {
      console.error("Error updating preferences:", error);
      return null;
    }
  },

  calculateStats: async (cycleEntries) => {
    const periodEntries = cycleEntries.filter(e => e.flowIntensity !== "none");
    if (periodEntries.length === 0) {
      return await profileService.get();
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

    return await profileService.update({
      averageCycleLength: avgCycleLength,
      averagePeriodLength: avgPeriodLength,
      lastPeriodStart: periodEntries[0].date
lastPeriodStart: periodEntries[0].date
    });
  }
};

export default profileService;