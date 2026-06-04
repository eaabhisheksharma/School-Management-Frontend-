import api from './axiosConfig';

/**
 * Class API
 * Handles Classes, Sections, Subjects, and Academic Years.
 * All routes are protected and require Bearer Token (handled by axiosConfig).
 */

// ─── Transformers ──

const transformClass = (c) => {
  if (!c) return c;
  const sections = c.sections || c.Sections || [];
  const sectionNames = sections.map(s => s.section_name || s.name).filter(Boolean);
  return {
    ...c,
    id: c.class_id || c.id,
    name: c.class_name || c.name || '',
    section: sectionNames.join(', ') || c.section || '',
    stream: c.stream || 'None',
    capacity: c.capacity || c.max_students || '',
    roomNo: c.room_no || c.roomNo || '',
    classTeacherId: c.class_teacher_id || c.classTeacherId || '',
    classTeacherName: c.classTeacherName || '',
    academicYear: c.academic_year || c.academicYear || '',
    fees: c.fees || '',
    description: c.description || '',
    studentCount: c.student_count || c.studentCount || 0,
    classCode: c.class_code || c.classCode || '',
    displayOrder: c.display_order || c.displayOrder || 0,
    sections: sections
  };
};

const transformClassList = (response) => {
  if (!response) return response;
  const data = response.data;
  if (Array.isArray(data)) {
    return { ...response, data: data.map(transformClass) };
  }
  return response;
};

const transformClassRequest = (data) => {
  return {
    class_name: data.name || data.class_name,
    class_code: data.classCode || data.class_code || (data.name || '').toUpperCase().replace(/\s+/g, '_'),
    display_order: data.displayOrder || data.display_order || 0,
    capacity: data.capacity,
    room_no: data.roomNo || data.room_no,
    stream: data.stream,
    fees: data.fees,
    description: data.description
  };
};

// ─── Classes ───────────────────────────────────────────────────────

// GET /classes
export const getClasses = async (params = {}) => {
  const res = await api.get('/principal/classes', { params });
  return transformClassList(res.data);
};

// GET /classes/:id
export const getClassById = async (id) => {
  const res = await api.get(`/principal/classes/${id}`);
  const response = res.data;
  if (response && response.data) {
    return { ...response, data: transformClass(response.data) };
  }
  return response;
};

// POST /classes
export const createClass = async (data) => {
  const res = await api.post('/principal/classes', transformClassRequest(data));
  return res.data;
};

// PUT /classes/:id
export const updateClass = async (id, data) => {
  const res = await api.put(`/principal/classes/${id}`, transformClassRequest(data));
  return res.data;
};

// DELETE /classes/:id
export const deleteClass = async (id) => {
  const res = await api.delete(`/principal/classes/${id}`);
  return res.data;
};

// GET /sections?class_id=:id
export const getClassSections = async (id) => {
  const res = await api.get('/principal/sections', { params: { class_id: id } });
  return res.data;
};

// GET /students?class_id=:id
export const getClassStudents = async (id, params = {}) => {
  const res = await api.get('/principal/students', { params: { ...params, class_id: id } });
  return res.data;
};

// GET /classes/:id/subjects (stub - not yet implemented in backend)
export const getClassSubjects = async (id) => {
  return { success: true, data: [] };
};

// ─── Sections ──────────────────────────────────────────────────────

// GET /sections
export const getSections = async (params = {}) => {
  const res = await api.get('/principal/sections', { params });
  return res.data;
};

// POST /sections
export const createSection = async (data) => {
  const res = await api.post('/principal/sections', data);
  return res.data;
};

// PUT /sections/:id
export const updateSection = async (id, data) => {
  const res = await api.put(`/principal/sections/${id}`, data);
  return res.data;
};

// DELETE /sections/:id
export const deleteSection = async (id) => {
  const res = await api.delete(`/principal/sections/${id}`);
  return res.data;
};

// Fetches students in a specific section
export const getSectionStudents = async (id, params = {}) => {
  const res = await api.get('/principal/students', { params: { ...params, section_id: id } });
  return res.data;
};

// ─── Subjects (not yet implemented in backend) ────────────────────

export const getSubjects = async (params = {}) => {
  return { success: true, data: [] };
};

export const createSubject = async (data) => {
  return { success: false, error: 'Subjects module not yet implemented' };
};

export const updateSubject = async (id, data) => {
  return { success: false, error: 'Subjects module not yet implemented' };
};

export const deleteSubject = async (id) => {
  return { success: false, error: 'Subjects module not yet implemented' };
};

// ─── Academic Years ────────────────────────────────────────────────

// GET /principal/academic-years
export const getAcademicYears = async () => {
  const res = await api.get('/principal/academic-years');
  return res.data;
};

// POST /principal/academic-years
export const createAcademicYear = async (data) => {
  const res = await api.post('/principal/academic-years', data);
  return res.data;
};

// PUT /principal/academic-years/:id
export const updateAcademicYear = async (id, data) => {
  const res = await api.put(`/principal/academic-years/${id}`, data);
  return res.data;
};

// Sets the specified academic year as the active one
export const setCurrentAcademicYear = async (id) => {
  const res = await api.put(`/principal/academic-years/${id}`, { is_current: true });
  return res.data;
};