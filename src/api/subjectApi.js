import api from './axiosConfig';

/**
 * Subject API
 * Handles subjects and their relation to classes.
 * All routes are protected and require Bearer Token (handled by axiosConfig).
 */

// Subjects module not yet implemented in backend — returning stubs

export const getSubjects = async (params = {}) => {
  return { success: true, data: [] };
};

export const getSubjectById = async (id) => {
  return { success: true, data: null };
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

export const getSubjectsByClass = async (id, params = {}) => {
  return { success: true, data: [] };
};