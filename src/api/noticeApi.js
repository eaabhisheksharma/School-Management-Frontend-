import api from './axiosConfig';

/**
 * Notice API
 * Handles school notices and announcements.
 * All routes are protected and require Bearer Token (handled by axiosConfig).
 */

// GET /principal/notices
export const getNotices = async (params = {}) => {
  const res = await api.get('/principal/notices', { params });
  return res.data;
};

// GET /principal/notices/:id (stub - backend only has list)
export const getNoticeById = async (id) => {
  return { success: true, data: null };
};

// POST /principal/notices
export const createNotice = async (data) => {
  const res = await api.post('/principal/notices', data);
  return res.data;
};

// PUT /principal/notices/:id
export const updateNotice = async (id, data) => {
  const res = await api.put(`/principal/notices/${id}`, data);
  return res.data;
};

// DELETE /principal/notices/:id
export const deleteNotice = async (id) => {
  const res = await api.delete(`/principal/notices/${id}`);
  return res.data;
};

// Publish (not yet implemented)
export const publishNotice = async (id) => {
  return { success: false, error: 'Publish not yet implemented' };
};

// GET /notices (for all roles - uses the standalone notices route)
export const getMyNotices = async (params = {}) => {
  const res = await api.get('/notices', { params });
  return res.data;
};