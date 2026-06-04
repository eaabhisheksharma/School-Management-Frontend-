import api from './axiosConfig';

/**
 * Timetable API
 * Handles class and teacher schedules.
 * All routes are protected and require Bearer Token (handled by axiosConfig).
 */

// GET /timetable
// Can be used to get all timetables or filter by params
export const getTimetable = async (params = {}) => {
  const res = await api.get('/timetable', { params });
  return res.data;
};

// Alias for consistency
export const getTimetables = async (params = {}) => {
  const res = await api.get('/timetable', { params });
  return res.data;
};

// GET /timetable/class/:id
export const getClassTimetable = async (id, params = {}) => {
  const res = await api.get(`/timetable/class/${id}`, { params });
  return res.data;
};

// GET /timetable/teacher/:id
export const getTeacherTimetable = async (id, params = {}) => {
  const res = await api.get(`/timetable/teacher/${id}`, { params });
  return res.data;
};

// POST /timetable
export const createTimetableEntry = async (data) => {
  const res = await api.post('/timetable', data);
  return res.data;
};

// PUT /timetable/:id
export const updateTimetableEntry = async (id, data) => {
  const res = await api.put(`/timetable/${id}`, data);
  return res.data;
};

// DELETE /timetable/:id
export const deleteTimetableEntry = async (id) => {
  const res = await api.delete(`/timetable/${id}`);
  return res.data;
};

// DELETE /timetable/full/:id
// Deletes a full timetable or session
export const deleteTimetable = async (id) => {
  const res = await api.delete(`/timetable/full/${id}`);
  return res.data;
};

// POST /timetable/generate
// Auto-generates timetable based on constraints
export const generateTimetable = async (data) => {
  const res = await api.post('/timetable/generate', data);
  return res.data;
};

// PUT /timetable/:id/publish
export const publishTimetable = async (id) => {
  const res = await api.put(`/timetable/${id}/publish`);
  return res.data;
};

// POST /timetable/:id/copy
export const copyTimetable = async (id, data) => {
  const res = await api.post(`/timetable/${id}/copy`, data);
  return res.data;
};