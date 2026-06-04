// // src/api/adminApi.js
// import api from './axiosConfig';

// // ─────────────────────────────────────────
// // PLATFORM STATS
// // ─────────────────────────────────────────
// export const getPlatformStats = () =>
//   api.get('/super-admin/stats');

// // ─────────────────────────────────────────
// // SCHOOL MANAGEMENT
// // ─────────────────────────────────────────
// export const listSchools = (params = {}) =>
//   api.get('/super-admin/schools', { params });

// export const getSchool = (id) =>
//   api.get(`/super-admin/schools/${id}`);

// export const createSchool = (data) =>
//   api.post('/super-admin/schools', data);

// export const updateSchool = (id, data) =>
//   api.patch(`/super-admin/schools/${id}`, data);

// export const toggleSchoolStatus = (id, action) =>
//   api.patch(`/super-admin/schools/${id}/status`, { action });

// export const verifySchool = (id) =>
//   api.patch(`/super-admin/schools/${id}/verify`);

// export const updateSchoolSubscription = (id, data) =>
//   api.patch(`/super-admin/schools/${id}/subscription`, data);

// export const listSchoolUsers = (id, params = {}) =>
//   api.get(`/super-admin/schools/${id}/users`, { params });

// // ─────────────────────────────────────────
// // USER MANAGEMENT
// // ─────────────────────────────────────────
// export const listAllUsers = (params = {}) =>
//   api.get('/super-admin/users', { params });

// export const getUser = (id) =>
//   api.get(`/super-admin/users/${id}`);

// export const toggleUserStatus = (id, is_active) =>
//   api.patch(`/super-admin/users/${id}/status`, { is_active });

// export const resetUserPassword = (id, new_password) =>
//   api.patch(`/super-admin/users/${id}/reset-password`, { new_password });

// // ─────────────────────────────────────────
// // ACTIVITY LOGS
// // ─────────────────────────────────────────
// export const getActivityLogs = (params = {}) =>
//   api.get('/super-admin/activity-logs', { params });

// // ─────────────────────────────────────────
// // SYSTEM SETTINGS
// // ─────────────────────────────────────────
// export const getSystemSettings = () =>
//   api.get('/super-admin/system-settings');

// export const upsertSystemSetting = (key, value, type = 'string') =>
//   api.put(`/super-admin/system-settings/${key}`, { value, type });

// export const deleteSystemSetting = (key) =>
//   api.delete(`/super-admin/system-settings/${key}`);


// src/api/adminApi.js

// // src/api/adminApi.js
// import api from './axiosConfig';

// // ─────────────────────────────────────────
// // PLATFORM / SUPER ADMIN STATS
// // ─────────────────────────────────────────
// // NOTE: This route is not clearly listed in the pasted endpoint table,
// // but it was referenced in your earlier frontend routes/admin design.
// // Keep it only if your backend actually has it.
// export const getPlatformStats = (params = {}) =>
//   api.get('/super-admin/stats', { params });

// // ─────────────────────────────────────────
// // SCHOOL MANAGEMENT
// // ─────────────────────────────────────────
// export const listSchools = (params = {}) =>
//   api.get('/super-admin/schools', { params });

// export const getSchool = (id) =>
//   api.get(`/super-admin/schools/${id}`);

// export const updateSchool = (id, data) =>
//   api.put(`/super-admin/schools/${id}`, data);

// export const suspendSchool = (id) =>
//   api.post(`/super-admin/schools/${id}/suspend`);

// export const activateSchool = (id) =>
//   api.post(`/super-admin/schools/${id}/activate`);

// export const deleteSchool = (id) =>
//   api.delete(`/super-admin/schools/${id}`);

// // Optional helper if you want one function for activate/suspend
// export const toggleSchoolStatus = (id, action) => {
//   if (action === 'activate') {
//     return activateSchool(id);
//   }

//   if (action === 'suspend') {
//     return suspendSchool(id);
//   }

//   throw new Error("Invalid action. Use 'activate' or 'suspend'.");
// };

// // ─────────────────────────────────────────
// // USER MANAGEMENT
// // ─────────────────────────────────────────
// export const listAllUsers = (params = {}) =>
//   api.get('/users', { params });

// export const getUser = (id) =>
//   api.get(`/users/${id}`);

// export const createUser = (data) =>
//   api.post('/users', data);

// export const updateUser = (id, data) =>
//   api.put(`/users/${id}`, data);

// export const deleteUser = (id) =>
//   api.delete(`/users/${id}`);

