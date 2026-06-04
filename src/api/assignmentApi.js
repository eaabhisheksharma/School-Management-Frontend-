import api from './axiosConfig';

/**
 * Assignment API
 * Base URL is handled by axiosConfig.
 * Interceptors automatically attach the Bearer token for protected routes.
 */

// ─── Teacher Routes ────────────────────────────────────────────────

// GET /assignments
// Fetches list of assignments (Teachers see theirs, Students see assigned)
export const getAssignments = async (params = {}) => {
  const res = await api.get('/assignments', { params });
  // API returns { success: true, data: [...] } or { success: true, assignments: [...] }
  return res.data;
};

// GET /assignments/:id
export const getAssignmentById = async (id) => {
  const res = await api.get(`/assignments/${id}`);
  return res.data;
};

// POST /assignments
// Teacher creates an assignment
export const createAssignment = async (data) => {
  const res = await api.post('/assignments', data);
  return res.data;
};

// PUT /assignments/:id
export const updateAssignment = async (id, data) => {
  const res = await api.put(`/assignments/${id}`, data);
  return res.data;
};

// DELETE /assignments/:id
export const deleteAssignment = async (id) => {
  const res = await api.delete(`/assignments/${id}`);
  return res.data;
};

// GET /assignments/:id/submissions
// Teacher views submissions for an assignment
export const getSubmissions = async (id, params = {}) => {
  const res = await api.get(`/assignments/${id}/submissions`, { params });
  return res.data;
};

// POST /assignments/:id/evaluate
// Teacher evaluates/submits grades for a submission
export const evaluateSubmission = async (id, data) => {
  const res = await api.post(`/assignments/${id}/evaluate`, data);
  return res.data;
};

// ─── Student Routes ────────────────────────────────────────────────

// GET /assignments/my
// Student fetches their assigned work
export const getMyAssignments = async (params = {}) => {
  const res = await api.get('/assignments/my', { params });
  return res.data;
};

// POST /assignments/:id/submit
// Student submits work (uses multipart/form-data)
export const submitAssignment = async (id, formData) => {
  const res = await api.post(`/assignments/${id}/submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// PUT /assignments/submissions/:id
// Student updates a submission
export const updateSubmission = async (id, formData) => {
  const res = await api.put(`/assignments/submissions/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};