import api from './axiosConfig';

/**
 * Teacher API
 * Handles teacher management, portal data, and reports.
 * All routes are protected and require Bearer Token (handled by axiosConfig).
 */

// ─── Transformers ──

const transformTeacher = (t) => {
  if (!t) return t;
  const u = t.user || t.User || {};
  return {
    ...t,
    id: t.teacher_id || t.id,
    name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || t.name || '',
    email: u.email || t.email || '',
    phone: u.mobile_number || t.phone || '',
    gender: u.gender || t.gender || '',
    status: t.is_active === false ? 'inactive' : (t.status || 'active'),
    department: t.department || '',
    designation: t.designation || '',
    employeeId: t.employee_id || t.employeeId || '',
    qualification: t.qualification || '',
    experience: t.experience_years || t.experience || 0,
    joiningDate: t.joining_date || t.joiningDate || '',
    salary: t.salary || '',
    profilePhoto: u.profile_picture_url || t.profilePhoto || '',
    dateOfBirth: u.date_of_birth || '',
    address: u.address || '',
    city: u.city || '',
    state: u.state || '',
    pincode: u.pincode || '',
    subjects: t.subjects || []
  };
};

const transformTeacherList = (response) => {
  if (!response) return response;
  const data = response.data;
  if (Array.isArray(data)) {
    return { ...response, data: data.map(transformTeacher) };
  }
  return response;
};

const transformTeacherRequest = (data) => {
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
    employee_id: data.employeeId || data.employee_id,
    qualification: data.qualification,
    specialization: data.specialization,
    experience_years: data.experience || data.experience_years,
    joining_date: data.joiningDate || data.joining_date,
    employment_type: data.employmentType || data.employment_type || 'full-time',
    designation: data.designation,
    department: data.department,
    salary: data.salary,
    is_active: data.status === 'active' || data.is_active !== false,
    address: data.address,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    password: data.password
  };
};

// ─── CRUD (via principal endpoint) ──

// GET /principal/teachers
export const getTeachers = async (params = {}) => {
  const res = await api.get('/principal/teachers', { params });
  return transformTeacherList(res.data);
};

// GET /principal/teachers/:id
export const getTeacherById = async (id) => {
  const res = await api.get(`/principal/teachers/${id}`);
  const response = res.data;
  if (response && response.data) {
    return { ...response, data: transformTeacher(response.data) };
  }
  return response;
};

// POST /principal/teachers
export const createTeacher = async (data) => {
  const res = await api.post('/principal/teachers', transformTeacherRequest(data));
  return res.data;
};

// PUT /principal/teachers/:id
export const updateTeacher = async (id, data) => {
  const res = await api.put(`/principal/teachers/${id}`, transformTeacherRequest(data));
  return res.data;
};

// DELETE /principal/teachers/:id
export const deleteTeacher = async (id) => {
  const res = await api.delete(`/principal/teachers/${id}`);
  return res.data;
};

// ─── Details (stubs — not yet implemented) ──

export const getTeacherTimetable = async (id, params = {}) => {
  return { success: true, data: [] };
};

export const getTeacherAssignments = async (id, params = {}) => {
  return { success: true, data: [] };
};

export const getTeacherAttendance = async (id, params = {}) => {
  return { success: true, data: [] };
};

export const getTeacherSchedule = async (id, params = {}) => {
  return { success: true, data: [] };
};

export const getTeacherPerformance = async (id, params = {}) => {
  return { success: true, data: [] };
};

// ─── Actions (stubs) ──

export const updateTeacherSalary = async (id, data) => {
  return { success: false, error: 'Salary update not yet implemented' };
};

export const exportTeachers = async (params = {}) => {
  return { success: false, error: 'Export not yet implemented' };
};

export const uploadProfilePhoto = async (id, data) => {
  return { success: false, error: 'Photo upload not yet implemented' };
};

// ─── Teacher Portal (self) — via /teacher route ──

export const getMyProfile = async () => {
  return { success: true, data: {} };
};

export const getMyClasses = async (params = {}) => {
  const res = await api.get('/teacher/classes', { params });
  return res.data;
};

export const getMyStudents = async (params = {}) => {
  return { success: true, data: [] };
};

export const getMyTimetable = async (params = {}) => {
  return { success: true, data: [] };
};