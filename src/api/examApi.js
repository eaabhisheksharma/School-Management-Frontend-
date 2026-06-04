import api from './axiosConfig';

/**
 * Exam API
 * Handles Exams, Schedules, Results, and Report Cards.
 * All routes are protected and require Bearer Token (handled by axiosConfig).
 */

// ─── Exam CRUD ─────────────────────────────────────────────────────

// GET /exams
export const getExams = async (params = {}) => {
  const res = await api.get('/exams', { params });
  return res.data;
};

// GET /exams/:id
export const getExamById = async (id) => {
  const res = await api.get(`/exams/${id}`);
  return res.data;
};

// POST /exams
export const createExam = async (data) => {
  const res = await api.post('/exams', data);
  return res.data;
};

// PUT /exams/:id
export const updateExam = async (id, data) => {
  const res = await api.put(`/exams/${id}`, data);
  return res.data;
};

// DELETE /exams/:id
export const deleteExam = async (id) => {
  const res = await api.delete(`/exams/${id}`);
  return res.data;
};

// ─── Exam Schedule ─────────────────────────────────────────────────

// GET /exams/:id/schedule
export const getExamSchedule = async (id) => {
  const res = await api.get(`/exams/${id}/schedule`);
  return res.data;
};

// POST /exams/:id/schedule
export const addScheduleEntry = async (id, data) => {
  const res = await api.post(`/exams/${id}/schedule`, data);
  return res.data;
};

// ─── Exam Results ──────────────────────────────────────────────────

// GET /exams/:id/results
export const getExamResults = async (id, params = {}) => {
  const res = await api.get(`/exams/${id}/results`, { params });
  return res.data;
};

// POST /exams/:id/results  (bulk entry)
export const enterResults = async (id, data) => {
  const res = await api.post(`/exams/${id}/results`, data);
  return res.data;
};

// PUT /exams/results/:id
export const updateResult = async (id, data) => {
  const res = await api.put(`/exams/results/${id}`, data);
  return res.data;
};

// GET /exams/:id/results/student/:studentId
export const getStudentResult = async (examId, studentId) => {
  const res = await api.get(`/exams/${examId}/results/student/${studentId}`);
  return res.data;
};

// POST /exams/:id/publish
export const publishResults = async (id) => {
  const res = await api.post(`/exams/${id}/publish`);
  return res.data;
};

// GET /exams/:id/report-card/:studentId
// Returns a PDF Blob
export const generateReportCard = async (examId, studentId) => {
  const res = await api.get(`/exams/${examId}/report-card/${studentId}`, {
    responseType: 'blob',
  });
  return res.data;
};