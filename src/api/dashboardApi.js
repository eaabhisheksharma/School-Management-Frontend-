import api from './axiosConfig';

/**
 * Dashboard API
 * Handles dashboard statistics and summary data.
 * All routes are protected and require Bearer Token (handled by axiosConfig).
 */

// GET /principal/dashboard
// Fetches general statistics (Student count, Teacher count, etc.)
export const getDashboardStats = async (params = {}) => {
  const queryParams = typeof params === 'string' ? { role: params } : params;
  const res = await api.get('/principal/dashboard', { params: queryParams });
  return res.data;
};

// GET /principal/dashboard (activity data comes from same endpoint or separate)
export const getRecentActivity = async (params = {}) => {
  try {
    const res = await api.get('/principal/dashboard', { params: { ...params, section: 'activity' } });
    return res.data;
  } catch {
    return { data: [] };
  }
};

// Upcoming events
export const getUpcomingEvents = async (params = {}) => {
  try {
    const res = await api.get('/principal/dashboard', { params: { ...params, section: 'events' } });
    return res.data;
  } catch {
    return { data: [] };
  }
};

// Birthdays today
export const getBirthdaysToday = async () => {
  try {
    const res = await api.get('/principal/dashboard', { params: { section: 'birthdays' } });
    return res.data;
  } catch {
    return { data: [] };
  }
};

// GET /principal/dashboard (attendance summary)
export const getAttendanceSummary = async (params = {}) => {
  try {
    const res = await api.get('/principal/dashboard', { params: { ...params, section: 'attendance' } });
    return res.data;
  } catch {
    return { data: [] };
  }
};

// Fee summary
export const getFeeSummary = async (params = {}) => {
  try {
    const res = await api.get('/principal/dashboard', { params: { ...params, section: 'fees' } });
    return res.data;
  } catch {
    return { data: [] };
  }
};

// Notifications
export const getNotifications = async (params = {}) => {
  try {
    const res = await api.get('/principal/notices', { params });
    return res.data;
  } catch {
    return { data: [] };
  }
};