// export const activateUser = (id) =>
//   api.put(`/users/${id}/activate`);

// export const deactivateUser = (id) =>
//   api.put(`/users/${id}/deactivate`);

// export const toggleUserStatus = (id, is_active) => {
//   return is_active ? activateUser(id) : deactivateUser(id);
// };

// export const resetUserPassword = (id, new_password) =>
//   api.put(`/users/${id}/reset-password`, { new_password });

// // ─────────────────────────────────────────
// // ACTIVITY LOGS
// // ─────────────────────────────────────────
// export const getActivityLogs = (params = {}) =>
//   api.get('/logs', { params });

// export const getUserActivityLogs = (id, params = {}) =>
//   api.get(`/logs/user/${id}`, { params });

// export const getEntityActivityLogs = (type, id, params = {}) =>
//   api.get(`/logs/entity/${type}/${id}`, { params });

// // ─────────────────────────────────────────
// // SYSTEM SETTINGS
// // ─────────────────────────────────────────
// export const getSystemSettings = (params = {}) =>
//   api.get('/settings', { params });

// export const getSystemSettingByKey = (key) =>
//   api.get(`/settings/${key}`);

// export const createSystemSetting = (data) =>
//   api.post('/settings', data);

// export const updateSystemSetting = (key, value) =>
//   api.put(`/settings/${key}`, { value });

// export const upsertSystemSetting = (key, value) =>
//   api.put(`/settings/${key}`, { value });

// export const deleteSystemSetting = (key) =>
//   api.delete(`/settings/${key}`);

// src/api/adminApi.js
import axios from './axiosConfig';

const API_URL = '/super-admin';

// --- Stats ---
export const getPlatformStats = () => axios.get(`${API_URL}/stats`);

// --- Schools ---
export const createSchool = (data) => axios.post(`${API_URL}/schools`, data); // ADDED THIS MISSING FUNCTION
export const listSchools = (params) => axios.get(`${API_URL}/schools`, { params });
export const getSchool = (id) => axios.get(`${API_URL}/schools/${id}`);
export const updateSchool = (id, data) => axios.patch(`${API_URL}/schools/${id}`, data);
export const toggleSchoolStatus = (id) => axios.patch(`${API_URL}/schools/${id}/status`);
export const activateSchool = (id) => axios.patch(`${API_URL}/schools/${id}/status`, { action: 'activate' });
export const suspendSchool = (id) => axios.patch(`${API_URL}/schools/${id}/status`, { action: 'suspend' });
export const deleteSchool = (id) => axios.delete(`${API_URL}/schools/${id}`);

// --- Users ---
export const listAllUsers = (params) => axios.get(`${API_URL}/users`, { params });
export const getUser = (id) => axios.get(`${API_URL}/users/${id}`);
export const toggleUserStatus = (id, is_active) => axios.patch(`${API_URL}/users/${id}/status`, is_active !== undefined ? { is_active } : {});
export const activateUser = (id) => axios.patch(`${API_URL}/users/${id}/status`, { is_active: true });
export const deactivateUser = (id) => axios.patch(`${API_URL}/users/${id}/status`, { is_active: false });
export const resetUserPassword = (id, data) => axios.patch(`${API_URL}/users/${id}/reset-password`, data);
export const createUser = (data) => axios.post(`${API_URL}/users`, data); // Might exist on backend
export const updateUser = (id, data) => axios.patch(`${API_URL}/users/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API_URL}/users/${id}`);

// --- System & Audit ---
export const getActivityLogs = (params) => axios.get(`${API_URL}/activity-logs`, { params });
export const getEntityActivityLogs = (entityType, entityId) => axios.get(`${API_URL}/activity-logs`, { params: { entity_type: entityType, entity_id: entityId } });
export const getUserActivityLogs = (userId) => axios.get(`${API_URL}/activity-logs`, { params: { user_id: userId } });
export const getSystemSettings = () => axios.get(`${API_URL}/system-settings`);
export const getSystemSettingByKey = (key) => axios.get(`${API_URL}/system-settings/${key}`);
export const createSystemSetting = (key, data) => axios.put(`${API_URL}/system-settings/${key}`, data);
export const updateSystemSetting = (key, data) => axios.put(`${API_URL}/system-settings/${key}`, data);
export const upsertSystemSetting = (key, data) => axios.put(`${API_URL}/system-settings/${key}`, data);
export const deleteSystemSetting = (key) => axios.delete(`${API_URL}/system-settings/${key}`);