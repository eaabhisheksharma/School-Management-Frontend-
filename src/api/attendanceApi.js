import api from './axiosConfig';

/**
 * Attendance API
 * Handles attendance tracking, marking, and reporting.
 * All routes are protected and require Bearer Token (handled by axiosConfig).
 */

// GET /attendance
// Fetches attendance records with optional filters (date, class, etc.)
export const getAttendance = async (params = {}) => {
  const res = await api.get('/attendance', { params });
  return res.data;
};

// POST /attendance/mark
// Marks attendance for a single student
export const markAttendance = async (data) => {
  const res = await api.post('/attendance/mark', data);
  return res.data;
};

// PUT /attendance/:id
// Updates an existing attendance record
export const updateAttendance = async (id, data) => {
  const res = await api.put(`/attendance/${id}`, data);
  return res.data;
};

// GET /attendance/class/:classId
// Fetches attendance for a specific class, typically filtered by date
export const getClassAttendance = async (classId, date) => {
  const res = await api.get(`/attendance/class/${classId}`, {
    params: { date }, // Passes date as a query param: ?date=YYYY-MM-DD
  });
  return res.data;
};

// GET /attendance/student/:studentId
// Fetches attendance history for a specific student
export const getStudentAttendanceHistory = async (studentId, params = {}) => {
  const res = await api.get(`/attendance/student/${studentId}`, { params });
  return res.data;
};

// POST /attendance/bulk-mark
// Marks attendance for multiple students at once (used by teachers)
export const bulkMarkAttendance = async (data) => {
  const res = await api.post('/attendance/bulk-mark', data);
  return res.data;
};

// GET /attendance/report/daily
// Generates a daily attendance report
export const getDailyReport = async (params = {}) => {
  const res = await api.get('/attendance/report/daily', { params });
  return res.data;
};

// GET /attendance/report/monthly
// Generates a monthly attendance report
export const getMonthlyReport = async (params = {}) => {
  const res = await api.get('/attendance/report/monthly', { params });
  return res.data;
};

// GET /attendance/report/student/:id
// Generates a detailed report for a specific student
export const getStudentReport = async (id, params = {}) => {
  const res = await api.get(`/attendance/report/student/${id}`, { params });
  return res.data;
};

// GET /attendance/defaulters
// Fetches a list of students with poor attendance
export const getAttendanceDefaulters = async (params = {}) => {
  const res = await api.get('/attendance/defaulters', { params });
  return res.data;
};