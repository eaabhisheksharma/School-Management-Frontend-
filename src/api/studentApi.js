import api from './axiosConfig';

/**
 * Student API
 * Handles student management, profiles, and related data.
 * All routes are protected and require Bearer Token (handled by axiosConfig).
 */

// ─── Transformers ──

const transformStudent = (s) => {
  if (!s) return s;
  const u = s.user || s.User || {};
  return {
    ...s,
    id: s.student_id || s.id,
    name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || s.name || '',
    email: u.email || s.email || '',
    phone: u.mobile_number || s.phone || '',
    gender: u.gender || s.gender || '',
    status: s.status || 'active',
    admissionNo: s.admission_number || s.admissionNo || '',
    admissionDate: s.admission_date || s.admissionDate || '',
    rollNo: s.roll_number || s.rollNo || '',
    className: s.className || '',
    class: s.class || null,
    fatherName: s.father_name || s.fatherName || '',
    motherName: s.mother_name || s.motherName || '',
    guardianName: s.guardian_name || s.guardianName || '',
    guardianPhone: s.guardian_phone || s.guardianPhone || '',
    parentPhone: s.guardian_phone || s.parentPhone || '',
    profilePhoto: u.profile_picture_url || s.profilePhoto || '',
    dateOfBirth: u.date_of_birth || s.dateOfBirth || '',
    bloodGroup: s.blood_group || s.bloodGroup || '',
    address: u.address || s.address || '',
    city: u.city || s.city || '',
    state: u.state || s.state || '',
    pincode: u.pincode || s.pincode || ''
  };
};

const transformStudentList = (response) => {
  if (!response) return response;
  const data = response.data;
  if (Array.isArray(data)) {
    return { ...response, data: data.map(transformStudent) };
  }
  return response;
};

const transformStudentRequest = (data) => {
  const nameParts = (data.name || '').split(' ');
  const first_name = data.firstName || data.first_name || nameParts[0] || '';
  const last_name = data.lastName || data.last_name || nameParts.slice(1).join(' ') || '';

  return {
    first_name,
    last_name,
    email: data.email,
    mobile_number: data.phone || data.mobile_number,
    gender: data.gender,
    date_of_birth: data.dateOfBirth || data.date_of_birth,
    admission_number: data.admissionNo || data.admission_number,
    admission_date: data.admissionDate || data.admission_date,
    roll_number: data.rollNo || data.roll_number,
    father_name: data.fatherName || data.father_name,
    father_phone: data.fatherPhone || data.father_phone,
    mother_name: data.motherName || data.mother_name,
    mother_phone: data.motherPhone || data.mother_phone,
    guardian_name: data.guardianName || data.guardian_name,
    guardian_phone: data.guardianPhone || data.guardian_phone,
    guardian_email: data.guardianEmail || data.guardian_email,
    guardian_relation: data.guardianRelation || data.guardian_relation,
    blood_group: data.bloodGroup || data.blood_group,
    medical_conditions: data.medicalConditions || data.medical_conditions,
    emergency_contact_name: data.emergencyContact || data.emergency_contact_name,
    emergency_contact_phone: data.emergencyPhone || data.emergency_contact_phone,
    status: data.status,
    address: data.address,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    password: data.password
  };
};

// ─── Admin/Staff Routes (via principal endpoint) ────────────────────

// GET /principal/students
export const getStudents = async (params = {}) => {
  const res = await api.get('/principal/students', { params });
  return transformStudentList(res.data);
};

// GET /principal/students/:id
export const getStudentById = async (id) => {
  const res = await api.get(`/principal/students/${id}`);
  const response = res.data;
  if (response && response.data) {
    return { ...response, data: transformStudent(response.data) };
  }
  return response;
};

// POST /principal/students
export const createStudent = async (data) => {
  const res = await api.post('/principal/students', transformStudentRequest(data));
  return res.data;
};

// PUT /principal/students/:id
export const updateStudent = async (id, data) => {
  const res = await api.put(`/principal/students/${id}`, transformStudentRequest(data));
  return res.data;
};

// DELETE /principal/students/:id
export const deleteStudent = async (id) => {
  const res = await api.delete(`/principal/students/${id}`);
  return res.data;
};

// GET /principal/students/:id (attendance data not yet a separate endpoint)
export const getStudentAttendance = async (id, params = {}) => {
  return { success: true, data: [] };
};

// GET (fees not yet a separate endpoint)
export const getStudentFees = async (id, params = {}) => {
  return { success: true, data: [] };
};

// GET (results not yet a separate endpoint)
export const getStudentResults = async (id, params = {}) => {
  return { success: true, data: [] };
};

// GET (exam-results not yet a separate endpoint)
export const getStudentExamResults = async (id, params = {}) => {
  return { success: true, data: [] };
};

// GET (assignments not yet a separate endpoint)
export const getStudentAssignments = async (id, params = {}) => {
  return { success: true, data: [] };
};

// POST /students/:id/promote (via students route)
export const promoteStudent = async (id, data) => {
  const res = await api.post(`/students/${id}/promote`, data);
  return res.data;
};

// POST (transfer not yet implemented)
export const transferStudent = async (id, data) => {
  return { success: false, error: 'Transfer not yet implemented' };
};

// POST /students/bulk-import
export const bulkImportStudents = async (data) => {
  const res = await api.post('/students/bulk-import', data);
  return res.data;
};

// Export (not yet implemented)
export const exportStudents = async (params = {}) => {
  return { success: false, error: 'Export not yet implemented' };
};

// Photo upload (not yet implemented)
export const uploadProfilePhoto = async (id, formData) => {
  return { success: false, error: 'Photo upload not yet implemented' };
};

// ─── Student 'Me' Routes (For logged-in Student) ───────────────────

// GET /students/me
export const getMyProfile = async () => {
  const res = await api.get('/students/me');
  return res.data;
};

// These sub-routes are not yet implemented in the backend
export const getMyAttendance = async (params = {}) => {
  return { success: true, data: [] };
};

export const getMyFees = async (params = {}) => {
  return { success: true, data: [] };
};

export const getMyResults = async (params = {}) => {
  return { success: true, data: [] };
};

export const getMyTimetable = async (params = {}) => {
  return { success: true, data: [] };
};

export const getMyAssignments = async (params = {}) => {
  return { success: true, data: [] };
};